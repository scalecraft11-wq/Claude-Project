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
  shippingMethodSchema,
  type ShippingMethodInput,
} from "@/lib/validation/admin/shipping";

function toOptionalNumber(value: number | "" | undefined): number | undefined {
  return value === "" || value === undefined ? undefined : value;
}

export async function createShippingMethodAction(
  input: ShippingMethodInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = shippingMethodSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  const method = await prisma.shippingMethod.create({
    data: {
      name: data.name,
      description: data.description || undefined,
      rateCents: data.rateCents,
      freeThresholdCents: toOptionalNumber(data.freeThresholdCents),
      estimatedDays: data.estimatedDays,
      active: data.active,
    },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "shipping_method.create",
    entityType: "ShippingMethod",
    entityId: method.id,
    metadata: { name: method.name },
  });

  revalidatePath("/admin/shipping");
  return { success: true, message: "Shipping method created." };
}

export async function updateShippingMethodAction(
  id: string,
  input: ShippingMethodInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = shippingMethodSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  const existing = await prisma.shippingMethod.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Shipping method not found." };
  }

  const method = await prisma.shippingMethod.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description || undefined,
      rateCents: data.rateCents,
      freeThresholdCents: toOptionalNumber(data.freeThresholdCents),
      estimatedDays: data.estimatedDays,
      active: data.active,
    },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "shipping_method.update",
    entityType: "ShippingMethod",
    entityId: method.id,
    metadata: { name: method.name },
  });

  revalidatePath("/admin/shipping");
  return { success: true, message: "Shipping method updated." };
}

export async function deleteShippingMethodAction(
  id: string,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");

  const existing = await prisma.shippingMethod.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Shipping method not found." };
  }

  await prisma.shippingMethod.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "shipping_method.delete",
    entityType: "ShippingMethod",
    entityId: id,
    metadata: { name: existing.name },
  });

  revalidatePath("/admin/shipping");
  return { success: true, message: "Shipping method deleted." };
}
