import { cookies } from "next/headers";

import { prisma } from "@/lib/prisma";
import { PRODUCT_CARD_SELECT, type ProductCard } from "@/lib/shop/catalog";

const RECENTLY_VIEWED_COOKIE = "recently_viewed";

/** Read-only — safe from Server Components. */
export async function getRecentlyViewedIds(): Promise<string[]> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(RECENTLY_VIEWED_COOKIE)?.value;
  if (!raw) return [];
  try {
    const ids = JSON.parse(raw);
    return Array.isArray(ids) ? ids.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export async function getRecentlyViewedProducts(
  excludeProductId?: string,
  limit = 8,
): Promise<ProductCard[]> {
  const ids = (await getRecentlyViewedIds()).filter(
    (id) => id !== excludeProductId,
  );
  if (ids.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: ids }, status: "ACTIVE" },
    select: PRODUCT_CARD_SELECT,
  });

  const byId = new Map(products.map((p) => [p.id, p]));
  return ids
    .map((id) => byId.get(id))
    .filter((p): p is ProductCard => !!p)
    .slice(0, limit);
}
