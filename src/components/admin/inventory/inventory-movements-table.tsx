"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/format";

export interface InventoryMovementRow {
  id: string;
  productName: string;
  type: string;
  quantity: number;
  note: string | null;
  actorName: string | null;
  createdAt: string;
}

const columns: LegacyColumnDef<InventoryMovementRow, unknown>[] = [
  { accessorKey: "productName", header: "Product" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <StatusBadge status={row.original.type} />,
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
    cell: ({ row }) => (
      <span
        className={row.original.quantity >= 0 ? "text-success" : "text-danger"}
      >
        {row.original.quantity >= 0 ? "+" : ""}
        {row.original.quantity}
      </span>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    cell: ({ row }) => row.original.note ?? "—",
  },
  {
    accessorKey: "actorName",
    header: "By",
    cell: ({ row }) => row.original.actorName ?? "System",
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

export function InventoryMovementsTable({
  movements,
}: {
  movements: InventoryMovementRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={movements}
      searchPlaceholder="Search movements..."
      exportFilename="inventory-movements"
      exportColumns={[
        { header: "Product", accessor: (row) => row.productName },
        { header: "Type", accessor: (row) => row.type },
        { header: "Quantity", accessor: (row) => row.quantity },
        { header: "Note", accessor: (row) => row.note ?? "" },
        { header: "By", accessor: (row) => row.actorName ?? "System" },
        { header: "Date", accessor: (row) => row.createdAt },
      ]}
      emptyMessage="No stock movements yet."
    />
  );
}
