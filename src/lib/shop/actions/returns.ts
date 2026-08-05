"use server";

import { revalidatePath } from "next/cache";

import { requireAuth } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/shop/action-result";
import {
  returnRequestSchema,
  type ReturnRequestInput,
} from "@/lib/validation/shop/return";

/** Creates the return request and its linked refund request together —
 * for a customer, asking to return an item and asking for the money back
 * are the same act; the refund only needs its own row so admin can work
 * the queue (approve/reject/mark processed) independent of the return's
 * own physical-item status (requested/received). */
export async function submitReturnRequestAction(
  orderId: string,
  input: ReturnRequestInput,
): Promise<ActionResult> {
  const session = await requireAuth();

  const parsed = returnRequestSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true, returnRequests: true },
  });
  if (!order || order.customerId !== session.user!.id) {
    return { success: false, message: "Order not found." };
  }
  if (order.status === "CANCELLED") {
    return { success: false, message: "Cancelled orders can't be returned." };
  }
  if (order.returnRequests.length > 0) {
    return {
      success: false,
      message: "A return has already been requested for this order.",
    };
  }

  const orderItemsById = new Map(order.items.map((item) => [item.id, item]));
  let amountCents = 0;
  for (const requested of parsed.data.items) {
    const orderItem = orderItemsById.get(requested.orderItemId);
    if (!orderItem) {
      return {
        success: false,
        message: "One of the selected items isn't part of this order.",
      };
    }
    if (requested.quantity > orderItem.quantity) {
      return {
        success: false,
        message: `You can return at most ${orderItem.quantity} of ${orderItem.nameSnapshot}.`,
      };
    }
    amountCents += requested.quantity * orderItem.priceCents;
  }

  await prisma.returnRequest.create({
    data: {
      orderId,
      customerId: session.user!.id,
      reason: parsed.data.reason,
      items: {
        create: parsed.data.items.map((item) => ({
          orderItemId: item.orderItemId,
          quantity: item.quantity,
        })),
      },
      refundRequest: {
        create: { amountCents },
      },
    },
  });

  revalidatePath(`/lumora/account/orders/${orderId}`);
  return { success: true, message: "Return request submitted." };
}
