"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { invalidateCache } from "@/lib/cache";
import { prisma } from "@/lib/prisma";
import {
  categorySchema,
  type CategoryInput,
} from "@/lib/validation/admin/category";

const CATEGORIES_CACHE_KEY = "shop:categories:tree";

function toOptionalId(value: string | undefined): string | undefined {
  return value ? value : undefined;
}

export async function createCategoryAction(
  input: CategoryInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  try {
    const category = await prisma.category.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        parentId: toOptionalId(data.parentId),
      },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "category.create",
      entityType: "Category",
      entityId: category.id,
      metadata: { name: category.name },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    await invalidateCache(CATEGORIES_CACHE_KEY);
    return { success: true, message: "Category created." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "A category with that slug already exists.",
      };
    }
    throw error;
  }
}

export async function updateCategoryAction(
  id: string,
  input: CategoryInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  if (data.parentId === id) {
    return { success: false, message: "A category can't be its own parent." };
  }

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Category not found." };
  }

  try {
    const category = await prisma.category.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description || undefined,
        parentId: toOptionalId(data.parentId),
      },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "category.update",
      entityType: "Category",
      entityId: category.id,
      metadata: { name: category.name },
    });

    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");
    await invalidateCache(CATEGORIES_CACHE_KEY);
    return { success: true, message: "Category updated." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "A category with that slug already exists.",
      };
    }
    throw error;
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  const session = await requireRole("EDITOR");

  const existing = await prisma.category.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Category not found." };
  }

  await prisma.category.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "category.delete",
    entityType: "Category",
    entityId: id,
    metadata: { name: existing.name },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  await invalidateCache(CATEGORIES_CACHE_KEY);
  return {
    success: true,
    message:
      "Category deleted. Its products and subcategories are now uncategorized/top-level.",
  };
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}
