import { apiSuccess, fromActionResult } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { cartSubtotalCents, getCart } from "@/lib/shop/cart";
import { clearCartAction } from "@/lib/shop/actions/cart";

export const GET = withApiErrorHandling(async () => {
  const cart = await getCart();
  if (!cart) return apiSuccess({ items: [], subtotalCents: 0 });
  return apiSuccess({
    items: cart.items,
    subtotalCents: cartSubtotalCents(cart),
  });
});

export const DELETE = withApiErrorHandling(async () => {
  const result = await clearCartAction();
  return fromActionResult(result);
});
