"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type YouTubeVideoSliderProps = {
  videoIds: string[];
  title: string;
};

/** Horizontal scroll-snap carousel of YouTube embeds — one card per view on mobile, two on larger screens. */
export default function YouTubeVideoSlider({ videoIds, title }: YouTubeVideoSliderProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  const total = videoIds.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;

    const updateActive = () => {
      raf = 0;
      const trackRect = track.getBoundingClientRect();
      const viewportCenter = trackRect.left + trackRect.width / 2;

      let closestIndex = 0;
      let closestDistance = Infinity;
      slideRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - viewportCenter);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = i;
        }
      });

      activeRef.current = closestIndex;
      setActive(closestIndex);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateActive);
    };

    updateActive();
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      track.removeEventListener("scroll", onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [total]);

  const goTo = useCallback(
    (index: number) => {
      const wrapped = ((index % total) + total) % total;
      slideRefs.current[wrapped]?.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [total],
  );

  if (total === 0) return null;

  return (
    <div className="w-full">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-8 [&::-webkit-scrollbar]:hidden"
        role="region"
        aria-label={`${title} videos`}
      >
        {videoIds.map((videoId, i) => (
          <div
            key={videoId}
            ref={(el) => {
              slideRefs.current[i] = el;
            }}
            className="relative aspect-video w-[88%] shrink-0 snap-center overflow-hidden rounded-2xl bg-ink sm:w-[calc(50%-1rem)]"
          >
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title={`${title} — video ${i + 1}`}
              className="absolute inset-0 h-full w-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {total > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-3 sm:mt-8 sm:gap-4">
          <button
            type="button"
            data-no-btn-motion
            aria-label="Previous video"
            onClick={() => goTo(activeRef.current - 1)}
            className="tap-target grid size-11 flex-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:size-12"
          >
            <ArrowLeft size={18} aria-hidden />
          </button>
          <span className="sr-only" aria-live="polite" aria-atomic="true">
            Showing video {active + 1} of {total}
          </span>
          <button
            type="button"
            data-no-btn-motion
            aria-label="Next video"
            onClick={() => goTo(activeRef.current + 1)}
            className="tap-target grid size-11 flex-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:size-12"
          >
            <ArrowRight size={18} aria-hidden />
          </button>
        </div>
      ) : null}
    </div>
  );
}
