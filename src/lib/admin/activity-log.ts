import { prisma } from "@/lib/prisma";
import type { Prisma } from "../../../generated/prisma/client";

export interface LogActivityParams {
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/** Every admin mutation writes one of these — the Activity Logs section
 * (`/admin/activity-logs`) reads exclusively from this table, so a
 * mutation that skips this call is invisible to that audit trail. */
export async function logActivity({
  actorId,
  actorName,
  action,
  entityType,
  entityId,
  metadata,
}: LogActivityParams): Promise<void> {
  await prisma.activityLog.create({
    data: {
      actorId,
      actorName,
      action,
      entityType,
      entityId,
      metadata: metadata as Prisma.InputJsonValue | undefined,
    },
  });
}
