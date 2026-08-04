import { Check } from "lucide-react";

import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

export interface PricingCardProps {
  planName: string;
  price: string;
  billingPeriod?: string;
  description?: string;
  features: string[];
  cta: { label: string; href: string };
  /** Highlights this plan as the recommended option. */
  featured?: boolean;
  className?: string;
}

/**
 * A single pricing tier. `featured` lifts the card (`elevation-3` +
 * accent border) and marks it with a badge — never more than one
 * `featured` card per row (DESIGN_SYSTEM.md §11 "rule of one" applies here
 * too: one recommended plan, not several competing for attention).
 */
export function PricingCard({
  planName,
  price,
  billingPeriod,
  description,
  features,
  cta,
  featured = false,
  className,
}: PricingCardProps) {
  return (
    <ScrollReveal as="article">
      <div
        className={cn(
          "relative flex h-full flex-col gap-6 rounded-card border p-8",
          featured
            ? "border-accent bg-surface shadow-elevation-3"
            : "border-hairline-subtle bg-surface",
          className,
        )}
      >
        {featured && (
          <span className="absolute -top-3 left-8 rounded-full bg-button-primary px-3 py-1 text-overline text-button-primary-foreground">
            Recommended
          </span>
        )}

        <div className="grid gap-2">
          <h3 className="font-display text-heading-02">{planName}</h3>
          {description && (
            <p className="text-body-sm text-content-secondary">{description}</p>
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="font-display text-display-03">{price}</span>
          {billingPeriod && (
            <span className="text-body-sm text-content-muted">
              /{billingPeriod}
            </span>
          )}
        </div>

        <ul className="grid flex-1 gap-3">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5">
              <Check
                className="mt-0.5 size-4 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span className="text-body-sm text-content-secondary">
                {feature}
              </span>
            </li>
          ))}
        </ul>

        <Button
          asChild
          variant={featured ? "primary" : "secondary"}
          size="lg"
          className="w-full"
        >
          <a href={cta.href}>{cta.label}</a>
        </Button>
      </div>
    </ScrollReveal>
  );
}
