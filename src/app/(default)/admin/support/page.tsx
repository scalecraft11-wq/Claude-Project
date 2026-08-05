import { SupportTicketsTable } from "@/components/admin/support/support-tickets-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function AdminSupportPage() {
  await requireRole("MANAGER");

  const tickets = await prisma.supportTicket.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      assignedTo: { select: { name: true } },
    },
  });

  const rows = tickets.map((ticket) => ({
    id: ticket.id,
    subject: ticket.subject,
    customerLabel:
      ticket.customer?.name ?? ticket.customer?.email ?? ticket.email,
    status: ticket.status,
    priority: ticket.priority,
    assignedToName: ticket.assignedTo?.name ?? null,
    createdAt: ticket.createdAt.toISOString(),
  }));

  const openCount = rows.filter((row) => row.status === "OPEN").length;

  return (
    <div>
      <PageHeader
        title="Support Tickets"
        description={`${rows.length} ticket${rows.length === 1 ? "" : "s"}, ${openCount} open.`}
      />
      <SupportTicketsTable tickets={rows} />
    </div>
  );
}
