"use client";

import Link from "next/link";
import * as React from "react";

import { Button } from "@/components/ui/button";

import { formatCurrency } from "@/lib/format";
import {
  getOrderBySessionIdAction,
  type OrderConfirmation,
} from "@/lib/shop/actions/orders";

const POLL_INTERVAL_MS = 2000;
const MAX_ATTEMPTS = 10;

export function OrderConfirmationView({ sessionId }: { sessionId: string }) {
  const [order, setOrder] = React.useState<OrderConfirmation | null>(null);
  const [attempts, setAttempts] = React.useState(0);
  const [gaveUp, setGaveUp] = React.useState(false);

  React.useEffect(() => {
    if (order || gaveUp) return;

    let cancelled = false;
    const timer = setTimeout(async () => {
      const result = await getOrderBySessionIdAction(sessionId);
      if (cancelled) return;
      if (result) {
        setOrder(result);
      } else if (attempts + 1 >= MAX_ATTEMPTS) {
        setGaveUp(true);
      } else {
        setAttempts((a) => a + 1);
      }
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [attempts, order, gaveUp, sessionId]);

  if (order) {
    return (
      <div className="grid gap-4 text-center">
        <h1 className="font-display text-heading-01">
          Thank you for your order
        </h1>
        <p className="text-body-md text-content-secondary">
          Order <strong>{order.orderNumber}</strong> —{" "}
          {formatCurrency(order.totalCents)}
        </p>
        <p className="text-body-sm text-content-muted">
          A confirmation has been sent to {order.email}.
        </p>
        <Button asChild className="justify-self-center">
          <Link href="/lumora/account/orders">View your orders</Link>
        </Button>
      </div>
    );
  }

  if (gaveUp) {
    return (
      <div className="grid gap-4 text-center">
        <h1 className="font-display text-heading-01">Payment received</h1>
        <p className="text-body-md text-content-secondary">
          We&apos;re still finalizing your order — this can take a moment. Check
          your account shortly, or check the inbox for{" "}
          {sessionId ? "your" : "the"} confirmation email.
        </p>
        <Button asChild className="justify-self-center">
          <Link href="/lumora/account/orders">Check your orders</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid justify-items-center gap-4 text-center">
      <h1 className="font-display text-heading-01">Confirming your order…</h1>
      <p className="text-body-md text-content-secondary">
        This will just take a moment.
      </p>
    </div>
  );
}
