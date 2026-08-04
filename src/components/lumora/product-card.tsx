import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  href: string;
  imageUrl: string;
  name: string;
  collection: string;
  priceCents: number;
  onQuickAdd?: () => void;
  className?: string;
}

/**
 * PLP grid item — DESIGN_SYSTEM.md §12: square studio-lit crop,
 * `radius-lg`, `elevation-1`, a quick-add icon-button that reveals on
 * hover/focus rather than sitting permanently on the card.
 */
export function ProductCard({
  href,
  imageUrl,
  name,
  collection,
  priceCents,
  onQuickAdd,
  className,
}: ProductCardProps) {
  return (
    <ScrollReveal as="article">
      <div className={cn("group relative", className)}>
        <Link href={href} className="block">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-raised shadow-elevation-1">
            <Image
              src={imageUrl}
              alt=""
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="duration-[600ms] object-cover transition-transform ease-luxury-out group-hover:scale-[1.04]"
            />
          </div>
          <div className="mt-4 grid gap-1">
            <p className="text-overline text-content-muted">{collection}</p>
            <h3 className="text-body-lg font-medium text-content-primary">
              {name}
            </h3>
            <p className="text-body-sm font-medium text-content-secondary">
              {formatCurrency(priceCents)}
            </p>
          </div>
        </Link>

        {onQuickAdd && (
          <button
            type="button"
            onClick={onQuickAdd}
            aria-label={`Quick add ${name} to bag`}
            className={cn(
              "absolute right-3 top-3 flex size-11 items-center justify-center rounded-full bg-button-primary text-button-primary-foreground",
              "scale-90 opacity-0 transition-all duration-fast ease-standard",
              "group-focus-within:scale-100 group-focus-within:opacity-100 group-hover:scale-100 group-hover:opacity-100",
              "focus-visible:scale-100 focus-visible:opacity-100 focus-visible:outline-none",
            )}
          >
            <Plus className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>
    </ScrollReveal>
  );
}
