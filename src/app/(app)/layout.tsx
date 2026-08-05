import Link from "next/link";
import type { ReactNode } from "react";

import { AgencyLogo } from "@/components/marketing/agency-logo";
import { RoleBadge } from "@/components/auth/role-badge";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { Container } from "@/components/layouts";
import { requireAuth } from "@/lib/auth/guards";

/**
 * Shell for every signed-in app route (`/dashboard`).
 * `requireAuth()` here is the Server Component layer of the same
 * defense-in-depth RBAC middleware.ts starts (ARCHITECTURE.md §17) — this
 * layout renders for every page beneath it, so a route added later under
 * `(app)/` is protected automatically even if someone forgets to update
 * the middleware matcher.
 */
export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await requireAuth();

  return (
    <div className="min-h-svh">
      <header className="border-b border-hairline-subtle">
        <Container size="xl" className="flex items-center justify-between py-5">
          <AgencyLogo />
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-body-sm text-content-secondary transition-colors duration-fast hover:text-content-primary"
            >
              Dashboard
            </Link>
            <RoleBadge role={session.user!.role} />
            <span className="text-body-sm text-content-secondary">
              {session.user!.name ?? session.user!.email}
            </span>
            <SignOutButton />
          </div>
        </Container>
      </header>
      <Container size="xl" className="py-12">
        {children}
      </Container>
    </div>
  );
}
