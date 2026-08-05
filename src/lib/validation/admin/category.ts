import { z } from "zod";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100)
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers, and hyphens only"),
  description: z.string().max(500).optional().or(z.literal("")),
  parentId: z.string().optional().or(z.literal("")),
});

export type CategoryInput = z.infer<typeof categorySchema>;
