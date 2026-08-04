"use client";

import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";
import type { JobOpening } from "@/lib/data/jobs";

export interface CareersJobListProps {
  jobs: JobOpening[];
}

/**
 * Department filter for open roles — same instant cross-fade pattern as
 * the Portfolio page's industry filter (ANIMATION_BLUEPRINT.md §20: one
 * shared filter recipe, not a bespoke one per page).
 */
export function CareersJobList({ jobs }: CareersJobListProps) {
  const departments = React.useMemo(
    () => Array.from(new Set(jobs.map((job) => job.department))),
    [jobs],
  );
  const [activeDepartment, setActiveDepartment] = React.useState<string | null>(
    null,
  );

  const filtered = activeDepartment
    ? jobs.filter((job) => job.department === activeDepartment)
    : jobs;

  return (
    <div>
      <div
        role="group"
        aria-label="Filter roles by department"
        className="flex flex-wrap gap-3"
      >
        <FilterPill
          label="All roles"
          active={activeDepartment === null}
          onClick={() => setActiveDepartment(null)}
        />
        {departments.map((department) => (
          <FilterPill
            key={department}
            label={department}
            active={activeDepartment === department}
            onClick={() => setActiveDepartment(department)}
          />
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {filtered.length} open role{filtered.length === 1 ? "" : "s"}
        {activeDepartment ? ` in ${activeDepartment}` : ""}.
      </p>

      <motion.div layout className="mt-10 grid gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((job) => (
            <motion.div
              key={job.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link
                href="/contact"
                className="hover:border-accent/40 group flex flex-col gap-4 rounded-card border border-hairline-subtle bg-surface p-6 transition-colors duration-fast sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="grid gap-1.5">
                  <p className="text-overline text-content-muted">
                    {job.department} · {job.location} · {job.type}
                  </p>
                  <h3 className="font-display text-heading-03 text-content-primary transition-colors duration-fast group-hover:text-accent">
                    {job.title}
                  </h3>
                  <p className="max-w-measure text-body-sm text-content-secondary">
                    {job.summary}
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1.5 text-body-sm font-medium text-content-primary transition-colors duration-fast group-hover:text-accent">
                  Apply
                  <ArrowUpRight
                    className="size-4 transition-transform duration-fast group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </span>
              </Link>
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
