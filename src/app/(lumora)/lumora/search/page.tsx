import type { Metadata } from "next";

import { CatalogPagination } from "@/components/lumora/catalog-pagination";
import { PlpFilterBar } from "@/components/lumora/plp-filter-bar";
import { ProductGrid } from "@/components/lumora/product-grid";
import { Input } from "@/components/ui/input";
import { Container } from "@/components/layouts";

import { listProducts, type ProductSort } from "@/lib/shop/catalog";
import { getWishlistProductIds } from "@/lib/shop/wishlist";

export const metadata: Metadata = { title: "Search" };

export default async function LumoraSearchPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    inStock?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;
  const query = params.q?.trim() ?? "";
  const page = Number(params.page) || 1;

  const [{ products, total, perPage }, wishlistProductIds] = query
    ? await Promise.all([
        listProducts({
          search: query,
          sort: params.sort as ProductSort | undefined,
          inStockOnly: params.inStock === "1",
          page,
        }),
        getWishlistProductIds(),
      ])
    : [{ products: [], total: 0, perPage: 24 }, new Set<string>()];

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <Container size="2xl" className="grid gap-8 py-section-sm">
      <div>
        <p className="text-overline text-content-muted">Search</p>
        <h1 className="mt-1 font-display text-heading-01">
          {query ? `Results for "${query}"` : "Search the collection"}
        </h1>
      </div>

      <form method="GET" className="max-w-md">
        <Input
          type="search"
          name="q"
          defaultValue={query}
          placeholder="Search products…"
          aria-label="Search products"
        />
      </form>

      {query && (
        <>
          <PlpFilterBar resultCount={total} />
          <ProductGrid
            products={products}
            wishlistProductIds={wishlistProductIds}
            emptyMessage={`No products match "${query}".`}
          />
          <CatalogPagination
            currentPage={page}
            totalPages={totalPages}
            basePath="/lumora/search"
            params={{ q: query, sort: params.sort, inStock: params.inStock }}
            className="justify-center"
          />
        </>
      )}
    </Container>
  );
}
