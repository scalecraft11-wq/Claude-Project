import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Check your email",
  path: "/verify-request",
  noIndex: true,
});

export default function VerifyRequestPage() {
  return (
    <AuthCard title="Check your email">
      <div className="grid gap-4 text-center">
        <p className="text-body-md text-content-secondary">
          We&rsquo;ve sent you a sign-in link. It expires in 10 minutes and can
          only be used once.
        </p>
        <Link
          href="/login"
          className="text-body-sm font-medium text-content-primary underline underline-offset-2"
        >
          Back to sign in
        </Link>
      </div>
    </AuthCard>
  );
}
