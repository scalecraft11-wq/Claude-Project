import { apiSuccess } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { getWishlist } from "@/lib/shop/wishlist";

export const GET = withApiErrorHandling(async () => {
  const items = await getWishlist();
  return apiSuccess(items);
});
