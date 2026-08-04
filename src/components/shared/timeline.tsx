import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { cn } from "@/lib/utils";

export interface TimelineStep {
  label: string;
  title: string;
  description: string;
}

export interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

/**
 * Vertical process/methodology timeline. Each step reveals independently
 * as it scrolls into view (`<ScrollReveal>`, staggered by index) rather
 * than a single scrubbed animation — this is a content list, not one of
 * the page's 1–2 signature scroll-scrubbed moments
 * (ANIMATION_BLUEPRINT.md §4).
 */
export function Timeline({ steps, className }: TimelineProps) {
  return (
    <ol className={cn("relative grid gap-12", className)}>
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-5 top-0 hidden border-l border-hairline-subtle sm:block"
      />
      {steps.map((step, index) => (
        <ScrollReveal
          as="li"
          key={step.title}
          delay={index * 60}
          className="relative grid gap-2 sm:pl-16"
        >
          <span className="absolute left-0 top-0 hidden size-10 items-center justify-center rounded-full border border-hairline-strong bg-canvas text-body-sm font-medium sm:flex">
            {index + 1}
          </span>
          <p className="text-overline text-content-muted">{step.label}</p>
          <h3 className="font-display text-heading-02">{step.title}</h3>
          <p className="max-w-measure text-body-md text-content-secondary">
            {step.description}
          </p>
        </ScrollReveal>
      ))}
    </ol>
  );
}
