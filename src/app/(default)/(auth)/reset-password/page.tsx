import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Reset password",
  path: "/reset-password",
  noIndex: true,
});

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <AuthCard
      title="Choose a new password"
      description="Must be at least 12 characters, with a mix of case, a number, and a symbol."
    >
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <div className="grid gap-4 text-center">
          <p className="text-body-md text-content-secondary">
            This reset link is missing its token. Request a new one from the
            sign-in page.
          </p>
          <Link
            href="/forgot-password"
            className="text-body-sm font-medium text-content-primary underline underline-offset-2"
          >
            Request a new link
          </Link>
        </div>
      )}
    </AuthCard>
  );
}
