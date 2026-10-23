import type { MediaSlot } from "@/content/about";
import { caseStudies } from "@/content/caseStudies";
import type { ServicePageCaseStudy, ServicePageStat } from "@/content/servicePages/types";
import { workPhotos } from "@/content/workPhotos";
import { lucideNameForLabel } from "@/lib/mediaIcons";

export const SERVICE_HERO_BURST = "/images/services/hero/radial-burst.svg";
export const SERVICE_HERO_ARROW = "/images/services/hero/arrow-circle.svg";

export const processIcons = {
  discover: {
    src: "/images/services/process/discover_magnifier.svg",
    alt: "",
    label: "Discover",
  } satisfies MediaSlot,
  strategize: {
    src: "/images/services/process/strategize_nodes.svg",
    alt: "",
    label: "Strategize",
  } satisfies MediaSlot,
  build: {
    src: "/images/services/process/build_gear.svg",
    alt: "",
    label: "Build",
  } satisfies MediaSlot,
  launch: {
    src: "/images/services/process/launch_rocket.svg",
    alt: "",
    label: "Launch",
  } satisfies MediaSlot,
  optimize: {
    src: "/images/services/process/optimize_chart.svg",
    alt: "",
    label: "Optimize",
  } satisfies MediaSlot,
};

export function placeholderIcon(label: string): MediaSlot {
  return { alt: "", label, icon: lucideNameForLabel(label) };
}

/** Map case studies tagged with this service slug into carousel cards. */
export function caseStudiesForService(serviceSlug: string): ServicePageCaseStudy[] {
  return caseStudies
    .filter((c) => c.services.includes(serviceSlug))
    .map((c) => {
      const photo = workPhotos[c.slug];
      return {
        slug: c.slug,
        client: c.client,
        title: c.campaign,
        body: c.hero,
        href: `/work/${c.slug}`,
        image: {
          ...(photo ? { src: photo } : {}),
          alt: `${c.client} case study`,
          label: `${c.client} case study`,
          fit: "cover" as const,
        },
      };
    });
}

/**
 * Headline stats for ink impact strips — short numeric values only.
 * Phrases, ranges ("1,000+ → 20,000+"), and long labels break the layout.
 */
export function isHeadlineStat(value: string, label: string): boolean {
  const v = value.trim();
  const l = label.trim();
  if (!v || !l) return false;
  if (v.length > 10 || l.length > 28) return false;
  if (/[→/]/.test(v) || /\s/.test(v)) return false;
  // Allow compact metrics like 130%+, 1.2B+, 87.1K, 5.7%, 75+
  if (!/^[\d,.]+[KMB%+x×]*$/i.test(v)) return false;
  return true;
}

/**
 * Pull a short list of headline metrics from cases tagged to this service.
 * Returns [] when there aren’t enough clean stats — omit the impact section.
 */
export function impactStatsForService(
  serviceSlug: string,
  limit = 4,
  min = 3,
): ServicePageStat[] {
  const tagged = caseStudies.filter((c) => c.services.includes(serviceSlug));
  const seen = new Set<string>();
  const stats: ServicePageStat[] = [];

  for (const study of tagged) {
    for (const metric of study.results ?? []) {
      if (!isHeadlineStat(metric.value, metric.label)) continue;
      const key = `${metric.label}:${metric.value}`;
      if (seen.has(key)) continue;
      seen.add(key);
      stats.push({ value: metric.value, label: metric.label });
      if (stats.length >= limit) break;
    }
    if (stats.length >= limit) break;
  }

  return stats.length >= min ? stats : [];
}
