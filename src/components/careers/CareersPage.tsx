"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import CTASection from "@/components/CTASection";
import PageHero from "@/components/PageHero";
import CareersCultureGallery from "@/components/careers/CareersCultureGallery";
import { IconSlot } from "@/components/media/AssetPlaceholder";
import { usePageReveal } from "@/hooks/usePageReveal";
import type { CareerRole } from "@/content/careers";
import { getCareerRoleHref } from "@/lib/careers";
import { careersCta, careersGallery, careersHero, careersOpenings } from "@/content/careers";

type CareersPageProps = {
  roles: CareerRole[];
};

export default function CareersPage({ roles }: CareersPageProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  usePageReveal({ scope: rootRef });

  return (
    <div ref={rootRef}>
      <PageHero
        headingId="careers-hero-heading"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        breadcrumbTone="accent"
        breadcrumbCurrentClassName="text-ink"
        titleClassName="text-display-xl mt-4 mb-0 text-balance"
        title={
          <>
            {careersHero.headlineBefore}{" "}
            <span className="text-red">{careersHero.headlineAccent}</span>{" "}
            {careersHero.headlineAfter}
          </>
        }
        body={careersHero.body}
        bodyClassName="text-body section-copy-on-light mt-5 mb-0 mx-auto max-w-[44rem] text-center sm:mt-6"
        media={null}
        showMediaRule={false}
        gridClassName="grid grid-cols-1"
        copyColumnClassName="relative z-[1] mx-auto flex max-w-5xl min-w-0 flex-col items-center text-center"
        burstSrc={careersHero.burst}
        burstClassName="hidden"
      />

      {/* ── Open Positions (mist) ──────────────────────── */}
      <section
        id="open-positions"
        data-animate-section
        className="section-shell section-pad bg-mist"
        aria-labelledby="openings-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            {careersOpenings.eyebrow}
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="openings-heading" className="text-display-md m-0">
              {careersOpenings.title}
            </h2>
          </div>

          {/* Mobile: stacked cards (no horizontal scroll) */}
          <ul
            data-animate-stagger
            className="section-media m-0 flex list-none flex-col gap-0 p-0 md:hidden"
          >
            {roles.map((role) => (
              <li key={role.slug} className="border-b border-line">
                <Link
                  href={role.href ?? getCareerRoleHref(role.slug)}
                  className="group flex min-h-14 items-center justify-between gap-4 py-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                >
                  <div className="min-w-0">
                    <p className="m-0 font-display text-base font-bold tracking-[0.03em] text-ink uppercase transition group-hover:text-red">
                      {role.title}
                    </p>
                    <p className="text-body-sm mt-1.5 mb-0 text-muted">
                      {role.location} · {role.type} · {role.experience}
                    </p>
                  </div>
                  <span
                    className="grid h-11 w-11 flex-none place-items-center rounded-full bg-ink text-white"
                    aria-hidden
                  >
                    <ArrowRight size={16} strokeWidth={2} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop/tablet: table */}
          <div
            data-animate="fade-up"
            role="region"
            aria-label="Open positions table"
            tabIndex={0}
            className="section-media hidden overflow-x-auto focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red md:block"
          >
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <caption className="sr-only">Open positions at First Economy</caption>
              <thead>
                <tr className="border-b border-line">
                  <th
                    scope="col"
                    className="pb-4 pr-4 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase"
                  >
                    Job Title
                  </th>
                  <th
                    scope="col"
                    className="pb-4 pr-4 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase"
                  >
                    Location
                  </th>
                  <th
                    scope="col"
                    className="hidden pb-4 pr-4 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase lg:table-cell"
                  >
                    Job Type
                  </th>
                  <th
                    scope="col"
                    className="hidden pb-4 pr-4 font-display text-xs font-bold tracking-[0.12em] text-muted uppercase lg:table-cell"
                  >
                    Experience
                  </th>
                  <th scope="col" className="w-14 pb-4">
                    <span className="sr-only">Apply</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role) => (
                  <tr key={role.slug} className="group border-b border-line">
                    <td className="py-5 pr-4 align-middle">
                      <Link
                        href={role.href ?? getCareerRoleHref(role.slug)}
                        className="rounded-sm font-display text-base font-bold tracking-[0.03em] text-ink uppercase transition hover:text-red focus-visible:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red lg:text-lg"
                      >
                        {role.title}
                      </Link>
                      <p className="text-body-sm mt-1 mb-0 text-muted lg:hidden">
                        {role.type} · {role.experience}
                      </p>
                    </td>
                    <td className="text-body-sm py-5 pr-4 align-middle text-muted">{role.location}</td>
                    <td className="text-body-sm hidden py-5 pr-4 align-middle text-muted lg:table-cell">
                      {role.type}
                    </td>
                    <td className="text-body-sm hidden py-5 pr-4 align-middle text-muted lg:table-cell">
                      {role.experience}
                    </td>
                    <td className="py-5 align-middle">
                      <Link
                        href={role.href ?? getCareerRoleHref(role.slug)}
                        tabIndex={-1}
                        aria-hidden
                        className="ml-auto grid h-11 w-11 place-items-center rounded-full bg-ink text-white transition group-hover:bg-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                      >
                        <ArrowRight size={16} strokeWidth={2} aria-hidden />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Life at First Economy (white) ─────────────── */}
      <section
        id="our-culture"
        data-animate-section
        className="section-shell section-pad bg-white"
        aria-labelledby="culture-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            {careersGallery.eyebrow}
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="culture-heading" className="text-display-md m-0">
              {careersGallery.title}
            </h2>
          </div>

          <div data-animate="fade-up" className="section-media">
            <CareersCultureGallery images={careersGallery.images} />
          </div>
        </div>
      </section>

      {/* ── Pre-footer CTA (ink) ───────────────────────── */}
      <CTASection
        animate
        headingId="careers-cta-heading"
        titleBefore={careersCta.titleBefore}
        titleAccent={careersCta.titleAccent}
        titleBreak
        primaryLabel={careersCta.button.label}
        primaryHref={careersCta.button.href}
        aside={
          <ul data-animate-stagger className="m-0 flex list-none flex-col gap-6 p-0 sm:gap-7">
            <li className="flex items-start gap-4">
              <IconSlot
                asset={careersCta.email.icon}
                tone="dark"
                size={64}
                className="h-12 w-12 flex-none sm:h-14 sm:w-14 md:h-16 md:w-16"
              />
              <div className="min-w-0 pt-1">
                <p className="text-body-sm m-0 text-muted-on-dark">{careersCta.email.label}</p>
                <a
                  href={careersCta.email.href}
                  className="text-body mt-0.5 flex min-h-11 items-center rounded-sm text-white transition hover:text-[#e84848] focus-visible:text-[#e84848] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {careersCta.email.value}
                </a>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <IconSlot
                asset={careersCta.culture.icon}
                tone="dark"
                size={64}
                className="h-12 w-12 flex-none sm:h-14 sm:w-14 md:h-16 md:w-16"
              />
              <div className="min-w-0 pt-1">
                <p className="text-body-sm m-0 text-muted-on-dark">{careersCta.culture.label}</p>
                <Link
                  href={careersCta.culture.href}
                  className="text-body mt-0.5 flex min-h-11 items-center rounded-sm text-white transition hover:text-[#e84848] focus-visible:text-[#e84848] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {careersCta.culture.value}
                </Link>
              </div>
            </li>
          </ul>
        }
      />
    </div>
  );
}
