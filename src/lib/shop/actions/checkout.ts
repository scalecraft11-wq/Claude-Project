"use server";

import type Stripe from "stripe";

import { getClientIp, rateLimit, RATE_LIMITS } from "@/lib/auth/rate-limit";
import { getCurrentSession } from "@/lib/auth/guards";
import { clientEnv } from "@/lib/env";
import { logger } from "@/lib/logger";
import { prisma } from "@/lib/prisma";
import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/shop/action-result";
import { cartSubtotalCents, getOrCreateCart } from "@/lib/shop/cart";
import { validateCoupon } from "@/lib/shop/coupon";
import { shippingCostCents } from "@/lib/shop/shipping";
import { checkStockAvailability } from "@/lib/shop/stock";
import { calculateTaxCents } from "@/lib/shop/tax";
import { stripe } from "@/lib/stripe";
import {
  checkoutSchema,
  type CheckoutInput,
} from "@/lib/validation/shop/checkout";

export interface CheckoutSessionResult extends ActionResult {
  checkoutUrl?: string;
}

export async function createCheckoutSessionAction(
  input: CheckoutInput,
): Promise<CheckoutSessionResult> {
  const ip = await getClientIp();
  const limited = await rateLimit(
    `checkoutCreate:${ip}`,
    RATE_LIMITS.checkoutCreate,
  );
  if (!limited.success) {
    return {
      success: false,
      message: "Too many checkout attempts — please try again shortly.",
    };
  }

  const parsed = checkoutSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  const cart = await getOrCreateCart();
  if (cart.items.length === 0) {
    return { success: false, message: "Your bag is empty." };
  }

  const stockIssues = await checkStockAvailability(
    cart.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  );
  if (stockIssues.length > 0) {
    return {
      success: false,
      message: `${stockIssues[0]!.name} only has ${stockIssues[0]!.available} left in stock — please update your bag.`,
    };
  }

  const shippingMethod = await prisma.shippingMethod.findUnique({
    where: { id: data.shippingMethodId },
  });
  if (!shippingMethod || !shippingMethod.active) {
    return {
      success: false,
      message: "Please choose a valid shipping method.",
    };
  }

  const subtotalCents = cartSubtotalCents(cart);

  let discountCents = 0;
  let couponId: string | undefined;
  if (data.couponCode) {
    const couponResult = await validateCoupon(data.couponCode, subtotalCents);
    if (!couponResult.valid) {
      return { success: false, message: couponResult.message };
    }
    discountCents = couponResult.discountCents;
    couponId = couponResult.coupon.id;
  }

  const shippingCents = shippingCostCents(
    shippingMethod,
    subtotalCents - discountCents,
  );
  const taxCents = await calculateTaxCents(subtotalCents - discountCents, {
    country: data.shippingAddress.country,
    state: data.shippingAddress.state,
  });

  const session = await getCurrentSession();

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
    cart.items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: { name: item.product.name },
        unit_amount: item.product.priceCents,
      },
      quantity: item.quantity,
    }));

  if (shippingCents > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: `Shipping — ${shippingMethod.name}` },
        unit_amount: shippingCents,
      },
      quantity: 1,
    });
  }

  if (taxCents > 0) {
    lineItems.push({
      price_data: {
        currency: "usd",
        product_data: { name: "Estimated tax" },
        unit_amount: taxCents,
      },
      quantity: 1,
    });
  }

  const appUrl = clientEnv.NEXT_PUBLIC_APP_URL;
  const billingAddress = data.billingSameAsShipping
    ? data.shippingAddress
    : (data.billingAddress ?? data.shippingAddress);

  try {
    const discounts: Stripe.Checkout.SessionCreateParams.Discount[] = [];
    if (discountCents > 0) {
      const stripeCoupon = await stripe.coupons.create({
        amount_off: discountCents,
        currency: "usd",
        duration: "once",
        name: data.couponCode?.toUpperCase(),
      });
      discounts.push({ coupon: stripeCoupon.id });
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: data.email,
      line_items: lineItems,
      discounts: discounts.length > 0 ? discounts : undefined,
      // Tax is our own flat per-region rate (lib/shop/tax.ts), added as its
      // own line item rather than Stripe Tax — a full jurisdiction-aware tax
      // engine is out of scope for this demo storefront.
      success_url: `${appUrl}/lumora/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/lumora/checkout`,
      metadata: {
        cartId: cart.id,
        shippingMethodId: shippingMethod.id,
        couponId: couponId ?? "",
        userId: session?.user?.id ?? "",
        shippingAddress: JSON.stringify(data.shippingAddress),
        billingAddress: JSON.stringify(billingAddress),
        saveAddress: session?.user?.id && data.saveAddress ? "1" : "",
        subtotalCents: String(subtotalCents),
        shippingCents: String(shippingCents),
        taxCents: String(taxCents),
        discountCents: String(discountCents),
      },
    });

    if (!checkoutSession.url) {
      return {
        success: false,
        message: "Could not start checkout — please try again.",
      };
    }

    return {
      success: true,
      message: "Redirecting to checkout…",
      checkoutUrl: checkoutSession.url,
    };
  } catch (error) {
    logger.child({ module: "checkout" }).error({ err: error }, "Stripe error");
    return {
      success: false,
      message:
        "Checkout isn't available right now — Stripe may not be configured for this environment.",
    };
  }
}
