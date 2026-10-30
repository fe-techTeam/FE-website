import { AI_SOLUTIONS_ENABLED } from "@/content/features";

/**
 * Canonical list of First Economy service offerings — aligned to the creds deck and Home grid.
 */

export type ServiceOffering = {
  slug: string;
  name: string;
  description: string;
  href: string;
};

const allServiceOfferings: ServiceOffering[] = [
  {
    slug: "media-buying",
    name: "360° Media Buying",
    description: "From reach to results, we make every media dollar work harder.",
    href: "/services/media-buying",
  },
  {
    slug: "video-production",
    name: "Video Production",
    description: "Stories that stop the scroll, spark emotion and stay remembered.",
    href: "/services/video-production",
  },
  {
    slug: "branding",
    name: "Project Innovation & Branding",
    description: "Turn bold ideas into distinctive brands people recognise and remember.",
    href: "/services/branding",
  },
  {
    slug: "influencer-marketing",
    name: "Influencer Marketing",
    description: "The right creators. Real conversations. Influence that moves people to act.",
    href: "/services/influencer-marketing",
  },
  {
    slug: "technology",
    name: "Tech Solutions",
    description: "Smarter systems that simplify complexity and accelerate growth.",
    href: "/services/technology",
  },
  {
    slug: "creative",
    name: "Creative Solutions",
    description: "Campaign and performance creative across every format.",
    href: "/services/creative",
  },
  {
    slug: "social-media",
    name: "Social Media",
    description: "More than likes, we build social growth, meaningful engagement and loyal communities.",
    href: "/services/social-media",
  },
  {
    slug: "seo",
    name: "SEO/AEO/GEO",
    description: "Get found on search engines, featured in AI answers and chosen by your audience.",
    href: "/services/seo",
  },
  {
    slug: "ai-solutions",
    name: "AI Solutions",
    description: "Intelligence applied to creative, analytics and operations.",
    href: "/services/ai-solutions",
  },
];

/** What the site lists: every offering except those whose feature switch is off (see features.ts). */
export const serviceOfferings: ServiceOffering[] = allServiceOfferings.filter(
  (service) => AI_SOLUTIONS_ENABLED || service.slug !== "ai-solutions",
);
