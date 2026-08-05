"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { formatDate } from "@/lib/format";

export interface ActivityLogRow {
  id: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId: string | null;
  summary: string;
  createdAt: string;
}

const columns: LegacyColumnDef<ActivityLogRow, unknown>[] = [
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      formatDate(row.original.createdAt, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      }),
  },
  { accessorKey: "actorName", header: "Actor" },
  { accessorKey: "action", header: "Action" },
  { accessorKey: "entityType", header: "Entity" },
  {
    accessorKey: "summary",
    header: "Details",
    cell: ({ row }) => (
      <span className="text-content-secondary">{row.original.summary}</span>
    ),
  },
];

const filters: DataTableFilter[] = [
  {
    columnId: "entityType",
    label: "Entity",
    options: [
      "Product",
      "Category",
      "Order",
      "Review",
      "BlogPost",
      "MediaAsset",
      "NewsletterSubscriber",
      "SeoMeta",
      "StoreSettings",
      "User",
      "RolePermission",
      "SupportTicket",
    ].map((entity) => ({ label: entity, value: entity })),
  },
];

export function ActivityLogsTable({ logs }: { logs: ActivityLogRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={logs}
      searchPlaceholder="Search activity..."
      filters={filters}
      exportFilename="activity-logs"
      exportColumns={[
        { header: "Date", accessor: (row) => row.createdAt },
        { header: "Actor", accessor: (row) => row.actorName },
        { header: "Action", accessor: (row) => row.action },
        { header: "Entity", accessor: (row) => row.entityType },
        { header: "Details", accessor: (row) => row.summary },
      ]}
      emptyMessage="No activity recorded yet."
    />
  );
}
