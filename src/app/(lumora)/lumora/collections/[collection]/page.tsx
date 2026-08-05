import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ProductGrid } from "@/components/lumora/product-grid";
import { Container } from "@/components/layouts";

import { getCollectionBySlug } from "@/lib/shop/catalog";
import { getWishlistProductIds } from "@/lib/shop/wishlist";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: slug } = await params;
  const result = await getCollectionBySlug(slug);
  if (!result) return {};
  return { title: result.collection.name };
}

export default async function LumoraCollectionDetailPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: slug } = await params;
  const [result, wishlistProductIds] = await Promise.all([
    getCollectionBySlug(slug),
    getWishlistProductIds(),
  ]);

  if (!result) notFound();
  const { collection, products } = result;

  return (
    <Container size="2xl" className="grid gap-8 py-section-sm">
      <div>
        <p className="text-overline text-content-muted">Collection</p>
        <h1 className="mt-1 font-display text-heading-01">{collection.name}</h1>
        {collection.description && (
          <p className="mt-3 max-w-measure text-body-md text-content-secondary">
            {collection.description}
          </p>
        )}
      </div>

      <ProductGrid
        products={products}
        wishlistProductIds={wishlistProductIds}
        emptyMessage="This collection doesn't have any products yet."
      />
    </Container>
  );
}
