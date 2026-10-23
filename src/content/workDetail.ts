/**
 * Work detail (case study) page — labels, CTA, and view-model helpers.
 */

import type { MediaSlot } from "@/content/about";
import { caseStudies } from "@/content/caseStudies";
import { industries } from "@/content/industries";
import { services } from "@/content/services";
import type {
  CaseStudy,
  CaseStudyFamily,
  CaseStudyGalleryImage,
  CaseStudyLink,
  CaseStudyLinkGroup,
  CaseStudyPillar,
  CaseStudyVideo,
  Metric,
} from "@/content/types";
import { workCardImage, workCardTag, workCardTitle } from "@/content/workPage";
import { workPhotos } from "@/content/workPhotos";
import { fetchInstagramThumbnail } from "@/lib/instagram";

export const workDetailCta = {
  titleBefore: "Got a challenge?",
  titleAccent: "Bring it on.",
  body: "Have a challenge worth solving? Let’s engineer a growth system custom-built for your brand.",
  button: { label: "Let’s talk", href: "/contact" },
  burst: "/images/work/cta-burst.svg",
};

/** Section display headlines — mirror Insights detail (label + display title + body). */
export const workDetailHeadlines = {
  activations: "Live proof from the campaign",
  built: "Capabilities behind the work",
};

/** Split metric strings into figure + unit for home/work-style stat UI. */
export function parseWorkMetricValue(raw: string): {
  figure: string;
  unit: string;
  plus: boolean;
  isPhrase: boolean;
} {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { figure: raw, unit: "", plus: false, isPhrase: true };
  }

  const plus = trimmed.endsWith("+");
  const core = (plus ? trimmed.slice(0, -1) : trimmed).trim();

  // 1.2B | 175M | 72K | 6.9x | 61.10% | 4.9/5 (keep slash phrases separate)
  const unitMatch = core.match(/^([\d]+(?:[.,][\d]+)*)\s*([KkMmBb]|[Xx]|%)$/);
  if (unitMatch) {
    let figure = unitMatch[1]!;
    let unit = unitMatch[2]!;

    // Normalize awkward "1,204M" → prefer billions when ≥ 1000M
    if (/^m$/i.test(unit) && !figure.includes(".")) {
      const asNumber = Number(figure.replace(/,/g, ""));
      if (Number.isFinite(asNumber) && asNumber >= 1000) {
        const billions = asNumber / 1000;
        figure =
          billions >= 10
            ? String(Math.round(billions))
            : billions.toFixed(billions >= 1 ? 1 : 2).replace(/\.0$/, "");
        unit = "B";
      } else {
        figure = figure.replace(/,/g, "");
      }
    } else if (/^[kmb]$/i.test(unit)) {
      figure = figure.replace(/,/g, "");
      unit = unit.toUpperCase();
    } else if (/^x$/i.test(unit)) {
      unit = "x";
    }

    return { figure, unit, plus, isPhrase: false };
  }

  // Plain number / thousands: 75 | 1,000 | 25
  if (/^[\d,]+(?:\.[\d]+)?$/.test(core)) {
    return { figure: core, unit: "", plus, isPhrase: false };
  }

  // Rating fractions: 4.9/5 | 9/10
  if (/^[\d.]+\/[\d.]+$/.test(core)) {
    return { figure: core, unit: "", plus, isPhrase: false };
  }

  // Short acronyms/words (e.g. "AI") read fine at full stat size
  if (core.length <= 3 && !/\s/.test(core)) {
    return { figure: core, unit: "", plus, isPhrase: false };
  }

  return { figure: core, unit: "", plus, isPhrase: true };
}

export function workResultGridClass(count: number) {
  if (count <= 1) return "grid-cols-1 max-w-sm";
  if (count === 2) return "grid-cols-2";
  if (count === 3) return "grid-cols-2 lg:grid-cols-3";
  if (count === 4) return "grid-cols-2 lg:grid-cols-4";
  if (count <= 6) return "grid-cols-2 lg:grid-cols-3";
  return "grid-cols-2 lg:grid-cols-3";
}

