import { z } from "zod";

export const orderStatusUpdateSchema = z.object({
  status: z.enum([
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ]),
});

export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateSchema>;
