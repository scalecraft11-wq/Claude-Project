import { z } from "zod";

export const couponSchema = z.object({
  code: z
    .string()
    .min(3, "Code must be at least 3 characters")
    .max(30)
    .regex(/^[A-Z0-9]+$/, "Use uppercase letters and numbers only"),
  type: z.enum(["PERCENTAGE", "FIXED"]),
  value: z.coerce.number().int().min(1, "Value must be at least 1"),
  minOrderCents: z.coerce.number().int().min(0).optional().or(z.literal("")),
  maxUses: z.coerce.number().int().min(1).optional().or(z.literal("")),
  active: z.boolean(),
  startsAt: z.string().optional().or(z.literal("")),
  expiresAt: z.string().optional().or(z.literal("")),
});

export type CouponInput = z.infer<typeof couponSchema>;
