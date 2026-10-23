"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AiServicesStack from "@/components/home/AiServicesStack";
import FeaturedWorkCarousel from "@/components/home/FeaturedWorkCarousel";
import PartnerLogos from "@/components/home/PartnerLogos";
import LocationsSection from "@/components/home/LocationsSection";
import CareersTeaser from "@/components/home/CareersTeaser";
import GrowthNetworkVisual from "@/components/home/GrowthNetworkVisual";
import CTASection from "@/components/CTASection";
import FaqSection from "@/components/FaqSection";
import GrowthCta from "@/components/GrowthCta";
import {
  ActiveClientsIcon,
  CitiesIcon,
  MindsIcon,
  YearsIcon,
} from "@/components/brandIcons";
import { FAQS_ENABLED } from "@/content/features";
import { homeFaqs } from "@/content/siteFaqs";
import { homeOfficeStats } from "@/content/stats";
import { homeCta } from "@/content/home";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const heroStatIcons = {
  Cities: CitiesIcon,
  Specialists: MindsIcon,
  Years: YearsIcon,
  "Active Clients": ActiveClientsIcon,
} as const;

const heroStats = homeOfficeStats.map((stat) => ({
  ...stat,
  Icon: heroStatIcons[stat.label as keyof typeof heroStatIcons],
}));

