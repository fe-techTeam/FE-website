import {
  Clapperboard,
  Compass,
  Megaphone,
  Network,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType, CSSProperties, ReactNode, SVGProps } from "react";
import {
  AiSolutionsIcon,
  BrandingIcon,
  CreativeSolutionsIcon,
  InfluencerMarketingIcon,
  MarketplaceManagementIcon,
  MediaBuyingIcon,
  SeoIcon,
  SocialMediaIcon,
  TechSolutionsIcon,
  VideoProductionIcon,
} from "@/components/brandIcons";
import type { WorkDetailSectionId } from "@/content/workDetail";

export const PILLAR_ICONS: LucideIcon[] = [Compass, Network, Megaphone, Clapperboard];

type ServiceIcon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export const SERVICE_ICONS: Record<string, ServiceIcon> = {
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

export const SECTION_META: Record<WorkDetailSectionId, { label: string }> = {
  objective: { label: "The Objective" },
  mandate: { label: "The Mandate" },
  platforms: { label: "Digital Platforms Used" },
  execution: { label: "The Execution" },
  creatives: { label: "Creatives" },
  activations: { label: "Live Activations" },
  gallery: { label: "Creative Gallery" },
  video: { label: "Video" },
  result: { label: "The Result" },
  "built-with": { label: "Built With" },
  related: { label: "Related Work" },
};

export function SectionLabel({
  id,
  number,
  headingId,
  onDark = false,
  labelOverride,
  asHeading = false,
}: {
  id: WorkDetailSectionId;
  number: string;
  headingId?: string;
  onDark?: boolean;
  labelOverride?: string;
  /** Promote the label to the section display heading (replaces a separate h2). */
  asHeading?: boolean;
}) {
  const meta = SECTION_META[id];
  const label = labelOverride ?? meta.label;

  if (asHeading) {
    return (
      <h2
        id={headingId}
        className={`text-display-md m-0 text-balance ${onDark ? "text-white" : ""}`}
      >
        <span className="text-red">{number}</span> {label}
      </h2>
    );
  }

  if (onDark) {
    return (
      <p id={headingId} className="text-eyebrow text-eyebrow-on-dark m-0">
        {number} {label}
      </p>
    );
  }

  return (
    <p id={headingId} className="insight-section-label m-0">
      <span>{number}</span>
      <span> {label}</span>
    </p>
  );
}

export function ContentBlock({
  id,
  children,
  className = "",
  style,
  labelledBy,
}: {
  id: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  labelledBy?: string;
}) {
  return (
    <section
      id={id}
      style={style}
      aria-labelledby={labelledBy}
      className={`insight-section-anchor w-full ${className}`}
    >
      {children}
    </section>
  );
}
