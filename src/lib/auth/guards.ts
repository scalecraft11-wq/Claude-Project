import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { hasMinimumRole } from "@/lib/auth/rbac";
import type { Role } from "../../../generated/prisma/client";

/**
 * The authoritative (Node runtime, full DB re-validation) half of the
 * defense-in-depth RBAC described in ARCHITECTURE.md §17 — `middleware.ts`
 * is the fast first check; every Server Action and protected Server
 * Component calls one of these too, since middleware alone is never
 * trusted as the sole security boundary.
 */

export async function getCurrentSession() {
  const session = await auth();
  if (!session?.user || session.error === "SessionRevoked") return null;
  return session;
}

/** Redirects to `/login` if there's no valid session. Use in Server
 * Components/Server Actions that render or mutate on behalf of the
 * signed-in user, regardless of role. */
export async function requireAuth() {
  const session = await getCurrentSession();
  if (!session) redirect("/login");
  return session;
}

/** Redirects to `/login` if unauthenticated, or `/unauthorized` if the
 * session's role doesn't meet `minRole`. */
export async function requireRole(minRole: Role) {
  const session = await requireAuth();
  // `requireAuth()` already redirected away if `session.user` were absent.
  if (!hasMinimumRole(session.user!.role, minRole)) {
    redirect("/unauthorized");
  }
  return session;
}
