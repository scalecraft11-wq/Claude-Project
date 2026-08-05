import { z } from "zod";

export const reviewSchema = z.object({
  rating: z.coerce.number().int().min(1, "Choose a rating").max(5),
  title: z.string().min(3, "Title must be at least 3 characters").max(120),
  body: z.string().min(10, "Please write at least 10 characters").max(2000),
});

export type ReviewInput = z.infer<typeof reviewSchema>;
