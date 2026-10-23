"use client";

import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";

type UseHorizontalCarouselOptions = {
  itemCount: number;
};

export function useHorizontalCarousel({ itemCount }: UseHorizontalCarouselOptions) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;

    const overflow = el.scrollWidth - el.clientWidth > 2;
    setCanScroll(overflow);

    if (!overflow) {
      setActive(0);
      setAtStart(true);
      setAtEnd(true);
      return;
    }

    const card = el.firstElementChild as HTMLElement | null;
    const styles = window.getComputedStyle(el);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "20") || 20;
    const step = card ? card.offsetWidth + gap : el.clientWidth;
    setActive(Math.round(el.scrollLeft / step));
    setAtStart(el.scrollLeft <= 2);
    setAtEnd(el.scrollLeft >= el.scrollWidth - el.clientWidth - 2);
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    syncScrollState();

    const observer = new ResizeObserver(syncScrollState);
    observer.observe(el);
    window.addEventListener("resize", syncScrollState);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncScrollState);
    };
  }, [itemCount, syncScrollState]);

  const scrollByDir = useCallback(
    (dir: number) => {
      const el = trackRef.current;
      if (!el || !canScroll) return;

      const card = el.firstElementChild as HTMLElement | null;
      if (!card) return;

      const styles = window.getComputedStyle(el);
      const gap = Number.parseFloat(styles.columnGap || styles.gap || "20") || 20;
      const step = card.offsetWidth + gap;
      const max = el.scrollWidth - el.clientWidth;
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      el.scrollTo({
        left: Math.max(0, Math.min(max, el.scrollLeft + dir * step)),
        behavior: reducedMotion ? "auto" : "smooth",
      });
    },
    [canScroll],
  );

  const scrollToIndex = useCallback(
    (index: number) => {
      const el = trackRef.current;
      if (!el || !canScroll) return;

      const card = el.children[index] as HTMLElement | undefined;
      if (!card) return;

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({ left: card.offsetLeft, behavior: reducedMotion ? "auto" : "smooth" });
    },
    [canScroll],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (!canScroll) return;

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollByDir(-1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollByDir(1);
      }
    },
    [canScroll, scrollByDir],
  );

  return {
    trackRef,
    active,
    canScroll,
    atStart,
    atEnd,
    syncScrollState,
    scrollByDir,
    scrollToIndex,
    handleKeyDown,
  };
}
