"use client";

import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, MapPin } from "lucide-react";
import PageHero from "@/components/PageHero";
import CTASection from "@/components/CTASection";
import GrowthCta from "@/components/GrowthCta";
import { ImageSlot } from "@/components/media/AssetPlaceholder";
import TeamCarousel from "@/components/about/TeamCarousel";
import FeaturedAwardHighlight from "@/components/about/FeaturedAwardHighlight";
import ValuesSlider from "@/components/about/ValuesSlider";
import FaqSection from "@/components/FaqSection";
import { FAQS_ENABLED } from "@/content/features";
import { aboutFaqs } from "@/content/siteFaqs";
import PartnerLogos from "@/components/home/PartnerLogos";
import { usePageReveal } from "@/hooks/usePageReveal";
import {
  aboutHero,
  aboutLocations,
  aboutValues,
  aboutWhatWeDo,
  aboutFeaturedAchievement,
  aboutCta,
} from "@/content/about";

export default function AboutPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  usePageReveal({
    scope: rootRef,
    onReveal: ({ gsap }) => {
      const storyWrap = gsap.utils.toArray<HTMLElement>(".about-timeline-wrap")[0];
      const storyTimeline = storyWrap?.querySelector<HTMLElement>("[data-story-timeline]");
      if (!storyWrap || !storyTimeline) return;

      const line = storyWrap.querySelector<HTMLElement>("[data-timeline-line]");
      const icons = storyTimeline.querySelectorAll("[data-timeline-icon]");
      const copies = storyTimeline.querySelectorAll("[data-timeline-copy]");
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;

      if (line) {
        gsap.set(line, isDesktop ? { scaleX: 0 } : { scaleY: 0 });
      }
      gsap.set(icons, { scale: 0.55, autoAlpha: 0 });
      gsap.set(copies, { y: 18, autoAlpha: 0 });

      const storyTl = gsap.timeline({
        scrollTrigger: {
          trigger: storyWrap,
          start: "top 78%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power3.out" },
      });

      if (line) {
        storyTl.to(line, {
          ...(isDesktop ? { scaleX: 1 } : { scaleY: 1 }),
          duration: 0.9,
          ease: "power2.inOut",
        });
      }

      icons.forEach((icon, i) => {
        const at = line ? (i === 0 ? "-=0.35" : "-=0.45") : i === 0 ? 0 : "-=0.45";
        storyTl.to(
          icon,
          {
            scale: 1,
            autoAlpha: 1,
            duration: 0.45,
            ease: "back.out(1.6)",
          },
          at,
        );
        storyTl.to(
          copies[i],
          {
            y: 0,
            autoAlpha: 1,
            duration: 0.5,
          },
          "-=0.28",
        );
      });
    },
  });

  return (
    <div ref={rootRef}>
      <PageHero
        headingId="about-hero-heading"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About Us" }]}
        breadcrumbSeparator=">"
        breadcrumbCurrentClassName="text-ink"
        eyebrow={aboutHero.eyebrow}
        title={
          <>
            {aboutHero.headlineBefore}{" "}
            <span className="text-red">{aboutHero.headlineAccent}</span>
            <span
              className="ml-[0.12em] inline-block h-[0.22em] w-[0.22em] translate-y-[-0.08em] bg-red align-middle"
              aria-hidden
            />
          </>
        }
        body={aboutHero.body}
        bodyClassName="text-body section-copy-on-light mt-5 mb-0 mx-auto max-w-[44rem] text-center sm:mt-6"
        media={null}
        showMediaRule={false}
        gridClassName="grid grid-cols-1"
        copyColumnClassName="relative z-[1] mx-auto flex max-w-5xl min-w-0 flex-col items-center text-center"
        burstSrc={aboutHero.burst}
        burstClassName="hidden"
      />

      <section
        id="what-we-do"
        data-animate-section
        className="section-shell section-pad bg-mist"
        aria-labelledby="what-we-do-heading"
      >
        <div className="section-inner grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.2fr)] lg:items-stretch lg:gap-12">
          <div className="min-w-0">
            <p data-animate="fade-up" className="text-eyebrow m-0">
              {aboutWhatWeDo.eyebrow}
            </p>
            <h2 data-animate="fade-up" id="what-we-do-heading" className="text-display-md mt-4 mb-0">
              {aboutWhatWeDo.titleBefore} <span className="text-red">{aboutWhatWeDo.titleAccent}</span>
            </h2>
            <p
              data-animate="fade-up"
              className="text-body section-copy section-copy-on-light mt-5 mb-0 max-w-[28rem]"
            >
              {aboutWhatWeDo.body}
            </p>
            <div data-animate="fade-up">
              <GrowthCta href={aboutWhatWeDo.cta.href} variant="primary" className="mt-7 sm:mt-8">
                {aboutWhatWeDo.cta.label}
              </GrowthCta>
            </div>
          </div>

          <div data-animate="fade-up" className="min-w-0">
            <ImageSlot
              asset={aboutWhatWeDo.image}
              className="aspect-[4/3] w-full lg:aspect-auto lg:h-full lg:min-h-[320px]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section
        id="team"
        data-animate-section
        className="section-shell section-pad scroll-mt-[5.5rem] bg-ink text-white"
        aria-labelledby="team-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow text-eyebrow-on-dark m-0">
            Our Core Team
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="team-heading" className="text-display-md m-0">
              Leadership that builds <span className="text-red">what&rsquo;s next.</span>
            </h2>
          </div>
          <div className="section-media">
            <TeamCarousel />
          </div>
        </div>
      </section>

      <section
        data-animate-section
        className="section-shell section-pad bg-mist"
        aria-labelledby="values-heading"
      >
        <div className="section-inner">
          <h2 data-animate="fade-up" id="values-heading" className="text-display-md m-0 text-center">
            Our Values
          </h2>

          <div data-animate="fade-up">
            <ValuesSlider values={aboutValues} />
          </div>
        </div>
      </section>

      <section
        id="awards"
        data-animate-section
        className="section-shell section-pad scroll-mt-[5.5rem] bg-paper"
        aria-labelledby="awards-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            Awards &amp; Recognition
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="awards-heading" className="text-display-md m-0">
              A few of our many <span className="text-red">achievements.</span>
            </h2>
            <div data-animate="fade-up" className="min-w-0 pt-0 md:pt-1 md:justify-self-end md:self-end">
              <Link href={aboutFeaturedAchievement.sectionCta.href} className="text-cta link-cta text-ink">
                {aboutFeaturedAchievement.sectionCta.label}
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>

          <div data-animate="fade-up" className="section-media">
            <FeaturedAwardHighlight />
          </div>
        </div>
      </section>

      <PartnerLogos sectionId="trusted-by" layout="grid" />

      <section
        id="locations"
        data-animate-section
        className="section-shell section-pad scroll-mt-[5.5rem] bg-mist"
        aria-labelledby="about-locations-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            Our Locations
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="about-locations-heading" className="text-display-md m-0">
              Where we <span className="text-red">operate.</span>
            </h2>
          </div>
          <ul
            data-animate-stagger
            className="mt-8 grid list-none grid-cols-1 gap-3 p-0 xs:grid-cols-2 lg:grid-cols-4"
          >
            {aboutLocations.map((office) => (
              <li key={office.slug} className="min-w-0">
                <Link
                  href="/contact#offices"
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-ink focus-visible:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                >
                  <div className="flex flex-1 items-start gap-3 px-3.5 py-3.5 sm:gap-3.5 sm:px-4 sm:py-4 lg:px-5 lg:py-[18px]">
                    <span
                      className="grid h-9 w-9 flex-none place-items-center rounded-full border border-red bg-white text-red sm:h-10 sm:w-10"
                      aria-hidden
                    >
                      <MapPin size={16} fill="currentColor" strokeWidth={0} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="m-0 flex min-w-0 flex-wrap items-baseline gap-x-1.5 gap-y-0.5 font-display text-sm leading-[1.1] font-bold tracking-[0.04em] uppercase sm:text-[15px]">
                          <span className="min-w-0">{office.city}</span>
                          {office.isHq ? (
                            <span className="shrink-0 text-xs tracking-[0.1em] text-red">HQ</span>
                          ) : null}
                        </p>
                        <span
                          className="grid h-9 w-9 flex-none place-items-center rounded-full border border-line text-ink transition-[border-color,color,background-color] duration-200 group-hover:border-red group-hover:bg-red group-hover:text-white sm:h-10 sm:w-10"
                          aria-hidden
                        >
                          <ArrowRight size={14} />
                        </span>
                      </div>
                      <p className="text-body-sm mt-1.5 mb-0 leading-snug text-muted">
                        {office.address}
                      </p>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {FAQS_ENABLED ? <FaqSection idPrefix="about" titleBefore="About First Economy" items={aboutFaqs} /> : null}

      <CTASection
        animate
        headingId="about-cta-heading"
        titleBreak
        titleBefore={aboutCta.titleBefore}
        titleAccent={aboutCta.titleAccent}
        primaryLabel={aboutCta.button.label}
        primaryHref={aboutCta.button.href}
      />
    </div>
  );
}
