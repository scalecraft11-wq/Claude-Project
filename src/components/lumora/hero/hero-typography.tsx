import { cn } from "@/lib/utils";

export interface HeroTypographyProps {
  eyebrow?: string;
  /** One entry per visual line — line breaks are an editorial choice, not
   * something to infer from a paragraph of text. */
  lines: string[];
  description?: string;
  className?: string;
}

/**
 * Hero headline entrance — ANIMATION_BLUEPRINT.md §14/§19: each line
 * reveals via a mask (clipped by the `overflow-hidden` wrapper, not a
 * fade) and staggers in ~80ms apart. Body copy gets the single
 * group-fade-up used everywhere else (§20) — kinetic per-line reveals are
 * reserved for headline-scale type only.
 *
 * Pure CSS (`tailwindcss-animate`'s `animate-in` utilities), not Framer
 * Motion — this is the hero's above-the-fold text, one of which is
 * typically the page's LCP element. A JS/rAF-driven entrance would gate
 * that element's paint on React hydration finishing, which under
 * throttled CPUs competes with everything else hydrating at once and
 * measurably delays LCP; a native CSS `@keyframes` animation paints on
 * schedule regardless of main-thread load, since the browser drives it
 * off the parsed stylesheet alone.
 */
export function HeroTypography({
  eyebrow,
  lines,
  description,
  className,
}: HeroTypographyProps) {
  return (
    <div className={cn("grid gap-6", className)}>
      {eyebrow && (
        <p className="text-overline text-content-muted duration-slow ease-luxury-out animate-in fade-in slide-in-from-bottom-2 fill-mode-both">
          {eyebrow}
        </p>
      )}

      <h1 className="font-display text-display-01 text-content-primary">
        {lines.map((line, index) => (
          <span key={line} className="block overflow-hidden">
            <span
              className="block duration-cinematic ease-luxury-out animate-in slide-in-from-bottom-[110%] fill-mode-both"
              style={{ animationDelay: `${index * 80}ms` }}
            >
              {line}
            </span>
          </span>
        ))}
      </h1>

      {description && (
        <p
          className="max-w-measure text-body-lg text-content-secondary duration-slow ease-luxury-out animate-in fade-in slide-in-from-bottom-4 fill-mode-both"
          style={{ animationDelay: `${lines.length * 80 + 100}ms` }}
        >
          {description}
        </p>
      )}
    </div>
  );
}
