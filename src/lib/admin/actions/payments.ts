"use server";

import { revalidatePath } from "next/cache";

import { type ActionResult } from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import {
  paymentStatusUpdateSchema,
  type PaymentStatusUpdateInput,
} from "@/lib/validation/admin/payment";

/**
 * Only MANUAL payments (wire/cash, recorded by staff) can have their status
 * changed here — STRIPE/PAYPAL payment status is owned by that provider's
 * webhooks in a real integration and must never be hand-edited.
 */
export async function updatePaymentStatusAction(
  id: string,
  input: PaymentStatusUpdateInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = paymentStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, message: "Please choose a valid status." };
  }

  const existing = await prisma.payment.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Payment not found." };
  }
  if (existing.provider !== "MANUAL") {
    return {
      success: false,
      message:
        "Only manual payments can be updated here — gateway payments are managed by their provider.",
    };
  }

  const payment = await prisma.payment.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "payment.status_update",
    entityType: "Payment",
    entityId: payment.id,
    metadata: { from: existing.status, to: payment.status },
  });

  revalidatePath("/admin/payments");
  return { success: true, message: "Payment status updated." };
}
