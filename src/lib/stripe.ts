import Stripe from "stripe";

import { env } from "@/lib/env";

/**
 * Stripe client singleton — lazy, same reasoning as `lib/prisma.ts`:
 * modules that merely *import* this (or import something that transitively
 * does) must not require `STRIPE_SECRET_KEY` just to be imported, only an
 * actual API call should throw. Test-mode only for this project (Lumora
 * Skin is a demo storefront — see ARCHITECTURE.md §"Payments & Checkout").
 */
let stripeClient: Stripe | undefined;

function createStripeClient(): Stripe {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY is not set — add a Stripe test-mode secret key to .env.local to enable checkout.",
    );
  }
  return new Stripe(env.STRIPE_SECRET_KEY);
}

export const stripe = new Proxy({} as Stripe, {
  get: (_target, prop, receiver) => {
    stripeClient ??= createStripeClient();
    return Reflect.get(stripeClient, prop, receiver);
  },
});
