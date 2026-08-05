import { z } from "zod";

export const reviewStatusUpdateSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export type ReviewStatusUpdateInput = z.infer<typeof reviewStatusUpdateSchema>;
