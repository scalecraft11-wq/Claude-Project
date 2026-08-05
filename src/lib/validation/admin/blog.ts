import { z } from "zod";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .max(200)
    .regex(SLUG_PATTERN, "Use lowercase letters, numbers, and hyphens only"),
  excerpt: z
    .string()
    .min(10, "Excerpt must be at least 10 characters")
    .max(500),
  content: z.string().min(20, "Content must be at least 20 characters"),
  coverImage: z.string().optional().or(z.literal("")),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
  /** Comma-separated in the form; split into `BlogPost.tags: String[]` server-side. */
  tags: z.string().optional().or(z.literal("")),
});

export type BlogPostInput = z.infer<typeof blogPostSchema>;
