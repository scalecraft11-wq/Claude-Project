"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import {
  orderStatusUpdateSchema,
  type OrderStatusUpdateInput,
} from "@/lib/validation/admin/order";

export async function updateOrderStatusAction(
  id: string,
  input: OrderStatusUpdateInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = orderStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please choose a valid status.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }

  const existing = await prisma.order.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Order not found." };
  }

  const order = await prisma.order.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "order.status_update",
    entityType: "Order",
    entityId: order.id,
    metadata: {
      orderNumber: order.orderNumber,
      from: existing.status,
      to: order.status,
    },
  });

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
  return { success: true, message: "Order status updated." };
}
