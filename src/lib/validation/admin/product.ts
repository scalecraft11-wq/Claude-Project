import { z } from "zod";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(200),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(200)
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers, and hyphens only"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(5000),
  sku: z.string().min(2, "SKU must be at least 2 characters").max(64),
  priceCents: z.coerce.number().int().min(0, "Price can't be negative"),
  compareAtCents: z.coerce.number().int().min(0).optional().or(z.literal("")),
  costCents: z.coerce.number().int().min(0).optional().or(z.literal("")),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  categoryId: z.string().optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock can't be negative"),
  lowStockThreshold: z.coerce.number().int().min(0),
});

export type ProductInput = z.infer<typeof productSchema>;
