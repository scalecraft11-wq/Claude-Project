import type { Metadata } from "next";
import Link from "next/link";

import { RoleBadge } from "@/components/auth/role-badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { hasMinimumRole } from "@/lib/auth/rbac";
import { requireAuth } from "@/lib/auth/guards";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Dashboard",
  path: "/dashboard",
  noIndex: true,
});

const ROLE_SECTIONS = [
  {
    minRole: "CUSTOMER",
    title: "My account",
    description:
      "Everyone signed in sees this — profile, orders, and account settings.",
  },
  {
    minRole: "EDITOR",
    title: "Content tools",
    description:
      "Editors and above can draft and publish case studies, blog posts, and pages.",
  },
  {
    minRole: "MANAGER",
    title: "Team overview",
    description:
      "Managers and admins can see lead pipeline, project status, and team workload.",
  },
  {
    minRole: "ADMIN",
    title: "Admin settings",
    description:
      "Admins only — user management, role changes, and destructive actions.",
  },
] as const;

export default async function DashboardPage() {
  const session = await requireAuth();
  const role = session.user!.role;

  return (
    <div className="grid gap-10">
      <div className="grid gap-2">
        <p className="text-overline text-content-muted">Signed in as</p>
        <div className="flex items-center gap-3">
          <h1 className="font-display text-heading-01 text-content-primary">
            {session.user!.name ?? session.user!.email}
          </h1>
          <RoleBadge role={role} />
        </div>
        <p className="text-body-md text-content-secondary">
          {session.user!.email}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {ROLE_SECTIONS.map((section) => {
          const unlocked = hasMinimumRole(role, section.minRole);
          return (
            <Card
              key={section.title}
              className={!unlocked ? "opacity-40" : undefined}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{section.title}</CardTitle>
                  <span className="text-overline text-content-muted">
                    {section.minRole}+
                  </span>
                </div>
                <CardDescription>{section.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {unlocked ? (
                  <p className="text-body-sm text-content-secondary">
                    Your role ({role}) has access to this section.
                  </p>
                ) : (
                  <p className="text-body-sm text-content-muted">
                    Requires the {section.minRole} role or higher.
                  </p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {hasMinimumRole(role, "MANAGER") && (
        <p className="text-body-sm text-content-secondary">
          You have manager-level access —{" "}
          <Link
            href="/admin"
            className="font-medium text-content-primary underline underline-offset-2"
          >
            visit the admin area
          </Link>
          .
        </p>
      )}
    </div>
  );
}
