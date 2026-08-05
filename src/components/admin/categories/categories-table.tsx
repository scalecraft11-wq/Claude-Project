"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { AddCategoryButton } from "@/components/admin/categories/add-category-button";
import { CategoryRowActions } from "@/components/admin/categories/category-row-actions";
import { DataTable } from "@/components/admin/data-table";
import type { CategoryInput } from "@/lib/validation/admin/category";

export interface CategoryRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  parentName: string | null;
  productCount: number;
  childCount: number;
}

function toFormValues(category: CategoryRow): CategoryInput {
  return {
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
    parentId: category.parentId ?? "",
  };
}

export function CategoriesTable({ categories }: { categories: CategoryRow[] }) {
  const parentOptions = categories.map((category) => ({
    id: category.id,
    name: category.name,
  }));

  const columns: LegacyColumnDef<CategoryRow, unknown>[] = [
    {
      accessorKey: "name",
      header: "Category",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-content-primary">
            {row.original.name}
          </p>
          <p className="text-caption text-content-muted">
            /{row.original.slug}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "parentName",
      header: "Parent",
      cell: ({ row }) => row.original.parentName ?? "— top-level —",
    },
    { accessorKey: "productCount", header: "Products" },
    { accessorKey: "childCount", header: "Subcategories" },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <CategoryRowActions
          categoryId={row.original.id}
          categoryName={row.original.name}
          defaultValues={toFormValues(row.original)}
          parentOptions={parentOptions}
        />
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={categories}
      searchPlaceholder="Search categories..."
      exportFilename="categories"
      exportColumns={[
        { header: "Name", accessor: (row) => row.name },
        { header: "Slug", accessor: (row) => row.slug },
        { header: "Parent", accessor: (row) => row.parentName ?? "" },
        { header: "Products", accessor: (row) => row.productCount },
      ]}
      toolbarActions={<AddCategoryButton parentOptions={parentOptions} />}
      emptyMessage="No categories yet."
    />
  );
}
