import Image from "next/image";
import Link from "next/link";

import { ArtworkTile } from "@/components/marketing/artwork-tile";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { cn } from "@/lib/utils";

export interface PortfolioCardProps {
  href: string;
  /** Real photography, when available — omit to render a deterministic
   * on-brand `<ArtworkTile>` instead (see artwork-tile.tsx). */
  imageUrl?: string;
  clientName: string;
  industry: string;
  title: string;
  summary: string;
  className?: string;
}

/**
 * Work-grid item — DESIGN_SYSTEM.md §12 ("Case study card" spec): full-bleed
 * image, overline (client/industry), title, one-line summary. `radius-sm`,
 * flat at rest, image scales to 1.04 on hover over 600ms — no border, no
 * shadow, so the photography carries the card.
 */
export function PortfolioCard({
  href,
  imageUrl,
  clientName,
  industry,
  title,
  summary,
  className,
}: PortfolioCardProps) {
  return (
    <ScrollReveal as="article">
      <Link href={href} className={cn("group block", className)}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="duration-[600ms] object-cover transition-transform ease-luxury-out group-hover:scale-[1.04]"
            />
          ) : (
            <ArtworkTile
              seed={title}
              className="duration-[600ms] size-full transition-transform ease-luxury-out group-hover:scale-[1.04]"
            />
          )}
        </div>
        <div className="mt-4 grid gap-1.5">
          <p className="text-overline text-content-muted">
            {clientName} · {industry}
          </p>
          <h3 className="font-display text-heading-02 transition-colors duration-fast group-hover:text-accent">
            {title}
          </h3>
          <p className="text-body-sm text-content-secondary">{summary}</p>
        </div>
      </Link>
    </ScrollReveal>
  );
}
