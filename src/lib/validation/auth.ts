import { z } from "zod";

/**
 * Shared auth validation schemas — the single source of truth for both
 * client-side form UX and server-side re-validation (every Server Action
 * in `lib/auth/actions.ts` re-runs these; the client check is a UX
 * nicety, never the security boundary, per ARCHITECTURE.md §17/§26).
 *
 * Password policy (ARCHITECTURE.md §16): minimum 12 characters, mixed
 * case, at least one number and one symbol — enforced identically on
 * register and reset, not just documented.
 */

export const passwordSchema = z
  .string()
  .min(12, "Password must be at least 12 characters.")
  .max(128, "Password must be under 128 characters.")
  .refine(
    (value) => /[a-z]/.test(value),
    "Password needs at least one lowercase letter.",
  )
  .refine(
    (value) => /[A-Z]/.test(value),
    "Password needs at least one uppercase letter.",
  )
  .refine((value) => /\d/.test(value), "Password needs at least one number.")
  .refine(
    (value) => /[^A-Za-z0-9]/.test(value),
    "Password needs at least one symbol (e.g. !@#$%).",
  );

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Enter a valid email address.")
  .toLowerCase();

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100),
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Missing reset token."),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const magicLinkSchema = z.object({
  email: emailSchema,
});

export type MagicLinkInput = z.infer<typeof magicLinkSchema>;
