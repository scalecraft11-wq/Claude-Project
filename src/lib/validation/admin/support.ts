import { z } from "zod";

export const ticketStatusUpdateSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});
export type TicketStatusUpdateInput = z.infer<typeof ticketStatusUpdateSchema>;

export const ticketPriorityUpdateSchema = z.object({
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]),
});
export type TicketPriorityUpdateInput = z.infer<
  typeof ticketPriorityUpdateSchema
>;

export const ticketAssignSchema = z.object({
  assignedToId: z.string().optional().or(z.literal("")),
});
export type TicketAssignInput = z.infer<typeof ticketAssignSchema>;

export const ticketMessageSchema = z.object({
  body: z.string().min(1, "Message can't be empty").max(5000),
});
export type TicketMessageInput = z.infer<typeof ticketMessageSchema>;
