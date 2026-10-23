"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { useHorizontalCarousel } from "@/hooks/useHorizontalCarousel";

type CarouselControls = "dark" | "light" | "dark-inset";

type HorizontalCarouselProps = {
  children: ReactNode;
  itemCount: number;
  ariaLabel: string;
  slidesGroupLabel?: string;
  getSlideLabel?: (index: number) => string;
  liveRegion?: (active: number, itemCount: number) => string;
  controls?: CarouselControls;
  /** Upper places arrows on the card image (dark and light controls) */
  arrowPosition?: "center" | "upper";
  dotsClassName?: string;
  arrowIconSize?: number;
  trackClassName?: string;
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
  /** Auto-advance interval in ms; omit or 0 to disable. Pauses on hover/focus and respects reduced motion. */
  autoPlayInterval?: number;
  showDots?: boolean;
};

const controlStyles = {
  dark: {
    arrow:
      "tap-target absolute z-10 grid size-11 place-items-center rounded-full border border-white/40 bg-ink/80 text-white backdrop-blur-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:pointer-events-none disabled:opacity-40",
    arrowLeft: "top-[34%] left-2 -translate-y-1/2 sm:top-[36%] sm:left-3",
    arrowRight: "top-[34%] right-2 -translate-y-1/2 sm:top-[36%] sm:right-3",
    dotFocus: "focus-visible:outline-white",
    dotButton: "tap-target-sm grid place-items-center rounded-full",
    dotActive: "w-6 bg-red",
    dotInactive: "w-1.5 bg-white/35 hover:bg-white/60",
    dotSpan: "block h-1.5 rounded-full transition",
  },
  "dark-inset": {
    arrow:
      "tap-target absolute top-[42%] z-10 grid -translate-y-1/2 place-items-center rounded-full border border-white/55 bg-ink/70 text-white shadow-lg backdrop-blur-sm hover:border-red hover:text-red disabled:pointer-events-none disabled:opacity-40",
    arrowLeft: "left-2 sm:left-3",
    arrowRight: "right-2 sm:right-3",
    dotFocus: "",
    dotButton: "tap-target grid place-items-center rounded-full",
    dotActive: "bg-red",
    dotInactive: "border border-[#8a8a8a] bg-transparent hover:border-white",
    dotSpan: "block h-2.5 w-2.5 rounded-full transition",
  },
  light: {
    arrow:
      "tap-target absolute z-10 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-white text-ink shadow-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red disabled:pointer-events-none disabled:opacity-40",
    arrowLeft: "top-1/2 left-2 sm:left-3",
    arrowRight: "top-1/2 right-2 sm:right-3",
    // Card carousels: sit on the card image, not on the text below it.
    arrowLeftUpper: "top-[30%] left-2 sm:left-3",
    arrowRightUpper: "top-[30%] right-2 sm:right-3",
    dotFocus: "focus-visible:outline-red",
    dotButton: "tap-target-sm grid place-items-center rounded-full",
    dotActive: "w-6 bg-red",
    dotInactive: "w-1.5 bg-line hover:bg-muted",
    dotSpan: "block h-1.5 rounded-full transition",
  },
} as const;

function arrowClassName(controls: CarouselControls, arrowPosition: "center" | "upper", side: "left" | "right") {
  const styles = controlStyles[controls];

  if (controls === "dark-inset") {
    return `${styles.arrow} ${side === "left" ? styles.arrowLeft : styles.arrowRight}`;
  }

  if (controls === "light") {
    const upper = arrowPosition === "upper";
    const left = upper ? controlStyles.light.arrowLeftUpper : styles.arrowLeft;
    const right = upper ? controlStyles.light.arrowRightUpper : styles.arrowRight;
    return `${styles.arrow} ${side === "left" ? left : right}`;
  }

  if (arrowPosition === "upper") {
    return `${styles.arrow} ${side === "left" ? styles.arrowLeft : styles.arrowRight}`;
  }

  const centerSide =
    side === "left"
      ? "left-2 top-1/2 -translate-y-1/2 sm:left-3"
      : "right-2 top-1/2 -translate-y-1/2 sm:right-3";
  return `${styles.arrow} ${centerSide}`;
}

