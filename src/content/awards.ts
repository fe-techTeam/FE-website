/**
 * Awards & Recognition page content.
 * Reuses media from /public/images/about/ where available.
 */

import type { MediaSlot } from "@/content/about";
import { aboutFeaturedAchievement, aboutUi, campaignAwards } from "@/content/about";

export { aboutUi };

export const awardsHero = {
  eyebrow: "Awards & Recognition",
  headlineBefore: "Recognized for impact.",
  headlineAccent: "Driven by purpose.",
  body: "From a Guinness World Record with Godrej Properties to honours from Afaqs, MOBEXX, e4m and DIGIXX — our work is recognized when strategy, media, creative, technology and data work as one.",
  image: {
    src: "/images/awards/hero/trophy-collection.jpg",
    alt: "Collection of trophies and awards on display",
    label: "Awards hero — trophy collection photo",
    fit: "cover",
    grayscale: false,
  } satisfies MediaSlot,
  burst: "/images/about/hero/radial-burst.svg",
  arrow: "/images/about/ui/arrow-right-circle.svg",
};

export type AwardGalleryItem = {
  organization: string;
  tier: string;
  category: string;
  year: string;
  image: MediaSlot;
};

export const awardsGallery: AwardGalleryItem[] = campaignAwards.map((award) => ({
  organization: award.client,
  tier:
    award.organization === "Guinness World Records"
      ? "Guinness World Record — 1,000+ influencers live in one hour"
      : `${award.organization} — ${award.accolade}`,
  category: award.category,
  year: award.organization === "Guinness World Records" ? "World Record" : "Award-winning",
  image: award.image,
}));


export const awardsGallerySection = {
  eyebrow: "Awards Gallery",
  title: "A few of our many achievements.",
  body: "Honored across storytelling, performance marketing, mobile, digital and integrated campaigns — for brands that moved markets.",
};


export { aboutFeaturedAchievement };

export const awardsCta = {
  titleBefore: "Got a challenge?",
  titleAccent: "Bring it on.",
  body: "Let’s engineer the next chapter of growth together.",
  button: { label: "Let’s talk", href: "/contact" },
  burst: "/images/about/hero/radial-burst.svg",
};
