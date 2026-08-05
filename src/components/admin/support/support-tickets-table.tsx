"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import Link from "next/link";

import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/format";

export interface SupportTicketRow {
  id: string;
  subject: string;
  customerLabel: string;
  status: string;
  priority: string;
  assignedToName: string | null;
  createdAt: string;
}

const columns: LegacyColumnDef<SupportTicketRow, unknown>[] = [
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => (
      <Link
        href={`/admin/support/${row.original.id}`}
        className="font-medium text-content-primary hover:text-accent"
      >
        {row.original.subject}
      </Link>
    ),
  },
  { accessorKey: "customerLabel", header: "Customer" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => <StatusBadge status={row.original.priority} />,
  },
  {
    accessorKey: "assignedToName",
    header: "Assigned to",
    cell: ({ row }) => row.original.assignedToName ?? "Unassigned",
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
      { label: "Open", value: "OPEN" },
      { label: "In progress", value: "IN_PROGRESS" },
      { label: "Resolved", value: "RESOLVED" },
      { label: "Closed", value: "CLOSED" },
    ],
  },
  {
    columnId: "priority",
    label: "Priority",
    options: [
      { label: "Low", value: "LOW" },
      { label: "Medium", value: "MEDIUM" },
      { label: "High", value: "HIGH" },
      { label: "Urgent", value: "URGENT" },
    ],
  },
];

export function SupportTicketsTable({
  tickets,
}: {
  tickets: SupportTicketRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={tickets}
      searchPlaceholder="Search tickets..."
      filters={filters}
      exportFilename="support-tickets"
      exportColumns={[
        { header: "Subject", accessor: (row) => row.subject },
        { header: "Customer", accessor: (row) => row.customerLabel },
        { header: "Status", accessor: (row) => row.status },
        { header: "Priority", accessor: (row) => row.priority },
        { header: "Assigned to", accessor: (row) => row.assignedToName ?? "" },
      ]}
      emptyMessage="No support tickets yet."
    />
  );
}
