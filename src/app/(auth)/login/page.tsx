import type { Metadata } from "next";
import Link from "next/link";

import { AuthCard } from "@/components/auth/auth-card";
import { LoginForm } from "@/components/auth/login-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Sign in",
  path: "/login",
  noIndex: true,
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to your account to continue."
      footer={
        <>
          Don&rsquo;t have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-content-primary underline underline-offset-2"
          >
            Create one
          </Link>
        </>
      }
    >
      <LoginForm callbackUrl={callbackUrl ?? "/dashboard"} />
    </AuthCard>
  );
}
