import Link from "next/link";
import type { Metadata } from "next";

import { HeroSection } from "@/components/lumora/hero/hero-section";
import { ProductGrid } from "@/components/lumora/product-grid";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layouts";

import { listProducts } from "@/lib/shop/catalog";
import { getWishlistProductIds } from "@/lib/shop/wishlist";

export const metadata: Metadata = {
  title: "Lumora Skin — Skincare, formulated like an argument",
};

export default async function LumoraHomePage() {
  const [{ products }, wishlistProductIds] = await Promise.all([
    listProducts({ sort: "newest", perPage: 8 }),
    getWishlistProductIds(),
  ]);

  return (
    <>
      <HeroSection />

      <Container size="2xl" className="grid gap-8 py-section-sm">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-overline text-content-muted">New arrivals</p>
            <h2 className="mt-1 font-display text-heading-02">
              The Renewal Collection
            </h2>
          </div>
          <Button asChild variant="secondary">
            <Link href="/lumora/collections">View all</Link>
          </Button>
        </div>
        <ProductGrid
          products={products}
          wishlistProductIds={wishlistProductIds}
        />
      </Container>
    </>
  );
}
