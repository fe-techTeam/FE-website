"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import CapabilitiesWorkCarousel from "@/components/capabilities/CapabilitiesWorkCarousel";
import AdvantageToolsGrid from "@/components/home/AdvantageToolsGrid";
import { LogoMarkGrid } from "@/components/home/PartnerLogos";
import AiServicesStack from "@/components/home/AiServicesStack";
import { usePageReveal } from "@/hooks/usePageReveal";
import {
  advantageToolsSection,
  capabilityCaseStudies,
  ecosystemSection,
  platformPartnerLogos,
  techCaseStudiesSection,
} from "@/content/capabilities";
import {
  servicesCta,
  servicesGrid,
  servicesHero,
} from "@/content/servicesPage";
import { dataTools } from "@/content/site";

export default function ServicesPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  usePageReveal({ scope: rootRef });

  return (
    <div ref={rootRef}>
      <PageHero
        headingId="services-hero-heading"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        breadcrumbCurrentClassName="font-semibold text-ink"
        titleClassName="text-display-xl mt-0 mb-0 text-balance"
        title={
          <>
            {servicesHero.headlineBefore}{" "}
            <span className="text-red">{servicesHero.headlineAccent}</span>{" "}
            {servicesHero.headlineAfter}
          </>
        }
        body={servicesHero.body}
        bodyClassName="text-body section-copy-on-light mt-5 mb-0 mx-auto max-w-[44rem] text-center sm:mt-6"
        media={null}
        showMediaRule={false}
        gridClassName="grid grid-cols-1"
        copyColumnClassName="relative z-[1] mx-auto flex max-w-5xl min-w-0 flex-col items-center text-center"
        burstSrc={servicesHero.burst}
        burstClassName="hidden"
      />

      {/* ── Our Services (mist) ────────────────────────── */}
      <section
        id="our-services"
        data-animate-section
        className="section-shell section-pad bg-mist scroll-mt-[5.5rem]"
        aria-labelledby="services-grid-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            {servicesGrid.eyebrow}
          </p>
          <div className="section-intro">
            <h2
              data-animate="fade-up"
              id="services-grid-heading"
              className="text-display-md m-0"
            >
              {servicesGrid.titleBefore}{" "}
              <br className="hidden sm:block" />
              {servicesGrid.titleAfter}
            </h2>
          </div>

          <div className="section-media">
            <AiServicesStack />
          </div>
        </div>
      </section>

      {/* ── Advantage tools (paper) ──────────────────────── */}
      <section
        id="advantage"
        data-animate-section
        className="section-shell section-pad scroll-mt-[5.5rem] bg-paper"
        aria-labelledby="advantage-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            {advantageToolsSection.eyebrow}
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="advantage-heading" className="text-display-md m-0">
              {advantageToolsSection.titleBefore}{" "}
              <span className="text-red">{advantageToolsSection.titleAccent}</span>
            </h2>
          </div>

          <div data-animate="fade-up" className="section-media">
            <AdvantageToolsGrid tools={dataTools} />
          </div>
        </div>
      </section>

      {/* ── Platform partners (paper) ────────────────────── */}
      <section
        id="ecosystem"
        data-animate-section
        className="section-shell section-pad scroll-mt-[5.5rem] bg-paper"
        aria-labelledby="ecosystem-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            {ecosystemSection.eyebrow}
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="ecosystem-heading" className="text-display-md m-0">
              {ecosystemSection.titleBefore}{" "}
              <span className="text-red">{ecosystemSection.titleAccent}</span>
            </h2>
          </div>

          <div data-animate="fade-up" className="section-media" aria-label="Platform partner logos">
            <LogoMarkGrid logos={platformPartnerLogos} />
          </div>
        </div>
      </section>

      {/* ── Case studies (mist) ──────────────────────────── */}
      <section
        id="tech-case-studies"
        data-animate-section
        className="section-shell section-pad scroll-mt-[5.5rem] bg-mist"
        aria-labelledby="tech-case-studies-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            {techCaseStudiesSection.eyebrow}
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="tech-case-studies-heading" className="text-display-md m-0">
              {techCaseStudiesSection.titleBefore}{" "}
              <span className="text-red">{techCaseStudiesSection.titleAccent}</span>
            </h2>
            <div data-animate="fade-up" className="min-w-0 pt-0 md:pt-1 md:justify-self-end md:self-end">
              <Link href={techCaseStudiesSection.exploreHref} className="text-cta link-cta mt-0 text-ink">
                {techCaseStudiesSection.exploreLabel}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>

          <div data-animate="fade-up" className="section-media">
            <CapabilitiesWorkCarousel cases={capabilityCaseStudies} />
          </div>
        </div>
      </section>

      {/* ── Pre-footer CTA (ink) ───────────────────────── */}
      <CTASection
        animate
        headingId="services-cta-heading"
        titleBreak
        titleBefore={servicesCta.titleBefore}
        titleAccent={servicesCta.titleAccent}
        primaryLabel={servicesCta.button.label}
        primaryHref={servicesCta.button.href}
      />
    </div>
  );
}
