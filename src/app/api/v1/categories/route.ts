import { apiSuccess } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { listCategories } from "@/lib/shop/catalog";

export const GET = withApiErrorHandling(async () => {
  const categories = await listCategories();
  return apiSuccess(categories);
});
