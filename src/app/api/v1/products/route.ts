import type { NextRequest } from "next/server";

import { apiSuccess, apiTooManyRequests } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { getClientIp, rateLimit, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { listProducts, type ProductSort } from "@/lib/shop/catalog";

const VALID_SORTS: ProductSort[] = [
  "newest",
  "price-asc",
  "price-desc",
  "rating",
  "relevance",
];

export const GET = withApiErrorHandling(async (request: NextRequest) => {
  const ip = await getClientIp();
  const limited = await rateLimit(
    `apiRead:products:${ip}`,
    RATE_LIMITS.apiRead,
  );
  if (!limited.success) return apiTooManyRequests();

  const params = request.nextUrl.searchParams;
  const sort = params.get("sort");

  const result = await listProducts({
    categorySlug: params.get("category") ?? undefined,
    collectionSlug: params.get("collection") ?? undefined,
    search: params.get("search") ?? undefined,
    minPriceCents: params.has("minPriceCents")
      ? Number(params.get("minPriceCents"))
      : undefined,
    maxPriceCents: params.has("maxPriceCents")
      ? Number(params.get("maxPriceCents"))
      : undefined,
    inStockOnly: params.get("inStock") === "1",
    sort:
      sort && VALID_SORTS.includes(sort as ProductSort)
        ? (sort as ProductSort)
        : undefined,
    page: params.has("page") ? Number(params.get("page")) : undefined,
    perPage: params.has("perPage") ? Number(params.get("perPage")) : undefined,
  });

  return apiSuccess(result);
});
