import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/page-header";
import { ReplyForm } from "@/components/admin/support/reply-form";
import { TicketControls } from "@/components/admin/support/ticket-controls";
import { Card } from "@/components/ui/card";
import { requireRole } from "@/lib/auth/guards";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function AdminSupportTicketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireRole("MANAGER");
  const { id } = await params;

  const [ticket, staff] = await Promise.all([
    prisma.supportTicket.findUnique({
      where: { id },
      include: {
        customer: { select: { name: true, email: true } },
        messages: { orderBy: { createdAt: "asc" } },
      },
    }),
    prisma.user.findMany({
      where: { role: { in: ["EDITOR", "MANAGER", "ADMIN"] } },
      select: { id: true, name: true, email: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!ticket) notFound();

  return (
    <div>
      <Link
        href="/admin/support"
        className="mb-4 inline-flex items-center gap-1.5 text-body-sm text-content-secondary hover:text-content-primary"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to tickets
      </Link>

      <PageHeader
        title={ticket.subject}
        description={`${ticket.customer?.name ?? ticket.customer?.email ?? ticket.email} · opened ${formatDate(ticket.createdAt)}`}
      />

      <Card className="mb-6 p-5">
        <TicketControls
          ticketId={ticket.id}
          status={ticket.status}
          priority={ticket.priority}
          assignedToId={ticket.assignedToId}
          staff={staff}
        />
      </Card>

      <div className="grid gap-4">
        {ticket.messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex",
              message.isStaff ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-lg rounded-card border p-4",
                message.isStaff
                  ? "border-accent/30 bg-accent-subtle"
                  : "border-hairline-subtle bg-surface",
              )}
            >
              <div className="mb-1 flex items-center justify-between gap-4">
                <span className="text-body-sm font-medium text-content-primary">
                  {message.authorName}
                </span>
                <span className="text-caption text-content-muted">
                  {formatDate(message.createdAt, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              </div>
              <p className="whitespace-pre-wrap text-body-sm text-content-secondary">
                {message.body}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <ReplyForm ticketId={ticket.id} />
      </div>
    </div>
  );
}
