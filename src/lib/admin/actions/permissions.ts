"use server";

import { revalidatePath } from "next/cache";

import { type ActionResult } from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import type { Role } from "../../../../generated/prisma/client";

export async function setPermissionGrantAction(
  permissionId: string,
  role: Role,
  granted: boolean,
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");

  const permission = await prisma.permission.findUnique({
    where: { id: permissionId },
  });
  if (!permission) {
    return { success: false, message: "Permission not found." };
  }

  await prisma.rolePermission.upsert({
    where: { role_permissionId: { role, permissionId } },
    create: { role, permissionId, granted },
    update: { granted },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "permission.grant_update",
    entityType: "RolePermission",
    entityId: permissionId,
    metadata: { role, key: permission.key, granted },
  });

  revalidatePath("/admin/permissions");
  return { success: true, message: "Permission updated." };
}
