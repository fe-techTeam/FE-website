"use client";

import { useRef } from "react";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import WorkCaseBrowser from "@/components/work/WorkCaseBrowser";
import WorkHeroCarousel from "@/components/work/WorkHeroCarousel";
import { usePageReveal } from "@/hooks/usePageReveal";
import { caseStudies } from "@/content/caseStudies";
import { workCta, workHero } from "@/content/workPage";

export default function WorkPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  usePageReveal({ scope: rootRef });

  return (
    <div ref={rootRef}>
      <PageHero
        headingId="work-hero-heading"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Work" }]}
        breadcrumbCurrentClassName="font-semibold text-red"
        titleClassName="text-display-xl mt-0 mb-0 text-balance"
        title={
          <>
            {workHero.headlineBefore}{" "}
            <span className="text-red">{workHero.headlineAccent}</span>
          </>
        }
        body={workHero.body}
        media={
          <WorkHeroCarousel
            caseStudies={caseStudies}
            priority
            className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[420px]"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        }
        burstSrc={workHero.burst}
        seam={{
          href: "#case-studies",
          ariaLabel: "Continue to case studies",
          arrowSrc: workHero.arrow,
        }}
      />

      {/* ── Case studies (paper) ──────────────────────── */}
      <section
        id="case-studies"
        data-animate-section
        className="section-shell section-pad bg-mist scroll-mt-[5.5rem]"
        aria-labelledby="work-cases-heading"
      >
        <h2 id="work-cases-heading" className="sr-only">
          Case studies
        </h2>
        <div className="section-inner">
          <WorkCaseBrowser caseStudies={caseStudies} />
        </div>
      </section>

      {/* ── Pre-footer CTA ────────────────────────────── */}
      <CTASection
        animate
        titleBreak
        headingId="work-cta-heading"
        titleBefore={workCta.titleBefore}
        titleAccent={workCta.titleAccent}
        primaryLabel={workCta.button.label}
        primaryHref={workCta.button.href}
      />
    </div>
  );
}
