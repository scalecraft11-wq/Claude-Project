import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Access denied",
  path: "/unauthorized",
  noIndex: true,
});

export default function UnauthorizedPage() {
  return (
    <AuthCard title="You don't have access to that page">
      <div className="grid gap-4 text-center">
        <p className="text-body-md text-content-secondary">
          Your account doesn&rsquo;t have the permissions required to view that
          page. If you think this is a mistake, contact an administrator.
        </p>
        <Button asChild variant="primary">
          <Link href="/dashboard">Back to dashboard</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
