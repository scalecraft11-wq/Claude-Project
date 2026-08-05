import Image from "next/image";
import Link from "next/link";

import { ArtworkTile } from "@/components/marketing/artwork-tile";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
  href: string;
  /** Real photography, when available — omit to render a deterministic
   * on-brand `<ArtworkTile>` instead (see artwork-tile.tsx). */
  coverImageUrl?: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  authorName: string;
  /** Anchor target for pages that link to `#id` (posts don't have their
   * own route yet). */
  id?: string;
  className?: string;
}

export function BlogCard({
  href,
  coverImageUrl,
  category,
  title,
  excerpt,
  publishedAt,
  authorName,
  id,
  className,
}: BlogCardProps) {
  return (
    <ScrollReveal
      as="article"
      id={id}
      className={id ? "scroll-mt-28" : undefined}
    >
      <Link href={href} className={cn("group block", className)}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
          {coverImageUrl ? (
            <Image
              src={coverImageUrl}
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
          <p className="text-overline text-content-muted">{category}</p>
          <h3 className="font-display text-heading-02 transition-colors duration-fast group-hover:text-accent">
            {title}
          </h3>
          <p className="text-body-sm text-content-secondary">{excerpt}</p>
          <p className="mt-1 text-body-sm text-content-muted">
            {authorName} · {formatDate(publishedAt)}
          </p>
        </div>
      </Link>
    </ScrollReveal>
  );
}
