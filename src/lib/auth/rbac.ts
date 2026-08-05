import type { Role } from "../../../generated/prisma/client";

/**
 * Coarse-grained RBAC (ARCHITECTURE.md §17), shared by `middleware.ts`
 * (fast, Edge-safe, first line of defense) and `lib/auth/guards.ts`
 * (Node runtime, the actual authority every Server Action/Route Handler
 * re-checks against). Never rely on the middleware check alone — see the
 * guards module for why.
 */
export const ROLE_HIERARCHY: Record<Role, number> = {
  CUSTOMER: 0,
  EDITOR: 1,
  MANAGER: 2,
  ADMIN: 3,
};

export function hasMinimumRole(role: Role, minRole: Role): boolean {
  return ROLE_HIERARCHY[role] >= ROLE_HIERARCHY[minRole];
}

export interface ProtectedRoute {
  pattern: RegExp;
  minRole: Role;
}

/**
 * Order matters only in that every pattern is checked and the *strictest*
 * matching requirement wins — so a more specific, higher-privilege
 * sub-path never accidentally inherits a looser parent requirement. This
 * is the fast, Edge-safe first pass; every one of these pages also calls
 * `requireRole()` itself (lib/auth/guards.ts) as the authoritative check.
 */
export const PROTECTED_ROUTES: ProtectedRoute[] = [
  // Broadest: the admin shell itself is reachable by EDITOR+ (Products,
  // Blog, Media, Reviews, SEO all live here) — sections below narrow it.
  { pattern: /^\/admin(\/.*)?$/, minRole: "EDITOR" },
  {
    pattern:
      /^\/admin\/(analytics|orders|customers|payments|coupons|shipping|inventory|newsletter|support|activity-logs)(\/.*)?$/,
    minRole: "MANAGER",
  },
  {
    pattern: /^\/admin\/(settings|roles|permissions)(\/.*)?$/,
    minRole: "ADMIN",
  },
  { pattern: /^\/dashboard(\/.*)?$/, minRole: "CUSTOMER" },
];

export function getRequiredRole(pathname: string): Role | null {
  let strictest: Role | null = null;
  for (const route of PROTECTED_ROUTES) {
    if (!route.pattern.test(pathname)) continue;
    if (
      !strictest ||
      ROLE_HIERARCHY[route.minRole] > ROLE_HIERARCHY[strictest]
    ) {
      strictest = route.minRole;
    }
  }
  return strictest;
}
