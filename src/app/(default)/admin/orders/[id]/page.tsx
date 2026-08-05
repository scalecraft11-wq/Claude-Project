import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { OrderStatusControl } from "@/components/admin/orders/order-status-control";
import { PageHeader } from "@/components/admin/page-header";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { requireRole } from "@/lib/auth/guards";
import { formatCurrency, formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

interface Address {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

function AddressBlock({
  title,
  address,
}: {
  title: string;
  address: Address | null;
}) {
  if (!address) {
    return (
      <div>
        <p className="text-overline text-content-muted">{title}</p>
        <p className="mt-1 text-body-sm text-content-muted">Not provided</p>
      </div>
    );
  }
  return (
    <div>
      <p className="text-overline text-content-muted">{title}</p>
      <p className="mt-1 text-body-sm text-content-primary">{address.name}</p>
      <p className="text-body-sm text-content-secondary">{address.line1}</p>
      {address.line2 && (
        <p className="text-body-sm text-content-secondary">{address.line2}</p>
      )}
      <p className="text-body-sm text-content-secondary">
        {[address.city, address.state, address.postalCode]
          .filter(Boolean)
          .join(", ")}
      </p>
      <p className="text-body-sm text-content-secondary">{address.country}</p>
    </div>
  );
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("MANAGER");
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true, email: true, phone: true } },
      coupon: { select: { code: true } },
      payments: true,
      items: true,
    },
  });

  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-body-sm text-content-secondary hover:text-content-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to orders
      </Link>

      <PageHeader
        title={order.orderNumber}
        description={`Placed ${formatDate(order.createdAt)}`}
        actions={
          <OrderStatusControl orderId={order.id} status={order.status} />
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="grid content-start gap-4 rounded-card border border-hairline-subtle bg-surface p-5 lg:col-span-2">
          <h2 className="font-display text-heading-03 text-content-primary">
            Items
          </h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.nameSnapshot}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{formatCurrency(item.priceCents)}</TableCell>
                  <TableCell>{formatCurrency(item.totalCents)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="ml-auto grid w-full max-w-xs gap-1.5 text-body-sm sm:ml-auto">
            <div className="flex justify-between text-content-secondary">
              <span>Subtotal</span>
              <span>{formatCurrency(order.subtotalCents)}</span>
            </div>
            {order.discountCents > 0 && (
              <div className="flex justify-between text-success">
                <span>
                  Discount{order.coupon ? ` (${order.coupon.code})` : ""}
                </span>
                <span>-{formatCurrency(order.discountCents)}</span>
              </div>
            )}
            <div className="flex justify-between text-content-secondary">
              <span>Shipping</span>
              <span>{formatCurrency(order.shippingCents)}</span>
            </div>
            <div className="flex justify-between text-content-secondary">
              <span>Tax</span>
              <span>{formatCurrency(order.taxCents)}</span>
            </div>
            <div className="flex justify-between border-t border-hairline-subtle pt-1.5 font-medium text-content-primary">
              <span>Total</span>
              <span>{formatCurrency(order.totalCents)}</span>
            </div>
          </div>
        </div>

        <div className="grid content-start gap-6">
          <div className="grid gap-4 rounded-card border border-hairline-subtle bg-surface p-5">
            <h2 className="font-display text-heading-03 text-content-primary">
              Customer
            </h2>
            <div>
              <p className="text-body-sm font-medium text-content-primary">
                {order.customer?.name ?? "Guest checkout"}
              </p>
              <p className="text-body-sm text-content-secondary">
                {order.email}
              </p>
              {order.customer?.phone && (
                <p className="text-body-sm text-content-secondary">
                  {order.customer.phone}
                </p>
              )}
            </div>
            <AddressBlock
              title="Shipping address"
              address={order.shippingAddress as Address}
            />
            <AddressBlock
              title="Billing address"
              address={order.billingAddress as Address | null}
            />
          </div>

          <div className="grid gap-3 rounded-card border border-hairline-subtle bg-surface p-5">
            <h2 className="font-display text-heading-03 text-content-primary">
              Payments
            </h2>
            {order.payments.length === 0 && (
              <p className="text-body-sm text-content-muted">
                No payment recorded.
              </p>
            )}
            {order.payments.map((payment) => (
              <div
                key={payment.id}
                className="flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-body-sm text-content-primary">
                    {payment.provider}
                  </p>
                  <p className="text-caption text-content-muted">
                    {formatDate(payment.createdAt, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-body-sm font-medium text-content-primary">
                    {formatCurrency(payment.amountCents)}
                  </p>
                  <StatusBadge status={payment.status} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
