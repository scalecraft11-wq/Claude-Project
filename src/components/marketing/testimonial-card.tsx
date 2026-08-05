"use client";

import Image from "next/image";

import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { useBrand, type Brand } from "@/contexts/brand-context";
import { cn } from "@/lib/utils";

export interface TestimonialCardProps {
  quote: string;
  authorName: string;
  authorRole: string;
  companyName: string;
  avatarUrl?: string;
  className?: string;
}

/**
 * DESIGN_SYSTEM.md §12: Agency is flat/editorial (`radius-xs`,
 * `bg-surface-raised`, no shadow); Lumora is softer and warmer
 * (`radius-xl`, `elevation-2`, tinted background).
 */
export function TestimonialCard({
  quote,
  authorName,
  authorRole,
  companyName,
  avatarUrl,
  className,
}: TestimonialCardProps) {
  const brand = useBrand();

  return (
    <ScrollReveal as="article">
      <figure
        className={cn(
          "flex h-full flex-col justify-between gap-8 p-8",
          brandCardStyles(brand),
          className,
        )}
      >
        <blockquote className="font-display text-heading-03">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="flex items-center gap-3">
          {avatarUrl && (
            <Image
              src={avatarUrl}
              alt=""
              width={44}
              height={44}
              className="size-11 rounded-full object-cover"
            />
          )}
          <div>
            <p className="text-body-sm font-medium text-content-primary">
              {authorName}
            </p>
            <p className="text-body-sm text-content-secondary">
              {authorRole}, {companyName}
            </p>
          </div>
        </figcaption>
      </figure>
    </ScrollReveal>
  );
}

function brandCardStyles(brand: Brand) {
  return brand === "lumora"
    ? "rounded-xl bg-accent-subtle shadow-elevation-2"
    : "rounded-xs bg-surface-raised";
}
