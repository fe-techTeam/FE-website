import { AI_SOLUTIONS_ENABLED, FAQS_ENABLED, SERVICE_GUIDES_ENABLED } from "@/content/features";
import { serviceFaqs } from "@/content/servicePages/faqs";
import { serviceGuides } from "@/content/servicePages/guides";
import { aiSolutionsPage } from "@/content/servicePages/ai-solutions";
import { brandingPage } from "@/content/servicePages/branding";
import { creativePage } from "@/content/servicePages/creative";
import { influencerMarketingPage } from "@/content/servicePages/influencer-marketing";
import { marketplaceManagementPage } from "@/content/servicePages/marketplace-management";
import { mediaBuyingPage } from "@/content/servicePages/media-buying";
import { seoPage } from "@/content/servicePages/seo";
import { socialMediaPage } from "@/content/servicePages/social-media";
import { technologyPage } from "@/content/servicePages/technology";
import type { ServicePageContent } from "@/content/servicePages/types";
import { videoProductionPage } from "@/content/servicePages/video-production";

export type { ServicePageContent } from "@/content/servicePages/types";

const basePages: ServicePageContent[] = [
  mediaBuyingPage,
  videoProductionPage,
  brandingPage,
  influencerMarketingPage,
  marketplaceManagementPage,
  technologyPage,
  creativePage,
  socialMediaPage,
  seoPage,
  ...(AI_SOLUTIONS_ENABLED ? [aiSolutionsPage] : []),
];

const pages: ServicePageContent[] = basePages.map((page) => ({ ...page, faq: FAQS_ENABLED ? serviceFaqs[page.slug] : undefined, guide: SERVICE_GUIDES_ENABLED ? serviceGuides[page.slug] : undefined }));

export const servicePagesBySlug: Record<string, ServicePageContent> = Object.fromEntries(
  pages.map((page) => [page.slug, page]),
);

export const servicePageSlugs = pages.map((page) => page.slug);

export function getServicePageContent(slug: string): ServicePageContent | undefined {
  return servicePagesBySlug[slug];
}
