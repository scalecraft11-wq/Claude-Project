import { DollarSign, ShieldCheck, XCircle } from "lucide-react";

import { PaymentsTable } from "@/components/admin/payments/payments-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { requireRole } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminPaymentsPage() {
  await requireRole("MANAGER");

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: { order: { select: { orderNumber: true } } },
  });

  const rows = payments.map((payment) => ({
    id: payment.id,
    orderId: payment.orderId,
    orderNumber: payment.order.orderNumber,
    provider: payment.provider,
    status: payment.status,
    amountCents: payment.amountCents,
    createdAt: payment.createdAt.toISOString(),
  }));

  const paidTotal = rows
    .filter((row) => row.status === "PAID")
    .reduce((sum, row) => sum + row.amountCents, 0);
  const failedCount = rows.filter((row) => row.status === "FAILED").length;
  const refundedCount = rows.filter((row) => row.status === "REFUNDED").length;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Payment records across all orders."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total paid"
          value={formatCurrency(paidTotal)}
          icon={DollarSign}
        />
        <StatCard
          label="Refunded"
          value={refundedCount.toLocaleString()}
          icon={ShieldCheck}
        />
        <StatCard
          label="Failed"
          value={failedCount.toLocaleString()}
          icon={XCircle}
        />
      </div>

      <div className="mt-6">
        <PaymentsTable payments={rows} />
      </div>
    </div>
  );
}
