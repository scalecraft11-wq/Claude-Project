"use client";

import { AnimatePresence, motion } from "motion/react";
import * as React from "react";

import { PortfolioCard } from "@/components/marketing/portfolio-card";
import { cn } from "@/lib/utils";
import type { CaseStudy } from "@/lib/data/case-studies";

export interface PortfolioGridProps {
  caseStudies: CaseStudy[];
  className?: string;
}

/**
 * Client-side industry filter for the work grid. Filtering is instant
 * (no network round-trip), but the grid still announces the change to
 * assistive tech and cross-fades entering/exiting cards rather than
 * snapping — the same "state changes should be felt, not just applied"
 * principle that governs the rest of the animation system.
 */
export function PortfolioGrid({ caseStudies, className }: PortfolioGridProps) {
  const industries = React.useMemo(
    () => Array.from(new Set(caseStudies.map((study) => study.industry))),
    [caseStudies],
  );
  const [activeIndustry, setActiveIndustry] = React.useState<string | null>(
    null,
  );

  const filtered = activeIndustry
    ? caseStudies.filter((study) => study.industry === activeIndustry)
    : caseStudies;

  return (
    <div className={className}>
      <div
        role="group"
        aria-label="Filter work by industry"
        className="flex flex-wrap gap-3"
      >
        <FilterPill
          label="All work"
          active={activeIndustry === null}
          onClick={() => setActiveIndustry(null)}
        />
        {industries.map((industry) => (
          <FilterPill
            key={industry}
            label={industry}
            active={activeIndustry === industry}
            onClick={() => setActiveIndustry(industry)}
          />
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {filtered.length} project{filtered.length === 1 ? "" : "s"}
        {activeIndustry ? ` in ${activeIndustry}` : ""}.
      </p>

      <motion.div
        layout
        className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((study) => (
            <motion.div
              key={study.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <PortfolioCard
                href={study.href ?? `/case-studies#${study.slug}`}
                clientName={study.clientName}
                industry={study.industry}
                title={study.title}
                summary={study.summary}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-full border px-4 py-2 text-body-sm font-medium transition-colors duration-fast",
        active
          ? "border-accent bg-accent-subtle text-accent"
          : "border-hairline-subtle text-content-secondary hover:text-content-primary",
      )}
    >
      {label}
    </button>
  );
}
