import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { PrintButton } from "@/components/lumora/print-button";

import { requireAuth } from "@/lib/auth/guards";
import { formatCurrency, formatDate } from "@/lib/format";
import { getCustomerOrder } from "@/lib/shop/orders";

export const metadata: Metadata = { title: "Invoice" };

export default async function LumoraInvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireAuth();
  const order = await getCustomerOrder(id, session.user!.id);
  if (!order || !order.invoice) notFound();

  const address = order.shippingAddress as {
    fullName?: string;
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };

  return (
    <div className="mx-auto grid max-w-2xl gap-8 px-6 py-16 print:px-0 print:py-0">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display text-heading-01">Lumora Skin</h1>
          <p className="text-body-sm text-content-muted">
            Invoice {order.invoice.invoiceNumber}
          </p>
        </div>
        <PrintButton />
      </div>

      <div className="grid grid-cols-2 gap-6 text-body-sm">
        <div>
          <p className="text-content-muted">Billed to</p>
          <p>{address.fullName}</p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.state} {address.postalCode}
          </p>
          <p>{address.country}</p>
        </div>
        <div className="text-right">
          <p className="text-content-muted">Order</p>
          <p>{order.orderNumber}</p>
          <p className="text-content-muted">Date</p>
          <p>{formatDate(order.invoice.issuedAt)}</p>
        </div>
      </div>

      <table className="w-full text-body-sm">
        <thead>
          <tr className="border-b border-hairline-strong text-left">
            <th className="py-2">Item</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Price</th>
            <th className="py-2 text-right">Total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id} className="border-b border-hairline-subtle">
              <td className="py-2">{item.nameSnapshot}</td>
              <td className="py-2 text-right">{item.quantity}</td>
              <td className="py-2 text-right">
                {formatCurrency(item.priceCents)}
              </td>
              <td className="py-2 text-right">
                {formatCurrency(item.totalCents)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="ml-auto grid w-full max-w-xs gap-1 text-body-sm">
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
        <div className="flex justify-between border-t border-hairline-strong pt-1 text-body-md font-medium">
          <span>Total</span>
          <span>{formatCurrency(order.totalCents)}</span>
        </div>
      </div>
    </div>
  );
}
