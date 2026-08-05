import Link from "next/link";
import type { Metadata } from "next";

import { Container } from "@/components/layouts";

import { requireAuth } from "@/lib/auth/guards";
import { formatCurrency, formatDate } from "@/lib/format";
import { listCustomerOrders } from "@/lib/shop/orders";

export const metadata: Metadata = { title: "Your Orders" };

export default async function LumoraAccountOrdersPage() {
  const session = await requireAuth();
  const orders = await listCustomerOrders(session.user!.id);

  return (
    <Container size="lg" className="grid gap-8 py-section-sm">
      <h1 className="font-display text-heading-01">Your Orders</h1>

      {orders.length === 0 ? (
        <p className="text-body-md text-content-secondary">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/lumora/account/orders/${order.id}`}
              className="flex items-center justify-between rounded-card border border-hairline-subtle p-6 transition-colors hover:bg-surface-raised"
            >
              <div>
                <p className="text-body-md font-medium">{order.orderNumber}</p>
                <p className="text-body-sm text-content-secondary">
                  {formatDate(order.createdAt)} · {order.items.length} item
                  {order.items.length === 1 ? "" : "s"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-body-md font-medium">
                  {formatCurrency(order.totalCents)}
                </p>
                <p className="text-body-sm text-content-muted">
                  {order.status}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
