/**
 * Work (case studies) landing page content and media slots.
 * Case thumbnails and icons: drop files in /public/images/work/ then set `src`.
 */

import type { MediaSlot } from "@/content/about";
import { industries } from "@/content/industries";
import type { CaseStudy, CaseStudyFamily, Metric } from "@/content/types";
import { workPhotos } from "@/content/workPhotos";

/**
 * Case studies kept out of the rotating slider at the top of /work. They are still listed in the case-study grid
 * below; delete a slug here to put it back in the slider.
 */
export const workHeroExcludedSlugs: string[] = ["adani-airports-safar-ke-humsafar", "fedex-csk"];

export const workHero = {
  headlineBefore: "Our",
  headlineAccent: "Work.",
  body: "Explore how we engineer growth systems that solve real business challenges and deliver measurable results.",
  burst: "/images/work/hero/radial-burst.svg",
  arrow: "/images/work/hero/arrow-circle.svg",
};

/** Tabs mirror the card badges; a case also appears under any tab whose service it was delivered under (see `filterServiceSlugs`). */
export const workFilters = [
  { key: "all", label: "All Cases" },
  { key: "integrated", label: "Integrated Campaign" },
  { key: "media-buying", label: "360° Media Buying" },
  { key: "tech", label: "Tech Solutions" },
  { key: "social", label: "Social Media" },
  { key: "seo", label: "SEO" },
  { key: "video", label: "Video Production" },
  { key: "creative", label: "Creative Solutions" },
  { key: "influencer", label: "Influencer Marketing" },
] as const;

export type WorkFilterKey = (typeof workFilters)[number]["key"];

const filterTagLabels: Record<Exclude<WorkFilterKey, "all">, string> = {
  integrated: "Integrated Campaign",
  "media-buying": "360° Media Buying",
  tech: "Tech Solutions",
  social: "Social Media",
  seo: "SEO",
  video: "Video Production",
  creative: "Creative Solutions",
  influencer: "Influencer Marketing",
};

/** Service slugs (from `caseStudy.services`) that also place a case under a filter tab. */
const filterServiceSlugs: Partial<Record<Exclude<WorkFilterKey, "all">, string[]>> = {
  "media-buying": ["media-buying"],
  tech: ["technology"],
  social: ["social-media"],
  seo: ["seo"],
  video: ["video-production"],
  creative: ["creative"],
  influencer: ["influencer-marketing"],
};

/** A case matches a tab by its badge OR by any of its service tags — one badge, many filters. */
/**
 * Cases that belong ONLY to the tab matching their card badge. They are not also listed under the tabs of the
 * individual services they used (e.g. Royale Touché is an Integrated Campaign, not an SEO / Social / Influencer case).
 */
const badgeOnlyFilterCases = new Set(["royale-touche-stay-curious"]);

/** Cases kept out of a specific tab for now (they still show under All and any other tab they match). */
const hiddenFromFilter: Record<string, WorkFilterKey[]> = {
  "jockey-seo": ["integrated"],
  "adani-airports-safar-ke-humsafar": ["influencer"],
  "fedex-csk": ["media-buying"],
};

export function matchesWorkFilter(caseStudy: CaseStudy, key: WorkFilterKey) {
  if (key === "all") return true;
  if (hiddenFromFilter[caseStudy.slug]?.includes(key)) return false;
  if (workCardTag(caseStudy) === filterTagLabels[key]) return true;
  if (badgeOnlyFilterCases.has(caseStudy.slug)) return false;
  return (filterServiceSlugs[key] ?? []).some((slug) => caseStudy.services.includes(slug));
}

/** Resolves a `/work?service=<service-slug>` deep link to its filter tab (null = no matching tab). */
export function workFilterFromService(serviceSlug: string | null | undefined): WorkFilterKey | null {
  if (!serviceSlug) return null;
  for (const [key, slugs] of Object.entries(filterServiceSlugs)) {
    if (slugs?.includes(serviceSlug)) return key as WorkFilterKey;
  }
  return null;
}

/** Mockup order first, then remaining studies. */
export const workShowcaseOrder = [
  "godrej-blue",
  "fedex-csk",
  "royale-touche-stay-curious",
  "mahindra-manulife",
  "orpat-erp",
  "ajanta-ai-creatives",
  "waaree",
];

/** Kept in sync with `familyLabels` in workDetail.ts — card tags mirror each case study’s own detail-page eyebrow. */
const familyTags: Record<CaseStudyFamily, string> = {
  integrated: "Integrated Campaign",
  "media-performance": "Media Performance",
  technology: "Technology",
  "content-social": "Content & Social",
  ai: "AI Solutions",
};

