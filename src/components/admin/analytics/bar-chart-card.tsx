"use client";

import { Bar, BarChart, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

import { ChartCard } from "@/components/admin/chart-card";
import { formatCurrency } from "@/lib/format";

export interface BarChartCardProps {
  title: string;
  description?: string;
  data: Record<string, string | number>[];
  xKey: string;
  yKey: string;
  /** A function prop can't cross the server→client boundary (this card is
   * rendered from a Server Component page), so callers pick a named format
   * instead of handing over a formatter closure. */
  valueFormat?: "currency" | "number";
  color?: string;
}

/** One generic bar chart, reused across Analytics for every single-series
 * breakdown (monthly revenue, orders by status, category revenue, new
 * customers) so each metric doesn't need its own bespoke chart component. */
export function BarChartCard({
  title,
  description,
  data,
  xKey,
  yKey,
  valueFormat = "number",
  color = "var(--color-accent)",
}: BarChartCardProps) {
  const format =
    valueFormat === "currency"
      ? formatCurrency
      : (value: number) => value.toLocaleString();

  return (
    <ChartCard title={title} description={description}>
      <BarChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border-subtle)"
          vertical={false}
        />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
          axisLine={{ stroke: "var(--color-border-subtle)" }}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={64}
          tickFormatter={(value: number) => format(value)}
        />
        <Tooltip
          formatter={(value) => format(Number(value))}
          contentStyle={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "var(--radius-card)",
            fontSize: 13,
          }}
          labelStyle={{ color: "var(--color-text-primary)" }}
          cursor={{ fill: "var(--color-bg-surface-raised)" }}
        />
        <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartCard>
  );
}
