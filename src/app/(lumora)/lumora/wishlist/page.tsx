import type { Metadata } from "next";

import Link from "next/link";

import { ProductGrid } from "@/components/lumora/product-grid";
import { Container } from "@/components/layouts";

import { getCurrentSession } from "@/lib/auth/guards";
import { getWishlist } from "@/lib/shop/wishlist";

export const metadata: Metadata = { title: "Wishlist" };

export default async function LumoraWishlistPage() {
  const session = await getCurrentSession();

  if (!session?.user) {
    return (
      <Container size="2xl" className="grid gap-4 py-section-sm text-center">
        <h1 className="font-display text-heading-01">Your Wishlist</h1>
        <p className="text-body-md text-content-secondary">
          <Link
            href="/login?callbackUrl=/lumora/wishlist"
            className="underline"
          >
            Sign in
          </Link>{" "}
          to see items you&apos;ve saved.
        </p>
      </Container>
    );
  }

  const items = await getWishlist();
  const products = items.map((item) => item.product);
  const wishlistProductIds = new Set(products.map((p) => p.id));

  return (
    <Container size="2xl" className="grid gap-8 py-section-sm">
      <div>
        <p className="text-overline text-content-muted">Saved</p>
        <h1 className="mt-1 font-display text-heading-01">Your Wishlist</h1>
      </div>

      <ProductGrid
        products={products}
        wishlistProductIds={wishlistProductIds}
        emptyMessage="Nothing saved yet — tap the heart on any product to add it here."
      />
    </Container>
  );
}
