import { ActivityLogsTable } from "@/components/admin/activity-logs/activity-logs-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

function summarizeMetadata(metadata: unknown): string {
  if (!metadata || typeof metadata !== "object") return "";
  return Object.entries(metadata as Record<string, unknown>)
    .map(([key, value]) => `${key}: ${value}`)
    .join(", ");
}

export default async function AdminActivityLogsPage() {
  await requireRole("MANAGER");

  const logs = await prisma.activityLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });

  const rows = logs.map((log) => ({
    id: log.id,
    actorName: log.actorName,
    action: log.action,
    entityType: log.entityType,
    entityId: log.entityId,
    summary: summarizeMetadata(log.metadata),
    createdAt: log.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Activity Logs"
        description={`An audit trail of the last ${rows.length} admin action${rows.length === 1 ? "" : "s"}.`}
      />
      <ActivityLogsTable logs={rows} />
    </div>
  );
}