const familyLabels: Record<CaseStudyFamily, string> = {
  integrated: "Integrated Campaign",
  "media-performance": "Media Performance",
  technology: "Technology",
  "content-social": "Content & Social",
  ai: "AI Solutions",
};

const familyOverviewLabels: Record<CaseStudyFamily, string> = {
  integrated: "Integrated Campaigns",
  "media-performance": "Media Performance",
  technology: "Technology",
  "content-social": "Content & Social",
  ai: "AI Solutions",
};

const familyTagDefaults: Record<CaseStudyFamily, string[]> = {
  integrated: ["Branding", "Digital", "OOH", "Experiential"],
  "media-performance": ["Media", "Performance", "Digital", "OOH"],
  technology: ["Technology", "Product", "Platform"],
  "content-social": ["Social", "Content", "Influencer", "Creative"],
  ai: ["AI", "Creative", "Video"],
};

export function workFamilyLabel(family: CaseStudyFamily) {
  return familyLabels[family];
}

export function workFamilyOverviewLabel(family: CaseStudyFamily) {
  return familyOverviewLabels[family];
}

export function getCaseStudyBySlug(slug: string) {
  return caseStudies.find((c) => c.slug === slug) ?? null;
}

export function getRelatedWork(caseStudy: CaseStudy, limit = 5) {
  const sameIndustry = caseStudies.filter(
    (c) => c.slug !== caseStudy.slug && c.industry === caseStudy.industry,
  );
  if (sameIndustry.length >= limit) return sameIndustry.slice(0, limit);

  const sameFamily = caseStudies.filter(
    (c) =>
      c.slug !== caseStudy.slug &&
      c.family === caseStudy.family &&
      !sameIndustry.some((s) => s.slug === c.slug),
  );
  const featured = caseStudies.filter(
    (c) =>
      c.slug !== caseStudy.slug &&
      c.featured &&
      !sameIndustry.some((s) => s.slug === c.slug) &&
      !sameFamily.some((s) => s.slug === c.slug),
  );

  return [...sameIndustry, ...sameFamily, ...featured].slice(0, limit);
}

function serviceTags(caseStudy: CaseStudy) {
  const fromServices = caseStudy.services
    .map((slug) => services.find((s) => s.slug === slug)?.shortName)
    .filter((name): name is string => Boolean(name));
  if (caseStudy.tags?.length) return caseStudy.tags;
  if (fromServices.length >= 2) return fromServices;
  const extras = familyTagDefaults[caseStudy.family].filter((t) => !fromServices.includes(t));
  return [...fromServices, ...extras].slice(0, 5);
}

function defaultPillars(execution: string[]): CaseStudyPillar[] {
  const titles = ["Strategy", "Integrated Approach", "Massive Reach", "Content Engine"];
  return execution.slice(0, 4).map((line, i) => ({
    title: titles[i] ?? `Pillar ${i + 1}`,
    description: line,
  }));
}

function galleryImageSrc(image: CaseStudyGalleryImage): string {
  return typeof image === "string" ? image : image.src;
}

function galleryImageHref(image: CaseStudyGalleryImage): string | undefined {
  return typeof image === "string" ? undefined : image.href;
}

