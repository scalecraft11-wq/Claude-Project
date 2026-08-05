"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import * as React from "react";

export interface LightboxImage {
  src: string;
  alt: string;
}

export interface LightboxProps {
  images: LightboxImage[];
  index: number;
  onIndexChange: (index: number) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Full-screen image viewer — ANIMATION_BLUEPRINT.md §19 (Image Reveal:
 * gallery/lightbox). Each image cross-fades in on navigation (not a hard
 * cut); arrow keys and `Esc` are first-class, not just click targets
 * (DESIGN_SYSTEM.md §29).
 */
export function Lightbox({
  images,
  index,
  onIndexChange,
  open,
  onOpenChange,
}: LightboxProps) {
  const goToPrevious = React.useCallback(() => {
    onIndexChange((index - 1 + images.length) % images.length);
  }, [index, images.length, onIndexChange]);

  const goToNext = React.useCallback(() => {
    onIndexChange((index + 1) % images.length);
  }, [index, images.length, onIndexChange]);

  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") goToPrevious();
      if (event.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, goToPrevious, goToNext]);

  const currentImage = images[index];

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && currentImage && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-black/92 fixed inset-0 z-[60]"
              />
            </DialogPrimitive.Overlay>
            <DialogPrimitive.Content
              asChild
              forceMount
              onOpenAutoFocus={(event) => event.preventDefault()}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-[60] flex flex-col"
              >
                <DialogPrimitive.Title className="sr-only">
                  {currentImage.alt || "Image viewer"}
                </DialogPrimitive.Title>

                <div className="flex items-center justify-between p-6">
                  <p className="text-body-sm tabular-nums text-white/70">
                    {index + 1} / {images.length}
                  </p>
                  <DialogPrimitive.Close className="rounded-xs text-white/70 transition-colors duration-fast hover:text-white focus-visible:outline-none">
                    <X className="size-6" aria-hidden="true" />
                    <span className="sr-only">Close</span>
                  </DialogPrimitive.Close>
                </div>

                <div className="relative flex-1 px-6 pb-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentImage.src}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="relative size-full"
                    >
                      <Image
                        src={currentImage.src}
                        alt={currentImage.alt}
                        fill
                        sizes="100vw"
                        className="object-contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>

                  {images.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={goToPrevious}
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-fast hover:bg-white/20 focus-visible:outline-none"
                      >
                        <ChevronLeft className="size-5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={goToNext}
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white transition-colors duration-fast hover:bg-white/20 focus-visible:outline-none"
                      >
                        <ChevronRight className="size-5" aria-hidden="true" />
                      </button>
                    </>
                  )}
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
}
