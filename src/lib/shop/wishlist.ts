import { getCurrentSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

import { PRODUCT_CARD_SELECT, type ProductCard } from "@/lib/shop/catalog";

export async function getWishlist(): Promise<
  { id: string; product: ProductCard }[]
> {
  const session = await getCurrentSession();
  if (!session?.user) return [];

  return prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    select: { id: true, product: { select: PRODUCT_CARD_SELECT } },
    orderBy: { createdAt: "desc" },
  });
}

export async function getWishlistProductIds(): Promise<Set<string>> {
  const session = await getCurrentSession();
  if (!session?.user) return new Set();

  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    select: { productId: true },
  });
  return new Set(items.map((i) => i.productId));
}
