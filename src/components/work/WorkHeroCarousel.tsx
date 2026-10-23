"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { MediaSlot } from "@/content/about";
import type { CaseStudy } from "@/content/types";
import { workCardImage } from "@/content/workPage";

type WorkHeroCarouselProps = {
  caseStudies: CaseStudy[];
  className?: string;
  sizes?: string;
  interval?: number;
  priority?: boolean;
};

type Slide = { slug: string; asset: MediaSlot & { src: string } };

/** Matches the CSS transition duration below — keep in sync. */
const TRANSITION_MS = 900;

/** Cycles through case-study thumbnails with a crossfade, filling the hero media slot. */
export default function WorkHeroCarousel({
  caseStudies,
  className = "",
  sizes = "100vw",
  interval = 1600,
  priority = false,
}: WorkHeroCarouselProps) {
  const slides: Slide[] = caseStudies
    .map((caseStudy) => ({ slug: caseStudy.slug, asset: workCardImage(caseStudy) }))
    .filter((slide): slide is Slide => Boolean(slide.asset.src));

  const [index, setIndex] = useState(0);
  const [outgoingIndex, setOutgoingIndex] = useState<number | null>(null);
  const outgoingTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((current) => {
        setOutgoingIndex(current);
        window.clearTimeout(outgoingTimer.current);
        outgoingTimer.current = window.setTimeout(() => setOutgoingIndex(null), TRANSITION_MS);
        return (current + 1) % slides.length;
      });
    }, interval);
    return () => {
      window.clearInterval(timer);
      window.clearTimeout(outgoingTimer.current);
    };
  }, [interval, slides.length]);

  if (slides.length === 0) return null;

  const current = slides[index % slides.length]!;
  const outgoing = outgoingIndex !== null ? (slides[outgoingIndex % slides.length] ?? null) : null;

  function renderSlide(slide: Slide, mode: "in" | "out") {
    const fit = slide.asset.fit === "contain" ? "object-contain" : "object-cover";
    const grayscale = slide.asset.grayscale ?? false;
    return (
      <div
        key={`${slide.slug}-${mode}`}
        className={`absolute inset-0 ${mode === "in" ? "work-hero-carousel__slide-in" : "work-hero-carousel__slide-out"}`}
      >
        <Image
          src={slide.asset.src}
          alt={slide.asset.alt}
          fill
          sizes={sizes}
          priority={priority && index === 0}
          className={`${fit} ${grayscale ? "grayscale" : ""}`.trim()}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden bg-mist ${className}`.trim()}>
      {outgoing ? renderSlide(outgoing, "out") : null}
      {renderSlide(current, "in")}
    </div>
  );
}
