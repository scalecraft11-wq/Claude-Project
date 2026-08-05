import type { NextAuthConfig } from "next-auth";

/**
 * The Edge-safe half of the NextAuth config — no Prisma, no bcrypt, no
 * ioredis, nothing that needs the Node.js runtime. `middleware.ts` runs on
 * the Edge runtime by default, so it builds its own lightweight
 * `NextAuth(authConfig)` instance from *only* this file to read/decode the
 * session cookie for route-gating.
 *
 * `auth.ts` (Node runtime — Route Handlers, Server Actions, Server
 * Components) spreads this config and layers the real providers/adapter/
 * database-backed callback logic on top, so both instances share the same
 * `pages` and pure (DB-free) parts of `jwt`/`session` and therefore
 * decode the exact same cookie the exact same way.
 *
 * This split — and the fact that middleware only ever does a fast,
 * DB-free check while every Server Action/Route Handler re-validates
 * against the database — is deliberate defense in depth (ARCHITECTURE.md
 * §17): middleware alone is never trusted as the sole security boundary.
 */
export const authConfig = {
  // Vercel (and most reverse-proxy platforms) already validate the
  // incoming Host header at the edge before a request reaches this app,
  // and preview deployments get a fresh URL per-deploy that can't be
  // pre-baked into a static `NEXTAUTH_URL` — without this, NextAuth
  // rejects those requests as `UntrustedHost` and every session/auth
  // call 500s. See https://errors.authjs.dev#untrustedhost.
  trustHost: true,
  pages: {
    signIn: "/login",
    verifyRequest: "/verify-request",
    newUser: "/dashboard",
  },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tokenVersion = user.tokenVersion ?? 0;
        token.tokenVersionCheckedAt = Date.now();
      }
      return token;
    },
    session({ session, token }) {
      if (token.revoked) {
        return { ...session, error: "SessionRevoked", user: undefined };
      }
      if (session.user) {
        session.user.id = token.id ?? "";
        session.user.role = token.role ?? "CUSTOMER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
