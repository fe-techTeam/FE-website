"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ImageSlot } from "@/components/media/AssetPlaceholder";
import type { CaseStudyVideo } from "@/content/types";

gsap.registerPlugin(useGSAP);

type WorkDetailVideoSliderProps = {
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

export default function WorkDetailVideoSlider({
  videos,
  campaign,
  fallbackPoster,
}: WorkDetailVideoSliderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const readyRef = useRef(false);

  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);

  const total = videos.length;
  const activeClip = videos[active];
  const isCarousel = total > 1;

  const pauseAll = useCallback(() => {
    videoRefs.current.forEach((el) => el?.pause());
    setPlaying(false);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      if (wrapped === active) return;
      pauseAll();
      setActive(wrapped);
    },
    [active, pauseAll, total],
  );

  const step = useCallback(
    (dir: number) => {
      goTo(active + dir);
    },
    [active, goTo],
  );

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage || !isCarousel) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-video-slide]", stage);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const stepX = wide ? 56 : 68;
      const animate = readyRef.current && !reduce;
      readyRef.current = true;

      slides.forEach((slide, i) => {
        const offset = relativeOffset(i, active, total);
        const isCenter = offset === 0;
        const abs = Math.abs(offset);
        const vars = {
          xPercent: -50 + offset * stepX,
          yPercent: -50,
          scale: isCenter ? 1 : abs === 1 ? 0.76 : 0.62,
          autoAlpha: isCenter ? 1 : abs === 1 ? 0.48 : 0.16,
          zIndex: isCenter ? 20 : 10 - abs,
          rotateY: offset * -12,
          overwrite: "auto" as const,
        };

        if (animate) {
          gsap.to(slide, { ...vars, duration: 0.85, ease: "power3.inOut" });
        } else {
          gsap.set(slide, vars);
        }
      });
    },
    { scope: rootRef, dependencies: [active, total, isCarousel] },
  );

  useEffect(() => pauseAll, [pauseAll]);

  function handleStageKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!isCarousel) return;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "Home") {
      event.preventDefault();
      goTo(0);
    } else if (event.key === "End") {
      event.preventDefault();
      goTo(total - 1);
    }
  }

  function togglePlay(index: number) {
    const el = videoRefs.current[index];
    if (!el) return;

    if (index !== active) {
      goTo(index);
      return;
    }

    if (el.paused) {
      videoRefs.current.forEach((other, i) => {
        if (other && i !== index) other.pause();
      });
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }

  if (total === 0 || !activeClip) return null;

  return (
    <div ref={rootRef} className="w-full">
      <div
        ref={stageRef}
        role="region"
        aria-roledescription={isCarousel ? "carousel" : undefined}
        aria-label={`${campaign} films`}
        tabIndex={isCarousel ? 0 : undefined}
        onKeyDown={handleStageKeyDown}
        className={`relative ${isCarousel ? "[perspective:1400px]" : ""}`}
      >
        <div
          className={
            isCarousel
              ? "relative mx-auto h-[min(52vw,15.5rem)] w-full max-w-5xl overflow-visible xs:h-[min(46vw,19rem)] sm:h-[min(40vw,24rem)] lg:h-[26rem]"
              : "relative mx-auto w-full max-w-4xl"
          }
        >
          {videos.map((clip, i) => {
            const offset = relativeOffset(i, active, total);
            const isCenter = !isCarousel || offset === 0;
            const poster = clip.poster ?? fallbackPoster;
            const isMp4 = Boolean(clip.src?.endsWith(".mp4"));

            return (
              <div
                key={clip.src ?? clip.title}
                data-video-slide
                className={
                  isCarousel
                    ? "absolute top-1/2 left-1/2 w-[min(92%,34rem)] origin-center will-change-transform sm:w-[min(86%,38rem)] lg:w-[min(82%,44rem)]"
                    : "relative w-full"
                }
                style={isCarousel ? { transformStyle: "preserve-3d" } : undefined}
              >
                <div
                  className={`relative overflow-hidden border bg-ink transition-[border-color,box-shadow] duration-500 ${
                    isCenter
                      ? "border-red/45 shadow-[0_28px_64px_rgba(0,0,0,0.3)]"
                      : "border-line/80 shadow-[0_14px_36px_rgba(0,0,0,0.18)]"
                  }`}
                >
                  {isMp4 && clip.src ? (
                    <>
                      <div className="relative aspect-video w-full bg-ink">
                        <video
                          ref={(el) => {
                            videoRefs.current[i] = el;
                          }}
                          className="absolute inset-0 h-full w-full object-contain"
                          playsInline
                          preload={isCenter ? "metadata" : "none"}
                          poster={poster}
                          controls={isCenter && playing}
                          onPlay={() => {
                            if (i === active) setPlaying(true);
                          }}
                          onPause={() => {
                            if (i === active) setPlaying(false);
                          }}
                          onEnded={() => {
                            if (i === active) setPlaying(false);
                          }}
                          aria-label={clip.title}
                        >
                          <source src={clip.src} type="video/mp4" />
                        </video>
                      </div>

                      {!(isCenter && playing) ? (
                        <button
                          type="button"
                          data-no-btn-motion
                          onClick={() => togglePlay(i)}
                          className="absolute inset-0 flex items-center justify-center bg-ink/25 transition hover:bg-ink/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-red"
                          aria-label={
                            isCenter ? `Play ${clip.title}` : `Show and play ${clip.title}`
                          }
                        >
                          <span className="grid size-14 place-items-center rounded-full bg-red text-white shadow-[0_10px_28px_rgba(210,37,37,0.4)] sm:size-16 lg:size-[4.5rem]">
                            <Play
                              size={28}
                              fill="currentColor"
                              className="translate-x-0.5 sm:size-8"
                              aria-hidden
                            />
                          </span>
                        </button>
                      ) : null}
                    </>
                  ) : clip.src ? (
                    <a
                      href={clip.src}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="relative block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                      aria-label={`Watch ${clip.title} (opens in a new tab)`}
                      onClick={(event) => {
                        if (!isCenter && isCarousel) {
                          event.preventDefault();
                          goTo(i);
                        }
                      }}
                    >
                      <ImageSlot
                        asset={{
                          src: poster ?? "",
                          alt: `${clip.title} — ${campaign}`,
                          label: clip.title,
                          grayscale: false,
                          fit: "contain",
                        }}
                        className="aspect-video w-full border-0 bg-ink"
                        sizes="(max-width: 1024px) 90vw, 44rem"
                      />
                      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/20">
                        <span className="grid size-14 place-items-center rounded-full bg-red text-white sm:size-16 lg:size-[4.5rem]">
                          <Play
                            size={28}
                            fill="currentColor"
                            className="translate-x-0.5"
                            aria-hidden
                          />
                        </span>
                      </div>
                    </a>
                  ) : poster ? (
                    <ImageSlot
                      asset={{
                        src: poster,
                        alt: `${clip.title} — ${campaign}`,
                        label: clip.title,
                        grayscale: false,
                        fit: "contain",
                      }}
                      className="aspect-video w-full border-0 bg-ink"
                      sizes="(max-width: 1024px) 90vw, 44rem"
                    />
                  ) : null}
                </div>

                {isCarousel && !isCenter ? (
                  <button
                    type="button"
                    data-no-btn-motion
                    className="absolute inset-0 z-10 cursor-pointer bg-transparent"
                    aria-label={`Show ${clip.title}`}
                    onClick={() => goTo(i)}
                  />
                ) : null}
              </div>
            );
          })}
        </div>

        {isCarousel ? (
          <div
            className="mt-8 flex items-center justify-center gap-3 sm:mt-10 sm:gap-4"
            role="group"
            aria-label="Film slides"
          >
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