/** Per-case-study card tag — takes priority over the family-based `familyTags` fallback. */
const cardTagOverrides: Record<string, string> = {
  "godrej-blue": "Integrated Campaign",
  "royale-touche-stay-curious": "Integrated Campaign",
  "fedex-csk": "360° Media Buying",
  "vip-industries": "360° Media Buying",
  "mahindra-manulife": "Tech Solutions",
  "orpat-erp": "Tech Solutions",
  waaree: "Social Media",
  "akbar-travels-seo": "SEO",
  "jockey-seo": "Integrated Campaign",
  "cello-kidzbee": "Video Production",
  "ajanta-ai-creatives": "Video Production",
  "ambassador-hotel": "Creative Solutions",
  "godrej-greenfront": "Creative Solutions",
  "amazon-samsung-great-indian-festival": "Influencer Marketing",
  "adani-airports-safar-ke-humsafar": "Influencer Marketing",
};

const titleOverrides: Record<string, string> = {
  "godrej-blue": "Godrej Blue",
  "godrej-greenfront": "Godrej Greenfront",
  "fedex-csk": "FedEx × CSK",
  "ajanta-ai-creatives": "Ajanta Magic Moments",
  waaree: "Waaree Energies",
  "royale-touche-stay-curious": "Royale Touché",
};

/** Home carousel — curated headline metrics (deck highlights not always first in `results`). */
const homeFeaturedSpotlight: Partial<Record<string, Metric>> = {
  "godrej-blue": { value: "1,000+", label: "Influencers live in one hour" },
  "royale-touche-stay-curious": { value: "120K+", label: "Reddit impressions" },
};

const homeFeaturedEyebrowOverrides: Partial<Record<string, string>> = {
  "fedex-csk": "Brand Recall",
  "royale-touche-stay-curious": "Integrated Campaign",
};

export const homeFeaturedWorkLimit = 4;

export function workCardTitle(caseStudy: CaseStudy) {
  return titleOverrides[caseStudy.slug] ?? caseStudy.client;
}

export function workCardTag(caseStudy: CaseStudy) {
  return cardTagOverrides[caseStudy.slug] ?? familyTags[caseStudy.family];
}

export function caseStudyIndustryName(caseStudy: CaseStudy) {
  return industries.find((industry) => industry.slug === caseStudy.industry)?.name ?? caseStudy.industry;
}

export function homeFeaturedWorkStudies(studies: CaseStudy[]) {
  return workShowcaseOrder
    .map((slug) => studies.find((study) => study.slug === slug))
    .filter((study): study is CaseStudy => Boolean(study?.featured))
    .slice(0, homeFeaturedWorkLimit);
}

export function homeFeaturedEyebrow(caseStudy: CaseStudy) {
  return homeFeaturedEyebrowOverrides[caseStudy.slug] ?? workCardTag(caseStudy);
}

export function homeFeaturedSpotlightMetric(caseStudy: CaseStudy): Metric {
  return (
    homeFeaturedSpotlight[caseStudy.slug] ??
    caseStudy.results?.[0] ?? { value: "—", label: "Impact" }
  );
}

/** Case thumbnails — shared with home / detail story covers via workPhotos. */
export function workCardImage(caseStudy: CaseStudy): MediaSlot {
  return {
    src: workPhotos[caseStudy.slug],
    alt: `${caseStudy.client} — ${caseStudy.campaign}`,
    label: workCardTitle(caseStudy),
    grayscale: false,
    // Designed campaign covers (type + logos) must not be cropped in the hero frame.
    fit:
      caseStudy.slug === "godrej-blue" ||
      caseStudy.slug === "royale-touche-stay-curious" ||
      caseStudy.slug === "fedex-csk" ||
      caseStudy.slug === "amazon-samsung-great-indian-festival" ||
      caseStudy.slug === "adani-airports-safar-ke-humsafar"
        ? "contain"
        : undefined,
  };
}

export function orderedWorkStudies(studies: CaseStudy[]) {
  const featured = workShowcaseOrder
    .map((slug) => studies.find((study) => study.slug === slug))
    .filter((study): study is CaseStudy => Boolean(study));
  const rest = studies.filter((study) => !workShowcaseOrder.includes(study.slug));
  return [...featured, ...rest];
}

export const workStats = {
  icon: {
    src: "/images/work/stats/results-target.svg",
    alt: "",
    label: "Results",
  } satisfies MediaSlot,
  items: [
    { value: 1.204, decimals: 3, unit: "B", plus: true, label: "Impressions generated" },
    { value: 175, decimals: 0, unit: "M", plus: true, label: "People reached" },
    { value: 54, decimals: 0, unit: "M", plus: true, label: "Engagements" },
    { value: 85, decimals: 0, unit: "M", plus: true, label: "Video views" },
  ],
  tagline: "Results that reflect strategy. Execution that delivers.",
};

export const workCta = {
  titleBefore: "Got a challenge?",
  titleAccent: "Bring it on.",
  body: "Let’s engineer a growth system custom-built for your brand.",
  button: { label: "Let’s talk", href: "/contact" },
  burst: "/images/work/cta-burst.svg",
};
