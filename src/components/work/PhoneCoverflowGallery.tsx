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
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { MOBILE_SCREEN_INSET } from "@/content/deviceShowcases";

gsap.registerPlugin(useGSAP);

type PhoneCoverflowImage = { src: string; alt: string; width: number; height: number };

type PhoneCoverflowGalleryProps = {
  images: PhoneCoverflowImage[];
  title: string;
};

function relativeOffset(index: number, active: number, total: number) {
  let delta = index - active;
  const half = Math.floor(total / 2);
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
}

/** Center-locked phone mockup with flanking images passing behind it — click a side card to bring it into the phone. */
export default function PhoneCoverflowGallery({ images, title }: PhoneCoverflowGalleryProps) {
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
      setActive(((next % total) + total) % total);
    },
    [total],
  );

  const step = useCallback((dir: number) => goTo(active + dir), [active, goTo]);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const stepLightbox = useCallback(
    (dir: number) => {
      if (lightboxIndex === null) return;
      setLightboxIndex((lightboxIndex + dir + total) % total);
    },
    [lightboxIndex, total],
  );

  useGSAP(
    () => {
      const stage = stageRef.current;
      if (!stage) return;

      const slides = gsap.utils.toArray<HTMLElement>("[data-phone-slide]", stage);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const wide = window.matchMedia("(min-width: 1024px)").matches;
      const stepX = wide ? 62 : 74;
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

  const activeImage = images[active]!;
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
        aria-label={`${title} gallery`}
        tabIndex={0}
        onKeyDown={handleStageKeyDown}
        className="relative [perspective:1400px]"
      >
        <div className="relative mx-auto h-[min(122vw,27rem)] w-full max-w-xl xs:h-[min(108vw,29rem)] sm:h-[30rem] lg:h-[32rem]">
          {images.map((img, i) => {
            if (i === active) return null;
            return (
              <div
                key={img.src}
                data-phone-slide
                data-index={i}
                className="absolute top-1/2 left-1/2 w-[8.5rem] origin-center will-change-transform xs:w-[9.5rem] sm:w-[10.5rem] lg:w-[11.5rem]"
              >
                <button
                  type="button"
                  data-no-btn-motion
                  onClick={() => goTo(i)}
                  aria-label={`Show ${img.alt}`}
                  className="group relative block aspect-[9/16] w-full cursor-pointer overflow-hidden rounded-[1.75rem] border border-line/80 bg-mist p-0 shadow-[0_14px_36px_rgba(0,0,0,0.14)] transition"
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="10rem"
                    className="object-cover transition duration-500 group-hover:scale-[1.04]"
                  />
                </button>
              </div>
            );
          })}

          <div className="absolute top-1/2 left-1/2 z-30 w-[14rem] -translate-x-1/2 -translate-y-1/2 xs:w-[15.5rem] sm:w-[17rem] lg:w-[18.5rem]">
            <button
              type="button"
              data-no-btn-motion
              onClick={() => openLightbox(active)}
              aria-label={`Open ${activeImage.alt}`}
              className="relative block w-full cursor-zoom-in p-0"
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
                className="absolute z-10 flex flex-col overflow-hidden bg-ink"
                style={{
                  top: `${MOBILE_SCREEN_INSET.top}%`,
                  left: `${MOBILE_SCREEN_INSET.left}%`,
                  right: `${MOBILE_SCREEN_INSET.right}%`,
                  bottom: `${MOBILE_SCREEN_INSET.bottom}%`,
                  borderRadius: "9.12% / 4.48%",
                }}
              >
                <div className="relative h-[60%] w-full shrink-0 overflow-hidden">
                  <Image
                    key={activeImage.src}
                    src={activeImage.src}
                    alt={activeImage.alt}
                    fill
                    sizes="16rem"
                    className="work-hero-carousel__slide-in object-cover"
                  />
                </div>
                <div className="h-[40%] w-full shrink-0 bg-ink" />
              </div>
            </button>
          </div>
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
