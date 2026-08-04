import type { Metadata } from "next";

import { RoleBadge } from "@/components/auth/role-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { requireRole } from "@/lib/auth/guards";
import { hasMinimumRole } from "@/lib/auth/rbac";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  path: "/admin",
  noIndex: true,
});

/**
 * `requireRole("MANAGER")` here is the same requirement middleware.ts
 * enforces for `/admin/**` — re-checked here, in Node, against the live
 * database (ARCHITECTURE.md §17's "never rely on just one enforcement
 * point"). The admin-only subsection below layers a *second*, stricter
 * check on top, demonstrating that role checks compose per-section, not
 * just per-route.
 */
export default async function AdminPage() {
  const session = await requireRole("MANAGER");
  const role = session.user!.role;
  const isAdmin = hasMinimumRole(role, "ADMIN");

  return (
    <div className="grid gap-10">
      <div className="grid gap-2">
        <p className="text-overline text-content-muted">Admin area</p>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-heading-01 text-content-primary">
            Manager &amp; admin console
          </h1>
          <RoleBadge role={role} />
        </div>
        <p className="text-body-md text-content-secondary">
          Visible to MANAGER and ADMIN roles. Reached this page? Both middleware
          and this page&rsquo;s own server-side check agreed you&rsquo;re
          allowed here.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Team &amp; leads overview</CardTitle>
          <CardDescription>Available to any MANAGER or ADMIN.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-body-sm text-content-secondary">
            This is where a real build would show lead pipeline, project status,
            and team workload — the RBAC wiring is real, the data underneath it
            is a demo placeholder.
          </p>
        </CardContent>
      </Card>

      {isAdmin ? (
        <Card className="border-accent/40">
          <CardHeader>
            <CardTitle>User &amp; role management</CardTitle>
            <CardDescription>
              ADMIN only — not visible to MANAGER accounts.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-body-sm text-content-secondary">
              This section only renders because &ldquo;hasMinimumRole(role,
              ADMIN)&rdquo; passed — a MANAGER hitting this exact page sees
              everything above, but not this card.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card className="opacity-40">
          <CardHeader>
            <CardTitle>User &amp; role management</CardTitle>
            <CardDescription>Requires the ADMIN role.</CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}
