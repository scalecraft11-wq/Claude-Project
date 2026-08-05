"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import {
  blogPostSchema,
  type BlogPostInput,
} from "@/lib/validation/admin/blog";

function tagsFromInput(tags: string | undefined): string[] {
  if (!tags) return [];
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function isUniqueConstraintError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

export async function createBlogPostAction(
  input: BlogPostInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  try {
    const post = await prisma.blogPost.create({
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || undefined,
        status: data.status,
        tags: tagsFromInput(data.tags),
        authorId: session.user!.id,
        publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "blog_post.create",
      entityType: "BlogPost",
      entityId: post.id,
      metadata: { title: post.title },
    });

    revalidatePath("/admin/blog");
    return { success: true, message: "Post created." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "A post with that slug already exists.",
      };
    }
    throw error;
  }
}

export async function updateBlogPostAction(
  id: string,
  input: BlogPostInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Post not found." };
  }

  try {
    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        excerpt: data.excerpt,
        content: data.content,
        coverImage: data.coverImage || undefined,
        status: data.status,
        tags: tagsFromInput(data.tags),
        publishedAt:
          data.status === "PUBLISHED"
            ? (existing.publishedAt ?? new Date())
            : existing.publishedAt,
      },
    });

    await logActivity({
      actorId: session.user!.id,
      actorName: session.user!.name ?? session.user!.email ?? "Unknown",
      action: "blog_post.update",
      entityType: "BlogPost",
      entityId: post.id,
      metadata: { title: post.title },
    });

    revalidatePath("/admin/blog");
    return { success: true, message: "Post updated." };
  } catch (error) {
    if (isUniqueConstraintError(error)) {
      return {
        success: false,
        message: "A post with that slug already exists.",
      };
    }
    throw error;
  }
}

export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  const session = await requireRole("EDITOR");

  const existing = await prisma.blogPost.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Post not found." };
  }

  await prisma.blogPost.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "blog_post.delete",
    entityType: "BlogPost",
    entityId: id,
    metadata: { title: existing.title },
  });

  revalidatePath("/admin/blog");
  return { success: true, message: "Post deleted." };
}
