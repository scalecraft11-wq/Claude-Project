import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";
import { getRequiredRole, hasMinimumRole } from "@/lib/auth/rbac";

/**
 * First line of defense for `/dashboard/**` and `/admin/**`
 * (ARCHITECTURE.md §17: "defense in depth, all three required"). This
 * runs on the Edge runtime, so it builds its own lightweight
 * `NextAuth(authConfig)` instance (no Prisma/bcrypt — see auth.config.ts)
 * purely to decode the session cookie and read `role`/`error` off it.
 *
 * This check is deliberately fast and coarse. It is never the only
 * check — every Server Action and Route Handler behind these routes
 * re-verifies session + role itself via `lib/auth/guards.ts`, because
 * middleware can be misconfigured, skipped for a route added later, or
 * bypassed entirely by invoking a Server Action directly.
 */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const requiredRole = getRequiredRole(nextUrl.pathname);
  if (!requiredRole) return NextResponse.next();

  const session = req.auth;
  const isAuthenticated = !!session?.user && session.error !== "SessionRevoked";

  if (!isAuthenticated) {
    const loginUrl = new URL("/login", nextUrl);
    loginUrl.searchParams.set("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (!hasMinimumRole(session.user!.role, requiredRole)) {
    return NextResponse.redirect(new URL("/unauthorized", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
