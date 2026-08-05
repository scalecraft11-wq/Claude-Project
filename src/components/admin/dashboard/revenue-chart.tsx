"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartCard } from "@/components/admin/chart-card";
import { formatCurrency } from "@/lib/format";

export interface RevenuePoint {
  date: string;
  label: string;
  revenueCents: number;
}

export function RevenueChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ChartCard
      title="Revenue"
      description="Order revenue over the last 30 days"
    >
      <AreaChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-accent)"
              stopOpacity={0.35}
            />
            <stop
              offset="100%"
              stopColor="var(--color-accent)"
              stopOpacity={0}
            />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--color-border-subtle)"
          vertical={false}
        />
        <XAxis
          dataKey="label"
          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
          axisLine={{ stroke: "var(--color-border-subtle)" }}
          tickLine={false}
          minTickGap={24}
        />
        <YAxis
          tick={{ fill: "var(--color-text-muted)", fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          width={64}
          tickFormatter={(value: number) => formatCurrency(value)}
        />
        <Tooltip
          formatter={(value) => formatCurrency(Number(value))}
          contentStyle={{
            background: "var(--color-bg-surface)",
            border: "1px solid var(--color-border-subtle)",
            borderRadius: "var(--radius-card)",
            fontSize: 13,
          }}
          labelStyle={{ color: "var(--color-text-primary)" }}
        />
        <Area
          type="monotone"
          dataKey="revenueCents"
          stroke="var(--color-accent)"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ChartCard>
  );
}
