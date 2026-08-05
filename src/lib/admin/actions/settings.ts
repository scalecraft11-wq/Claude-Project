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
  storeSettingsSchema,
  type StoreSettingsInput,
} from "@/lib/validation/admin/settings";

export async function updateStoreSettingsAction(
  input: StoreSettingsInput,
): Promise<ActionResult> {
  const session = await requireRole("ADMIN");
  const parsed = storeSettingsSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: fieldErrorsFromZod(parsed.error.flatten()),
    };
  }
  const data = parsed.data;

  await prisma.storeSettings.upsert({
    where: { id: "singleton" },
    create: { id: "singleton", ...data },
    update: data,
  });

  await logActivity({
    actorId: session.user!.id,
    actorName: session.user!.name ?? session.user!.email ?? "Unknown",
    action: "settings.update",
    entityType: "StoreSettings",
    entityId: "singleton",
    metadata: {
      storeName: data.storeName,
      maintenanceMode: data.maintenanceMode,
    },
  });

  revalidatePath("/admin/settings");
  return { success: true, message: "Settings saved." };
}
