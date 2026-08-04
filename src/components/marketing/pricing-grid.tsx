"use client";

import * as React from "react";

import { PricingCard } from "@/components/marketing/pricing-card";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/lib/data/pricing-plans";

export interface PricingGridProps {
  plans: PricingPlan[];
  className?: string;
}

type BillingMode = "monthly" | "project";

/**
 * Monthly/project-based pricing toggle. Each `PricingCard` remounts on
 * toggle (keyed by `${slug}-${billing}`) rather than mutating its price
 * in place — cheap here (no external data fetch) and it means the card's
 * own entrance animation replays as a quiet confirmation that the numbers
 * actually changed, instead of the figure just silently swapping.
 */
export function PricingGrid({ plans, className }: PricingGridProps) {
  const [billing, setBilling] = React.useState<BillingMode>("monthly");

  return (
    <div className={className}>
      <div className="flex items-center justify-center gap-4">
        <span
          className={cn(
            "text-body-sm font-medium",
            billing === "monthly"
              ? "text-content-primary"
              : "text-content-muted",
          )}
        >
          Monthly retainer
        </span>
        <Switch
          checked={billing === "project"}
          onCheckedChange={(checked) =>
            setBilling(checked ? "project" : "monthly")
          }
          aria-label="Toggle between monthly retainer and project-based pricing"
        />
        <span
          className={cn(
            "text-body-sm font-medium",
            billing === "project"
              ? "text-content-primary"
              : "text-content-muted",
          )}
        >
          Project-based
        </span>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {plans.map((plan) => (
          <PricingCard
            key={`${plan.slug}-${billing}`}
            planName={plan.name}
            description={plan.description}
            price={
              billing === "monthly" ? plan.priceMonthly : plan.priceProject
            }
            features={plan.features}
            featured={plan.featured}
            cta={{
              label: plan.cta,
              href: "/contact",
            }}
          />
        ))}
      </div>
    </div>
  );
}
