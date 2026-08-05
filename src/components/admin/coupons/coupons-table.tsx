"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { AddCouponButton } from "@/components/admin/coupons/add-coupon-button";
import { CouponRowActions } from "@/components/admin/coupons/coupon-row-actions";
import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { CouponInput } from "@/lib/validation/admin/coupon";

export interface CouponRow {
  id: string;
  code: string;
  type: string;
  value: number;
  minOrderCents: number | null;
  maxUses: number | null;
  usedCount: number;
  active: boolean;
  startsAt: string | null;
  expiresAt: string | null;
  lifecycleStatus: "ACTIVE" | "INACTIVE" | "EXPIRED";
}

function toFormValues(coupon: CouponRow): CouponInput {
  return {
    code: coupon.code,
    type: coupon.type as CouponInput["type"],
    value: coupon.value,
    minOrderCents: coupon.minOrderCents ?? "",
    maxUses: coupon.maxUses ?? "",
    active: coupon.active,
    startsAt: coupon.startsAt ? coupon.startsAt.slice(0, 10) : "",
    expiresAt: coupon.expiresAt ? coupon.expiresAt.slice(0, 10) : "",
  };
}

function formatValue(coupon: CouponRow): string {
  return coupon.type === "PERCENTAGE"
    ? `${coupon.value}%`
    : formatCurrency(coupon.value);
}

const columns: LegacyColumnDef<CouponRow, unknown>[] = [
  { accessorKey: "code", header: "Code" },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }) => formatValue(row.original),
  },
  {
    accessorKey: "usedCount",
    header: "Uses",
    cell: ({ row }) =>
      `${row.original.usedCount}${row.original.maxUses ? ` / ${row.original.maxUses}` : ""}`,
  },
  {
    accessorKey: "expiresAt",
    header: "Expires",
    cell: ({ row }) =>
      row.original.expiresAt
        ? formatDate(row.original.expiresAt, {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "Never",
  },
  {
    accessorKey: "lifecycleStatus",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.lifecycleStatus} />,
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <CouponRowActions
        couponId={row.original.id}
        code={row.original.code}
        defaultValues={toFormValues(row.original)}
      />
    ),
  },
];

const filters: DataTableFilter[] = [
  {
    columnId: "lifecycleStatus",
    label: "Status",
    options: [
      { label: "Active", value: "ACTIVE" },
      { label: "Inactive", value: "INACTIVE" },
      { label: "Expired", value: "EXPIRED" },
    ],
  },
];

export function CouponsTable({ coupons }: { coupons: CouponRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={coupons}
      searchPlaceholder="Search coupons..."
      filters={filters}
      exportFilename="coupons"
      exportColumns={[
        { header: "Code", accessor: (row) => row.code },
        { header: "Type", accessor: (row) => row.type },
        { header: "Value", accessor: (row) => row.value },
        { header: "Used", accessor: (row) => row.usedCount },
        { header: "Max uses", accessor: (row) => row.maxUses ?? "" },
        { header: "Status", accessor: (row) => row.lifecycleStatus },
      ]}
      toolbarActions={<AddCouponButton />}
      emptyMessage="No coupons yet."
    />
  );
}
