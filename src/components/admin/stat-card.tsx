import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  /** Signed percentage vs. the prior comparable period, e.g. `12.4` or `-3.1`. */
  trend?: number;
  trendLabel?: string;
}

/** KPI tile for the Dashboard/Analytics grids — one metric, one glanceable delta. */
export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
}: StatCardProps) {
  const isPositive = typeof trend === "number" && trend >= 0;

  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-body-sm text-content-secondary">{label}</p>
        <span className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-accent-subtle text-accent">
          <Icon className="size-[18px]" aria-hidden="true" />
        </span>
      </div>
      <p className="mt-3 font-display text-heading-01 text-content-primary">
        {value}
      </p>
      {typeof trend === "number" && (
        <p
          className={cn(
            "mt-2 flex items-center gap-1 text-body-sm font-medium",
            isPositive ? "text-success" : "text-danger",
          )}
        >
          {isPositive ? (
            <ArrowUpRight className="size-4" aria-hidden="true" />
          ) : (
            <ArrowDownRight className="size-4" aria-hidden="true" />
          )}
          {Math.abs(trend).toFixed(1)}%
          {trendLabel && (
            <span className="font-normal text-content-muted">{trendLabel}</span>
          )}
        </p>
      )}
    </Card>
  );
}
