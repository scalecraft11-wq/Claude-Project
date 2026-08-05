import { apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { toggleWishlistAction } from "@/lib/shop/actions/wishlist";

/** Toggles — mirrors the storefront's wishlist heart icon rather than
 * separate add/remove endpoints, since that's the one operation the UI
 * actually needs and REST doesn't require every resource to have a full
 * CRUD surface. */
export const POST = withApiErrorHandling(
  async (_request, { params }: { params: Promise<{ productId: string }> }) => {
    const { productId } = await params;
    const result = await toggleWishlistAction(productId);
    if (result.requiresLogin) return apiUnauthorized(result.message);
    return apiSuccess(result);
  },
);
