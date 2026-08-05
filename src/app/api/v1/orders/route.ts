import { apiSuccess, apiUnauthorized } from "@/lib/api/response";
import { withApiErrorHandling } from "@/lib/api/with-error-handling";
import { getCurrentSession } from "@/lib/auth/guards";
import { listCustomerOrders } from "@/lib/shop/orders";

export const GET = withApiErrorHandling(async () => {
  const session = await getCurrentSession();
  if (!session?.user) return apiUnauthorized();

  const orders = await listCustomerOrders(session.user.id);
  return apiSuccess(orders);
});
