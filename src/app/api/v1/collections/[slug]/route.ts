import { apiNotFound, apiSuccess } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { getCollectionBySlug } from "@/lib/shop/catalog";

export const GET = withApiErrorHandling(
  async (_request, { params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params;
    const result = await getCollectionBySlug(slug);
    if (!result) return apiNotFound("Collection not found.");
    return apiSuccess(result);
  },
);
