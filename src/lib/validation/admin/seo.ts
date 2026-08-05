import { z } from "zod";

export const seoMetaSchema = z.object({
  path: z
    .string()
    .min(1, "Path is required")
    .regex(
      /^\/[a-z0-9\-/]*$/,
      "Path must start with / and use lowercase letters, numbers, and hyphens",
    ),
  title: z.string().min(3, "Title must be at least 3 characters").max(70),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(200),
  ogImage: z.string().optional().or(z.literal("")),
  noIndex: z.boolean(),
});

export type SeoMetaInput = z.infer<typeof seoMetaSchema>;
