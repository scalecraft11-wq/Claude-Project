import Link from "next/link";
import type { Metadata } from "next";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { Container } from "@/components/layouts";

import { requireAuth } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Your Account" };

export default async function LumoraAccountPage() {
  const session = await requireAuth();

  return (
    <Container size="lg" className="grid gap-8 py-section-sm">
      <div>
        <p className="text-overline text-content-muted">Account</p>
        <h1 className="mt-1 font-display text-heading-01">
          {session.user!.name ?? session.user!.email}
        </h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/lumora/account/orders"
          className="rounded-card border border-hairline-subtle p-6 transition-colors hover:bg-surface-raised"
        >
          <h2 className="font-display text-heading-03">Orders</h2>
          <p className="mt-1 text-body-sm text-content-secondary">
            Track orders, view invoices, and request returns.
          </p>
        </Link>
        <Link
          href="/lumora/wishlist"
          className="rounded-card border border-hairline-subtle p-6 transition-colors hover:bg-surface-raised"
        >
          <h2 className="font-display text-heading-03">Wishlist</h2>
          <p className="mt-1 text-body-sm text-content-secondary">
            Everything you&apos;ve saved for later.
          </p>
        </Link>
      </div>

      <SignOutButton className="justify-self-start" />
    </Container>
  );
}
