import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

/**
 * Read-only storefront catalog queries — every list/detail query a public
 * page needs, all scoped to `status: "ACTIVE"` so a DRAFT/ARCHIVED product
 * never leaks onto the storefront even if someone guesses its slug.
 */

export type ProductSort =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "relevance";

export interface ProductListFilters {
  categorySlug?: string;
  collectionSlug?: string;
  search?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  inStockOnly?: boolean;
  sort?: ProductSort;
  page?: number;
  perPage?: number;
}

const DEFAULT_PER_PAGE = 24;

export const PRODUCT_CARD_SELECT = {
  id: true,
  name: true,
  slug: true,
  priceCents: true,
  compareAtCents: true,
  stock: true,
  status: true,
  createdAt: true,
  images: {
    orderBy: { position: "asc" as const },
    take: 1,
    select: { url: true, altText: true },
  },
  reviews: {
    where: { status: "APPROVED" as const },
    select: { rating: true },
  },
} satisfies Prisma.ProductSelect;

export type ProductCard = Prisma.ProductGetPayload<{
  select: typeof PRODUCT_CARD_SELECT;
}>;

export function ratingSummary(reviews: { rating: number }[]): {
  average: number;
  count: number;
} {
  if (reviews.length === 0) return { average: 0, count: 0 };
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return { average: total / reviews.length, count: reviews.length };
}

async function resolveSortOrder(
  sort: ProductSort | undefined,
): Promise<Prisma.ProductOrderByWithRelationInput[]> {
  switch (sort) {
    case "price-asc":
      return [{ priceCents: "asc" }];
    case "price-desc":
      return [{ priceCents: "desc" }];
    case "rating":
      // Approximated at the query level (true average requires a raw
      // aggregate); pages needing an exact rating sort re-sort the page's
      // results client-side using `ratingSummary`, since a 24-row page is
      // cheap to re-order in memory.
      return [{ createdAt: "desc" }];
    case "newest":
    case "relevance":
    default:
      return [{ createdAt: "desc" }];
  }
}

export async function listProducts(filters: ProductListFilters = {}): Promise<{
  products: ProductCard[];
  total: number;
  page: number;
  perPage: number;
}> {
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(
    60,
    Math.max(1, filters.perPage ?? DEFAULT_PER_PAGE),
  );

  const where: Prisma.ProductWhereInput = {
    status: "ACTIVE",
    ...(filters.categorySlug && {
      category: { slug: filters.categorySlug },
    }),
    ...(filters.collectionSlug && {
      collections: {
        some: { collection: { slug: filters.collectionSlug } },
      },
    }),
    ...(filters.search && {
      OR: [
        { name: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
      ],
    }),
    ...(filters.inStockOnly && { stock: { gt: 0 } }),
    ...((filters.minPriceCents !== undefined ||
      filters.maxPriceCents !== undefined) && {
      priceCents: {
        ...(filters.minPriceCents !== undefined && {
          gte: filters.minPriceCents,
        }),
        ...(filters.maxPriceCents !== undefined && {
          lte: filters.maxPriceCents,
        }),
      },
    }),
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      select: PRODUCT_CARD_SELECT,
      orderBy: await resolveSortOrder(filters.sort),
      skip: (page - 1) * perPage,
      take: perPage,
    }),
    prisma.product.count({ where }),
  ]);

  if (filters.sort === "rating") {
    products.sort(
      (a, b) =>
        ratingSummary(b.reviews).average - ratingSummary(a.reviews).average,
    );
  }

  return { products, total, page, perPage };
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({
    where: { slug, status: "ACTIVE" },
    include: {
      category: true,
      images: { orderBy: { position: "asc" } },
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function listCategories() {
  return prisma.category.findMany({
    where: { parentId: null },
    include: { children: { orderBy: { name: "asc" } } },
    orderBy: { name: "asc" },
  });
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function listCollections(featuredOnly = false) {
  return prisma.collection.findMany({
    where: featuredOnly ? { featured: true } : undefined,
    orderBy: { name: "asc" },
  });
}

export async function getCollectionBySlug(slug: string) {
  const collection = await prisma.collection.findUnique({
    where: { slug },
  });
  if (!collection) return null;

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      collections: { some: { collectionId: collection.id } },
    },
    select: PRODUCT_CARD_SELECT,
    orderBy: { createdAt: "desc" },
  });

  // Re-order by the curator's explicit position within *this* collection —
  // the query above can't ORDER BY a filtered join's own column, so it's
  // applied in memory against the small (single-collection) result set.
  const positions = await prisma.collectionProduct.findMany({
    where: { collectionId: collection.id },
    select: { productId: true, position: true },
  });
  const positionByProductId = new Map(
    positions.map((p) => [p.productId, p.position]),
  );
  products.sort(
    (a, b) =>
      (positionByProductId.get(a.id) ?? 0) -
      (positionByProductId.get(b.id) ?? 0),
  );

  return { collection, products };
}
