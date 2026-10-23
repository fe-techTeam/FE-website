/**
 * Canonical list of First Economy service offerings — aligned to the creds deck and Home grid.
 */

export type ServiceOffering = {
  slug: string;
  name: string;
  description: string;
  href: string;
};

export const serviceOfferings: ServiceOffering[] = [
  {
    slug: "media-buying",
    name: "360° Media Buying",
    description: "Integrated media strategy across search, social, programmatic and OOH.",
    href: "/services/media-buying",
  },
  {
    slug: "video-production",
    name: "Video Production",
    description: "Brand films and social video built for how people watch today.",
    href: "/services/video-production",
  },
  {
    slug: "branding",
    name: "Project Innovation & Branding",
    description: "Identity systems that hold up on screen and on the storefront.",
    href: "/services/branding",
  },
  {
    slug: "influencer-marketing",
    name: "Influencer Marketing",
    description: "Creator networks built for scale, authenticity and amplification.",
    href: "/services/influencer-marketing",
  },
  {
    slug: "technology",
    name: "Tech Solutions",
    description: "Platforms and systems built for scale, compliance and growth.",
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
    description: "Always-on social strategy, content and community that compounds.",
    href: "/services/social-media",
  },
  {
    slug: "seo",
    name: "SEO/AEO/GEO",
    description: "Technical, local and AI-era search built to be found.",
    href: "/services/seo",
  },
  {
    slug: "ai-solutions",
    name: "AI Solutions",
    description: "Intelligence applied to creative, analytics and operations.",
    href: "/services/ai-solutions",
  },
];
