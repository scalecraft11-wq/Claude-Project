import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { verifyEmailAction } from "@/lib/auth/actions";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Verify email",
  path: "/verify-email",
  noIndex: true,
});

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token
    ? await verifyEmailAction(token)
    : { success: false, message: "Missing verification token." };

  return (
    <AuthCard title={result.success ? "Email verified" : "Verification failed"}>
      <div className="grid gap-4 text-center">
        <p className="text-body-md text-content-secondary">{result.message}</p>
        {result.success ? (
          <Button asChild variant="primary">
            <Link href="/login">Sign in</Link>
          </Button>
        ) : (
          <Link
            href="/login"
            className="text-body-sm font-medium text-content-primary underline underline-offset-2"
          >
            Back to sign in
          </Link>
        )}
      </div>
    </AuthCard>
  );
}
