"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { seoMetaSchema, type SeoMetaInput } from "@/lib/validation/admin/seo";

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function createSeoMetaAction(
  input: SeoMetaInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = seoMetaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  try {
    const entry = await prisma.seoMeta.create({
      data: {
        path: data.path,
        title: data.title,
        description: data.description,
        ogImage: data.ogImage || undefined,
        noIndex: data.noIndex,
      },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "seo_meta.create",
      entityType: "SeoMeta",
      entityId: entry.id,
      metadata: { path: entry.path },
    });

    revalidatePath("/admin/seo");
    return { success: true, message: "SEO entry created." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "That path already has an SEO entry." };
    }
    throw error;
  }
}

export async function updateSeoMetaAction(
  id: string,
  input: SeoMetaInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = seoMetaSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  const existing = await prisma.seoMeta.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "SEO entry not found." };
  }

  try {
    const entry = await prisma.seoMeta.update({
      where: { id },
      data: {
        path: data.path,
        title: data.title,
        description: data.description,
        ogImage: data.ogImage || undefined,
        noIndex: data.noIndex,
      },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "seo_meta.update",
      entityType: "SeoMeta",
      entityId: entry.id,
      metadata: { path: entry.path },
    });

    revalidatePath("/admin/seo");
    return { success: true, message: "SEO entry updated." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return { success: false, message: "That path already has an SEO entry." };
    }
    throw error;
  }
}

export async function deleteSeoMetaAction(id: string): Promise<ActionResult> {
  const session = await requireRole("EDITOR");

  const existing = await prisma.seoMeta.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "SEO entry not found." };
  }

  await prisma.seoMeta.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "seo_meta.delete",
    entityType: "SeoMeta",
    entityId: id,
    metadata: { path: existing.path },
  });

  revalidatePath("/admin/seo");
  return { success: true, message: "SEO entry deleted." };
}
