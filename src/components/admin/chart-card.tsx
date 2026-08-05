"use client";

import type { ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

import { Card } from "@/components/ui/card";

export interface ChartCardProps {
  title: string;
  description?: string;
  height?: number;
  /** A single Recharts chart element (LineChart/BarChart/AreaChart/PieChart). */
  children: ReactElement;
  actions?: ReactElement;
}

/** Shared frame for every Recharts visualization across Dashboard/Analytics. */
export function ChartCard({
  title,
  description,
  height = 300,
  children,
  actions,
}: ChartCardProps) {
  return (
    <Card className="p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-heading-03 text-content-primary">
            {title}
          </h3>
          {description && (
            <p className="mt-0.5 text-body-sm text-content-secondary">
              {description}
            </p>
          )}
        </div>
        {actions}
      </div>
      <ResponsiveContainer width="100%" height={height}>
        {children}
      </ResponsiveContainer>
    </Card>
  );
}
