import { prisma } from "@/lib/prisma";

export interface StockCheckItem {
  productId: string;
  quantity: number;
}

export interface StockIssue {
  productId: string;
  name: string;
  requested: number;
  available: number;
}

/** Re-reads current stock for every line so cart/checkout can never oversell
 * against stale in-memory quantities — call this again immediately before
 * any write that decrements stock, not just when the cart page first loads. */
export async function checkStockAvailability(
  items: StockCheckItem[],
): Promise<StockIssue[]> {
  if (items.length === 0) return [];

  const products = await prisma.product.findMany({
    where: { id: { in: items.map((i) => i.productId) } },
    select: { id: true, name: true, stock: true, status: true },
  });
  const byId = new Map(products.map((p) => [p.id, p]));

  const issues: StockIssue[] = [];
  for (const item of items) {
    const product = byId.get(item.productId);
    if (!product || product.status !== "ACTIVE") {
      issues.push({
        productId: item.productId,
        name: product?.name ?? "Unknown product",
        requested: item.quantity,
        available: 0,
      });
      continue;
    }
    if (product.stock < item.quantity) {
      issues.push({
        productId: item.productId,
        name: product.name,
        requested: item.quantity,
        available: product.stock,
      });
    }
  }
  return issues;
}
