import { z } from "zod";

export const mediaAssetSchema = z.object({
  filename: z.string().min(1, "Filename is required").max(255),
  url: z.string().min(1, "File data is required"),
  mimeType: z.string().min(1),
  sizeBytes: z.coerce.number().int().min(0),
  width: z.coerce.number().int().min(0).optional(),
  height: z.coerce.number().int().min(0).optional(),
  folder: z.string().min(1).max(100),
});

export type MediaAssetInput = z.infer<typeof mediaAssetSchema>;
