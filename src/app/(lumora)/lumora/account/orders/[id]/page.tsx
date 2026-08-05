import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ReturnRequestForm } from "@/components/lumora/return-request-form";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/layouts";

import { requireAuth } from "@/lib/auth/guards";
import { formatCurrency, formatDate } from "@/lib/format";
import { getCustomerOrder, ORDER_STATUS_STEPS } from "@/lib/shop/orders";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Order Details" };

export default async function LumoraAccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireAuth();
  const order = await getCustomerOrder(id, session.user!.id);
  if (!order) notFound();

  const isTerminal =
    order.status === "CANCELLED" || order.status === "REFUNDED";
  const currentStepIndex = ORDER_STATUS_STEPS.indexOf(
    order.status as (typeof ORDER_STATUS_STEPS)[number],
  );
  const existingReturn = order.returnRequests[0];

  return (
    <Container size="lg" className="grid gap-10 py-section-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-overline text-content-muted">Order</p>
          <h1 className="mt-1 font-display text-heading-01">
            {order.orderNumber}
          </h1>
          <p className="mt-1 text-body-sm text-content-secondary">
            Placed {formatDate(order.createdAt)}
          </p>
        </div>
        {order.invoice && (
          <Button asChild variant="secondary">
            <Link href={`/lumora/account/orders/${order.id}/invoice`}>
              View Invoice
            </Link>
          </Button>
        )}
      </div>

      {!isTerminal && (
        <div className="grid gap-3">
          <h2 className="font-display text-heading-03">Tracking</h2>
          <ol className="flex flex-wrap gap-4">
            {ORDER_STATUS_STEPS.map((step, index) => (
              <li
                key={step}
                className={cn(
                  "flex items-center gap-2 rounded-full border px-4 py-2 text-body-sm",
                  index <= currentStepIndex
                    ? "bg-accent-subtle-bg border-accent text-content-primary"
                    : "border-hairline-subtle text-content-muted",
                )}
              >
                {step}
              </li>
            ))}
          </ol>
          {order.trackingNumber && (
            <p className="text-body-sm text-content-secondary">
              {order.trackingCarrier ?? "Carrier"} tracking number:{" "}
              <span className="font-medium">{order.trackingNumber}</span>
            </p>
          )}
        </div>
      )}
      {isTerminal && (
        <p className="text-body-md font-medium text-content-secondary">
          This order was {order.status.toLowerCase()}.
        </p>
      )}

      <div>
        <h2 className="mb-3 font-display text-heading-03">Items</h2>
        <div className="grid gap-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-body-sm">
              <span>
                {item.nameSnapshot} × {item.quantity}
              </span>
              <span>{formatCurrency(item.totalCents)}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 grid gap-1 border-t border-hairline-subtle pt-4 text-body-sm">
          <div className="flex justify-between">
            <span className="text-content-secondary">Subtotal</span>
            <span>{formatCurrency(order.subtotalCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-content-secondary">Shipping</span>
            <span>{formatCurrency(order.shippingCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-content-secondary">Tax</span>
            <span>{formatCurrency(order.taxCents)}</span>
          </div>
          {order.discountCents > 0 && (
            <div className="flex justify-between">
              <span className="text-content-secondary">Discount</span>
              <span>-{formatCurrency(order.discountCents)}</span>
            </div>
          )}
          <div className="flex justify-between text-body-md font-medium">
            <span>Total</span>
            <span>{formatCurrency(order.totalCents)}</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 font-display text-heading-03">Returns & Refunds</h2>
        {existingReturn ? (
          <div className="grid gap-2 rounded-card border border-hairline-subtle p-6">
            <p className="text-body-sm">
              Return status:{" "}
              <span className="font-medium">{existingReturn.status}</span>
            </p>
            {existingReturn.refundRequest && (
              <p className="text-body-sm">
                Refund status:{" "}
                <span className="font-medium">
                  {existingReturn.refundRequest.status}
                </span>{" "}
                — {formatCurrency(existingReturn.refundRequest.amountCents)}
              </p>
            )}
          </div>
        ) : order.status !== "CANCELLED" ? (
          <ReturnRequestForm
            orderId={order.id}
            items={order.items.map((item) => ({
              id: item.id,
              nameSnapshot: item.nameSnapshot,
              quantity: item.quantity,
            }))}
          />
        ) : (
          <p className="text-body-sm text-content-secondary">
            Cancelled orders aren&apos;t eligible for return.
          </p>
        )}
      </div>
    </Container>
  );
}