export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          canAnimate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            gsap.set("[data-animate], [data-animate-stagger] > *, [data-animate='hero-line']", {
              clearProps: "all",
              autoAlpha: 1,
              y: 0,
              scale: 1,
            });
            gsap.set(".growth-hero__line-inner", { y: 0 });
            return;
          }

          gsap.set(".growth-hero__line-inner", { y: "110%" });
          gsap.set(
            "[data-animate='hero-eyebrow'], [data-animate='hero-ctas'], [data-animate='hero-visual'], [data-animate='scroll-hint']",
            { autoAlpha: 0, y: 0 },
          );

          const heroTl = gsap.timeline({ defaults: { ease: "power4.out" } });
          heroTl
            .to("[data-animate='hero-eyebrow']", {
              autoAlpha: 1,
              duration: 0.55,
            })
            .to(
              ".growth-hero__line-inner",
              {
                y: "0%",
                duration: 0.85,
                stagger: 0.08,
              },
              "-=0.25",
            )
            .to(
              "[data-animate='hero-ctas']",
              {
                autoAlpha: 1,
                duration: 0.55,
              },
              "-=0.35",
            )
            .to(
              "[data-animate='hero-visual']",
              {
                autoAlpha: 1,
                duration: 0.5,
              },
              0.25,
            )
            .to(
              "[data-animate='scroll-hint']",
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
              },
              "-=0.2",
            );

          gsap.fromTo(
            ".growth-hero__visual",
            { y: 15 },
            {
              y: -15,
              ease: "none",
              scrollTrigger: {
                trigger: ".growth-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          gsap.fromTo(
            ".growth-hero__copy",
            { y: 5 },
            {
              y: -5,
              ease: "none",
              scrollTrigger: {
                trigger: ".growth-hero",
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            },
          );

          const statsSection = gsap.utils.toArray<HTMLElement>("[data-stats-section]")[0];
          const counters = gsap.utils.toArray<HTMLElement>("[data-counter]");

          const formatCounter = (el: HTMLElement, val: number) => {
            const decimals = Number(el.dataset.decimals ?? 0);
            const prefix = el.dataset.prefix ?? "";
            const suffix = el.dataset.suffix ?? "";
            const display =
              decimals > 0 ? val.toFixed(decimals) : String(Math.round(val));
            el.textContent = `${prefix}${display}${suffix}`;
          };

          const runCounters = () => {
            counters.forEach((el, index) => {
              const target = Number(el.dataset.target ?? 0);
              const state = ((el as HTMLElement & { __count?: { val: number } }).__count ??= {
                val: 0,
              });
              gsap.killTweensOf(state);
              state.val = 0;
              formatCounter(el, 0);
              gsap.to(state, {
                val: target,
                duration: 1.8,
                delay: index * 0.08,
                ease: "power2.out",
                onUpdate: () => formatCounter(el, state.val),
              });
            });
          };

          if (statsSection && counters.length) {
            ScrollTrigger.create({
              trigger: statsSection,
              start: "top 78%",
              onEnter: runCounters,
              onEnterBack: runCounters,
            });
          }

          gsap.utils.toArray<HTMLElement>("[data-animate-section]").forEach((section) => {
            const intro = section.querySelectorAll("[data-animate='fade-up']");
            const staggerRoot = section.querySelector("[data-animate-stagger]");
            const staggerItems = staggerRoot
              ? staggerRoot.querySelectorAll(":scope > *")
              : section.querySelectorAll("[data-animate='stagger-item']");

            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: section,
                start: "top 78%",
                toggleActions: "play none none none",
              },
              defaults: { ease: "power3.out" },
            });

            if (intro.length) {
              tl.from(intro, {
                y: 32,
                autoAlpha: 0,
                duration: 0.75,
                stagger: 0.1,
              });
            }

            if (staggerItems.length) {
              tl.from(
                staggerItems,
                {
                  y: 24,
                  autoAlpha: 0,
                  duration: 0.55,
                  stagger: 0.06,
                },
                intro.length ? "-=0.35" : 0,
              );
            }
          });
        },
      );

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef}>
      <section
        className="growth-hero section-shell pt-3 pb-3 sm:pt-4 sm:pb-4 lg:pt-4 lg:pb-5"
        aria-labelledby="hero-heading"
      >
        <div className="growth-hero__bg" aria-hidden="true">
          <span className="growth-hero__bg-grid" />
          <span className="growth-hero__bg-dots growth-hero__bg-dots--a" />
          <span className="growth-hero__bg-dots growth-hero__bg-dots--b" />
          <span className="growth-hero__bg-guide growth-hero__bg-guide--1" />
          <span className="growth-hero__bg-guide growth-hero__bg-guide--2" />
          <span className="growth-hero__bg-glow growth-hero__bg-glow--engine" />
          <span className="growth-hero__bg-glow growth-hero__bg-glow--floor" />
          <span className="growth-hero__bg-grain" />
        </div>
        <div className="growth-hero__grid">
          <div className="growth-hero__copy">
            <p data-animate="hero-eyebrow" className="growth-hero__eyebrow" aria-hidden="true">
              <span>360° Media</span>
              <span className="growth-hero__eyebrow-mark" />
              <span>Technology</span>
              <span className="growth-hero__eyebrow-mark" />
              <span>Strategy</span>
              <span className="growth-hero__eyebrow-mark" />
              <span>Creativity</span>
            </p>

            <h1 id="hero-heading" className="growth-hero__title">
              <span className="growth-hero__line">
                <span
                  data-animate="hero-line"
                  className="growth-hero__line-inner growth-hero__line-inner--flow"
                >
                  We don&rsquo;t just connect the dots.
                </span>
              </span>
              <span className="growth-hero__line growth-hero__line--accent">
                <span
                  data-animate="hero-line"
                  className="growth-hero__line-inner growth-hero__line-inner--flow"
                >
                  We make them count.
                </span>
              </span>
            </h1>

            <div data-animate="hero-ctas" className="growth-hero__ctas">
              <GrowthCta href="/work" variant="primary">
                Explore our work
              </GrowthCta>
              <GrowthCta href="/services" variant="accent">
                Explore our services
              </GrowthCta>
            </div>

          </div>

          <div data-animate="hero-visual" className="growth-hero__visual">
            <GrowthNetworkVisual />
          </div>
        </div>

        <div
          data-animate="scroll-hint"
          className="growth-hero__scroll"
          aria-hidden="true"
        >
          <Image
            src="/images/brand/ui-scroll.png"
            alt=""
            width={40}
            height={52}
            className="animate-scroll-hint block h-8 w-auto sm:h-10 lg:h-11"
          />
        </div>
      </section>

      <section
        data-animate-section
        data-stats-section
        className="section-shell section-pad-sm bg-ink text-white"
        aria-label="Company scale"
      >
        <div className="section-inner">
          <div
            data-animate-stagger
            className="mx-auto grid w-full max-w-2xl grid-cols-2 gap-4 xs:max-w-3xl xs:gap-6 lg:max-w-6xl lg:grid-cols-4 lg:gap-6"
          >
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="stat-item"
              >
                <div
                  className="mb-3.5 flex h-10 w-10 items-center justify-center border border-white/30 text-white sm:mb-4 sm:h-12 sm:w-12 md:h-14 md:w-14"
                  aria-hidden
                >
                  <stat.Icon className="h-5 w-5 sm:h-7 sm:w-7 md:h-8 md:w-8" />
                </div>
                <p className="text-stat m-0">
                  <span
                    data-counter
                    data-target={stat.value}
                    data-prefix={stat.prefix ?? ""}
                    data-suffix={stat.suffix}
                    data-decimals={stat.decimals ?? 0}
                    aria-label={`${stat.prefix ?? ""}${stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value}${stat.suffix}${stat.showPlus ? "+" : ""} ${stat.label}`}
                  >
                    {stat.prefix ?? ""}
                    {stat.decimals ? stat.value.toFixed(stat.decimals) : stat.value}
                    {stat.suffix}
                  </span>
                  {stat.showPlus && (
                    <span className="text-red" aria-hidden>
                      +
                    </span>
                  )}
                </p>
                <p className="mt-2 text-xs font-bold tracking-[0.14em] uppercase sm:mt-2.5 sm:text-sm">
                  {stat.label}
                  {stat.footnoteMarker ? "*" : ""}
                </p>
                <p className="text-body-sm mt-2.5 mb-0 max-w-[22rem] text-muted-on-dark sm:mt-3">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="services"
        data-animate-section
        className="section-shell section-pad bg-paper"
        aria-labelledby="services-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow m-0">
            AI-powered growth solutions
          </p>
          <div className="section-intro">
            <div data-animate="fade-up" className="min-w-0">
              <h2 id="services-heading" className="text-display-md m-0">
                AI is not an add-on.
                <br />
                It&rsquo;s how we build.
              </h2>
              <p className="text-body section-copy section-copy-on-light mt-4 mb-0">
                We weave AI into strategy, creativity, media and technology to help brands think
                bigger, move faster and grow smarter.
              </p>
            </div>
            <div data-animate="fade-up" className="min-w-0 pt-0 md:pt-1 md:justify-self-end md:self-end">
              <Link href="/services" className="text-cta link-cta text-ink">
                Explore all services
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
          <div className="section-media">
            <AiServicesStack />
          </div>
        </div>
      </section>

      <section
        id="work"
        data-animate-section
        className="section-shell section-pad bg-ink text-white"
        aria-labelledby="work-heading"
      >
        <div className="section-inner">
          <p data-animate="fade-up" className="text-eyebrow text-eyebrow-on-dark m-0">
            Our work
          </p>
          <div className="section-intro">
            <h2 data-animate="fade-up" id="work-heading" className="text-display-md m-0">
              A closer look at
              <br />
              <span className="text-red">how we make things happen.</span>
            </h2>
            <div data-animate="fade-up" className="min-w-0 pt-0 md:pt-1 md:justify-self-end md:self-end">
              <Link href="/work" className="text-cta link-cta text-white">
                View all case studies
                <ArrowRight size={16} aria-hidden />
              </Link>
            </div>
          </div>
          <div data-animate="fade-up" className="section-media">
            <FeaturedWorkCarousel />
          </div>
        </div>
      </section>

      <PartnerLogos />
      <LocationsSection />
      <CareersTeaser />

      {FAQS_ENABLED ? (
        <FaqSection idPrefix="home" titleBefore="First Economy" items={homeFaqs} animate={false} className="bg-paper" />
      ) : null}

      <CTASection
        animate
        headingId="home-cta-heading"
        titleBreak
        titleBefore={homeCta.titleBefore}
        titleAccent={homeCta.titleAccent}
        primaryLabel={homeCta.button.label}
        primaryHref={homeCta.button.href}
      />
    </div>
  );
}
