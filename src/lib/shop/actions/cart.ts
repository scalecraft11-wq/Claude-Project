"use server";

import { revalidatePath } from "next/cache";

import { getClientIp, rateLimit, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { prisma } from "@/lib/prisma";
import { type ActionResult } from "@/lib/shop/action-result";
import { getOrCreateCart } from "@/lib/shop/cart";
import { checkStockAvailability } from "@/lib/shop/stock";

const MAX_QUANTITY_PER_LINE = 99;

async function assertNotRateLimited(): Promise<ActionResult | null> {
  const ip = await getClientIp();
  const result = await rateLimit(`cartMutate:${ip}`, RATE_LIMITS.cartMutate);
  if (!result.success) {
    return {
      success: false,
      message: "Too many cart updates — please slow down.",
    };
  }
  return null;
}

export async function addToCartAction(
  productId: string,
  quantity: number,
): Promise<ActionResult> {
  const limited = await assertNotRateLimited();
  if (limited) return limited;

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_QUANTITY_PER_LINE
  ) {
    return { success: false, message: "Please choose a valid quantity." };
  }

  const cart = await getOrCreateCart();
  const existing = cart.items.find((item) => item.productId === productId);
  const nextQuantity = (existing?.quantity ?? 0) + quantity;

  const [issue] = await checkStockAvailability([
    { productId, quantity: nextQuantity },
  ]);
  if (issue) {
    return {
      success: false,
      message:
        issue.available === 0
          ? "This item is out of stock."
          : `Only ${issue.available} left in stock.`,
    };
  }

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    update: { quantity: nextQuantity },
    create: { cartId: cart.id, productId, quantity: nextQuantity },
  });

  revalidatePath("/cart");
  return { success: true, message: "Added to cart." };
}

export async function updateCartItemAction(
  itemId: string,
  quantity: number,
): Promise<ActionResult> {
  const limited = await assertNotRateLimited();
  if (limited) return limited;

  if (
    !Number.isInteger(quantity) ||
    quantity < 1 ||
    quantity > MAX_QUANTITY_PER_LINE
  ) {
    return { success: false, message: "Please choose a valid quantity." };
  }

  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, message: "That item isn't in your cart." };
  }

  const [issue] = await checkStockAvailability([
    { productId: item.productId, quantity },
  ]);
  if (issue) {
    return {
      success: false,
      message: `Only ${issue.available} left in stock.`,
    };
  }

  await prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
  revalidatePath("/cart");
  return { success: true, message: "Cart updated." };
}

export async function removeCartItemAction(
  itemId: string,
): Promise<ActionResult> {
  const cart = await getOrCreateCart();
  const item = cart.items.find((i) => i.id === itemId);
  if (!item) {
    return { success: false, message: "That item isn't in your cart." };
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  revalidatePath("/cart");
  return { success: true, message: "Item removed." };
}

export async function clearCartAction(): Promise<ActionResult> {
  const cart = await getOrCreateCart();
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  revalidatePath("/cart");
  return { success: true, message: "Cart cleared." };
}

export async function cartItemCount(): Promise<number> {
  const cart = await getOrCreateCart();
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
