import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import {
  generateInvoiceNumber,
  generateOrderNumber,
} from "@/lib/shop/order-number";
import { stripe } from "@/lib/stripe";

/**
 * Stripe webhook — the single source of truth for "did this order actually
 * get paid," never the client-side redirect back to /checkout/success
 * (ARCHITECTURE.md: "never trusts the redirect alone as proof of
 * payment"). Idempotent on `Order.stripeSessionId` (unique) so a retried
 * or duplicate delivery of the same event can never create two orders.
 */
export async function POST(request: Request) {
  if (!env.STRIPE_WEBHOOK_SECRET) {
    console.error("[stripe webhook] STRIPE_WEBHOOK_SECRET is not set");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 500 },
    );
  }

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (error) {
    console.error("[stripe webhook] signature verification failed", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" ||
    event.type === "checkout.session.async_payment_succeeded"
  ) {
    try {
      await fulfillCheckoutSession(
        event.data.object as Stripe.Checkout.Session,
      );
    } catch (error) {
      console.error("[stripe webhook] fulfillment failed", event.id, error);
      // 500 tells Stripe to retry — the idempotency check above makes a
      // retry safe even if fulfillment partially completed before erroring.
      return NextResponse.json(
        { error: "Fulfillment failed" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const existing = await prisma.order.findUnique({
    where: { stripeSessionId: session.id },
  });
  if (existing) return;

  const metadata = session.metadata ?? {};
  const cartId = metadata.cartId;
  if (!cartId) {
    console.error(
      "[stripe webhook] missing cartId in session metadata",
      session.id,
    );
    return;
  }

  const cart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: { items: { include: { product: true } } },
  });
  if (!cart || cart.items.length === 0) {
    console.error(
      "[stripe webhook] cart missing or empty at fulfillment time",
      cartId,
    );
    return;
  }

  const shippingAddress = safeJsonParse(metadata.shippingAddress) ?? {};
  const billingAddress = safeJsonParse(metadata.billingAddress);
  const subtotalCents = Number(metadata.subtotalCents ?? 0);
  const shippingCents = Number(metadata.shippingCents ?? 0);
  const taxCents = Number(metadata.taxCents ?? 0);
  const discountCents = Number(metadata.discountCents ?? 0);
  const totalCents = subtotalCents + shippingCents + taxCents - discountCents;
  const userId = metadata.userId || undefined;
  const couponId = metadata.couponId || undefined;
  const shippingMethodId = metadata.shippingMethodId || undefined;

  const orderNumber = generateOrderNumber();
  const invoiceNumber = generateInvoiceNumber();
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;

  await prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        orderNumber,
        customerId: userId,
        email:
          session.customer_email ??
          session.customer_details?.email ??
          "unknown@example.com",
        status: "PROCESSING",
        subtotalCents,
        taxCents,
        shippingCents,
        discountCents,
        totalCents,
        currency: "USD",
        shippingAddress,
        billingAddress: billingAddress ?? undefined,
        couponId,
        shippingMethodId,
        stripeSessionId: session.id,
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            nameSnapshot: item.product.name,
            priceCents: item.product.priceCents,
            quantity: item.quantity,
            totalCents: item.product.priceCents * item.quantity,
          })),
        },
        payments: {
          create: {
            provider: "STRIPE",
            status: "PAID",
            amountCents: totalCents,
            currency: "USD",
            transactionId: paymentIntentId,
          },
        },
      },
    });

    await tx.invoice.create({ data: { invoiceNumber, orderId: order.id } });

    for (const item of cart.items) {
      const product = await tx.product.findUnique({
        where: { id: item.productId },
        select: { stock: true },
      });
      const nextStock = Math.max(0, (product?.stock ?? 0) - item.quantity);
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: nextStock },
      });
      await tx.inventoryMovement.create({
        data: {
          productId: item.productId,
          type: "SALE",
          quantity: -item.quantity,
          note: `Order ${orderNumber}`,
        },
      });
    }

    if (couponId) {
      await tx.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    if (userId && metadata.saveAddress === "1" && shippingAddress) {
      await tx.address.create({
        data: {
          userId,
          fullName: shippingAddress.fullName ?? "",
          line1: shippingAddress.line1 ?? "",
          line2: shippingAddress.line2 || null,
          city: shippingAddress.city ?? "",
          state: shippingAddress.state || null,
          postalCode: shippingAddress.postalCode ?? "",
          country: shippingAddress.country ?? "",
          phone: shippingAddress.phone || null,
        },
      });
    }

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
  });
}

function safeJsonParse(
  value: string | undefined,
): Record<string, string> | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value);
  } catch {
    return undefined;
  }
}
