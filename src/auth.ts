import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { CredentialsSignin } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";

import { authConfig } from "@/auth.config";
import { sendMagicLinkEmail } from "@/lib/auth/email";
import { verifyPassword } from "@/lib/auth/password";
import { getClientIp, rateLimit, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { loginSchema } from "@/lib/validation/auth";
import type { Role } from "../generated/prisma/client";

/**
 * The full NextAuth config — Node runtime only (Prisma, bcrypt, ioredis).
 * Used by the `/api/auth/[...nextauth]` route handler and everywhere
 * Server Actions/Server Components call `auth()`. See auth.config.ts for
 * why this is split from the Edge-safe base `middleware.ts` uses.
 */

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_DURATION_MS = 15 * 60 * 1000;

/**
 * The only two `authorize()` failures ever allowed to surface a distinct
 * reason to the client, via `CredentialsSignin.code`. Every other failure
 * (unknown email, wrong password, locked account, OAuth-only account)
 * returns `null` from `authorize`, which NextAuth always reports as the
 * same generic `code: "credentials"` — deliberately, so none of those
 * cases can be used to enumerate which emails have an account
 * (ARCHITECTURE.md §16: "generic error messages, no user-enumeration").
 *
 * Neither exception below leaks account existence: rate-limiting is
 * scoped to the requesting IP, not the email, and "verify your email" is
 * the same widely-used, accepted UX trade-off most consumer products make
 * (the alternative — staying silent about needing verification — mostly
 * just confuses legitimate users who mistyped nothing wrong).
 */
class TooManyAttemptsError extends CredentialsSignin {
  override code = "too-many-attempts";
}
class EmailNotVerifiedError extends CredentialsSignin {
  override code = "email-not-verified";
}

const providers: Provider[] = [
  Credentials({
    id: "credentials",
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(rawCredentials, request) {
      const parsed = loginSchema.safeParse(rawCredentials);
      if (!parsed.success) return null;
      const { email, password } = parsed.data;

      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
        request.headers.get("x-real-ip") ??
        "unknown";

      const ipLimit = await rateLimit(`login:ip:${ip}`, RATE_LIMITS.login);
      if (!ipLimit.success) throw new TooManyAttemptsError();

      const user = await prisma.user.findUnique({ where: { email } });

      // Unknown email or an OAuth-only account with no password set —
      // both collapse to the same generic failure below.
      if (!user || !user.passwordHash) return null;

      if (user.lockedUntil && user.lockedUntil > new Date()) return null;

      const validPassword = await verifyPassword(password, user.passwordHash);

      if (!validPassword) {
        const attempts = user.failedLoginAttempts + 1;
        const lockingNow = attempts >= MAX_FAILED_LOGIN_ATTEMPTS;
        await prisma.user.update({
          where: { id: user.id },
          data: {
            failedLoginAttempts: lockingNow ? 0 : attempts,
            lockedUntil: lockingNow
              ? new Date(Date.now() + ACCOUNT_LOCK_DURATION_MS)
              : null,
          },
        });
        return null;
      }

      if (!user.emailVerified) throw new EmailNotVerifiedError();

      if (user.failedLoginAttempts > 0 || user.lockedUntil) {
        await prisma.user.update({
          where: { id: user.id },
          data: { failedLoginAttempts: 0, lockedUntil: null },
        });
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        role: user.role,
        tokenVersion: user.tokenVersion,
      };
    },
  }),
];

if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      // Google's own verification already satisfies our email-verification
      // requirement — an OAuth account never needs the separate token flow.
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          emailVerified: profile.email_verified ? new Date() : null,
          role: "CUSTOMER" as Role,
        };
      },
    }),
  );
}

if (env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GitHub({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          emailVerified: new Date(),
          role: "CUSTOMER" as Role,
        };
      },
    }),
  );
}

// Magic-link sign-in. Built as a plain provider object (rather than via
// the `Nodemailer()` helper) because that helper hard-requires an SMTP
// `server` config even when `sendVerificationRequest` is fully overridden
// — this app sends through Resend instead, via lib/auth/email.ts.
providers.push({
  id: "email",
  type: "email",
  name: "Email",
  from: env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
  maxAge: 10 * 60, // 10 minutes
  async sendVerificationRequest({ identifier, url }) {
    const ip = await getClientIp();
    const limit = await rateLimit(
      `magic-link:${ip}:${identifier}`,
      RATE_LIMITS.magicLink,
    );
    if (!limit.success) {
      throw new Error("Too many magic link requests. Please try again later.");
    }
    await sendMagicLinkEmail(identifier, url);
  },
  options: {},
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers,
  callbacks: {
    ...authConfig.callbacks,
    async jwt(params) {
      const token = authConfig.callbacks.jwt(params);
      if (params.user) return token; // freshly embedded above, nothing more to do

      // Re-validate role/tokenVersion against the database at most once a
      // minute (not on every single request) — this is what makes a
      // stateless JWT session still revocable: bump `User.tokenVersion` on
      // password change and every previously-issued token fails this check
      // on its next refresh, forcing re-authentication everywhere it's
      // still logged in.
      const lastChecked = token.tokenVersionCheckedAt ?? 0;
      if (Date.now() - lastChecked < 60_000) return token;

      const dbUser = token.id
        ? await prisma.user.findUnique({
            where: { id: token.id },
            select: { role: true, tokenVersion: true },
          })
        : null;

      if (!dbUser || dbUser.tokenVersion !== token.tokenVersion) {
        return { ...token, revoked: true };
      }

      token.role = dbUser.role;
      token.tokenVersionCheckedAt = Date.now();
      return token;
    },
  },
});
