import type { ComponentType, SVGProps } from "react";
import {
  MediaBuyingIcon,
  VideoProductionIcon,
  BrandingIcon,
  InfluencerMarketingIcon,
  MarketplaceManagementIcon,
  TechSolutionsIcon,
  CreativeSolutionsIcon,
  SocialMediaIcon,
  SeoIcon,
  AiSolutionsIcon,
} from "@/components/brandIcons";

export type ServiceOfferingIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

/** Shared icon map for home + services landing cards — keep metaphors in sync. */
export const serviceOfferingIconBySlug: Record<string, ServiceOfferingIcon> = {
  "media-buying": MediaBuyingIcon,
  "video-production": VideoProductionIcon,
  branding: BrandingIcon,
  "influencer-marketing": InfluencerMarketingIcon,
  "marketplace-management": MarketplaceManagementIcon,
  technology: TechSolutionsIcon,
  creative: CreativeSolutionsIcon,
  "social-media": SocialMediaIcon,
  seo: SeoIcon,
  "ai-solutions": AiSolutionsIcon,
};
