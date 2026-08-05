import { z } from "zod";

export const subscriberSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  source: z.string().max(100).optional().or(z.literal("")),
});

export type SubscriberInput = z.infer<typeof subscriberSchema>;

export const subscriberStatusUpdateSchema = z.object({
  status: z.enum(["SUBSCRIBED", "UNSUBSCRIBED"]),
});

export type SubscriberStatusUpdateInput = z.infer<
  typeof subscriberStatusUpdateSchema
>;
