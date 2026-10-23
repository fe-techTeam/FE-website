"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Image from "next/image";
import { MOBILE_SCREEN_INSET } from "@/content/deviceShowcases";
import type { CaseStudyVideo } from "@/content/types";

gsap.registerPlugin(useGSAP);

type WorkDetailVideoMockupSliderProps = {
  videos: CaseStudyVideo[];
  campaign: string;
  fallbackPoster?: string;
};

function relativeOffset(index: number, active: number, total: number) {
  let delta = index - active;
  const half = Math.floor(total / 2);
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
}

/** Center-locked phone mockup carousel for portrait case-study films — flanking posters pass behind a live-playing video. */
export default function WorkDetailVideoMockupSlider({
  videos,
  campaign,
  fallbackPoster,
}: WorkDetailVideoMockupSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const readyRef = useRef(false);

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  const total = videos.length;
  const activeClip = videos[active];

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      if (wrapped === active) return;
      videoRef.current?.pause();
      setPlaying(false);
      setActive(wrapped);
    },
    [active, total],
  );

  const step = useCallback((dir: number) => goTo(active + dir), [active, goTo]);

  const dragRef = useRef<{ startX: number; startY: number; startTime: number } | null>(null);

  const handlePointerDown = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    dragRef.current = { startX: event.clientX, startY: event.clientY, startTime: Date.now() };
  }, []);

  const handlePointerUp = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      const drag = dragRef.current;
      dragRef.current = null;
      if (!drag) return;

      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      const elapsed = Date.now() - drag.startTime;
      const isHorizontalFlick =
        Math.abs(dx) > Math.abs(dy) && (Math.abs(dx) > 32 || (Math.abs(dx) > 12 && elapsed < 220));

      if (isHorizontalFlick) step(dx < 0 ? 1 : -1);
    },
    [step],
  );

  const togglePlay = useCallback(() => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-mockup-slide]", stage);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const stepX = wide ? 135 : 140;
      const animate = readyRef.current && !reduce;
      readyRef.current = true;

      slides.forEach((slide) => {
        const i = Number(slide.dataset.index);
        const offset = relativeOffset(i, active, total);
        const abs = Math.abs(offset);
        const vars = {
          xPercent: -50 + offset * stepX,
          yPercent: -50,
          scale: abs === 1 ? 0.86 : 0.7,
          autoAlpha: abs === 1 ? 0.85 : 0.35,
          zIndex: 10 - abs,
          overwrite: "auto" as const,
        };

        if (animate) {
          gsap.to(slide, { ...vars, duration: 0.5, ease: "power3.out" });
        } else {
          gsap.set(slide, vars);
        }
      });
    },
    { scope: rootRef, dependencies: [active, total] },
  );

  useEffect(() => {
    return () => {
      videoRef.current?.pause();
    };
  }, []);

  function handleStageKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      togglePlay();
    }
  }

  if (total === 0 || !activeClip) return null;

  const activePoster = activeClip.poster ?? fallbackPoster;

  return (
    <div ref={rootRef} className="w-full overflow-x-clip">
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label={`${campaign} films`}
        tabIndex={0}
        onKeyDown={handleStageKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          dragRef.current = null;
        }}
        className="relative touch-pan-y [perspective:1400px]"
      >
        <div className="relative mx-auto h-[min(122vw,27rem)] w-full max-w-xl xs:h-[min(108vw,29rem)] sm:h-[30rem] lg:h-[32rem]">
          {videos.map((clip, i) => {
            if (i === active) return null;
            const poster = clip.poster ?? fallbackPoster;
            return (
              <div
                key={clip.src ?? clip.title}
                data-mockup-slide
                data-index={i}
                className="absolute top-1/2 left-1/2 w-[8.5rem] origin-center will-change-transform xs:w-[9.5rem] sm:w-[10.5rem] lg:w-[11.5rem]"
              >
                <button
                  type="button"
                  data-no-btn-motion
                  onClick={() => goTo(i)}
                  aria-label={`Show ${clip.title}`}
                  className="group relative block aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-[1.75rem] border border-line/80 bg-mist p-0 shadow-[0_14px_36px_rgba(0,0,0,0.14)] transition"
                >
                  {poster ? (
                    <Image
                      src={poster}
                      alt={clip.title}
                      fill
                      sizes="10rem"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                  ) : null}
                </button>
              </div>
            );
          })}

          <div className="absolute top-1/2 left-1/2 z-30 w-[14rem] -translate-x-1/2 -translate-y-1/2 xs:w-[15.5rem] sm:w-[17rem] lg:w-[18.5rem]">
            <button
              type="button"
              data-no-btn-motion
              onClick={togglePlay}
              aria-label={playing ? `Pause ${activeClip.title}` : `Play ${activeClip.title}`}
              className="relative block w-full cursor-pointer p-0"
            >
              <Image
                src="/images/work/mobile-mockup.png"
                alt=""
                aria-hidden
                width={941}
                height={1672}
                priority
                className="pointer-events-none relative z-0 block h-auto w-full select-none"
                sizes="16rem"
              />
              <div
                className="absolute z-10 overflow-hidden bg-ink"
                style={{
                  top: `${MOBILE_SCREEN_INSET.top}%`,
                  left: `${MOBILE_SCREEN_INSET.left}%`,
                  right: `${MOBILE_SCREEN_INSET.right}%`,
                  bottom: `${MOBILE_SCREEN_INSET.bottom}%`,
                  borderRadius: "9.12% / 4.48%",
                }}
              >
                {activeClip.src ? (
                  <video
                    key={activeClip.src}
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    playsInline
                    preload="metadata"
                    poster={activePoster}
                    controls={playing}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                    aria-label={activeClip.title}
                  >
                    <source src={activeClip.src} type="video/mp4" />
                  </video>
                ) : activePoster ? (
                  <Image
                    src={activePoster}
                    alt={activeClip.title}
                    fill
                    sizes="16rem"
                    className="object-cover"
                  />
                ) : null}

                {!playing ? (
                  <span
                    className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/20"
                    aria-hidden
                  >
                    <span className="grid size-14 place-items-center rounded-full bg-red text-white shadow-[0_10px_28px_rgba(210,37,37,0.4)] sm:size-16">
                      <Play size={24} fill="currentColor" className="translate-x-0.5" aria-hidden />
                    </span>
                  </span>
                ) : null}
              </div>
            </button>
          </div>
        </div>

        {total > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <button
              type="button"
              data-no-btn-motion
              aria-label="Previous film"
              onClick={() => step(-1)}
              className="tap-target grid size-11 flex-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:size-12"
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              Showing film {active + 1} of {total}: {activeClip.title}
            </span>
            <button
              type="button"
              data-no-btn-motion
              aria-label="Next film"
              onClick={() => step(1)}
              className="tap-target grid size-11 flex-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:size-12"
            >
              <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
