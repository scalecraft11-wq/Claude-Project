"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import Link from "next/link";

import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { PaymentStatusControl } from "@/components/admin/payments/payment-status-control";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";

export interface PaymentRow {
  id: string;
  orderId: string;
  orderNumber: string;
  provider: string;
  status: string;
  amountCents: number;
  createdAt: string;
}

const columns: LegacyColumnDef<PaymentRow, unknown>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => (
      <Link
        href={`/admin/orders/${row.original.orderId}`}
        className="font-medium text-content-primary hover:text-accent"
      >
        {row.original.orderNumber}
      </Link>
    ),
  },
  { accessorKey: "provider", header: "Provider" },
  {
    accessorKey: "amountCents",
    header: "Amount",
    cell: ({ row }) => formatCurrency(row.original.amountCents),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) =>
      row.original.provider === "MANUAL" ? (
        <PaymentStatusControl
          paymentId={row.original.id}
          status={row.original.status}
          editable
        />
      ) : (
        <StatusBadge status={row.original.status} />
      ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      formatDate(row.original.createdAt, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
];

const filters: DataTableFilter[] = [
  {
    columnId: "provider",
    label: "Provider",
    options: [
      { label: "Stripe", value: "STRIPE" },
      { label: "PayPal", value: "PAYPAL" },
      { label: "Manual", value: "MANUAL" },
    ],
  },
  {
    columnId: "status",
    label: "Status",
    options: [
      { label: "Pending", value: "PENDING" },
      { label: "Paid", value: "PAID" },
      { label: "Failed", value: "FAILED" },
      { label: "Refunded", value: "REFUNDED" },
    ],
  },
];

export function PaymentsTable({ payments }: { payments: PaymentRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={payments}
      searchPlaceholder="Search payments..."
      filters={filters}
      exportFilename="payments"
      exportColumns={[
        { header: "Order", accessor: (row) => row.orderNumber },
        { header: "Provider", accessor: (row) => row.provider },
        {
          header: "Amount",
          accessor: (row) => (row.amountCents / 100).toFixed(2),
        },
        { header: "Status", accessor: (row) => row.status },
        { header: "Date", accessor: (row) => row.createdAt },
      ]}
      emptyMessage="No payments yet."
    />
  );
}