export default function HorizontalCarousel({
  children,
  itemCount,
  ariaLabel,
  slidesGroupLabel = "Slides",
  getSlideLabel,
  liveRegion,
  controls = "light",
  arrowPosition = "center",
  dotsClassName = "mt-6 flex items-center justify-center gap-1 sm:mt-7",
  arrowIconSize = 18,
  trackClassName = "work-rail w-full",
  prevLabel = "Previous slide",
  nextLabel = "Next slide",
  className = "relative",
  autoPlayInterval,
  showDots = true,
}: HorizontalCarouselProps) {
  const {
    trackRef,
    active,
    canScroll,
    atStart,
    atEnd,
    syncScrollState,
    scrollByDir,
    scrollToIndex,
    handleKeyDown,
  } = useHorizontalCarousel({ itemCount });

  const [autoPlayPaused, setAutoPlayPaused] = useState(false);
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (!autoPlayInterval || !canScroll || autoPlayPaused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setInterval(() => {
      const next = activeRef.current + 1;
      if (next >= itemCount) {
        scrollToIndex(0);
      } else {
        scrollByDir(1);
      }
    }, autoPlayInterval);

    return () => window.clearInterval(timer);
  }, [autoPlayInterval, canScroll, autoPlayPaused, itemCount, scrollByDir, scrollToIndex]);

  const styles = controlStyles[controls];
  const currentSlideLabel = getSlideLabel?.(active);
  const liveMessage =
    liveRegion?.(active, itemCount) ??
    (currentSlideLabel ? `Showing ${currentSlideLabel}` : undefined);

  return (
    <div className={className}>
      <div
        ref={trackRef}
        onScroll={syncScrollState}
        className={trackClassName}
        role="region"
        aria-roledescription={canScroll ? "carousel" : undefined}
        aria-label={ariaLabel}
        tabIndex={canScroll ? 0 : undefined}
        onKeyDown={canScroll ? handleKeyDown : undefined}
        onPointerEnter={autoPlayInterval ? () => setAutoPlayPaused(true) : undefined}
        onPointerLeave={autoPlayInterval ? () => setAutoPlayPaused(false) : undefined}
        onFocus={autoPlayInterval ? () => setAutoPlayPaused(true) : undefined}
        onBlur={autoPlayInterval ? () => setAutoPlayPaused(false) : undefined}
      >
        {children}
      </div>

      {canScroll ? (
        <>
          <button
            type="button"
            aria-label={prevLabel}
            aria-disabled={atStart}
            disabled={atStart}
            data-no-btn-motion
            onClick={() => scrollByDir(-1)}
            className={arrowClassName(controls, arrowPosition, "left")}
          >
            <ArrowLeft size={arrowIconSize} aria-hidden />
          </button>
          <button
            type="button"
            aria-label={nextLabel}
            aria-disabled={atEnd}
            disabled={atEnd}
            data-no-btn-motion
            onClick={() => scrollByDir(1)}
            className={arrowClassName(controls, arrowPosition, "right")}
          >
            <ArrowRight size={arrowIconSize} aria-hidden />
          </button>

          {showDots ? (
            <div className={dotsClassName} role="group" aria-label={slidesGroupLabel}>
              {liveMessage ? (
                <span className="sr-only" aria-live="polite" aria-atomic={Boolean(liveRegion)}>
                  {liveMessage}
                </span>
              ) : null}
              {Array.from({ length: itemCount }, (_, index) => {
                const label = getSlideLabel?.(index) ?? `Slide ${index + 1}`;
                const dotFocusClass = styles.dotFocus
                  ? `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${styles.dotFocus}`
                  : "";

                return (
                  <button
                    key={label + index}
                    type="button"
                    aria-label={`Go to ${label}`}
                    aria-current={index === active ? "true" : undefined}
                    data-no-btn-motion
                    onClick={() => scrollToIndex(index)}
                    className={`${styles.dotButton} ${dotFocusClass}`.trim()}
                  >
                    <span
                      className={`${styles.dotSpan} ${
                        index === active ? styles.dotActive : styles.dotInactive
                      }`}
                      aria-hidden
                    />
                  </button>
                );
              })}
            </div>
          ) : liveMessage ? (
            <span className="sr-only" aria-live="polite" aria-atomic={Boolean(liveRegion)}>
              {liveMessage}
            </span>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
