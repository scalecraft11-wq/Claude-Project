import { cn } from "@/lib/utils";

export interface HeroFallbackProps {
  className?: string;
}

/**
 * Static fallback for the hero's 3D scene — ANIMATION_BLUEPRINT.md §26
 * (Tier 3): no WebGL canvas at all, a self-contained illustration instead.
 * Built as inline SVG so there's no external asset to fetch/fail — the
 * "no placeholders" requirement means this has to be a real, finished
 * piece of art, not a gray box with a caption.
 *
 * The only motion here is a single CSS `animate-float` loop, which
 * Tailwind's `motion-safe:` variant compiles against
 * `prefers-reduced-motion` at the stylesheet level — no JS, so this
 * fallback is correct even before React hydrates.
 */
export function HeroFallback({ className }: HeroFallbackProps) {
  return (
    <div
      className={cn(
        // On narrow viewports the bottle sits lower/smaller so it never
        // competes with the headline text stacked above it — the same
        // z-10 foreground content overlays this on every breakpoint, and
        // there's no room to reserve a separate "image half" the way a
        // wider layout can.
        "relative flex items-end justify-end overflow-hidden pb-10 pr-4",
        "sm:items-center sm:justify-center sm:pb-0 sm:pr-0",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 45%, var(--color-accent-subtle-bg) 0%, transparent 70%)",
        }}
      />
      <svg
        viewBox="0 0 320 480"
        role="img"
        aria-label="Lumora Skin renewal serum bottle"
        className="relative h-[34vh] max-h-[560px] w-auto drop-shadow-2xl motion-safe:animate-float sm:h-[46vh] lg:h-[60vh]"
      >
        <defs>
          <linearGradient id="lumora-glass" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f6ead3" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#e3c68f" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#c9a15c" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="lumora-liquid" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a15c" />
            <stop offset="100%" stopColor="#ad8547" />
          </linearGradient>
          <linearGradient id="lumora-cap" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e3c68f" />
            <stop offset="100%" stopColor="#8f6935" />
          </linearGradient>
          <radialGradient id="lumora-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#1c1712" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#1c1712" stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="160" cy="452" rx="90" ry="16" fill="url(#lumora-shadow)" />

        {/* Cap */}
        <rect
          x="128"
          y="40"
          width="64"
          height="56"
          rx="10"
          fill="url(#lumora-cap)"
        />
        <rect
          x="140"
          y="24"
          width="40"
          height="24"
          rx="6"
          fill="url(#lumora-cap)"
        />

        {/* Glass body */}
        <rect
          x="90"
          y="92"
          width="140"
          height="330"
          rx="34"
          fill="url(#lumora-glass)"
          stroke="#f6ead3"
          strokeOpacity="0.5"
        />

        {/* Liquid fill */}
        <rect
          x="104"
          y="220"
          width="112"
          height="188"
          rx="22"
          fill="url(#lumora-liquid)"
          opacity="0.9"
        />

        {/* Highlight */}
        <rect
          x="104"
          y="112"
          width="18"
          height="290"
          rx="9"
          fill="#ffffff"
          opacity="0.25"
        />
      </svg>
    </div>
  );
}
