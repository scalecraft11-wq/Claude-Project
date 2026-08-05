"use client";

import type { LegacyColumnDef } from "@tanstack/react-table/legacy";

import { DataTable, type DataTableFilter } from "@/components/admin/data-table";
import { RoleSelect } from "@/components/admin/roles/role-select";
import { formatDate } from "@/lib/format";

export interface UserRoleRow {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isCurrentUser: boolean;
}

const columns: LegacyColumnDef<UserRoleRow, unknown>[] = [
  {
    accessorKey: "name",
    header: "User",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-content-primary">
          {row.original.name}
          {row.original.isCurrentUser && (
            <span className="ml-2 text-caption text-content-muted">(you)</span>
          )}
        </p>
        <p className="text-caption text-content-muted">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <RoleSelect
        userId={row.original.id}
        role={row.original.role}
        isCurrentUser={row.original.isCurrentUser}
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
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
    columnId: "role",
    label: "Role",
    options: [
      { label: "Customer", value: "CUSTOMER" },
      { label: "Editor", value: "EDITOR" },
      { label: "Manager", value: "MANAGER" },
      { label: "Admin", value: "ADMIN" },
    ],
  },
];

export function RolesTable({ users }: { users: UserRoleRow[] }) {
  return (
    <DataTable
      columns={columns}
      data={users}
      searchPlaceholder="Search users..."
      filters={filters}
      exportFilename="user-roles"
      exportColumns={[
        { header: "Name", accessor: (row) => row.name },
        { header: "Email", accessor: (row) => row.email },
        { header: "Role", accessor: (row) => row.role },
      ]}
      emptyMessage="No users found."
    />
  );
}
