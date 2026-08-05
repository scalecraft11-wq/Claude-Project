"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { DataTable } from "@/components/admin/data-table";
import { formatCurrency } from "@/lib/format";

export interface CategoryPerformanceRow {
  id: string;
  name: string;
  productCount: number;
  unitsSold: number;
  revenueCents: number;
}

const columns: LegacyColumnDef<CategoryPerformanceRow, unknown>[] = [
  { accessorKey: "name", header: "Category" },
  { accessorKey: "productCount", header: "Products" },
  { accessorKey: "unitsSold", header: "Units sold" },
  {
    accessorKey: "revenueCents",
    header: "Revenue",
    cell: ({ row }) => formatCurrency(row.original.revenueCents),
  },
];

export function CategoryPerformanceTable({
  rows,
}: {
  rows: CategoryPerformanceRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={rows}
      searchPlaceholder="Search categories..."
      exportFilename="category-performance"
      exportColumns={[
        { header: "Category", accessor: (row) => row.name },
        { header: "Products", accessor: (row) => row.productCount },
        { header: "Units sold", accessor: (row) => row.unitsSold },
        {
          header: "Revenue",
          accessor: (row) => (row.revenueCents / 100).toFixed(2),
        },
      ]}
      emptyMessage="No category sales yet."
    />
  );
}
