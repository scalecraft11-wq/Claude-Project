"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import Link from "next/link";

import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";

export interface OrderRow {
  id: string;
  orderNumber: string;
  customerLabel: string;
  status: string;
  totalCents: number;
  itemCount: number;
  createdAt: string;
}

const columns: LegacyColumnDef<OrderRow, unknown>[] = [
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
  { accessorKey: "customerLabel", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  { accessorKey: "itemCount", header: "Items" },
  {
    accessorKey: "totalCents",
    header: "Total",
    cell: ({ row }) => formatCurrency(row.original.totalCents),
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
    columnId: "status",
    label: "Status",
    options: [
      { label: "Pending", value: "PENDING" },
      { label: "Processing", value: "PROCESSING" },
      { label: "Shipped", value: "SHIPPED" },
      { label: "Delivered", value: "DELIVERED" },
      { label: "Cancelled", value: "CANCELLED" },
      { label: "Refunded", value: "REFUNDED" },
    ],
  },
];

export function OrdersTable({
  orders,
  initialSearch,
}: {
  orders: OrderRow[];
  initialSearch?: string;
}) {
  return (
    <DataTable
      columns={columns}
      data={orders}
      searchPlaceholder="Search orders..."
      initialSearch={initialSearch}
      filters={filters}
      exportFilename="orders"
      exportColumns={[
        { header: "Order", accessor: (row) => row.orderNumber },
        { header: "Customer", accessor: (row) => row.customerLabel },
        { header: "Status", accessor: (row) => row.status },
        { header: "Items", accessor: (row) => row.itemCount },
        {
          header: "Total",
          accessor: (row) => (row.totalCents / 100).toFixed(2),
        },
        { header: "Date", accessor: (row) => row.createdAt },
      ]}
      emptyMessage="No orders yet."
    />
  );
}
