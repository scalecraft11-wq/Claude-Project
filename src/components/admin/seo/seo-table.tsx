"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { AddSeoButton } from "@/components/admin/seo/add-seo-button";
import { SeoRowActions } from "@/components/admin/seo/seo-row-actions";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import type { SeoMetaInput } from "@/lib/validation/admin/seo";

export interface SeoMetaRow {
  id: string;
  path: string;
  title: string;
  description: string;
  ogImage: string | null;
  noIndex: boolean;
}

function toFormValues(entry: SeoMetaRow): SeoMetaInput {
  return {
    path: entry.path,
    title: entry.title,
    description: entry.description,
    ogImage: entry.ogImage ?? "",
    noIndex: entry.noIndex,
  };
}

const columns: LegacyColumnDef<SeoMetaRow, unknown>[] = [
  { accessorKey: "path", header: "Path" },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div className="max-w-sm">
        <p className="font-medium text-content-primary">{row.original.title}</p>
        <p className="truncate text-caption text-content-muted">
          {row.original.description}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "noIndex",
    header: "Indexing",
    cell: ({ row }) => (
      <StatusBadge status={row.original.noIndex ? "NO_INDEX" : "INDEXED"} />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <SeoRowActions
        entryId={row.original.id}
        path={row.original.path}
        defaultValues={toFormValues(row.original)}
      />
    ),
  },
];

export function SeoTable({ entries }: { entries: SeoMetaRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={entries}
      searchPlaceholder="Search paths..."
      exportFilename="seo-entries"
      exportColumns={[
        { header: "Path", accessor: (row) => row.path },
        { header: "Title", accessor: (row) => row.title },
        { header: "Description", accessor: (row) => row.description },
        { header: "No-index", accessor: (row) => (row.noIndex ? "Yes" : "No") },
      ]}
      toolbarActions={<AddSeoButton />}
      emptyMessage="No SEO entries yet."
    />
  );
}
