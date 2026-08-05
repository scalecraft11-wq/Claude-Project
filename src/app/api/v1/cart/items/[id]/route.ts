import type { NextRequest } from "next/server";

import { apiError, fromActionResult } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import {
  removeCartItemAction,
  updateCartItemAction,
} from "@/lib/shop/actions/cart";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export const PATCH = withApiErrorHandling(
  async (request: NextRequest, { params }: RouteContext) => {
    const { id } = await params;

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return apiError("Invalid JSON body.", 400);
    }

    const { quantity } = (body ?? {}) as { quantity?: unknown };
    const result = await updateCartItemAction(id, Number(quantity));
    return fromActionResult(result);
  },
);

export const DELETE = withApiErrorHandling(
  async (_request: NextRequest, { params }: RouteContext) => {
    const { id } = await params;
    const result = await removeCartItemAction(id);
    return fromActionResult(result);
  },
);
