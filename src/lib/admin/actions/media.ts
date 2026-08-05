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
  mediaAssetSchema,
  type MediaAssetInput,
} from "@/lib/validation/admin/media";

export async function uploadMediaAction(
  input: MediaAssetInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = mediaAssetSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: data.filename,
      url: data.url,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      width: data.width,
      height: data.height,
      folder: data.folder,
      uploadedById: session.user!.id,
    },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "media.upload",
    entityType: "MediaAsset",
    entityId: asset.id,
    metadata: { filename: asset.filename, folder: asset.folder },
  });

  revalidatePath("/admin/media");
  return { success: true, message: "Uploaded." };
}

export async function deleteMediaAction(id: string): Promise<ActionResult> {
  const session = await requireRole("EDITOR");

  const existing = await prisma.mediaAsset.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Asset not found." };
  }

  await prisma.mediaAsset.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "media.delete",
    entityType: "MediaAsset",
    entityId: id,
    metadata: { filename: existing.filename },
  });

  revalidatePath("/admin/media");
  return { success: true, message: "Deleted." };
}
