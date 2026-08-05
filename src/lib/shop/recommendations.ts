import { prisma } from "@/lib/prisma";

import { PRODUCT_CARD_SELECT, type ProductCard } from "@/lib/shop/catalog";

/** Same-category active products, excluding the product itself — the
 * "You may also like" rail on a product page. */
export async function relatedProducts(
  productId: string,
  categoryId: string | null,
  limit = 8,
): Promise<ProductCard[]> {
  if (!categoryId) return [];
  return prisma.product.findMany({
    where: {
      status: "ACTIVE",
      categoryId,
      id: { not: productId },
    },
    select: PRODUCT_CARD_SELECT,
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

/** "Frequently bought together" — other products that co-occur in orders
 * containing this product, ranked by how often that happens. A real
 * recommendation engine would look at behavioral signals too; this is the
 * honest, purchase-data-only version of that. */
export async function frequentlyBoughtTogether(
  productId: string,
  limit = 4,
): Promise<ProductCard[]> {
  const coOrderedItems = await prisma.orderItem.findMany({
    where: {
      productId: { not: productId },
      order: { items: { some: { productId } } },
    },
    select: { productId: true },
  });

  if (coOrderedItems.length === 0) return [];

  const counts = new Map<string, number>();
  for (const item of coOrderedItems) {
    if (!item.productId) continue;
    counts.set(item.productId, (counts.get(item.productId) ?? 0) + 1);
  }

  const rankedIds = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);

  if (rankedIds.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: rankedIds }, status: "ACTIVE" },
    select: PRODUCT_CARD_SELECT,
  });

  // Prisma's `in` doesn't preserve order — re-rank to match the count sort.
  const byId = new Map(products.map((p) => [p.id, p]));
  return rankedIds
    .map((id) => byId.get(id))
    .filter((p): p is ProductCard => !!p);
}
