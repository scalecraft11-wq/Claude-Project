import { prisma } from "@/lib/prisma";

export async function listCustomerOrders(customerId: string) {
  return prisma.order.findMany({
    where: { customerId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export async function getCustomerOrder(orderId: string, customerId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: { include: { returnItems: true } },
      payments: true,
      invoice: true,
      shippingMethod: true,
      coupon: true,
      returnRequests: { include: { items: true, refundRequest: true } },
    },
  });
  if (!order || order.customerId !== customerId) return null;
  return order;
}

export const ORDER_STATUS_STEPS = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
] as const;
