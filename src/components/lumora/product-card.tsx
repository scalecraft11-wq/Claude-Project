import Image from "next/image";
import Link from "next/link";

import { QuickAddButton } from "@/components/lumora/quick-add-button";
import { WishlistButton } from "@/components/lumora/wishlist-button";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { formatCurrency } from "@/lib/format";
import {
  ratingSummary,
  type ProductCard as ProductCardData,
} from "@/lib/shop/catalog";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: ProductCardData;
  collectionLabel?: string;
  inWishlist?: boolean;
  className?: string;
}

/** PLP grid item — DESIGN_SYSTEM.md §12: square studio-lit crop,
 * `radius-lg`, `elevation-1`, a quick-add icon-button that reveals on
 * hover/focus rather than sitting permanently on the card. */
export function ProductCard({
  product,
  collectionLabel,
  inWishlist = false,
  className,
}: ProductCardProps) {
  const image = product.images[0];
  const { average, count } = ratingSummary(product.reviews);
  const isOutOfStock = product.stock <= 0;

  return (
    <ScrollReveal as="article">
      <div className={cn("group relative", className)}>
        <Link href={`/lumora/products/${product.slug}`} className="block">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-raised shadow-elevation-1">
            {image ? (
              <Image
                src={image.url}
                alt={image.altText}
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
                className="duration-[600ms] object-cover transition-transform ease-luxury-out group-hover:scale-[1.04]"
              />
            ) : (
              <div className="flex size-full items-center justify-center text-body-sm text-content-muted">
                No image
              </div>
            )}
            {isOutOfStock && (
              <span className="bg-canvas/90 absolute left-3 top-3 rounded-full px-3 py-1 text-overline text-content-secondary">
                Sold out
              </span>
            )}
          </div>
          <div className="mt-4 grid gap-1">
            {collectionLabel && (
              <p className="text-overline text-content-muted">
                {collectionLabel}
              </p>
            )}
            <h3 className="text-body-lg font-medium text-content-primary">
              {product.name}
            </h3>
            <div className="flex items-center gap-2">
              <p className="text-body-sm font-medium text-content-secondary">
                {formatCurrency(product.priceCents)}
              </p>
              {product.compareAtCents &&
                product.compareAtCents > product.priceCents && (
                  <p className="text-body-sm text-content-muted line-through">
                    {formatCurrency(product.compareAtCents)}
                  </p>
                )}
              {count > 0 && (
                <p className="text-body-sm text-content-muted">
                  · {average.toFixed(1)} ({count})
                </p>
              )}
            </div>
          </div>
        </Link>

        <WishlistButton
          productId={product.id}
          productName={product.name}
          initialInWishlist={inWishlist}
          className="absolute right-3 top-3 opacity-0 transition-opacity duration-fast focus-visible:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100"
        />

        {!isOutOfStock && (
          <QuickAddButton
            productId={product.id}
            productName={product.name}
            className="right-3 top-16"
          />
        )}
      </div>
    </ScrollReveal>
  );
}
