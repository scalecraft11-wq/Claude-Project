import Link from "next/link";
import type { ReactNode } from "react";

import { AgencyLogo } from "@/components/marketing/agency-logo";

/**
 * Minimal, focused shell for every auth route — deliberately without the
 * marketing navbar/mega-menu/footer chrome (`(marketing)/layout.tsx`):
 * a sign-in/register/reset flow is a task the visitor wants to complete
 * quickly, not a moment to keep browsing the site from.
 */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 px-5 py-16">
      <AgencyLogo />
      <div className="w-full max-w-md">{children}</div>
      <Link
        href="/"
        className="text-body-sm text-content-muted transition-colors duration-fast hover:text-content-primary"
      >
        ← Back to site
      </Link>
    </div>
  );
}
