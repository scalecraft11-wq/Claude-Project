"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import {
  productSchema,
  type ProductInput,
} from "@/lib/validation/admin/product";
import { prisma } from "@/lib/prisma";

function toOptionalCents(value: number | "" | undefined): number | undefined {
  return value === "" || value === undefined ? undefined : value;
}

function toOptionalId(value: string | undefined): string | undefined {
  return value ? value : undefined;
}

export async function createProductAction(
  input: ProductInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        sku: data.sku,
        priceCents: data.priceCents,
        compareAtCents: toOptionalCents(data.compareAtCents),
        costCents: toOptionalCents(data.costCents),
        status: data.status,
        categoryId: toOptionalId(data.categoryId),
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
      },
    });

    if (data.stock > 0) {
      await prisma.inventoryMovement.create({
        data: {
          productId: product.id,
          type: "RESTOCK",
          quantity: data.stock,
          note: "Initial stock on product creation",
          createdById: session.user!.id,
        },
      });
    }

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "product.create",
      entityType: "Product",
      entityId: product.id,
      metadata: { name: product.name, sku: product.sku },
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Product created." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "A product with that slug or SKU already exists.",
      };
    }
    throw error;
  }
}

export async function updateProductAction(
  id: string,
  input: ProductInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Product not found." };
  }

  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        sku: data.sku,
        priceCents: data.priceCents,
        compareAtCents: toOptionalCents(data.compareAtCents),
        costCents: toOptionalCents(data.costCents),
        status: data.status,
        categoryId: toOptionalId(data.categoryId),
        stock: data.stock,
        lowStockThreshold: data.lowStockThreshold,
      },
    });

    const stockDelta = data.stock - existing.stock;
    if (stockDelta !== 0) {
      await prisma.inventoryMovement.create({
        data: {
          productId: id,
          type: "ADJUSTMENT",
          quantity: stockDelta,
          note: "Manual stock adjustment via product edit",
          createdById: session.user!.id,
        },
      });
    }

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "product.update",
      entityType: "Product",
      entityId: product.id,
      metadata: { name: product.name, sku: product.sku },
    });

    revalidatePath("/admin/products");
    return { success: true, message: "Product updated." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "A product with that slug or SKU already exists.",
      };
    }
    throw error;
  }
}

export async function deleteProductAction(id: string): Promise<ActionResult> {
  const session = await requireRole("EDITOR");

  const existing = await prisma.product.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Product not found." };
  }

  await prisma.product.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "product.delete",
    entityType: "Product",
    entityId: id,
    metadata: { name: existing.name, sku: existing.sku },
  });

  revalidatePath("/admin/products");
  return { success: true, message: "Product deleted." };
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}
