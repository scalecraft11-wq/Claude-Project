import { ProductCard } from "@/components/lumora/product-card";

import type { ProductCard as ProductCardData } from "@/lib/shop/catalog";

export function ProductGrid({
  products,
  wishlistProductIds,
  emptyMessage = "No products match your filters.",
}: {
  products: ProductCardData[];
  wishlistProductIds: Set<string>;
  emptyMessage?: string;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-body-md text-content-secondary">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          inWishlist={wishlistProductIds.has(product.id)}
        />
      ))}
    </div>
  );
}
