import type { ReactNode } from "react";

import { AdminShell } from "@/components/admin/admin-shell";
import { requireRole } from "@/lib/auth/guards";

/**
 * Every /admin/** page reads the live session and the database — Next's
 * static-optimization heuristic doesn't reliably infer that from the
 * layout's `auth()` call alone (a build-time probe render of a page like
 * `/admin/blog` can execute its own data fetch before that bailout takes
 * effect), so this is forced explicitly rather than left to inference.
 */
export const dynamic = "force-dynamic";

/**
 * Shell for every route under `/admin/**` — a dedicated enterprise
 * sidebar layout, deliberately separate from `(app)/layout.tsx`'s plain
 * customer-account header. `requireRole("EDITOR")` is the broadest gate
 * that reaches any admin section; individual pages/actions still call
 * `requireRole()` again with their own stricter minimum where
 * `rbac.ts`'s `PROTECTED_ROUTES` demands more (MANAGER/ADMIN).
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireRole("EDITOR");

  return (
    <AdminShell
      role={session.user!.role}
      name={session.user!.name ?? null}
      email={session.user!.email ?? ""}
    >
      {children}
    </AdminShell>
  );
}
