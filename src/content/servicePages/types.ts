/**
 * CMS-ready service detail page content model.
 * Sections render only when their data is present.
 */

import type { MediaSlot } from "@/content/about";

export type ServicePageHighlight = {
  id: string;
  label: string;
  icon: MediaSlot;
};

export type ServicePageStep = {
  number: string;
  id: string;
  title: string;
  body: string;
  icon: MediaSlot;
};

export type ServicePageValueCard = {
  id: string;
  title: string;
  body: string;
  icon: MediaSlot;
};

export type ServicePageStage = {
  id: string;
  title: string;
  body: string;
  icon: MediaSlot;
};

export type ServicePageCaseStudy = {
  slug: string;
  client: string;
  title: string;
  body: string;
  image: MediaSlot;
  href?: string;
};

export type ServicePageStat = {
  value: string;
  label: string;
};

export type ServiceGuideSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ServiceGuide = {
  title: string;
  intro: string;
  sections: ServiceGuideSection[];
};

export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServicePageContent = {
  slug: string;
  name: string;
  summary: string;
  /** <title> without the brand suffix (aim for 44 chars or fewer). Names the service + market for search; falls back to `name`. */
  seoTitle?: string;
  /** Optional meta description override (120–160 chars). Defaults to `summary`. */
  seoDescription?: string;
  hero: {
    eyebrow: string;
    headlineBefore: string;
    headlineAccent: string;
    body: string;
    visual: MediaSlot;
    burst: string;
    arrow: string;
    highlights: ServicePageHighlight[];
  };
  process?: {
    eyebrow: string;
    title: string;
    body: string;
    steps: ServicePageStep[];
  };
  why?: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    body: string;
    button: { label: string; href: string };
    valueCards: ServicePageValueCard[];
  };
  framework?: {
    eyebrow: string;
    title: string;
    body: string;
    stages: ServicePageStage[];
  };
  caseStudies?: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    body: string;
    exploreLabel: string;
    exploreHref: string;
    items: ServicePageCaseStudy[];
  };
  impact?: {
    eyebrow: string;
    titleBefore: string;
    titleAccent: string;
    stats: ServicePageStat[];
  };
  /** Attached from `faqs.ts` in `index.ts`; drives the visible FAQ section and FAQPage JSON-LD. */
  faq?: ServiceFaqItem[];
  /** Long-form explainer attached from `guides.ts` in `index.ts`. */
  guide?: ServiceGuide;
  cta?: {
    titleBefore: string;
    titleAccent: string;
    body: string;
    button: { label: string; href: string };
  };
};
