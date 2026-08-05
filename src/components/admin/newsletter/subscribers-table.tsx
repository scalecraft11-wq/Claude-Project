"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { AddSubscriberButton } from "@/components/admin/newsletter/add-subscriber-button";
import { SubscriberRowActions } from "@/components/admin/newsletter/subscriber-row-actions";
import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/format";

export interface SubscriberRow {
  id: string;
  email: string;
  status: string;
  source: string | null;
  subscribedAt: string;
}

const columns: LegacyColumnDef<SubscriberRow, unknown>[] = [
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "source",
    header: "Source",
    cell: ({ row }) => row.original.source ?? "—",
  },
  {
    accessorKey: "subscribedAt",
    header: "Subscribed",
    cell: ({ row }) =>
      formatDate(row.original.subscribedAt, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <SubscriberRowActions
        subscriberId={row.original.id}
        status={row.original.status}
      />
    ),
  },
];

const filters: DataTableFilter[] = [
  {
    columnId: "status",
    label: "Status",
    options: [
      { label: "Subscribed", value: "SUBSCRIBED" },
      { label: "Unsubscribed", value: "UNSUBSCRIBED" },
    ],
  },
];

export function SubscribersTable({
  subscribers,
}: {
  subscribers: SubscriberRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={subscribers}
      searchPlaceholder="Search subscribers..."
      filters={filters}
      exportFilename="newsletter-subscribers"
      exportColumns={[
        { header: "Email", accessor: (row) => row.email },
        { header: "Status", accessor: (row) => row.status },
        { header: "Source", accessor: (row) => row.source ?? "" },
        { header: "Subscribed", accessor: (row) => row.subscribedAt },
      ]}
      toolbarActions={<AddSubscriberButton />}
      emptyMessage="No subscribers yet."
    />
  );
}
