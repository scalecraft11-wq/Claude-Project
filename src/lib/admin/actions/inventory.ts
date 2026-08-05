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
  inventoryMovementSchema,
  type InventoryMovementInput,
} from "@/lib/validation/admin/inventory";

export async function recordInventoryMovementAction(
  productId: string,
  input: InventoryMovementInput,
): Promise<ActionResult> {
  const session = await requireRole("MANAGER");
  const parsed = inventoryMovementSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const { type, quantity, note } = parsed.data;

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    return { success: false, message: "Product not found." };
  }

  const newStock = product.stock + quantity;
  if (newStock < 0) {
    return {
      success: false,
      message: `That would take stock below zero (currently ${product.stock}).`,
    };
  }

  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: { stock: newStock },
    }),
    prisma.inventoryMovement.create({
      data: {
        productId,
        type,
        quantity,
        note: note || undefined,
        createdById: session.user!.id,
      },
    }),
  ]);

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "inventory.movement",
    entityType: "Product",
    entityId: productId,
    metadata: { type, quantity, newStock, productName: product.name },
  });

  revalidatePath("/admin/inventory");
  revalidatePath("/admin/products");
  return { success: true, message: "Stock updated." };
}
