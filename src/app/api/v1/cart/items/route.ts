import type { NextRequest } from "next/server";

import { apiError, fromActionResult } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { addToCartAction } from "@/lib/shop/actions/cart";

export const POST = withApiErrorHandling(async (request: NextRequest) => {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError("Invalid JSON body.", 400);
  }

  const { productId, quantity } = (body ?? {}) as {
    productId?: unknown;
    quantity?: unknown;
  };
  if (typeof productId !== "string" || !productId) {
    return apiError("productId is required.", 400, { productId: ["Required"] });
  }

  const result = await addToCartAction(productId, Number(quantity ?? 1));
  return fromActionResult(result);
});
