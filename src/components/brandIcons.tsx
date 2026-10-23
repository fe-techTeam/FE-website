import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function Icon({ size = 24, children, className, width, height, ...props }: IconProps & { children: React.ReactNode }) {
  const sizedByClass = Boolean(className && /\b(h-|w-|size-)/.test(className));

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...(!sizedByClass ? { width: width ?? size, height: height ?? size } : { width, height })}
      {...props}
    >
      {children}
    </svg>
  );
}

export function MediaBuyingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 50V38h10v12M28 50V30h10v20M44 50V22h10v28" />
      <path d="M14 32l12-10 8 6 16-16" />
      <path d="M42 12h8v8" />
    </Icon>
  );
}

export function VideoProductionIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M10 22h26a4 4 0 0 1 4 4v20a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V26a4 4 0 0 1 4-4z" />
      <path d="M40 28l18-8v32l-18-8z" />
    </Icon>
  );
}

export function BrandingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 48l8-4 24-24-4-4-24 24z" />
      <path d="M42 18l4 4" />
      <path d="M22 40l4 4" />
      <path d="M14 52l4-10" />
      <circle cx="48" cy="16" r="4" />
    </Icon>
  );
}

export function InfluencerMarketingIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="32" cy="18" r="7" />
      <circle cx="16" cy="26" r="5.5" />
      <circle cx="48" cy="26" r="5.5" />
      <path d="M20 50c1-10 6-16 12-16s11 6 12 16" />
      <path d="M8 52c1-8 5-13 11-13 3 0 5 1 7 3" />
      <path d="M56 52c-1-8-5-13-11-13-3 0-5 1-7 3" />
    </Icon>
  );
}

export function MarketplaceManagementIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 24h32l-3 28H19z" />
      <path d="M22 24l2-8h16l2 8" />
      <circle cx="24" cy="56" r="3.5" />
      <circle cx="42" cy="56" r="3.5" />
    </Icon>
  );
}

export function TechSolutionsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="20" y="20" width="24" height="24" rx="4" />
      <rect x="26" y="26" width="12" height="12" rx="2" />
      <path d="M26 12v8M32 12v8M38 12v8M26 44v8M32 44v8M38 44v8M12 26h8M12 32h8M12 38h8M44 26h8M44 32h8M44 38h8" />
    </Icon>
  );
}

export function CreativeSolutionsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M28 36h8l2 10H26z" />
      <path d="M26 36c-5-4-8-10-8-16a14 14 0 0 1 28 0c0 6-3 12-8 16" />
      <path d="M30 20c1-3 3-5 6-5" />
    </Icon>
  );
}

export function SocialMediaIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 18h28a6 6 0 0 1 6 6v14a6 6 0 0 1-6 6H26l-10 8v-8h-4a6 6 0 0 1-6-6V24a6 6 0 0 1 6-6z" />
      <path d="M20 28h12M20 34h8" />
    </Icon>
  );
}

export function SeoIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="28" cy="28" r="14" />
      <path d="M38 38l14 14" />
      <path d="M22 28h12M28 22v12" />
    </Icon>
  );
}

export function AiSolutionsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <ellipse cx="32" cy="32" rx="8" ry="20" />
      <ellipse cx="32" cy="32" rx="8" ry="20" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="8" ry="20" transform="rotate(-60 32 32)" />
      <circle cx="32" cy="32" r="4" fill="currentColor" stroke="none" />
    </Icon>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 46L46 18M27 18h19v19" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M40 14L22 32l18 18" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M24 14l18 18-18 18" />
    </Icon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 20h36M14 32h36M14 44h36" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M16 16l32 32M48 16L16 48" />
    </Icon>
  );
}

export function MindsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="24" cy="22" r="7" />
      <circle cx="40" cy="22" r="7" />
      <path d="M12 48c1-9 6-14 12-14 3 0 5.5 1 8 3.5" />
      <path d="M52 48c-1-9-6-14-12-14-3 0-5.5 1-8 3.5" />
    </Icon>
  );
}

export function CitiesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M32 52s-16-14-16-26a16 16 0 0 1 32 0c0 12-16 26-16 26z" />
      <circle cx="32" cy="26" r="6" />
    </Icon>
  );
}

export function AwardsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="32" cy="26" r="14" />
      <path d="M24 38l-4 16 12-6 12 6-4-16" />
      <path d="M26 24l4 4 8-8" />
    </Icon>
  );
}

export function GrowthSystemIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="32" cy="32" r="8" />
      <circle cx="32" cy="12" r="4" />
      <circle cx="52" cy="32" r="4" />
      <circle cx="32" cy="52" r="4" />
      <circle cx="12" cy="32" r="4" />
      <path d="M32 20v4M44 32h4M32 40v4M16 32h4" />
    </Icon>
  );
}

export function YearsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="32" cy="34" r="20" />
      <path d="M32 22v12l9 6" />
      <path d="M24 6h16M32 6v8" />
    </Icon>
  );
}

export function ActiveClientsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="10" y="24" width="44" height="28" rx="4" />
      <path d="M22 24v-4a10 10 0 0 1 20 0v4" />
      <path d="M24 36l6 6 10-12" />
    </Icon>
  );
}

export function GlobeIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="32" cy="32" r="20" />
      <path d="M12 32h40" />
      <path d="M32 12v40" />
      <path d="M18 20c6 4 14 4 28 0" />
      <path d="M18 44c6-4 14-4 28 0" />
      <path d="M22 14c4 8 4 28 0 36" />
      <path d="M42 14c-4 8-4 28 0 36" />
    </Icon>
  );
}

export function AiCreativesIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M32 10l3 9 9 3-9 3-3 9-3-9-9-3 9-3z" />
      <path d="M48 36l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" />
      <path d="M16 38l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5z" />
    </Icon>
  );
}

export function AiAnalyticsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 48V28M24 48V18M36 48V32M48 48V14" />
      <path d="M12 28l12-10 12 14 12-18" />
      <circle cx="48" cy="14" r="3" />
    </Icon>
  );
}

export function AiOptimizationIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="20" y="20" width="24" height="24" rx="4" />
      <path d="M28 14v6M36 14v6M28 44v6M36 44v6M14 28h6M14 36h6M44 28h6M44 36h6" />
      <circle cx="32" cy="32" r="5" />
    </Icon>
  );
}

/** Careers — collaborative culture */
export function CollaborativeCultureIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="32" cy="18" r="7" />
      <circle cx="16" cy="24" r="5.5" />
      <circle cx="48" cy="24" r="5.5" />
      <path d="M18 48c1-10 6-16 14-16s13 6 14 16" />
      <path d="M8 48c.8-7 4-11 8-12" />
      <path d="M56 48c-.8-7-4-11-8-12" />
      <path d="M26 28h12" />
    </Icon>
  );
}

/** Careers — learning & growth */
export function LearningGrowthIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 48V28M24 48V22M36 48V16M48 48V10" />
      <path d="M12 28l12-6 12 6 12-12" />
      <path d="M42 10h10v10" />
      <circle cx="48" cy="10" r="2.5" fill="currentColor" stroke="none" />
    </Icon>
  );
}

/** Careers — meaningful impact */
export function MeaningfulImpactIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="32" cy="32" r="20" />
      <circle cx="32" cy="32" r="12" />
      <circle cx="32" cy="32" r="3.5" fill="currentColor" stroke="none" />
      <path d="M32 8v6M32 50v6M8 32h6M50 32h6" />
    </Icon>
  );
}
