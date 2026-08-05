import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * The one shared section-intro recipe reused across every marketing page
 * — DESIGN_SYSTEM.md §1 ("editorial before app-like") and
 * ANIMATION_BLUEPRINT.md §20 (one reveal recipe for standard content, not
 * a bespoke one per section).
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <ScrollReveal
      className={cn(
        "grid gap-4",
        align === "center" && "mx-auto max-w-2xl text-center",
        className,
      )}
    >
      {eyebrow && <p className="text-overline text-content-muted">{eyebrow}</p>}
      <h2 className="font-display text-display-03 text-content-primary">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-measure text-body-lg text-content-secondary",
            align === "center" && "mx-auto",
          )}
        >
          {description}
        </p>
      )}
    </ScrollReveal>
  );
}
