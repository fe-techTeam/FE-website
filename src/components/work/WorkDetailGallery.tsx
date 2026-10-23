"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ArrowLeft, ArrowRight, Expand, ExternalLink, X } from "lucide-react";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import { ImageSlot } from "@/components/media/AssetPlaceholder";
import type { MediaSlot } from "@/content/about";

type WorkDetailGalleryProps = {
  items: MediaSlot[];
  title: string;
  density?: "default" | "solo";
};

export default function WorkDetailGallery({
  items,
  title,
  density = "default",
}: WorkDetailGalleryProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  const lightboxOpen = lightboxIndex !== null;
  const lightboxItem = lightboxIndex !== null ? items[lightboxIndex] : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  const openLightbox = useCallback((index: number) => {
    lastFocusRef.current = document.activeElement as HTMLElement | null;
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    requestAnimationFrame(() => lastFocusRef.current?.focus());
  }, []);

  const stepLightbox = useCallback(
    (dir: number) => {
      if (lightboxIndex === null || items.length === 0) return;
      const next = (lightboxIndex + dir + items.length) % items.length;
      setLightboxIndex(next);
    },
    [items.length, lightboxIndex],
  );

  useEffect(() => {
    if (!lightboxOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => closeBtnRef.current?.focus());

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeLightbox();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepLightbox(-1);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        stepLightbox(1);
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
      if (focusable.length === 0) return;

      const first = focusable[0]!;
      const last = focusable[focusable.length - 1]!;
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [closeLightbox, lightboxOpen, stepLightbox]);

  if (items.length === 0) return null;

  const frameClass =
    density === "solo"
      ? "h-[17rem] w-full border-0 bg-[#111] sm:h-[18.5rem] lg:h-[20rem]"
      : "aspect-[4/3] w-full border-0 bg-[#f3f3f3]";
  const frameSizes =
    density === "solo"
      ? "(max-width: 1024px) 100vw, 33vw"
      : "(max-width: 640px) 86vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw";

  const tile = (item: MediaSlot, i: number) => {
    const key = `${item.src ?? item.label}-${i}`;
    const label = item.alt || item.label || `creative ${i + 1}`;
    const media = (
      <ImageSlot
        asset={{ ...item, fit: item.fit ?? "contain" }}
        className={frameClass}
        sizes={frameSizes}
      />
    );

    if (item.href) {
      return (
        <div
          key={key}
          className="group relative m-0 min-w-0 w-full overflow-hidden border border-line bg-mist transition hover:border-red"
        >
          <button
            type="button"
            onClick={() => openLightbox(i)}
            data-no-btn-motion
            className="m-0 block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            aria-label={`Open ${label}`}
          >
            {media}
            <span
              className="pointer-events-none absolute right-3 bottom-3 grid size-9 place-items-center rounded-full border border-white/80 bg-ink/55 text-white backdrop-blur-[2px]"
              aria-hidden
            >
              <Expand size={15} strokeWidth={2.25} />
            </span>
          </button>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            data-no-btn-motion
            className="absolute left-3 bottom-3 z-10 inline-flex items-center gap-1.5 rounded-full border border-white/80 bg-ink/55 px-2.5 py-1.5 text-[0.6875rem] font-medium tracking-wide text-white backdrop-blur-[2px] hover:border-red hover:bg-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
            aria-label={`Open live link for ${label}`}
          >
            <ExternalLink size={12} strokeWidth={2.25} aria-hidden />
            Live
          </a>
        </div>
      );
    }

    return (
      <button
        key={key}
        type="button"
        onClick={() => openLightbox(i)}
        data-no-btn-motion
        className="group relative m-0 block min-w-0 w-full cursor-zoom-in overflow-hidden border border-line bg-mist p-0 text-left transition hover:border-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
        aria-label={`Open ${label}`}
      >
        {media}
        <span
          className="pointer-events-none absolute right-3 bottom-3 grid size-9 place-items-center rounded-full border border-white/80 bg-ink/55 text-white backdrop-blur-[2px]"
          aria-hidden
        >
          <Expand size={15} strokeWidth={2.25} />
        </span>
      </button>
    );
  };

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

            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby={titleId}
              className="relative z-[1] flex w-full max-w-[min(96vw,72rem)] flex-col gap-4"
            >
              <div className="flex items-center justify-between gap-4 text-white">
                <p id={titleId} className="text-body-sm m-0 min-w-0 truncate text-white/80">
                  {lightboxItem.alt || lightboxItem.label || `${title} creative`}
                  <span className="text-white/45">
                    {" "}
                    · {lightboxIndex! + 1} / {items.length}
                  </span>
                </p>
                <div className="flex flex-none items-center gap-2">
                  {lightboxItem.href ? (
                    <a
                      href={lightboxItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-no-btn-motion
                      className="tap-target inline-flex h-11 items-center gap-2 rounded-full border border-white/30 px-4 text-body-sm text-white transition hover:border-red hover:bg-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <ExternalLink size={15} aria-hidden />
                      Live link
                    </a>
                  ) : null}
                  <button
                    ref={closeBtnRef}
                    type="button"
                    aria-label="Close gallery viewer"
                    data-no-btn-motion
                    onClick={closeLightbox}
                    className="tap-target grid size-11 flex-none place-items-center rounded-full border border-white/30 text-white hover:border-red hover:bg-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <X size={20} aria-hidden />
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden border border-white/15 bg-ink">
                <div className="relative mx-auto aspect-[4/3] w-full max-h-[min(72vh,40rem)] sm:aspect-[16/10]">
                  {lightboxItem.src ? (
                    <Image
                      src={lightboxItem.src}
                      alt={lightboxItem.alt || lightboxItem.label || ""}
                      fill
                      sizes="96vw"
                      className="object-contain"
                      priority
                    />
                  ) : (
                    <div className="grid h-full place-items-center px-6 text-center text-white/60">
                      <span>{lightboxItem.label}</span>
                    </div>
                  )}
                </div>
              </div>

              {items.length > 1 ? (
                <div
                  className="flex items-center justify-center gap-3 sm:gap-4"
                  role="group"
                  aria-label="Lightbox slides"
                >
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
                    <span className="sr-only" aria-live="polite" aria-atomic="true">
                      Image {lightboxIndex! + 1} of {items.length}
                    </span>
                    {items.map((item, i) => (
                      <button
                        key={`${item.src ?? item.label}-lb-${i}`}
                        type="button"
                        aria-label={`View image ${i + 1} of ${items.length}`}
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
    <>
      <HorizontalCarousel
        itemCount={items.length}
        ariaLabel={`${title} creative gallery`}
        slidesGroupLabel="Gallery slides"
        liveRegion={(active, count) => `Showing slide ${active + 1} of ${count}`}
        getSlideLabel={(index) => `slide ${index + 1} of ${items.length}`}
        controls="light"
        trackClassName={
          density === "solo" ? "work-rail work-rail--solo w-full" : "work-rail w-full"
        }
        dotsClassName="mt-5 flex justify-center gap-1"
        prevLabel="Previous creative"
        nextLabel="Next creative"
      >
        {items.map((item, i) => tile(item, i))}
      </HorizontalCarousel>

      {lightbox}
    </>
  );
}
