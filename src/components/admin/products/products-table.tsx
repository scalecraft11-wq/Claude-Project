"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { AlertTriangle } from "lucide-react";

import { AddProductButton } from "@/components/admin/products/add-product-button";
import { ProductRowActions } from "@/components/admin/products/product-row-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { formatCurrency } from "@/lib/format";
import type { ProductInput } from "@/lib/validation/admin/product";

export interface ProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  priceCents: number;
  compareAtCents: number | null;
  costCents: number | null;
  status: string;
  categoryId: string | null;
  categoryName: string | null;
  stock: number;
  lowStockThreshold: number;
}

function toFormValues(product: ProductRow): ProductInput {
  return {
    name: product.name,
    slug: product.slug,
    description: product.description,
    sku: product.sku,
    priceCents: product.priceCents,
    compareAtCents: product.compareAtCents ?? "",
    costCents: product.costCents ?? "",
    status: product.status as ProductInput["status"],
    categoryId: product.categoryId ?? "",
    stock: product.stock,
    lowStockThreshold: product.lowStockThreshold,
  };
}

export function ProductsTable({
  products,
  categories,
}: {
  products: ProductRow[];
  categories: { id: string; name: string }[];
}) {
  const columns: LegacyColumnDef<ProductRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "Product",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-content-primary">
            {row.original.name}
          </p>
          <p className="text-caption text-content-muted">{row.original.sku}</p>
        </div>
      ),
    },
    {
      accessorKey: "categoryName",
      header: "Category",
      cell: ({ row }) => row.original.categoryName ?? "—",
    },
    {
      accessorKey: "priceCents",
      header: "Price",
      cell: ({ row }) => formatCurrency(row.original.priceCents),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: ({ row }) => {
        const isLow = row.original.stock <= row.original.lowStockThreshold;
        return (
          <span
            className={
              isLow ? "flex items-center gap-1.5 text-warning" : undefined
            }
          >
            {isLow && <AlertTriangle className="size-3.5" aria-hidden="true" />}
            {row.original.stock}
          </span>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <ProductRowActions
          productId={row.original.id}
          productName={row.original.name}
          defaultValues={toFormValues(row.original)}
          categories={categories}
        />
      ),
    },
  ];

  const filters: DataTableFilter[] = [
    {
      columnId: "status",
      label: "Status",
      options: [
        { label: "Draft", value: "DRAFT" },
        { label: "Active", value: "ACTIVE" },
        { label: "Archived", value: "ARCHIVED" },
      ],
    },
    {
      columnId: "categoryName",
      label: "Category",
      options: categories.map((category) => ({
        label: category.name,
        value: category.name,
      })),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={products}
      searchPlaceholder="Search products..."
      filters={filters}
      exportFilename="products"
      exportColumns={[
        { header: "Name", accessor: (row) => row.name },
        { header: "SKU", accessor: (row) => row.sku },
        { header: "Category", accessor: (row) => row.categoryName ?? "" },
        {
          header: "Price",
          accessor: (row) => (row.priceCents / 100).toFixed(2),
        },
        { header: "Stock", accessor: (row) => row.stock },
        { header: "Status", accessor: (row) => row.status },
      ]}
      toolbarActions={<AddProductButton categories={categories} />}
      emptyMessage="No products yet."
    />
  );
}
