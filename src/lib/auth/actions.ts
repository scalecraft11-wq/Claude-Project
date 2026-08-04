"use server";

import {
  sendPasswordResetEmail,
  sendVerificationEmail,
} from "@/lib/auth/email";
import { hashPassword } from "@/lib/auth/password";
import { getClientIp, rateLimit, RATE_LIMITS } from "@/lib/auth/rate-limit";
import {
  EMAIL_VERIFICATION_TOKEN_TTL_MS,
  generateRawToken,
  hashToken,
  isTokenExpired,
  PASSWORD_RESET_TOKEN_TTL_MS,
  tokenExpiryDate,
} from "@/lib/auth/tokens";
import { clientEnv } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  forgotPasswordSchema,
  registerSchema,
  resetPasswordSchema,
  type ForgotPasswordInput,
  type RegisterInput,
  type ResetPasswordInput,
} from "@/lib/validation/auth";

export interface ActionResult {
  success: boolean;
  message: string;
  fieldErrors?: Record<string, string[]>;
}

const GENERIC_RESET_MESSAGE =
  "If an account exists for that email, we've sent a password reset link.";
const GENERIC_VERIFICATION_MESSAGE =
  "If that account exists and isn't verified yet, we've sent a new verification link.";

function firstFieldErrors(flatten: {
  fieldErrors: Record<string, string[] | undefined>;
}) {
  const result: Record<string, string[]> = {};
  for (const [field, errors] of Object.entries(flatten.fieldErrors)) {
    if (errors?.length) result[field] = errors;
  }
  return result;
}

/**
 * Registration. Always creates the user with `emailVerified: null` — even
 * for a would-be duplicate we can't silently skip — sending a real
 * verification email is what gates the account, not this response, so a
 * pre-existing account's owner isn't affected by someone else attempting
 * to register their email.
 */
export async function registerAction(
  input: RegisterInput,
): Promise<ActionResult> {
  const ip = await getClientIp();
  const limit = await rateLimit(`register:ip:${ip}`, RATE_LIMITS.register);
  if (!limit.success) {
    return {
      success: false,
      message: "Too many attempts. Please try again later.",
    };
  }

  const parsed = registerSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: firstFieldErrors(parsed.error.flatten()),
    };
  }

  const { name, email, password } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Telling this particular requester "that email is taken" is a
    // deliberate, common trade-off (unlike login/forgot-password, which
    // stay fully generic) — see lib/validation/auth.ts's doc comment.
    return {
      success: false,
      message:
        "An account with that email already exists. Try signing in instead.",
      fieldErrors: { email: ["Email already in use."] },
    };
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { name, email, passwordHash },
  });

  const rawToken = generateRawToken();
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      tokenHash: hashToken(rawToken),
      expiresAt: tokenExpiryDate(EMAIL_VERIFICATION_TOKEN_TTL_MS),
    },
  });

  const verifyUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/verify-email?token=${rawToken}`;
  await sendVerificationEmail(user.email, verifyUrl);

  return {
    success: true,
    message: "Account created. Check your email for a verification link.",
  };
}

export async function requestPasswordResetAction(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a valid email address.",
      fieldErrors: firstFieldErrors(parsed.error.flatten()),
    };
  }

  const { email } = parsed.data;
  const ip = await getClientIp();
  const limit = await rateLimit(
    `forgot-password:${ip}:${email}`,
    RATE_LIMITS.forgotPassword,
  );
  if (!limit.success) {
    // Still generic — even the rate-limit response can't hint at whether
    // the account exists, only that this requester is sending too many.
    return { success: true, message: GENERIC_RESET_MESSAGE };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  // No account, or an OAuth-only account with nothing to reset — either
  // way, respond identically and do nothing further.
  if (user?.passwordHash) {
    const rawToken = generateRawToken();
    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: tokenExpiryDate(PASSWORD_RESET_TOKEN_TTL_MS),
      },
    });
    const resetUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/reset-password?token=${rawToken}`;
    await sendPasswordResetEmail(user.email, resetUrl);
  }

  return { success: true, message: GENERIC_RESET_MESSAGE };
}

export async function resetPasswordAction(
  input: ResetPasswordInput,
): Promise<ActionResult> {
  const parsed = resetPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: firstFieldErrors(parsed.error.flatten()),
    };
  }

  const { token, password } = parsed.data;
  const tokenHash = hashToken(token);

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (
    !resetToken ||
    resetToken.usedAt ||
    isTokenExpired(resetToken.expiresAt)
  ) {
    return {
      success: false,
      message: "This reset link is invalid or has expired. Request a new one.",
    };
  }

  const passwordHash = await hashPassword(password);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: {
        passwordHash,
        // Bumping tokenVersion invalidates every JWT issued before this
        // moment — a password reset signs the user out everywhere else,
        // not just on the device performing the reset.
        tokenVersion: { increment: 1 },
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    }),
    prisma.passwordResetToken.update({
      where: { id: resetToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true, message: "Password reset. You can now sign in." };
}

export async function verifyEmailAction(token: string): Promise<ActionResult> {
  if (!token) return { success: false, message: "Missing verification token." };

  const tokenHash = hashToken(token);
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { tokenHash },
  });

  if (
    !verificationToken ||
    verificationToken.usedAt ||
    isTokenExpired(verificationToken.expiresAt)
  ) {
    return {
      success: false,
      message:
        "This verification link is invalid or has expired. Request a new one.",
    };
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: new Date() },
    }),
    prisma.emailVerificationToken.update({
      where: { id: verificationToken.id },
      data: { usedAt: new Date() },
    }),
  ]);

  return { success: true, message: "Email verified. You can now sign in." };
}

export async function resendVerificationEmailAction(
  input: ForgotPasswordInput,
): Promise<ActionResult> {
  const parsed = forgotPasswordSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Enter a valid email address.",
      fieldErrors: firstFieldErrors(parsed.error.flatten()),
    };
  }

  const { email } = parsed.data;
  const ip = await getClientIp();
  const limit = await rateLimit(
    `resend-verification:${ip}:${email}`,
    RATE_LIMITS.resendVerification,
  );
  if (!limit.success) {
    return { success: true, message: GENERIC_VERIFICATION_MESSAGE };
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (user && !user.emailVerified) {
    const rawToken = generateRawToken();
    await prisma.emailVerificationToken.create({
      data: {
        userId: user.id,
        tokenHash: hashToken(rawToken),
        expiresAt: tokenExpiryDate(EMAIL_VERIFICATION_TOKEN_TTL_MS),
      },
    });
    const verifyUrl = `${clientEnv.NEXT_PUBLIC_APP_URL}/verify-email?token=${rawToken}`;
    await sendVerificationEmail(user.email, verifyUrl);
  }

  return { success: true, message: GENERIC_VERIFICATION_MESSAGE };
}
