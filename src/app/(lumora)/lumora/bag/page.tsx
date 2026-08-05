import Link from "next/link";
import type { Metadata } from "next";

import { CartLineItem } from "@/components/lumora/cart-line-item";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layouts";

import { formatCurrency } from "@/lib/format";
import { cartSubtotalCents, getCart } from "@/lib/shop/cart";

export const metadata: Metadata = { title: "Your Bag" };

export default async function LumoraBagPage() {
  const cart = await getCart();
  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <Container size="2xl" className="grid gap-4 py-section-sm text-center">
        <h1 className="font-display text-heading-01">Your Bag</h1>
        <p className="text-body-md text-content-secondary">
          Your bag is empty.
        </p>
        <Button asChild className="justify-self-center">
          <Link href="/lumora/collections">Continue shopping</Link>
        </Button>
      </Container>
    );
  }

  const subtotalCents = cartSubtotalCents({ items });

  return (
    <Container
      size="2xl"
      className="grid gap-8 py-section-sm lg:grid-cols-[2fr_1fr]"
    >
      <div>
        <h1 className="mb-6 font-display text-heading-01">Your Bag</h1>
        {items.map((item) => (
          <CartLineItem key={item.id} item={item} />
        ))}
      </div>

      <div className="h-fit rounded-card border border-hairline-subtle p-6">
        <div className="flex items-center justify-between text-body-md">
          <span className="text-content-secondary">Subtotal</span>
          <span className="font-medium">{formatCurrency(subtotalCents)}</span>
        </div>
        <p className="mt-1 text-body-sm text-content-muted">
          Shipping and tax calculated at checkout.
        </p>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/lumora/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </Container>
  );
}
