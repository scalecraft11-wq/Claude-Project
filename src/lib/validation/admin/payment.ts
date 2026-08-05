import { z } from "zod";

export const paymentStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "PAID", "FAILED", "REFUNDED"]),
});

export type PaymentStatusUpdateInput = z.infer<
  typeof paymentStatusUpdateSchema
>;
