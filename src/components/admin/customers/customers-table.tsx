"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import Link from "next/link";

import { DataTable } from "@/components/admin/data-table";
import { formatCurrency, formatDate } from "@/lib/format";

export interface CustomerRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orderCount: number;
  lifetimeSpendCents: number;
  createdAt: string;
}

const columns: LegacyColumnDef<CustomerRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Customer",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-content-primary">{row.original.name}</p>
        <p className="text-caption text-content-muted">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => row.original.phone ?? "—",
  },
  { accessorKey: "orderCount", header: "Orders" },
  {
    accessorKey: "lifetimeSpendCents",
    header: "Lifetime spend",
    cell: ({ row }) => formatCurrency(row.original.lifetimeSpendCents),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) =>
      formatDate(row.original.createdAt, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Link
        href={`/admin/orders?customer=${encodeURIComponent(row.original.email)}`}
        className="text-body-sm text-accent hover:underline"
      >
        View orders
      </Link>
    ),
  },
];

export function CustomersTable({ customers }: { customers: CustomerRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={customers}
      searchPlaceholder="Search customers..."
      exportFilename="customers"
      exportColumns={[
        { header: "Name", accessor: (row) => row.name },
        { header: "Email", accessor: (row) => row.email },
        { header: "Phone", accessor: (row) => row.phone ?? "" },
        { header: "Orders", accessor: (row) => row.orderCount },
        {
          header: "Lifetime spend",
          accessor: (row) => (row.lifetimeSpendCents / 100).toFixed(2),
        },
      ]}
      emptyMessage="No customers yet."
    />
  );
}