function gallerySlots(caseStudy: CaseStudy): MediaSlot[] {
  const fromGroups =
    caseStudy.galleryGroups?.flatMap((group) =>
      group.images.map((image, i) => ({
        src: galleryImageSrc(image),
        href: galleryImageHref(image),
        alt: `${caseStudy.client} — ${group.title} ${i + 1}`,
        label: group.title,
        grayscale: false,
        fit: "contain" as const,
      })),
    ) ?? [];

  if (fromGroups.length) {
    // Include cover-only paths that sit in `gallery` but not in groups
    const grouped = new Set(fromGroups.map((g) => g.src));
    const extras = (caseStudy.gallery ?? [])
      .filter((src) => !grouped.has(src))
      .map((src, i) => ({
        src,
        alt: `${caseStudy.client} — ${caseStudy.campaign} creative ${i + 1}`,
        label: workCardTitle(caseStudy),
        grayscale: false,
        fit: "contain" as const,
      }));
    return [...extras, ...fromGroups];
  }

  // Only fall back to the card cover photo when no gallery data was authored at all —
  // an explicit empty `gallery`/`galleryGroups` means the case study intentionally has none.
  const gallerySpecified = caseStudy.gallery !== undefined || caseStudy.galleryGroups !== undefined;
  const paths =
    caseStudy.gallery?.length
      ? caseStudy.gallery
      : gallerySpecified
        ? []
        : workPhotos[caseStudy.slug]
          ? [workPhotos[caseStudy.slug]]
          : [];

  return paths.map((src, i) => ({
    src,
    alt: `${caseStudy.client} — ${caseStudy.campaign} creative ${i + 1}`,
    label: `${workCardTitle(caseStudy)} gallery ${i + 1}`,
    grayscale: false,
    fit: "contain" as const,
  }));
}

export type WorkGalleryGroup = {
  title: string;
  description?: string;
  density?: "default" | "compact" | "solo";
  pairRow?: string;
  pairRowHeading?: string;
  items: MediaSlot[];
};

function galleryGroups(caseStudy: CaseStudy): WorkGalleryGroup[] {
  if (caseStudy.galleryGroups?.length) {
    return caseStudy.galleryGroups
      .filter((g) => g.images.length > 0)
      .map((group) => ({
        title: group.title,
        description: group.description,
        density: group.density,
        pairRow: group.pairRow,
        pairRowHeading: group.pairRowHeading,
        items: group.images.map((image, i) => ({
          src: galleryImageSrc(image),
          href: galleryImageHref(image),
          alt: `${caseStudy.client} — ${group.title} ${i + 1}`,
          label: group.title,
          grayscale: false,
          fit: "contain" as const,
        })),
      }));
  }

  const flat = gallerySlots(caseStudy);
  return flat.length ? [{ title: "Campaign Creatives", items: flat }] : [];
}

/** All deck films for a case — `videos` when present, else single `video`. */
export function caseStudyVideos(caseStudy: CaseStudy): CaseStudyVideo[] {
  if (caseStudy.videos?.length) return caseStudy.videos;
  return caseStudy.video?.src ? [caseStudy.video] : [];
}

export type WorkDetailModel = {
  caseStudy: CaseStudy;
  title: string;
  familyLabel: string;
  familyOverviewLabel: string;
  tags: string[];
  industryName: string;
  servicesUsed: string[];
  objective: string;
  mandate: string[];
  executionSummary: string;
  pillars: CaseStudyPillar[];
  heroImage: MediaSlot;
  gallery: MediaSlot[];
  galleryGroups: WorkGalleryGroup[];
  videos: CaseStudyVideo[];
  linkGroups: CaseStudyLinkGroup[];
  results: Metric[];
  resultHighlights: string[];
  builtWith: { slug: string; name: string; shortName: string; summary: string }[];
  related: CaseStudy[];
};

export function buildWorkDetailModel(caseStudy: CaseStudy): WorkDetailModel {
  const industry = industries.find((i) => i.slug === caseStudy.industry);
  const relatedServices = services.filter((s) => caseStudy.services.includes(s.slug));
  const builtWithSlugs = caseStudy.builtWithServices ?? caseStudy.services;
  const builtWithServices = services.filter((s) => builtWithSlugs.includes(s.slug));
  const gallery = gallerySlots(caseStudy);
  const groups = galleryGroups(caseStudy);

  return {
    caseStudy,
    title: workCardTitle(caseStudy),
    familyLabel: workCardTag(caseStudy),
    familyOverviewLabel: workFamilyOverviewLabel(caseStudy.family),
    tags: serviceTags(caseStudy),
    industryName: industry?.name ?? caseStudy.industry,
    servicesUsed: relatedServices.map((s) => s.shortName),
    objective: (caseStudy.objective ?? caseStudy.challenge ?? "").trim(),
    mandate: caseStudy.mandate?.length
      ? caseStudy.mandate
      : caseStudy.execution.slice(0, 4),
    executionSummary: caseStudy.executionSummary ?? caseStudy.hero,
    pillars: caseStudy.executionPillars
      ? caseStudy.executionPillars
      : caseStudy.execution.length
        ? defaultPillars(caseStudy.execution)
        : [],
    heroImage: workCardImage(caseStudy),
    gallery,
    galleryGroups: groups,
    videos: caseStudyVideos(caseStudy),
    linkGroups: caseStudy.linkGroups?.filter((g) => g.links.length > 0) ?? [],
    results: caseStudy.results ?? [],
    resultHighlights: caseStudy.resultHighlights ?? [],
    builtWith: builtWithServices.map((s) => ({
      slug: s.slug,
      name: s.name,
      shortName: s.shortName,
      summary: s.summary,
    })),
    related: getRelatedWork(caseStudy),
  };
}

