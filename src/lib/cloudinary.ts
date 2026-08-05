import { v2 as cloudinary } from "cloudinary";

import { clientEnv, env } from "@/lib/env";
import { logger } from "@/lib/logger";

const log = logger.child({ module: "cloudinary" });

export function isCloudinaryConfigured(): boolean {
  return !!(
    env.CLOUDINARY_API_KEY &&
    env.CLOUDINARY_API_SECRET &&
    clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  );
}

let configured = false;

function ensureConfigured(): void {
  if (configured) return;
  if (!isCloudinaryConfigured()) {
    throw new Error(
      "Cloudinary is not configured — set CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME.",
    );
  }
  cloudinary.config({
    cloud_name: clientEnv.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export interface CloudinaryUploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  bytes: number;
  format: string;
}

/** Uploads a data URI (what the admin Media Library's client already
 * produces from a `<input type="file">` read) to Cloudinary, scoped
 * under a fixed root folder so every asset this app owns is
 * distinguishable from anything else in the Cloudinary account. */
export async function uploadImage(
  dataUri: string,
  folder: string,
): Promise<CloudinaryUploadResult> {
  ensureConfigured();
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: `lumora-digital/${folder}`,
    resource_type: "image",
  });
  log.info(
    { publicId: result.public_id, bytes: result.bytes },
    "image uploaded",
  );
  return {
    url: result.secure_url,
    publicId: result.public_id,
    width: result.width,
    height: result.height,
    bytes: result.bytes,
    format: result.format,
  };
}

export async function deleteImage(publicId: string): Promise<void> {
  ensureConfigured();
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    log.error({ err: error, publicId }, "failed to delete image");
  }
}
