import { redirect } from "next/navigation";
import type { Metadata } from "next";

import { CheckoutForm } from "@/components/lumora/checkout-form";
import { Container } from "@/components/layouts";

import { getCurrentSession } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/format";
import { cartSubtotalCents, getCart } from "@/lib/shop/cart";
import { prisma } from "@/lib/prisma";
import { listActiveShippingMethods } from "@/lib/shop/shipping";

export const metadata: Metadata = { title: "Checkout" };

export default async function LumoraCheckoutPage() {
  const [cart, shippingMethods, session] = await Promise.all([
    getCart(),
    listActiveShippingMethods(),
    getCurrentSession(),
  ]);

  if (!cart || cart.items.length === 0) {
    redirect("/lumora/bag");
  }

  const defaultAddress = session?.user
    ? await prisma.address.findFirst({
        where: { userId: session.user.id },
        orderBy: { isDefault: "desc" },
      })
    : null;

  const subtotalCents = cartSubtotalCents(cart);

  return (
    <Container
      size="xl"
      className="grid gap-8 py-section-sm lg:grid-cols-[2fr_1fr]"
    >
      <div>
        <h1 className="mb-6 font-display text-heading-01">Checkout</h1>
        <CheckoutForm
          shippingMethods={shippingMethods}
          defaultEmail={session?.user?.email ?? ""}
          defaultAddress={
            defaultAddress
              ? {
                  fullName: defaultAddress.fullName,
                  line1: defaultAddress.line1,
                  line2: defaultAddress.line2 ?? "",
                  city: defaultAddress.city,
                  state: defaultAddress.state ?? "",
                  postalCode: defaultAddress.postalCode,
                  country: defaultAddress.country,
                  phone: defaultAddress.phone ?? "",
                }
              : undefined
          }
          isAuthenticated={!!session?.user}
        />
      </div>

      <div className="h-fit rounded-card border border-hairline-subtle p-6">
        <h2 className="mb-4 font-display text-heading-03">Order Summary</h2>
        <div className="grid gap-2">
          {cart.items.map((item) => (
            <div key={item.id} className="flex justify-between text-body-sm">
              <span className="text-content-secondary">
                {item.product.name} × {item.quantity}
              </span>
              <span>
                {formatCurrency(item.product.priceCents * item.quantity)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-hairline-subtle pt-4 text-body-md font-medium">
          <span>Subtotal</span>
          <span>{formatCurrency(subtotalCents)}</span>
        </div>
        <p className="mt-1 text-body-sm text-content-muted">
          Shipping, tax, and any discount are calculated on the next step.
        </p>
      </div>
    </Container>
  );
}