/** Resolve Instagram post/reel OG thumbnails for activation links (server-only). */
export async function enrichLinkGroupThumbnails(
  groups: CaseStudyLinkGroup[],
): Promise<CaseStudyLinkGroup[]> {
  return Promise.all(
    groups.map(async (group) => ({
      ...group,
      links: await Promise.all(
        group.links.map(async (link): Promise<CaseStudyLink> => {
          if (link.thumbnail) return link;
          const thumbnail = await fetchInstagramThumbnail(link.href);
          return thumbnail ? { ...link, thumbnail } : link;
        }),
      ),
    })),
  );
}

export type WorkDetailSectionId =
  | "objective"
  | "mandate"
  | "platforms"
  | "execution"
  | "creatives"
  | "activations"
  | "gallery"
  | "video"
  | "result"
  | "built-with"
  | "related";

export type WorkDetailTab = {
  id: WorkDetailSectionId;
  label: string;
};

/** Visible case-study tabs — each section appears only when its data is present. */
const TAB_DEFINITIONS: {
  id: WorkDetailSectionId;
  label: string;
  hasContent: (model: WorkDetailModel) => boolean;
}[] = [
  { id: "objective", label: "Objective", hasContent: (m) => Boolean(m.objective) },
  { id: "mandate", label: "Mandate", hasContent: (m) => m.mandate.length > 0 },
  {
    id: "platforms",
    label: "Platforms",
    hasContent: (m) => m.galleryGroups.some((g) => g.density === "compact"),
  },
  {
    id: "execution",
    label: "Execution",
    hasContent: (m) => {
      const executionGroups = m.galleryGroups.filter((g) => g.density !== "compact");
      const hasVideo = m.videos.length > 0 && !m.caseStudy.heroVideo;
      return (
        m.pillars.length > 0 ||
        executionGroups.length > 0 ||
        (m.galleryGroups.length === 0 && m.gallery.length > 0) ||
        hasVideo ||
        Boolean(m.executionSummary)
      );
    },
  },
  {
    id: "creatives",
    label: "Creatives",
    hasContent: (m) => m.caseStudy.slug === "waaree",
  },
  {
    id: "activations",
    label: "Activations",
    hasContent: (m) => m.linkGroups.length > 0,
  },
  {
    id: "result",
    label: "Results",
    hasContent: (m) => m.results.length > 0 || m.resultHighlights.length > 0,
  },
  { id: "built-with", label: "Built With", hasContent: () => false },
  { id: "related", label: "Related", hasContent: (m) => m.related.length > 0 },
];

export function getWorkDetailTabs(model: WorkDetailModel): WorkDetailTab[] {
  return TAB_DEFINITIONS.filter((tab) => tab.hasContent(model)).map(({ id, label }) => ({
    id,
    label,
  }));
}

/** Section numbers follow visible tabs so the template stays CMS-friendly. */
export function getSectionNumber(
  sectionId: WorkDetailSectionId,
  tabs: WorkDetailTab[],
): string {
  const index = tabs.findIndex((tab) => tab.id === sectionId);
  return String((index >= 0 ? index : 0) + 1).padStart(2, "0");
}
