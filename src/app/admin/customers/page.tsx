import { CustomersTable } from "@/components/admin/customers/customers-table";
import { PageHeader } from "@/components/admin/page-header";
import { requireRole } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";

export default async function AdminCustomersPage() {
  await requireRole("MANAGER");

  const [customers, ordersByCustomer] = await Promise.all([
    prisma.user.findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    }),
    prisma.order.groupBy({
      by: ["customerId"],
      where: { customerId: { not: null } },
      _count: { _all: true },
      _sum: { totalCents: true },
    }),
  ]);

  const orderStatsByCustomer = new Map(
    ordersByCustomer.map((entry) => [
      entry.customerId,
      { count: entry._count._all, spend: entry._sum.totalCents ?? 0 },
    ]),
  );

  const rows = customers.map((customer) => ({
    id: customer.id,
    name: customer.name ?? customer.email,
    email: customer.email,
    phone: customer.phone,
    orderCount: orderStatsByCustomer.get(customer.id)?.count ?? 0,
    lifetimeSpendCents: orderStatsByCustomer.get(customer.id)?.spend ?? 0,
    createdAt: customer.createdAt.toISOString(),
  }));

  return (
    <div>
      <PageHeader
        title="Customers"
        description={`${rows.length} registered customer${rows.length === 1 ? "" : "s"}.`}
      />
      <CustomersTable customers={rows} />
    </div>
  );
}
