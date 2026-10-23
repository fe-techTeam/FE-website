"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type CultureImage = { src: string; alt: string };

type CareersCultureGalleryProps = {
  images: CultureImage[];
};

function relativeOffset(index: number, active: number, total: number) {
  let delta = index - active;
  const half = Math.floor(total / 2);
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
}

/** Center-focused coverflow slider — click the center slide to open it full-size. */
export default function CareersCultureGallery({ images }: CareersCultureGalleryProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const readyRef = useRef(false);

  const [active, setActive] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const total = images.length;
  const lightboxOpen = lightboxIndex !== null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const goTo = useCallback(
    (next: number) => {
      if (total === 0) return;
      const wrapped = ((next % total) + total) % total;
      setActive(wrapped);
    },
    [total],
  );

  const step = useCallback((dir: number) => goTo(active + dir), [active, goTo]);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const stepLightbox = useCallback(
    (dir: number) => {
      if (lightboxIndex === null) return;
      const next = (lightboxIndex + dir + total) % total;
      setLightboxIndex(next);
    },
    [lightboxIndex, total],
  );

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-culture-slide]", stage);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const stepX = wide ? 58 : 70;
      const animate = readyRef.current && !reduce;
      readyRef.current = true;

      slides.forEach((slide, i) => {
        const offset = relativeOffset(i, active, total);
        const isCenter = offset === 0;
        const abs = Math.abs(offset);
        const vars = {
          xPercent: -50 + offset * stepX,
          yPercent: -50,
          scale: isCenter ? 1 : abs === 1 ? 0.78 : 0.6,
          autoAlpha: isCenter ? 1 : abs === 1 ? 0.55 : 0.2,
          zIndex: isCenter ? 20 : 10 - abs,
          rotateY: offset * -10,
          overwrite: "auto" as const,
        };

        if (animate) {
          gsap.to(slide, { ...vars, duration: 0.85, ease: "power3.inOut" });
        } else {
          gsap.set(slide, vars);
        }
      });
    },
    { scope: rootRef, dependencies: [active, total] },
  );

  function handleStageKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(active);
    }
  }

  useEffect(() => {
    if (!lightboxOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepLightbox(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepLightbox(1);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, lightboxOpen, stepLightbox]);

  if (total === 0) return null;

  const lightboxItem = lightboxIndex !== null ? images[lightboxIndex] : null;

  const lightbox =
    mounted && lightboxOpen && lightboxItem
      ? createPortal(
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 lg:p-10">
            <button
              type="button"
              className="absolute inset-0 bg-ink/85 backdrop-blur-[2px]"
              aria-label="Close gallery viewer"
              data-no-btn-motion
              onClick={closeLightbox}
            />
            <div className="relative z-[1] flex w-full max-w-[min(96vw,64rem)] flex-col gap-4">
              <div className="flex items-center justify-between gap-4 text-white">
                <p className="text-body-sm m-0 min-w-0 truncate text-white/80">
                  {lightboxItem.alt}
                  <span className="text-white/45"> · {lightboxIndex! + 1} / {total}</span>
                </p>
                <button
                  type="button"
                  aria-label="Close gallery viewer"
                  data-no-btn-motion
                  onClick={closeLightbox}
                  className="tap-target grid size-11 flex-none place-items-center rounded-full border border-white/30 text-white hover:border-red hover:bg-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <X size={20} aria-hidden />
                </button>
              </div>

              <div className="relative overflow-hidden border border-white/15 bg-ink">
                <div className="relative mx-auto aspect-[4/3] w-full max-h-[min(72vh,40rem)] sm:aspect-[16/10]">
                  <Image
                    src={lightboxItem.src}
                    alt={lightboxItem.alt}
                    fill
                    sizes="96vw"
                    className="object-contain"
                    priority
                  />
                </div>
              </div>

              {total > 1 ? (
                <div className="flex items-center justify-center gap-3 sm:gap-4" role="group" aria-label="Lightbox slides">
                  <button
                    type="button"
                    aria-label="Previous image"
                    data-no-btn-motion
                    onClick={() => stepLightbox(-1)}
                    className="tap-target grid size-11 flex-none place-items-center rounded-full border border-white/35 bg-ink/70 text-white backdrop-blur-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <ArrowLeft size={18} aria-hidden />
                  </button>
                  <div className="flex min-w-0 items-center justify-center gap-1">
                    {images.map((img, i) => (
                      <button
                        key={`${img.src}-lb-${i}`}
                        type="button"
                        aria-label={`View image ${i + 1} of ${total}`}
                        aria-current={i === lightboxIndex ? "true" : undefined}
                        data-no-btn-motion
                        onClick={() => setLightboxIndex(i)}
                        className="tap-target-sm grid place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                      >
                        <span
                          className={`block h-1.5 rounded-full transition ${
                            i === lightboxIndex ? "w-6 bg-red" : "w-1.5 bg-white/35"
                          }`}
                          aria-hidden
                        />
                      </button>
                    ))}
                  </div>
                  <button
                    type="button"
                    aria-label="Next image"
                    data-no-btn-motion
                    onClick={() => stepLightbox(1)}
                    className="tap-target grid size-11 flex-none place-items-center rounded-full border border-white/35 bg-ink/70 text-white backdrop-blur-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <ArrowRight size={18} aria-hidden />
                  </button>
                </div>
              ) : null}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <div ref={rootRef} className="w-full overflow-x-clip">
      <div
        ref={stageRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Life at First Economy gallery"
        tabIndex={0}
        onKeyDown={handleStageKeyDown}
        className="relative [perspective:1400px]"
      >
        <div className="relative mx-auto h-[min(62vw,17rem)] w-full max-w-5xl overflow-visible xs:h-[min(54vw,20rem)] sm:h-[min(44vw,25rem)] lg:h-[28rem]">
          {images.map((img, i) => {
            const offset = relativeOffset(i, active, total);
            const isCenter = offset === 0;

            return (
              <div
                key={img.src}
                data-culture-slide
                className="absolute top-1/2 left-1/2 w-[min(92%,32rem)] origin-center will-change-transform sm:w-[min(80%,36rem)] lg:w-[min(72%,40rem)]"
                style={{ transformStyle: "preserve-3d" }}
              >
                <button
                  type="button"
                  data-no-btn-motion
                  onClick={() => (isCenter ? openLightbox(i) : goTo(i))}
                  aria-label={isCenter ? `Open ${img.alt}` : `Show ${img.alt}`}
                  className={`group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border bg-mist p-0 transition duration-500 sm:aspect-[16/10] ${
                    isCenter
                      ? "cursor-zoom-in border-red/45 shadow-[0_28px_64px_rgba(0,0,0,0.18)]"
                      : "cursor-pointer border-line/80 shadow-[0_14px_36px_rgba(0,0,0,0.1)]"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="(max-width: 1024px) 80vw, 40rem"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  {isCenter ? (
                    <span
                      className="pointer-events-none absolute right-3 bottom-3 grid size-9 place-items-center rounded-full border border-white/80 bg-ink/55 text-white backdrop-blur-[2px]"
                      aria-hidden
                    >
                      <Expand size={15} strokeWidth={2.25} />
                    </span>
                  ) : null}
                </button>
              </div>
            );
          })}
        </div>

        {total > 1 ? (
          <div className="mt-8 flex items-center justify-center gap-3 sm:mt-10 sm:gap-4">
            <button
              type="button"
              data-no-btn-motion
              aria-label="Previous image"
              onClick={() => step(-1)}
              className="tap-target grid size-11 flex-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:size-12"
            >
              <ArrowLeft size={18} aria-hidden />
            </button>
            <span className="sr-only" aria-live="polite" aria-atomic="true">
              Showing image {active + 1} of {total}
            </span>
            <button
              type="button"
              data-no-btn-motion
              aria-label="Next image"
              onClick={() => step(1)}
              className="tap-target grid size-11 flex-none place-items-center rounded-full border border-line bg-white text-ink shadow-sm hover:border-red hover:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:size-12"
            >
              <ArrowRight size={18} aria-hidden />
            </button>
          </div>
        ) : null}
      </div>

      {lightbox}
    </div>
  );
}
