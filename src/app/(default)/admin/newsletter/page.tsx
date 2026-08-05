import { Mail, UserCheck, UserX } from "lucide-react";

import { SubscribersTable } from "@/components/admin/newsletter/subscribers-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function AdminNewsletterPage() {
  await requireRole("MANAGER");

  const subscribers = await prisma.newsletterSubscriber.findMany({
    orderBy: { subscribedAt: "desc" },
  });

  const rows = subscribers.map((subscriber) => ({
    id: subscriber.id,
    email: subscriber.email,
    status: subscriber.status,
    source: subscriber.source,
    subscribedAt: subscriber.subscribedAt.toISOString(),
  }));

  const subscribedCount = rows.filter(
    (row) => row.status === "SUBSCRIBED",
  ).length;
  const unsubscribedCount = rows.length - subscribedCount;

  return (
    <div>
      <PageHeader title="Newsletter" description="Manage the mailing list." />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total subscribers"
          value={rows.length.toLocaleString()}
          icon={Mail}
        />
        <StatCard
          label="Subscribed"
          value={subscribedCount.toLocaleString()}
          icon={UserCheck}
        />
        <StatCard
          label="Unsubscribed"
          value={unsubscribedCount.toLocaleString()}
          icon={UserX}
        />
      </div>

      <div className="mt-6">
        <SubscribersTable subscribers={rows} />
      </div>
    </div>
  );
}
