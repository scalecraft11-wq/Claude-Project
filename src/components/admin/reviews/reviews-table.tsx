"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";
import { Star } from "lucide-react";

import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { ReviewRowActions } from "@/components/admin/reviews/review-row-actions";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ReviewRow {
  id: string;
  productName: string;
  authorName: string;
  rating: number;
  title: string;
  body: string;
  status: string;
  createdAt: string;
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={cn(
            "size-3.5",
            index < rating
              ? "fill-warning text-warning"
              : "fill-none text-hairline-strong",
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

const columns: LegacyColumnDef<ReviewRow, unknown>[] = [
  { accessorKey: "productName", header: "Product" },
  {
    accessorKey: "rating",
    header: "Rating",
    cell: ({ row }) => <StarRating rating={row.original.rating} />,
  },
  {
    accessorKey: "title",
    header: "Review",
    cell: ({ row }) => (
      <div className="max-w-sm">
        <p className="font-medium text-content-primary">{row.original.title}</p>
        <p className="truncate text-caption text-content-muted">
          {row.original.body}
        </p>
      </div>
    ),
  },
  { accessorKey: "authorName", header: "Author" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
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
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <ReviewRowActions
        reviewId={row.original.id}
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
      { label: "Pending", value: "PENDING" },
      { label: "Approved", value: "APPROVED" },
      { label: "Rejected", value: "REJECTED" },
    ],
  },
];

export function ReviewsTable({ reviews }: { reviews: ReviewRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={reviews}
      searchPlaceholder="Search reviews..."
      filters={filters}
      exportFilename="reviews"
      exportColumns={[
        { header: "Product", accessor: (row) => row.productName },
        { header: "Rating", accessor: (row) => row.rating },
        { header: "Title", accessor: (row) => row.title },
        { header: "Author", accessor: (row) => row.authorName },
        { header: "Status", accessor: (row) => row.status },
      ]}
      emptyMessage="No reviews yet."
    />
  );
}
