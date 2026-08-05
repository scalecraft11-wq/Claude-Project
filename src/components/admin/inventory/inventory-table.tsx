"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { AdjustStockButton } from "@/components/admin/inventory/adjust-stock-button";
import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";

export interface InventoryRow {
  id: string;
  name: string;
  sku: string;
  categoryName: string | null;
  stock: number;
  lowStockThreshold: number;
  stockStatus: "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
}

const columns: LegacyColumnDef<InventoryRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "Product",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-content-primary">{row.original.name}</p>
        <p className="text-caption text-content-muted">{row.original.sku}</p>
      </div>
    ),
  },
  {
    accessorKey: "categoryName",
    header: "Category",
    cell: ({ row }) => row.original.categoryName ?? "—",
  },
  { accessorKey: "stock", header: "Stock" },
  { accessorKey: "lowStockThreshold", header: "Threshold" },
  {
    accessorKey: "stockStatus",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.stockStatus} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <AdjustStockButton
        productId={row.original.id}
        productName={row.original.name}
        currentStock={row.original.stock}
      />
    ),
  },
];

const filters: DataTableFilter[] = [
  {
    columnId: "stockStatus",
    label: "Stock",
    options: [
      { label: "In stock", value: "IN_STOCK" },
      { label: "Low stock", value: "LOW_STOCK" },
      { label: "Out of stock", value: "OUT_OF_STOCK" },
    ],
  },
];

export function InventoryTable({ products }: { products: InventoryRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={products}
      searchPlaceholder="Search products..."
      filters={filters}
      exportFilename="inventory"
      exportColumns={[
        { header: "Product", accessor: (row) => row.name },
        { header: "SKU", accessor: (row) => row.sku },
        { header: "Category", accessor: (row) => row.categoryName ?? "" },
        { header: "Stock", accessor: (row) => row.stock },
        { header: "Threshold", accessor: (row) => row.lowStockThreshold },
        { header: "Status", accessor: (row) => row.stockStatus },
      ]}
      emptyMessage="No products yet."
    />
  );
}
