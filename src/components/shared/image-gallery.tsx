"use client";

import Image from "next/image";
import * as React from "react";

import { Lightbox, type LightboxImage } from "@/components/ui/lightbox";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

import { cn } from "@/lib/utils";

export interface ImageGalleryProps {
  images: LightboxImage[];
  columns?: 2 | 3 | 4;
  className?: string;
}

/**
 * A grid of images that opens `<Lightbox>` on click, with full keyboard
 * access (each thumbnail is a real button, not a click-only div).
 */
export function ImageGallery({
  images,
  columns = 3,
  className,
}: ImageGalleryProps) {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const columnsClassName = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-4",
  }[columns];

  return (
    <>
      <div
        className={cn("grid grid-cols-2 gap-4", columnsClassName, className)}
      >
        {images.map((image, imageIndex) => (
          <ScrollReveal
            as="div"
            key={`${image.src}-${imageIndex}`}
            delay={imageIndex * 40}
          >
            <button
              type="button"
              onClick={() => {
                setIndex(imageIndex);
                setOpen(true);
              }}
              className="group relative block aspect-square w-full overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                className="duration-[600ms] object-cover transition-transform ease-luxury-out group-hover:scale-[1.04]"
              />
            </button>
          </ScrollReveal>
        ))}
      </div>

      <Lightbox
        images={images}
        index={index}
        onIndexChange={setIndex}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
