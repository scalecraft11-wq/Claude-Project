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
  reviewStatusUpdateSchema,
  type ReviewStatusUpdateInput,
} from "@/lib/validation/admin/review";

export async function updateReviewStatusAction(
  id: string,
  input: ReviewStatusUpdateInput,
): Promise<ActionResult> {
  const session = await requireRole("EDITOR");
  const parsed = reviewStatusUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please choose a valid status.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Review not found." };
  }

  const review = await prisma.review.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "review.status_update",
    entityType: "Review",
    entityId: review.id,
    metadata: { from: existing.status, to: review.status },
  });

  revalidatePath("/admin/reviews");
  return { success: true, message: "Review status updated." };
}

export async function deleteReviewAction(id: string): Promise<ActionResult> {
  const session = await requireRole("EDITOR");

  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) {
    return { success: false, message: "Review not found." };
  }

  await prisma.review.delete({ where: { id } });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "review.delete",
    entityType: "Review",
    entityId: id,
    metadata: { authorName: existing.authorName, rating: existing.rating },
  });

  revalidatePath("/admin/reviews");
  return { success: true, message: "Review deleted." };
}
