import { OrdersTable } from "@/components/admin/orders/orders-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ customer?: string }>;
}) {
  await requireRole("MANAGER");
  const { customer } = await searchParams;

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: { select: { name: true, email: true } },
      _count: { select: { items: true } },
    },
  });

  const rows = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerLabel: order.customer?.name ?? order.customer?.email ?? order.email,
    status: order.status,
    totalCents: order.totalCents,
    itemCount: order._count.items,
    createdAt: order.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Orders"
        description={`${rows.length} order${rows.length === 1 ? "" : "s"} placed.`}
      />
      <OrdersTable orders={rows} initialSearch={customer} />
    </div>
  );
}
