"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRightCircle } from "lucide-react";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import AwardsGalleryGrid from "@/components/awards/AwardsGalleryGrid";
import FeaturedAwardHighlight from "@/components/about/FeaturedAwardHighlight";
import { ImageSlot } from "@/components/media/AssetPlaceholder";
import { usePageReveal } from "@/hooks/usePageReveal";
import {
  awardsCta,
  awardsGallerySection,
  awardsHero,
} from "@/content/awards";

export default function AwardsPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  usePageReveal({ scope: rootRef });

  return (
    <div ref={rootRef}>
      <PageHero
        headingId="awards-hero-heading"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About", href: "/about" },
          { label: "Awards & Recognition" },
        ]}
        breadcrumbTone="accent"
        breadcrumbCurrentClassName="text-ink"
        eyebrow={awardsHero.eyebrow}
        title={
          <>
            {awardsHero.headlineBefore}{" "}
            <span className="text-red">{awardsHero.headlineAccent}</span>
            <span
              className="ml-[0.12em] inline-block h-[0.22em] w-[0.22em] translate-y-[-0.08em] bg-red align-middle"
              aria-hidden
            />
          </>
        }
        body={awardsHero.body}
        copyAfterBody={
          <Link
            href="#awards-featured"
            data-animate="hero-copy"
            className="text-cta link-cta mt-6 inline-flex min-h-11 items-center gap-2 text-ink lg:hidden"
          >
            View featured award
            <ArrowRightCircle size={18} strokeWidth={1.5} aria-hidden />
          </Link>
        }
        gridClassName="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10 xl:gap-12"
        copyColumnClassName="relative z-[1] min-w-0 lg:pr-12 xl:pr-20"
        media={
          <ImageSlot
            asset={awardsHero.image}
            priority
            className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[380px] xl:min-h-[420px]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        }
        burstSrc={awardsHero.burst}
        seam={{
          href: "#awards-featured",
          ariaLabel: "Continue to featured award",
          arrowSrc: awardsHero.arrow,
        }}
      />

      <section
        id="awards-featured"
        data-animate-section
        className="section-shell section-pad scroll-mt-24 bg-paper"
        aria-labelledby="awards-featured-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            Featured achievement
          </p>
          <h2 data-animate="fade-up" id="awards-featured-heading" className="sr-only">
            Guinness World Record with Godrej Properties
          </h2>
          <div data-animate="fade-up" className="section-media mt-6 sm:mt-8">
            <FeaturedAwardHighlight />
          </div>
        </div>
      </section>

      <section
        id="awards-gallery"
        data-animate-section
        className="section-shell section-pad scroll-mt-24 bg-mist"
        aria-labelledby="awards-gallery-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            {awardsGallerySection.eyebrow}
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="awards-gallery-heading" className="text-display-md m-0">
              {awardsGallerySection.title}
            </h2>
          </div>

          <div className="section-media">
            <AwardsGalleryGrid headingId="awards-gallery-heading" />
          </div>
        </div>
      </section>

      <CTASection
        animate
        headingId="awards-cta-heading"
        titleBefore={awardsCta.titleBefore}
        titleAccent={awardsCta.titleAccent}
        titleBreak
        primaryLabel={awardsCta.button.label}
        primaryHref={awardsCta.button.href}
        burstSrc={awardsCta.burst}
      />
    </div>
  );
}
