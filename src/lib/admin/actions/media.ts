"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import {
  deleteImage,
  isCloudinaryConfigured,
  uploadImage,
} from "@/lib/cloudinary";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import {
  mediaAssetSchema,
  type MediaAssetInput,
} from "@/lib/validation/admin/media";

const log = logger.child({ module: "media" });

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

  // Cloudinary when configured (a real CDN URL, not a base64 blob sitting
  // in Postgres); falls back to storing the data URI as-is otherwise —
  // same graceful-degradation posture as every other optional integration.
  let url = data.url;
  let publicId: string | undefined;
  let width = data.width;
  let height = data.height;

  if (isCloudinaryConfigured() && data.url.startsWith("data:")) {
    try {
      const uploaded = await uploadImage(data.url, data.folder);
      url = uploaded.url;
      publicId = uploaded.publicId;
      width = uploaded.width ?? width;
      height = uploaded.height ?? height;
    } catch (error) {
      log.error(
        { err: error },
        "Cloudinary upload failed, storing data URI instead",
      );
    }
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      filename: data.filename,
      url,
      publicId,
      mimeType: data.mimeType,
      sizeBytes: data.sizeBytes,
      width,
      height,
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

  if (existing.publicId) {
    await deleteImage(existing.publicId);
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
