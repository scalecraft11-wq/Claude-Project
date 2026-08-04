import Image from "next/image";

import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface BlogCardProps {
  href: string;
  coverImageUrl: string;
  category: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  authorName: string;
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
  className,
}: BlogCardProps) {
  return (
    <ScrollReveal as="article">
      <a href={href} className={cn("group block", className)}>
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm">
          <Image
            src={coverImageUrl}
            alt=""
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="duration-[600ms] object-cover transition-transform ease-luxury-out group-hover:scale-[1.04]"
          />
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
      </a>
    </ScrollReveal>
  );
}
