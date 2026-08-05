"use client";

import Image from "next/image";
import * as React from "react";

import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
}: {
  images: { url: string; altText: string }[];
}) {
  const [activeIndex, setActiveIndex] = React.useState(0);
  const active = images[activeIndex];

  return (
    <div className="grid gap-3">
      <div className="relative aspect-square overflow-hidden rounded-card bg-surface-raised">
        {active ? (
          <Image
            src={active.url}
            alt={active.altText}
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center text-body-sm text-content-muted">
            No image available
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={image.url + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1}`}
              aria-current={index === activeIndex}
              className={cn(
                "relative aspect-square overflow-hidden rounded-sm bg-surface-raised ring-2 ring-transparent transition-all",
                index === activeIndex && "ring-accent",
              )}
            >
              <Image
                src={image.url}
                alt=""
                fill
                sizes="10vw"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
