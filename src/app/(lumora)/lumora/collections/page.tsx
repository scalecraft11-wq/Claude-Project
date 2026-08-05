import Link from "next/link";
import type { Metadata } from "next";

import { CatalogPagination } from "@/components/lumora/catalog-pagination";
import { PlpFilterBar } from "@/components/lumora/plp-filter-bar";
import { ProductGrid } from "@/components/lumora/product-grid";
import { Container } from "@/components/layouts";

import { cn } from "@/lib/utils";
import {
  listCategories,
  listProducts,
  type ProductSort,
} from "@/lib/shop/catalog";
import { getWishlistProductIds } from "@/lib/shop/wishlist";

export const metadata: Metadata = { title: "All Collections" };

export default async function LumoraCollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    sort?: string;
    inStock?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const [{ products, total, perPage }, categories, wishlistProductIds] =
    await Promise.all([
      listProducts({
        categorySlug: params.category,
        sort: params.sort as ProductSort | undefined,
        inStockOnly: params.inStock === "1",
        page,
      }),
      listCategories(),
      getWishlistProductIds(),
    ]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  const flatCategories = categories.flatMap((c) => [c, ...c.children]);

  return (
    <Container size="2xl" className="grid gap-8 py-section-sm">
      <div>
        <p className="text-overline text-content-muted">Shop</p>
        <h1 className="mt-1 font-display text-heading-01">All Collections</h1>
      </div>

      <div className="flex flex-wrap gap-2">
        <Link
          href="/lumora/collections"
          className={cn(
            "rounded-full border border-hairline-subtle px-4 py-2 text-body-sm transition-colors",
            !params.category
              ? "bg-accent-subtle-bg border-accent text-content-primary"
              : "text-content-secondary hover:bg-surface-raised",
          )}
        >
          All
        </Link>
        {flatCategories.map((category) => (
          <Link
            key={category.id}
            href={`/lumora/collections?category=${category.slug}`}
            className={cn(
              "rounded-full border border-hairline-subtle px-4 py-2 text-body-sm transition-colors",
              params.category === category.slug
                ? "bg-accent-subtle-bg border-accent text-content-primary"
                : "text-content-secondary hover:bg-surface-raised",
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <PlpFilterBar resultCount={total} />

      <ProductGrid
        products={products}
        wishlistProductIds={wishlistProductIds}
      />

      <CatalogPagination
        currentPage={page}
        totalPages={totalPages}
        basePath="/lumora/collections"
        params={{
          category: params.category,
          sort: params.sort,
          inStock: params.inStock,
        }}
        className="justify-center"
      />
    </Container>
  );
}
