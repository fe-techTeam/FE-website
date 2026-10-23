import { LogoMarkGrid } from "@/components/home/PartnerLogos";
import type { PartnerLogo } from "@/content/partners";

type ToolLogo = {
  name: string;
  file: string;
  width: number;
  height: number;
};

const TOOL_LOGOS: ToolLogo[] = [
  { name: "Google Trends", file: "google_trends.png", width: 357, height: 91 },
  { name: "Comscore", file: "comscore.png", width: 514, height: 119 },
  { name: "SEMrush", file: "semrush.png", width: 270, height: 152 },
  { name: "GWI", file: "gwi.png", width: 384, height: 288 },
  { name: "Power BI", file: "power_bi.png", width: 360, height: 360 },
  { name: "Brandwatch", file: "brandwatch.png", width: 428, height: 128 },
  { name: "Brand24", file: "brand24.png", width: 360, height: 150 },
  { name: "Supermetrics", file: "supermetrics.png", width: 405, height: 101 },
  { name: "Konnect Insights", file: "konnect_insights.png", width: 768, height: 220 },
  { name: "Looker Studio", file: "looker_studio.png", width: 367, height: 173 },
  { name: "Similarweb", file: "similarweb.png", width: 402, height: 102 },
];

type AdvantageToolsGridProps = {
  /** Kept for CMS compatibility; when omitted, full deck set is shown. */
  tools?: string[];
};

function toPartnerLogo(tool: ToolLogo): PartnerLogo {
  return {
    slug: tool.file.replace(/\.png$/, ""),
    name: tool.name,
    src: `/images/tools/${tool.file}`,
    width: tool.width,
    height: tool.height,
    sourceMedia: "deck-slide-97",
    sourceSlide: 97,
  };
}

export default function AdvantageToolsGrid({ tools }: AdvantageToolsGridProps) {
  const logos = (
    tools?.length ? TOOL_LOGOS.filter((logo) => tools.includes(logo.name)) : TOOL_LOGOS
  ).map(toPartnerLogo);

  return (
    <div className="space-y-5 sm:space-y-6">
      <LogoMarkGrid logos={logos} />
      {/* Deck slide 97 caption — text only, not a logo asset */}
      <p className="text-eyebrow m-0 pt-4 text-center sm:pt-5">And in-house proprietary tools</p>
    </div>
  );
}
