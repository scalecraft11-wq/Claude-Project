import { randomUUID } from "crypto";
import { cookies } from "next/headers";

import { getCurrentSession } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

const CART_COOKIE = "cart_session";
const CART_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

const CART_INCLUDE = {
  items: {
    orderBy: { createdAt: "asc" as const },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          slug: true,
          priceCents: true,
          stock: true,
          status: true,
          images: {
            orderBy: { position: "asc" as const },
            take: 1,
            select: { url: true, altText: true },
          },
        },
      },
    },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{
  include: typeof CART_INCLUDE;
}>;

/** Read-only — safe from Server Components. Never creates a cart or touches
 * cookies (Server Components can't set them); returns null for "no cart
 * yet" rather than creating one just to display an empty state. */
export async function getCart(): Promise<CartWithItems | null> {
  const session = await getCurrentSession();
  if (session?.user) {
    return prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: CART_INCLUDE,
    });
  }

  const cookieStore = await cookies();
  const token = cookieStore.get(CART_COOKIE)?.value;
  if (!token) return null;
  return prisma.cart.findUnique({
    where: { sessionToken: token },
    include: CART_INCLUDE,
  });
}

export function cartSubtotalCents(cart: Pick<CartWithItems, "items">): number {
  return cart.items.reduce(
    (sum, item) => sum + item.quantity * item.product.priceCents,
    0,
  );
}

async function mergeGuestCartIntoUserCart(
  guestCartId: string,
  userId: string,
): Promise<void> {
  await prisma.$transaction(async (tx) => {
    const guestCart = await tx.cart.findUnique({
      where: { id: guestCartId },
      include: { items: true },
    });
    if (!guestCart) return;

    let userCart = await tx.cart.findUnique({ where: { userId } });
    userCart ??= await tx.cart.create({ data: { userId } });

    for (const item of guestCart.items) {
      await tx.cartItem.upsert({
        where: {
          cartId_productId: { cartId: userCart.id, productId: item.productId },
        },
        update: { quantity: { increment: item.quantity } },
        create: {
          cartId: userCart.id,
          productId: item.productId,
          quantity: item.quantity,
        },
      });
    }

    await tx.cart.delete({ where: { id: guestCart.id } });
  });
}

/** Mutating — only callable from a Server Action/Route Handler (it may set
 * or clear the guest-cart cookie). Creates a cart on first use, and
 * one-time merges a guest cart into the user's cart right after login. */
export async function getOrCreateCart(): Promise<CartWithItems> {
  const session = await getCurrentSession();
  const cookieStore = await cookies();

  if (session?.user) {
    const userId = session.user.id;
    const guestToken = cookieStore.get(CART_COOKIE)?.value;

    if (guestToken) {
      const guestCart = await prisma.cart.findUnique({
        where: { sessionToken: guestToken },
      });
      if (guestCart && guestCart.userId !== userId) {
        await mergeGuestCartIntoUserCart(guestCart.id, userId);
      }
      cookieStore.delete(CART_COOKIE);
    }

    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      include: CART_INCLUDE,
    });
    return cart;
  }

  const existingToken = cookieStore.get(CART_COOKIE)?.value;
  if (existingToken) {
    const cart = await prisma.cart.findUnique({
      where: { sessionToken: existingToken },
      include: CART_INCLUDE,
    });
    if (cart) return cart;
  }

  const token = randomUUID();
  const cart = await prisma.cart.create({
    data: { sessionToken: token },
    include: CART_INCLUDE,
  });
  cookieStore.set(CART_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: CART_COOKIE_MAX_AGE,
    path: "/",
  });
  return cart;
}
