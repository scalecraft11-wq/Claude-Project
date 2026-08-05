import { z } from "zod";

export const shippingMethodSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().max(300).optional().or(z.literal("")),
  rateCents: z.coerce.number().int().min(0, "Rate can't be negative"),
  freeThresholdCents: z.coerce
    .number()
    .int()
    .min(0)
    .optional()
    .or(z.literal("")),
  estimatedDays: z
    .string()
    .min(1, "Estimated delivery time is required")
    .max(50),
  active: z.boolean(),
});

export type ShippingMethodInput = z.infer<typeof shippingMethodSchema>;
