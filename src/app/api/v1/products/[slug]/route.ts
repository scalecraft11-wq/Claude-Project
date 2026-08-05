import { apiNotFound, apiSuccess } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { getProductBySlug } from "@/lib/shop/catalog";

export const GET = withApiErrorHandling(
  async (_request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const product = await getProductBySlug(slug);
    if (!product) return apiNotFound("Product not found.");
    return apiSuccess(product);
  },
);
