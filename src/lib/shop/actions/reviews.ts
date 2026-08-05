"use server";

import { revalidatePath } from "next/cache";

import { getCurrentSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { sanitizePlainText } from "@/lib/sanitize";
import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/shop/action-result";
import { reviewSchema, type ReviewInput } from "@/lib/validation/shop/review";

/** Reviews go in as PENDING and only surface on the storefront once an
 * admin approves them (see admin/actions/reviews.ts) — same moderation
 * gate as every other review already in the system, customer- or
 * admin-submitted alike. */
export async function submitReviewAction(
  productSlug: string,
  input: ReviewInput,
): Promise<ActionResult> {
  const session = await getCurrentSession();
  if (!session?.user) {
    return { success: false, message: "Sign in to leave a review." };
  }

  const parsed = reviewSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }

  const product = await prisma.product.findUnique({
    where: { slug: productSlug, status: "ACTIVE" },
    select: { id: true },
  });
  if (!product) {
    return { success: false, message: "Product not found." };
  }

  const existing = await prisma.review.findFirst({
    where: { productId: product.id, customerId: session.user.id },
  });
  if (existing) {
    return { success: false, message: "You've already reviewed this product." };
  }

  await prisma.review.create({
    data: {
      productId: product.id,
      customerId: session.user.id,
      authorName: session.user.name ?? session.user.email ?? "Customer",
      rating: parsed.data.rating,
      title: sanitizePlainText(parsed.data.title),
      body: sanitizePlainText(parsed.data.body),
    },
  });

  revalidatePath(`/lumora/products/${productSlug}`);
  return {
    success: true,
    message: "Thanks! Your review will appear after a quick moderation check.",
  };
}
