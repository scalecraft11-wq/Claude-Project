import Image from "next/image";

import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { cn } from "@/lib/utils";

export interface CaseStudyCardProps {
  href: string;
  imageUrl: string;
  clientName: string;
  title: string;
  summary: string;
  /** A single standout result, e.g. `{ label: "Conversion", value: "+340%" }`. */
  metric: { label: string; value: string };
  className?: string;
}

/**
 * A results-forward case-study feature — heavier than `<PortfolioCard>`
 * (which is the plain work-grid item): includes an `elevation-2` surface
 * and a highlighted metric, for contexts that should sell the outcome,
 * not just the work (a homepage "featured results" section, for example).
 */
export function CaseStudyCard({
  href,
  imageUrl,
  clientName,
  title,
  summary,
  metric,
  className,
}: CaseStudyCardProps) {
  return (
    <ScrollReveal as="article">
      <a
        href={href}
        className={cn(
          "group grid overflow-hidden rounded-card border border-hairline-subtle bg-surface shadow-elevation-2 lg:grid-cols-2",
          className,
        )}
      >
        <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
          <Image
            src={imageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="duration-[600ms] object-cover transition-transform ease-luxury-out group-hover:scale-[1.04]"
          />
        </div>
        <div className="flex flex-col justify-between gap-8 p-8">
          <div className="grid gap-2">
            <p className="text-overline text-content-muted">{clientName}</p>
            <h3 className="font-display text-heading-02 transition-colors duration-fast group-hover:text-accent">
              {title}
            </h3>
            <p className="text-body-sm text-content-secondary">{summary}</p>
          </div>
          <div className="border-t border-hairline-subtle pt-6">
            <p className="font-display text-display-03 text-accent">
              {metric.value}
            </p>
            <p className="text-body-sm text-content-muted">{metric.label}</p>
          </div>
        </div>
      </a>
    </ScrollReveal>
  );
}
