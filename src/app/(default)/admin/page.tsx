import { AlertTriangle, DollarSign, ShoppingCart, Users } from "lucide-react";

import { RecentOrdersTable } from "@/components/admin/dashboard/recent-orders-table";
import {
  RevenueChart,
  type RevenuePoint,
} from "@/components/admin/dashboard/revenue-chart";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;
const REVENUE_EXCLUDED_STATUSES = ["CANCELLED"] as const;

function percentTrend(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

async function getDashboardData() {
  const now = new Date();
  const last30Start = new Date(now.getTime() - 30 * DAY_MS);
  const prev30Start = new Date(now.getTime() - 60 * DAY_MS);

  const [
    ordersLast30,
    ordersPrev30,
    customersLast30Count,
    customersPrev30Count,
    customersTotal,
    lowStockCount,
    recentOrders,
    topOrderItems,
  ] = await Promise.all([
    prisma.order.findMany({
      where: {
        createdAt: { gte: last30Start },
        status: { notIn: [...REVENUE_EXCLUDED_STATUSES] },
      },
      select: { totalCents: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: prev30Start, lt: last30Start },
        status: { notIn: [...REVENUE_EXCLUDED_STATUSES] },
      },
      select: { totalCents: true },
    }),
    prisma.user.count({
      where: { role: "CUSTOMER", createdAt: { gte: last30Start } },
    }),
    prisma.user.count({
      where: {
        role: "CUSTOMER",
        createdAt: { gte: prev30Start, lt: last30Start },
      },
    }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count({
      where: {
        status: "ACTIVE",
        stock: { lte: prisma.product.fields.lowStockThreshold },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { customer: { select: { name: true, email: true } } },
    }),
    prisma.orderItem.groupBy({
      by: ["productId"],
      where: { productId: { not: null } },
      _sum: { totalCents: true, quantity: true },
      orderBy: { _sum: { totalCents: "desc" } },
      take: 5,
    }),
  ]);

  const revenueLast30 = ordersLast30.reduce(
    (sum, order) => sum + order.totalCents,
    0,
  );
  const revenuePrev30 = ordersPrev30.reduce(
    (sum, order) => sum + order.totalCents,
    0,
  );

  const revenueByDay = new Map<string, number>();
  for (let i = 29; i >= 0; i -= 1) {
    const day = new Date(now.getTime() - i * DAY_MS);
    revenueByDay.set(day.toISOString().slice(0, 10), 0);
  }
  for (const order of ordersLast30) {
    const key = order.createdAt.toISOString().slice(0, 10);
    if (revenueByDay.has(key)) {
      revenueByDay.set(key, (revenueByDay.get(key) ?? 0) + order.totalCents);
    }
  }
  const revenueSeries: RevenuePoint[] = Array.from(revenueByDay.entries()).map(
    ([date, revenueCents]) => ({
      date,
      label: new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      revenueCents,
    }),
  );

  const topProductIds = topOrderItems
    .map((item) => item.productId)
    .filter((id): id is string => Boolean(id));
  const topProducts = await prisma.product.findMany({
    where: { id: { in: topProductIds } },
    select: { id: true, name: true, slug: true },
  });
  const topProductsWithRevenue = topOrderItems.map((item) => {
    const product = topProducts.find((p) => p.id === item.productId);
    return {
      id: item.productId ?? "unknown",
      name: product?.name ?? "Deleted product",
      revenueCents: item._sum.totalCents ?? 0,
      unitsSold: item._sum.quantity ?? 0,
    };
  });

  return {
    revenueLast30,
    revenueTrend: percentTrend(revenueLast30, revenuePrev30),
    ordersCount: ordersLast30.length,
    ordersTrend: percentTrend(ordersLast30.length, ordersPrev30.length),
    customersTotal,
    customersTrend: percentTrend(customersLast30Count, customersPrev30Count),
    lowStockCount,
    revenueSeries,
    recentOrders: recentOrders.map((order) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customerLabel:
        order.customer?.name ?? order.customer?.email ?? order.email,
      status: order.status,
      totalCents: order.totalCents,
      createdAt: order.createdAt.toISOString(),
    })),
    topProducts: topProductsWithRevenue,
  };
}

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="A live snapshot of the store's last 30 days."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Revenue (30d)"
          value={formatCurrency(data.revenueLast30)}
          icon={DollarSign}
          trend={data.revenueTrend}
          trendLabel="vs prior 30d"
        />
        <StatCard
          label="Orders (30d)"
          value={data.ordersCount.toLocaleString()}
          icon={ShoppingCart}
          trend={data.ordersTrend}
          trendLabel="vs prior 30d"
        />
        <StatCard
          label="Customers"
          value={data.customersTotal.toLocaleString()}
          icon={Users}
          trend={data.customersTrend}
          trendLabel="new vs prior 30d"
        />
        <StatCard
          label="Low stock items"
          value={data.lowStockCount.toLocaleString()}
          icon={AlertTriangle}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RevenueChart data={data.revenueSeries} />
        </div>
        <Card className="p-5">
          <h3 className="font-display text-heading-03 text-content-primary">
            Top products
          </h3>
          <p className="mt-0.5 text-body-sm text-content-secondary">
            By revenue, last 30 days
          </p>
          <ul className="mt-4 grid gap-3">
            {data.topProducts.length ? (
              data.topProducts.map((product, index) => (
                <li
                  key={product.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-surface-raised text-caption font-medium text-content-secondary">
                      {index + 1}
                    </span>
                    <span className="truncate text-body-sm text-content-primary">
                      {product.name}
                    </span>
                  </div>
                  <span className="shrink-0 text-body-sm font-medium text-content-primary">
                    {formatCurrency(product.revenueCents)}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-body-sm text-content-muted">No sales yet.</li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-heading-03 text-content-primary">
          Recent orders
        </h2>
        <RecentOrdersTable orders={data.recentOrders} />
      </div>
    </div>
  );
}
