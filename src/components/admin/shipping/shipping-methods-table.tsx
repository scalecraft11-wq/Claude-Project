"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { AddShippingMethodButton } from "@/components/admin/shipping/add-shipping-method-button";
import { ShippingMethodRowActions } from "@/components/admin/shipping/shipping-method-row-actions";
import { DataTable } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCurrency } from "@/lib/format";
import type { ShippingMethodInput } from "@/lib/validation/admin/shipping";

export interface ShippingMethodRow {
  id: string;
  name: string;
  description: string | null;
  rateCents: number;
  freeThresholdCents: number | null;
  estimatedDays: string;
  active: boolean;
}

function toFormValues(method: ShippingMethodRow): ShippingMethodInput {
  return {
    name: method.name,
    description: method.description ?? "",
    rateCents: method.rateCents,
    freeThresholdCents: method.freeThresholdCents ?? "",
    estimatedDays: method.estimatedDays,
    active: method.active,
  };
}

const columns: LegacyColumnDef<ShippingMethodRow, unknown>[] = [
  { accessorKey: "name", header: "Method" },
  {
    accessorKey: "rateCents",
    header: "Rate",
    cell: ({ row }) => formatCurrency(row.original.rateCents),
  },
  {
    accessorKey: "freeThresholdCents",
    header: "Free above",
    cell: ({ row }) =>
      row.original.freeThresholdCents !== null
        ? formatCurrency(row.original.freeThresholdCents)
        : "—",
  },
  { accessorKey: "estimatedDays", header: "Delivery" },
  {
    accessorKey: "active",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.active ? "ACTIVE" : "INACTIVE"} />
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ShippingMethodRowActions
        methodId={row.original.id}
        name={row.original.name}
        defaultValues={toFormValues(row.original)}
      />
    ),
  },
];

export function ShippingMethodsTable({
  methods,
}: {
  methods: ShippingMethodRow[];
}) {
  return (
    <DataTable
      columns={columns}
      data={methods}
      searchPlaceholder="Search shipping methods..."
      exportFilename="shipping-methods"
      exportColumns={[
        { header: "Name", accessor: (row) => row.name },
        { header: "Rate", accessor: (row) => (row.rateCents / 100).toFixed(2) },
        { header: "Delivery", accessor: (row) => row.estimatedDays },
        { header: "Active", accessor: (row) => (row.active ? "Yes" : "No") },
      ]}
      toolbarActions={<AddShippingMethodButton />}
      emptyMessage="No shipping methods yet."
    />
  );
}
