"use client";

import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type Value = { title: string; body: string };

/** Text-only, one-at-a-time values slider — auto-advances with manual prev/next and dot navigation. */
export default function ValuesSlider({ values }: { values: Value[] }) {
  const [active, setActive] = useState(0);
  const total = values.length;

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      setActive(((next % total) + total) % total);
    },
    [total],
  );

  const step = useCallback((dir: number) => goTo(active + dir), [active, goTo]);

  useEffect(() => {
    if (total <= 1) return;
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [total]);

  if (total === 0) return null;

  return (
    <div className="mt-8 md:mt-10">
      {/* Every slide stays in the DOM (crawlable, announced via the live region); only the active one is visible. */}
      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Our values"
        className="relative grid min-h-[11rem] text-center sm:min-h-[9rem]"
      >
        {values.map((value, i) => (
          <div
            key={value.title}
            aria-hidden={i !== active}
            className={`col-start-1 row-start-1 ${i === active ? "work-hero-carousel__slide-in" : "invisible"}`}
          >
            <h3 className="font-display text-2xl tracking-[0.04em] text-red uppercase sm:text-3xl">
              {value.title}
            </h3>
            <p className="text-body section-copy-on-light mx-auto mt-4 mb-0 max-w-3xl">
              {value.body}
            </p>
          </div>
        ))}
      </div>

      {total > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10 sm:gap-4">
          <button
            type="button"
            data-no-btn-motion
            aria-label="Previous value"
            onClick={() => step(-1)}
            className="tap-target grid size-11 flex-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:size-12"
          >
            <ArrowLeft size={18} aria-hidden />
          </button>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            Showing value {active + 1} of {total}
          </span>
          <button
            type="button"
            data-no-btn-motion
            aria-label="Next value"
            onClick={() => step(1)}
            className="tap-target grid size-11 flex-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm transition hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:size-12"
          >
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
