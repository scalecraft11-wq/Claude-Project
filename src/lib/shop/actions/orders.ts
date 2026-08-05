"use server";

import { prisma } from "@/lib/prisma";

export interface OrderConfirmation {
  orderNumber: string;
  totalCents: number;
  email: string;
}

/** Polled by the checkout success page — the webhook is the only thing
 * that actually creates the Order, so a customer can land on this page
 * slightly before it exists yet (ARCHITECTURE.md: never trust the
 * redirect alone as proof of payment). */
export async function getOrderBySessionIdAction(
  sessionId: string,
): Promise<OrderConfirmation | null> {
  const order = await prisma.order.findUnique({
    where: { stripeSessionId: sessionId },
    select: { orderNumber: true, totalCents: true, email: true },
  });
  return order;
}
