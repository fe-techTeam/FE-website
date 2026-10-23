/**
 * Shared capability/platform content reused across live pages (Services).
 * Assets live in /public/images/capabilities/.
 */

import type { MediaSlot } from "@/content/about";
import { caseStudies } from "@/content/caseStudies";
import { workShowcaseOrder } from "@/content/workPage";
import { workPhotos } from "@/content/workPhotos";
import type { PartnerLogo } from "@/content/partners";

/** Deck slide 97 — The Infrastructure of Advantage */
export const advantageToolsSection = {
  eyebrow: "The Infrastructure of Advantage",
  titleBefore: "Data Tools.",
  titleAccent: "Built-in Edge.",
  body: "Best-in-class analytics and intelligence platforms — plus in-house proprietary tools — powering sharper decisions and continuous optimisation.",
};

export const ecosystemSection = {
  eyebrow: "Partners Who Help Us Deliver That Advantage",
  titleBefore: "Platform Partners.",
  titleAccent: "Built for Reach.",
  body: "Media and platform partnerships across search, social, OTT, commerce and publishing — the channels our growth systems run on.",
};

/** Deck slide 98 — platform partners (full original PNGs via object-contain). */
export const platformPartnerLogos: PartnerLogo[] = [
  {
    slug: "google",
    name: "Google",
    src: "/images/capabilities/platforms/google.png",
    width: 360,
    height: 262,
    sourceMedia: "deck-slide-98",
    sourceSlide: 98,
  },
  {
    slug: "meta",
    name: "Meta",
    src: "/images/capabilities/platforms/meta.png",
    width: 360,
    height: 240,
    sourceMedia: "deck-slide-98",
    sourceSlide: 98,
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    src: "/images/capabilities/platforms/linkedin.png",
    width: 336,
    height: 126,
    sourceMedia: "deck-slide-98",
    sourceSlide: 98,
  },
];

export const techCaseStudiesSection = {
  eyebrow: "Capabilities in Action",
  titleBefore: "Solving Real Challenges.",
  titleAccent: "Delivering Real Results.",
  body: "Work where technology, AI and data were core to the growth system — not an afterthought.",
  exploreLabel: "Explore our work",
  exploreHref: "/work",
};

export type CapabilityCaseStudy = {
  slug: string;
  client: string;
  title: string;
  body: string;
  image: MediaSlot;
  href?: string;
};

/** Latest showcase case studies — same order as Work / home featured. */
export const capabilityCaseStudies: CapabilityCaseStudy[] = workShowcaseOrder
  .map((slug) => caseStudies.find((study) => study.slug === slug))
  .filter((study): study is (typeof caseStudies)[number] => Boolean(study))
  .map((study) => ({
    slug: study.slug,
    client: study.client,
    title: study.campaign,
    body: study.hero,
    image: {
      src: workPhotos[study.slug] ?? `/images/work/cases/${study.slug}.png`,
      alt: `${study.client} — ${study.campaign}`,
      label: study.client,
      fit: "cover" as const,
    },
  }));
