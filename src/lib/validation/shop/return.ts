import { z } from "zod";

export const returnRequestSchema = z.object({
  reason: z
    .string()
    .min(10, "Please describe the reason (at least 10 characters)")
    .max(1000),
  items: z
    .array(
      z.object({
        orderItemId: z.string().min(1),
        quantity: z.coerce.number().int().min(1),
      }),
    )
    .min(1, "Select at least one item to return"),
});

export type ReturnRequestInput = z.infer<typeof returnRequestSchema>;
