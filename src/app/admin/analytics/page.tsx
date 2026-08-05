import { BarChart3, DollarSign, RefreshCw, ShoppingCart } from "lucide-react";

import { BarChartCard } from "@/components/admin/analytics/bar-chart-card";
import { CategoryPerformanceTable } from "@/components/admin/analytics/category-performance-table";
import { PageHeader } from "@/components/admin/page-header";
import { StatCard } from "@/components/admin/stat-card";
import { requireRole } from "@/lib/auth/guards";
import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";

const DAY_MS = 24 * 60 * 60 * 1000;
const MONTHS_BACK = 6;
const NON_REVENUE_STATUSES = ["CANCELLED"] as const;

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string): string {
  const [yearPart, monthPart] = key.split("-");
  const year = Number(yearPart);
  const month = Number(monthPart);
  return new Date(year, month - 1, 1).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

async function getAnalyticsData() {
  const now = new Date();
  const windowStart = new Date(now.getTime() - MONTHS_BACK * 31 * DAY_MS);

  const [
    allOrders,
    ordersByStatus,
    recentOrdersForRevenue,
    recentCustomers,
    orderItems,
    products,
    categories,
    ordersByCustomer,
  ] = await Promise.all([
    prisma.order.findMany({
      where: { status: { notIn: [...NON_REVENUE_STATUSES] } },
      select: { totalCents: true },
    }),
    prisma.order.groupBy({ by: ["status"], _count: { _all: true } }),
    prisma.order.findMany({
      where: {
        createdAt: { gte: windowStart },
        status: { notIn: [...NON_REVENUE_STATUSES] },
      },
      select: { totalCents: true, createdAt: true },
    }),
    prisma.user.findMany({
      where: { role: "CUSTOMER", createdAt: { gte: windowStart } },
      select: { createdAt: true },
    }),
    prisma.orderItem.findMany({
      where: { productId: { not: null } },
      select: { productId: true, totalCents: true, quantity: true },
    }),
    prisma.product.findMany({ select: { id: true, categoryId: true } }),
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.order.groupBy({
      by: ["customerId"],
      where: { customerId: { not: null } },
      _count: { _all: true },
    }),
  ]);

  const lifetimeRevenue = allOrders.reduce(
    (sum, order) => sum + order.totalCents,
    0,
  );
  const totalOrders = allOrders.length;
  const avgOrderValue =
    totalOrders > 0 ? Math.round(lifetimeRevenue / totalOrders) : 0;

  const customersWithOrders = ordersByCustomer.length;
  const repeatCustomers = ordersByCustomer.filter(
    (entry) => entry._count._all > 1,
  ).length;
  const repeatCustomerRate =
    customersWithOrders > 0 ? (repeatCustomers / customersWithOrders) * 100 : 0;

  const monthBuckets: string[] = [];
  for (let i = MONTHS_BACK - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    monthBuckets.push(monthKey(d));
  }

  const revenueByMonth = new Map(monthBuckets.map((key) => [key, 0]));
  for (const order of recentOrdersForRevenue) {
    const key = monthKey(order.createdAt);
    if (revenueByMonth.has(key)) {
      revenueByMonth.set(
        key,
        (revenueByMonth.get(key) ?? 0) + order.totalCents,
      );
    }
  }
  const monthlyRevenue = monthBuckets.map((key) => ({
    month: monthLabel(key),
    revenueCents: revenueByMonth.get(key) ?? 0,
  }));

  const customersByMonth = new Map(monthBuckets.map((key) => [key, 0]));
  for (const customer of recentCustomers) {
    const key = monthKey(customer.createdAt);
    if (customersByMonth.has(key)) {
      customersByMonth.set(key, (customersByMonth.get(key) ?? 0) + 1);
    }
  }
  const newCustomersByMonth = monthBuckets.map((key) => ({
    month: monthLabel(key),
    customers: customersByMonth.get(key) ?? 0,
  }));

  const statusOrder = [
    "PENDING",
    "PROCESSING",
    "SHIPPED",
    "DELIVERED",
    "CANCELLED",
    "REFUNDED",
  ];
  const ordersByStatusData = statusOrder
    .map((status) => ({
      status: status.charAt(0) + status.slice(1).toLowerCase(),
      count:
        ordersByStatus.find((entry) => entry.status === status)?._count._all ??
        0,
    }))
    .filter((entry) => entry.count > 0);

  const productToCategory = new Map(products.map((p) => [p.id, p.categoryId]));
  const categoryRevenue = new Map<
    string,
    { units: number; revenue: number; products: Set<string> }
  >();
  for (const item of orderItems) {
    const categoryId = item.productId
      ? productToCategory.get(item.productId)
      : undefined;
    if (!categoryId) continue;
    const entry = categoryRevenue.get(categoryId) ?? {
      units: 0,
      revenue: 0,
      products: new Set(),
    };
    entry.units += item.quantity;
    entry.revenue += item.totalCents;
    if (item.productId) entry.products.add(item.productId);
    categoryRevenue.set(categoryId, entry);
  }
  const categoryPerformance = categories
    .map((category) => {
      const entry = categoryRevenue.get(category.id);
      return {
        id: category.id,
        name: category.name,
        productCount: entry?.products.size ?? 0,
        unitsSold: entry?.units ?? 0,
        revenueCents: entry?.revenue ?? 0,
      };
    })
    .sort((a, b) => b.revenueCents - a.revenueCents);

  return {
    lifetimeRevenue,
    totalOrders,
    avgOrderValue,
    repeatCustomerRate,
    monthlyRevenue,
    newCustomersByMonth,
    ordersByStatusData,
    categoryPerformance,
  };
}

export default async function AdminAnalyticsPage() {
  await requireRole("MANAGER");
  const data = await getAnalyticsData();

  return (
    <div>
      <PageHeader
        title="Analytics"
        description="Lifetime performance and trends across the store."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Lifetime revenue"
          value={formatCurrency(data.lifetimeRevenue)}
          icon={DollarSign}
        />
        <StatCard
          label="Total orders"
          value={data.totalOrders.toLocaleString()}
          icon={ShoppingCart}
        />
        <StatCard
          label="Avg. order value"
          value={formatCurrency(data.avgOrderValue)}
          icon={BarChart3}
        />
        <StatCard
          label="Repeat customer rate"
          value={`${data.repeatCustomerRate.toFixed(1)}%`}
          icon={RefreshCw}
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <BarChartCard
          title="Monthly revenue"
          description={`Last ${MONTHS_BACK} months`}
          data={data.monthlyRevenue}
          xKey="month"
          yKey="revenueCents"
          valueFormat="currency"
        />
        <BarChartCard
          title="Orders by status"
          description="All-time order distribution"
          data={data.ordersByStatusData}
          xKey="status"
          yKey="count"
          color="var(--color-info)"
        />
        <BarChartCard
          title="New customers"
          description={`Last ${MONTHS_BACK} months`}
          data={data.newCustomersByMonth}
          xKey="month"
          yKey="customers"
          color="var(--color-success)"
        />
        <BarChartCard
          title="Revenue by category"
          description="All-time, top categories"
          data={data.categoryPerformance.slice(0, 6).map((c) => ({
            name: c.name,
            revenueCents: c.revenueCents,
          }))}
          xKey="name"
          yKey="revenueCents"
          valueFormat="currency"
          color="var(--color-warning)"
        />
      </div>

      <div className="mt-6">
        <h2 className="mb-3 font-display text-heading-03 text-content-primary">
          Category performance
        </h2>
        <CategoryPerformanceTable rows={data.categoryPerformance} />
      </div>
    </div>
  );
}
