"use client";

import * as React from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { registerGsap } from "@/lib/animation/gsap";
import { cn } from "@/lib/utils";

export interface TechMarqueeProps {
  items: string[];
  className?: string;
}

/**
 * Services page's signature GSAP moment — a continuous, time-based
 * infinite marquee (not scroll-scrubbed; About's ValuesScroll already
 * owns that recipe for this batch of pages) showcasing the stack behind
 * every build. The track is rendered twice back-to-back and translated
 * exactly -50% on a seamless loop, so the seam is invisible.
 * `prefers-reduced-motion` gets the same list as a plain static, wrapped
 * row instead — motion is never the only way to read the content.
 */
export function TechMarquee({ items, className }: TechMarqueeProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  React.useEffect(() => {
    if (prefersReducedMotion || !trackRef.current) return;

    const gsap = registerGsap();
    const track = trackRef.current;

    const ctx = gsap.context(() => {
      gsap.to(track, {
        xPercent: -50,
        ease: "none",
        duration: items.length * 2.5,
        repeat: -1,
      });
    });

    return () => ctx.revert();
  }, [prefersReducedMotion, items.length]);

  if (prefersReducedMotion) {
    return (
      <div
        className={cn(
          "flex flex-wrap justify-center gap-x-10 gap-y-4",
          className,
        )}
      >
        {items.map((item) => (
          <span
            key={item}
            className="font-display text-heading-03 text-content-muted"
          >
            {item}
          </span>
        ))}
      </div>
    );
  }

  const loopItems = [...items, ...items];

  return (
    <div className={className}>
      <p className="sr-only">{items.join(", ")}</p>
      <div className="overflow-hidden" aria-hidden="true">
        <div ref={trackRef} className="flex w-max gap-16">
          {loopItems.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="whitespace-nowrap font-display text-heading-03 text-content-muted"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
