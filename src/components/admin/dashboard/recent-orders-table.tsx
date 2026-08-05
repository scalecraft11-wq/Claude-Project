"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import Link from "next/link";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";

export interface RecentOrderRow {
  id: string;
  orderNumber: string;
  customerLabel: string;
  status: string;
  totalCents: number;
  createdAt: string;
}

const columns: LegacyColumnDef<RecentOrderRow, unknown>[] = [
  {
    accessorKey: "orderNumber",
    header: "Order",
    cell: ({ row }) => (
      <Link
        href={`/admin/orders/${row.original.id}`}
        className="font-medium text-content-primary hover:text-accent"
      >
        {row.original.orderNumber}
      </Link>
    ),
  },
  {
    accessorKey: "customerLabel",
    header: "Customer",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "totalCents",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.totalCents),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      formatDate(row.original.createdAt, { month: "short", day: "numeric" }),
  },
];

export function RecentOrdersTable({ orders }: { orders: RecentOrderRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={orders}
      searchPlaceholder="Search recent orders..."
      emptyMessage="No orders yet."
    />
  );
}
