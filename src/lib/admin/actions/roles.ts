"use server";

import { revalidatePath } from "next/cache";

import {
  fieldErrorsFromZod,
  type ActionResult,
} from "@/lib/admin/action-result";
import { logActivity } from "@/lib/admin/activity-log";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import {
  roleUpdateSchema,
  type RoleUpdateInput,
} from "@/lib/validation/admin/role";

export async function updateUserRoleAction(
  userId: string,
  input: RoleUpdateInput,
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = roleUpdateSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }

  if (userId === session.user!.id && parsed.data.role !== "ADMIN") {
    return {
      success: false,
      message: "You can't change your own role away from Admin.",
    };
  }

  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) {
    return { success: false, message: "User not found." };
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { role: parsed.data.role, tokenVersion: { increment: 1 } },
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "user.role_update",
    entityType: "User",
    entityId: user.id,
    metadata: { email: user.email, from: existing.role, to: user.role },
  });

  revalidatePath("/admin/roles");
  return { success: true, message: "Role updated." };
}
