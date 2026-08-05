import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { AddToCartForm } from "@/components/lumora/add-to-cart-form";
import { ProductGallery } from "@/components/lumora/product-gallery";
import { ProductGrid } from "@/components/lumora/product-grid";
import { RecentlyViewedTracker } from "@/components/lumora/recently-viewed-tracker";
import { ReviewForm } from "@/components/lumora/review-form";
import { WishlistButton } from "@/components/lumora/wishlist-button";
import { Container } from "@/components/layouts";

import { getCurrentSession } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/format";
import { getProductBySlug, ratingSummary } from "@/lib/shop/catalog";
import {
  frequentlyBoughtTogether,
  relatedProducts,
} from "@/lib/shop/recommendations";
import { getRecentlyViewedProducts } from "@/lib/shop/recently-viewed";
import { getWishlistProductIds } from "@/lib/shop/wishlist";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description.slice(0, 160),
  };
}

export default async function LumoraProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [
    session,
    related,
    frequentlyBought,
    recentlyViewed,
    wishlistProductIds,
  ] = await Promise.all([
    getCurrentSession(),
    relatedProducts(product.id, product.categoryId, 8),
    frequentlyBoughtTogether(product.id, 4),
    getRecentlyViewedProducts(product.id, 8),
    getWishlistProductIds(),
  ]);

  const { average, count } = ratingSummary(product.reviews);

  return (
    <>
      <RecentlyViewedTracker productId={product.id} />

      <Container
        size="2xl"
        className="grid gap-12 py-section-sm lg:grid-cols-2"
      >
        <ProductGallery images={product.images} />

        <div className="grid gap-6">
          {product.category && (
            <p className="text-overline text-content-muted">
              {product.category.name}
            </p>
          )}
          <h1 className="font-display text-heading-01">{product.name}</h1>

          <div className="flex items-center gap-3">
            <p className="text-heading-04 font-medium">
              {formatCurrency(product.priceCents)}
            </p>
            {product.compareAtCents &&
              product.compareAtCents > product.priceCents && (
                <p className="text-body-lg text-content-muted line-through">
                  {formatCurrency(product.compareAtCents)}
                </p>
              )}
            {count > 0 && (
              <p className="text-body-sm text-content-muted">
                {average.toFixed(1)} ★ ({count} review{count === 1 ? "" : "s"})
              </p>
            )}
          </div>

          <p className="max-w-measure text-body-md text-content-secondary">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <AddToCartForm
                productId={product.id}
                productName={product.name}
                stock={product.stock}
              />
            </div>
            <WishlistButton
              productId={product.id}
              productName={product.name}
              initialInWishlist={wishlistProductIds.has(product.id)}
              className="static"
            />
          </div>
        </div>
      </Container>

      {frequentlyBought.length > 0 && (
        <Container
          size="2xl"
          className="grid gap-6 border-t border-hairline-subtle py-section-sm"
        >
          <h2 className="font-display text-heading-02">
            Frequently Bought Together
          </h2>
          <ProductGrid
            products={frequentlyBought}
            wishlistProductIds={wishlistProductIds}
          />
        </Container>
      )}

      {related.length > 0 && (
        <Container
          size="2xl"
          className="grid gap-6 border-t border-hairline-subtle py-section-sm"
        >
          <h2 className="font-display text-heading-02">You May Also Like</h2>
          <ProductGrid
            products={related}
            wishlistProductIds={wishlistProductIds}
          />
        </Container>
      )}

      <Container
        size="2xl"
        className="grid gap-6 border-t border-hairline-subtle py-section-sm"
      >
        <h2 className="font-display text-heading-02">Reviews</h2>
        <ReviewForm productSlug={product.slug} canReview={!!session?.user} />
        <div className="grid gap-6">
          {product.reviews.length === 0 && (
            <p className="text-body-sm text-content-secondary">
              No reviews yet — be the first to share your experience.
            </p>
          )}
          {product.reviews.map((review) => (
            <div
              key={review.id}
              className="border-b border-hairline-subtle pb-6"
            >
              <div className="flex items-center gap-2">
                <p className="text-body-sm font-medium">{review.authorName}</p>
                <p className="text-body-sm text-content-muted">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
              </div>
              <p className="mt-1 text-body-md font-medium">{review.title}</p>
              <p className="mt-1 text-body-sm text-content-secondary">
                {review.body}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {recentlyViewed.length > 0 && (
        <Container
          size="2xl"
          className="grid gap-6 border-t border-hairline-subtle py-section-sm"
        >
          <h2 className="font-display text-heading-02">Recently Viewed</h2>
          <ProductGrid
            products={recentlyViewed}
            wishlistProductIds={wishlistProductIds}
          />
        </Container>
      )}
    </>
  );
}
