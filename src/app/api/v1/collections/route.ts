import type { NextRequest } from "next/server";

import { apiSuccess } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { listCollections } from "@/lib/shop/catalog";

export const GET = withApiErrorHandling(async (request: NextRequest) => {
  const featuredOnly = request.nextUrl.searchParams.get("featured") === "1";
  const collections = await listCollections(featuredOnly);
  return apiSuccess(collections);
});
