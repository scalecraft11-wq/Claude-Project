"use client";

import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

interface CarouselContextValue {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  slideCount: number;
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);
  if (!context) {
    throw new Error("Carousel sub-components must be used within <Carousel>");
  }
  return context;
}

export interface CarouselProps {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  className?: string;
  children: React.ReactNode;
}

/**
 * Carousel — built on `embla-carousel-react` (battle-tested drag/snap
 * physics and touch handling rather than a hand-rolled implementation)
 * with the accessibility layer Embla doesn't provide out of the box:
 * `region`/`group` roles, a live region announcing the current slide, and
 * left/right arrow-key navigation (ANIMATION_BLUEPRINT.md §4).
 */
export function Carousel({
  opts,
  plugins,
  className,
  children,
}: CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(opts, plugins);
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [slideCount, setSlideCount] = React.useState(0);

  const onSelect = React.useCallback((emblaApi: NonNullable<CarouselApi>) => {
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  const scrollPrev = React.useCallback(() => api?.scrollPrev(), [api]);
  const scrollNext = React.useCallback(() => api?.scrollNext(), [api]);

  const handleKeyDownCapture = React.useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api) return;
    setSlideCount(api.scrollSnapList().length);
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
        selectedIndex,
        slideCount,
      }}
    >
      <div
        role="region"
        aria-roledescription="carousel"
        onKeyDownCapture={handleKeyDownCapture}
        className={cn("relative", className)}
      >
        {children}
        <p aria-live="polite" className="sr-only">
          Slide {selectedIndex + 1} of {slideCount}
        </p>
      </div>
    </CarouselContext.Provider>
  );
}

export function CarouselContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const { carouselRef } = useCarousel();
  return (
    <div ref={carouselRef} className="overflow-hidden">
      <div className={cn("-ml-4 flex", className)}>{children}</div>
    </div>
  );
}

export function CarouselItem({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      role="group"
      aria-roledescription="slide"
      className={cn("min-w-0 shrink-0 grow-0 basis-full pl-4", className)}
    >
      {children}
    </div>
  );
}

const controlBaseClassName = cn(
  "flex size-11 items-center justify-center rounded-full border border-hairline-subtle bg-surface shadow-elevation-2",
  "transition-opacity duration-fast hover:bg-surface-raised disabled:pointer-events-none disabled:opacity-40",
  "focus-visible:ring-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
);

export function CarouselPrevious({ className }: { className?: string }) {
  const { scrollPrev, canScrollPrev } = useCarousel();
  return (
    <button
      type="button"
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      aria-label="Previous slide"
      className={cn(controlBaseClassName, className)}
    >
      <ChevronLeft className="size-5" aria-hidden="true" />
    </button>
  );
}

export function CarouselNext({ className }: { className?: string }) {
  const { scrollNext, canScrollNext } = useCarousel();
  return (
    <button
      type="button"
      onClick={scrollNext}
      disabled={!canScrollNext}
      aria-label="Next slide"
      className={cn(controlBaseClassName, className)}
    >
      <ChevronRight className="size-5" aria-hidden="true" />
    </button>
  );
}
