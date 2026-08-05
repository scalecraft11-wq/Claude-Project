"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { AddPostButton } from "@/components/admin/blog/add-post-button";
import { PostRowActions } from "@/components/admin/blog/post-row-actions";
import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { formatDate } from "@/lib/format";
import type { BlogPostInput } from "@/lib/validation/admin/blog";

export interface BlogPostRow {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string | null;
  status: string;
  tags: string[];
  authorName: string | null;
  publishedAt: string | null;
  createdAt: string;
}

function toFormValues(post: BlogPostRow): BlogPostInput {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    content: post.content,
    coverImage: post.coverImage ?? "",
    status: post.status as BlogPostInput["status"],
    tags: post.tags.join(", "),
  };
}

const columns: LegacyColumnDef<BlogPostRow, unknown>[] = [
  {
    accessorKey: "title",
    header: "Post",
    cell: ({ row }) => (
      <div className="max-w-sm">
        <p className="font-medium text-content-primary">{row.original.title}</p>
        <p className="truncate text-caption text-content-muted">
          {row.original.excerpt}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "authorName",
    header: "Author",
    cell: ({ row }) => row.original.authorName ?? "—",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) =>
      formatDate(row.original.publishedAt ?? row.original.createdAt, {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <PostRowActions
        postId={row.original.id}
        postTitle={row.original.title}
        defaultValues={toFormValues(row.original)}
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
      { label: "Published", value: "PUBLISHED" },
      { label: "Archived", value: "ARCHIVED" },
    ],
  },
];

export function BlogTable({ posts }: { posts: BlogPostRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={posts}
      searchPlaceholder="Search posts..."
      filters={filters}
      exportFilename="blog-posts"
      exportColumns={[
        { header: "Title", accessor: (row) => row.title },
        { header: "Author", accessor: (row) => row.authorName ?? "" },
        { header: "Status", accessor: (row) => row.status },
        { header: "Tags", accessor: (row) => row.tags.join(", ") },
      ]}
      toolbarActions={<AddPostButton />}
      emptyMessage="No posts yet."
    />
  );
}
