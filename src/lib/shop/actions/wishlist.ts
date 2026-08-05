"use server";

import { revalidatePath } from "next/cache";

import { getCurrentSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import { type ActionResult } from "@/lib/shop/action-result";

export interface WishlistToggleResult extends ActionResult {
  inWishlist?: boolean;
  requiresLogin?: boolean;
}

/** Deliberately doesn't use `requireAuth()` (which redirects) — a heart
 * icon on a product card should tell an anonymous visitor to sign in via
 * the returned flag, not hard-navigate them away from the page they're on. */
export async function toggleWishlistAction(
  productId: string,
): Promise<WishlistToggleResult> {
  const session = await getCurrentSession();
  if (!session?.user) {
    return {
      success: false,
      message: "Sign in to save items to your wishlist.",
      requiresLogin: true,
    };
  }
  const userId = session.user.id;

  const existing = await prisma.wishlistItem.findUnique({
    where: { userId_productId: { userId, productId } },
  });

  if (existing) {
    await prisma.wishlistItem.delete({ where: { id: existing.id } });
    revalidatePath("/wishlist");
    return {
      success: true,
      message: "Removed from wishlist.",
      inWishlist: false,
    };
  }

  await prisma.wishlistItem.create({ data: { userId, productId } });
  revalidatePath("/wishlist");
  return { success: true, message: "Added to wishlist.", inWishlist: true };
}
