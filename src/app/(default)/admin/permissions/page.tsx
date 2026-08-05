import {
  PermissionsMatrix,
  type PermissionRow,
} from "@/components/admin/permissions/permissions-matrix";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

const ROLES = ["CUSTOMER", "EDITOR", "MANAGER", "ADMIN"] as const;

export default async function AdminPermissionsPage() {
  await requireRole("ADMIN");

  const permissions = await prisma.permission.findMany({
    orderBy: [{ category: "asc" }, { label: "asc" }],
    include: { roles: true },
  });

  const rows: PermissionRow[] = permissions.map((permission) => {
    const granted = Object.fromEntries(
      ROLES.map((role) => [
        role,
        permission.roles.find((entry) => entry.role === role)?.granted ?? false,
      ]),
    ) as PermissionRow["granted"];

    return {
      id: permission.id,
      key: permission.key,
      label: permission.label,
      category: permission.category,
      granted,
    };
  });

  return (
    <div>
      <PageHeader
        title="Permissions"
        description="A reference matrix of what each role can do — the actual route/action gates in this app enforce the coarser Role hierarchy directly; this table is for visibility and fine-grained bookkeeping."
      />
      <PermissionsMatrix permissions={rows} />
    </div>
  );
}
