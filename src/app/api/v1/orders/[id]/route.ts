import { apiNotFound, apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { getCurrentSession } from "@/lib/auth/guards";
import { getCustomerOrder } from "@/lib/shop/orders";

export const GET = withApiErrorHandling(
  async (_request, { params }: { params: Promise<{ id: string }> }) => {
    const session = await getCurrentSession();
    if (!session?.user) return apiUnauthorized();

    const { id } = await params;
    const order = await getCustomerOrder(id, session.user.id);
    if (!order) return apiNotFound("Order not found.");

    return apiSuccess(order);
  },
);
