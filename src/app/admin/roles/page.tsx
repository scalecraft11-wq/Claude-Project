import { RolesTable } from "@/components/admin/roles/roles-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function AdminRolesPage() {
  const session = await requireRole("ADMIN");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  const rows = users.map((user) => ({
    id: user.id,
    name: user.name ?? user.email,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
    isCurrentUser: user.id === session.user!.id,
  }));

  return (
    <div>
      <PageHeader
        title="Roles"
        description="Assign each user's coarse access level. Changing a role signs that user out of any existing session."
      />
      <RolesTable users={rows} />
    </div>
  );
}
