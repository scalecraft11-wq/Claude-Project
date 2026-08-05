import { AnimatedStat } from "@/components/shared/animated-stat";
import { cn } from "@/lib/utils";

export interface HeroStat {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
  decimals?: number;
}

export interface HeroStatsProps {
  stats: HeroStat[];
  className?: string;
}

export function HeroStats({ stats, className }: HeroStatsProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-8 sm:grid-cols-4", className)}>
      {stats.map((stat) => (
        <AnimatedStat
          key={stat.label}
          value={stat.value}
          prefix={stat.prefix}
          suffix={stat.suffix}
          decimals={stat.decimals}
          label={stat.label}
        />
      ))}
    </div>
  );
}
