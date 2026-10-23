import {
  buildFallbackDetail,
  careerDetailHeroImage,
  careerRoleDetails,
  careersRoles,
  type CareerDetailSectionId,
  type CareerDetailTab,
  type CareerListItem,
  type CareerRole,
  type CareerRoleDetail,
  type CareerWorkArea,
} from "@/content/careers";

export type { CareerDetailSectionId, CareerDetailTab, CareerRole, CareerRoleDetail };

export function getCareerRoleHref(slug: string): string {
  return `/careers/${slug}`;
}

function sanitizeText(value: string | undefined | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function sanitizeListItems(items: CareerListItem[] | undefined): CareerListItem[] {
  if (!items?.length) return [];

  return items.filter((item) => sanitizeText(item?.title) && sanitizeText(item?.body));
}

function sanitizeWorkAreas(items: CareerWorkArea[] | undefined): CareerWorkArea[] {
  if (!items?.length) return [];

  return items.filter((item) => sanitizeText(item?.title) && sanitizeText(item?.body));
}

export function normalizeCareerRole(role: CareerRole): CareerRole | null {
  const slug = sanitizeText(role.slug);
  const title = sanitizeText(role.title);

  if (!slug || !title) return null;

  return {
    ...role,
    slug,
    title,
    location: sanitizeText(role.location),
    department: sanitizeText(role.department),
    type: sanitizeText(role.type),
    experience: sanitizeText(role.experience) || undefined,
    href: role.href ?? getCareerRoleHref(slug),
  };
}

export function normalizeCareerRoleDetail(
  role: CareerRole,
  detail?: Partial<CareerRoleDetail> | null,
): CareerRoleDetail {
  const fallback = buildFallbackDetail(role);

  if (!detail) {
    return {
      ...fallback,
      responsibilities: sanitizeListItems(fallback.responsibilities),
      workAreas: sanitizeWorkAreas(fallback.workAreas),
      requirements: sanitizeListItems(fallback.requirements),
      benefits: sanitizeListItems(fallback.benefits),
    };
  }

  return {
    slug: role.slug,
    eyebrow: sanitizeText(detail.eyebrow) || fallback.eyebrow,
    headlineBefore: sanitizeText(detail.headlineBefore) || fallback.headlineBefore,
    headlineAccent: sanitizeText(detail.headlineAccent) || fallback.headlineAccent,
    summary: sanitizeText(detail.summary) || fallback.summary,
    heroImage: detail.heroImage ?? fallback.heroImage ?? careerDetailHeroImage,
    heroBurst: sanitizeText(detail.heroBurst) || fallback.heroBurst,
    aboutRole:
      detail.aboutRole !== undefined ? sanitizeText(detail.aboutRole) : fallback.aboutRole,
    responsibilities:
      detail.responsibilities !== undefined
        ? sanitizeListItems(detail.responsibilities)
        : sanitizeListItems(fallback.responsibilities),
    workAreas:
      detail.workAreas !== undefined
        ? sanitizeWorkAreas(detail.workAreas)
        : sanitizeWorkAreas(fallback.workAreas),
    requirements:
      detail.requirements !== undefined
        ? sanitizeListItems(detail.requirements)
        : sanitizeListItems(fallback.requirements),
    benefits:
      detail.benefits !== undefined
        ? sanitizeListItems(detail.benefits)
        : sanitizeListItems(fallback.benefits),
    aboutUs: detail.aboutUs !== undefined ? sanitizeText(detail.aboutUs) : fallback.aboutUs,
  };
}

const TAB_DEFINITIONS: {
  id: CareerDetailSectionId;
  label: string;
  hasContent: (detail: CareerRoleDetail) => boolean;
}[] = [
  { id: "overview", label: "Overview", hasContent: (detail) => Boolean(detail.aboutRole?.trim()) },
  {
    id: "responsibilities",
    label: "Responsibilities",
    hasContent: (detail) => detail.responsibilities.length > 0,
  },
  {
    id: "requirements",
    label: "Requirements",
    hasContent: (detail) => detail.requirements.length > 0,
  },
  { id: "benefits", label: "Benefits", hasContent: (detail) => detail.benefits.length > 0 },
  { id: "about-us", label: "About Us", hasContent: (detail) => Boolean(detail.aboutUs?.trim()) },
];

export function getCareerDetailTabs(detail: CareerRoleDetail): CareerDetailTab[] {
  return TAB_DEFINITIONS.filter((tab) => tab.hasContent(detail)).map(({ id, label }) => ({
    id,
    label,
  }));
}

async function loadCareerRolesFromSource(): Promise<CareerRole[]> {
  // Swap this for a CMS/API fetch when roles are managed dynamically, e.g.:
  // const response = await fetch(`${process.env.CMS_URL}/careers`, { next: { revalidate: 3600 } });
  // if (!response.ok) throw new Error("Failed to load careers");
  // return (await response.json()) as CareerRole[];
  return careersRoles;
}

async function loadCareerRoleDetailFromSource(
  slug: string,
): Promise<Partial<CareerRoleDetail> | null> {
  // Swap for per-role CMS/API fetch when detail pages are managed dynamically, e.g.:
  // const response = await fetch(`${process.env.CMS_URL}/careers/${slug}`, { next: { revalidate: 3600 } });
  // if (response.status === 404) return null;
  // if (!response.ok) throw new Error(`Failed to load career detail for ${slug}`);
  // return (await response.json()) as Partial<CareerRoleDetail>;
  return careerRoleDetails[slug] ?? null;
}

export async function getCareerRoles(): Promise<CareerRole[]> {
  const roles = await loadCareerRolesFromSource();
  return roles
    .map(normalizeCareerRole)
    .filter((role): role is CareerRole => role !== null);
}

export async function getCareerRoleBySlug(slug: string): Promise<CareerRole | null> {
  const normalizedSlug = sanitizeText(slug);
  if (!normalizedSlug) return null;

  const roles = await getCareerRoles();
  return roles.find((role) => role.slug === normalizedSlug) ?? null;
}

export async function getCareerRoleDetail(slug: string): Promise<CareerRoleDetail | null> {
  const role = await getCareerRoleBySlug(slug);
  if (!role) return null;

  const detail = await loadCareerRoleDetailFromSource(slug);
  return normalizeCareerRoleDetail(role, detail);
}

export async function getRelatedCareerRoles(slug: string, limit = 4): Promise<CareerRole[]> {
  const roles = await getCareerRoles();
  const current = roles.find((role) => role.slug === slug);

  const candidates = roles.filter((role) => role.slug !== slug);
  const sameDepartment = current?.department
    ? candidates.filter((role) => role.department === current.department)
    : [];
  const otherRoles = candidates.filter(
    (role) => !current?.department || role.department !== current.department,
  );

  return [...sameDepartment, ...otherRoles].slice(0, limit);
}

export function getFirstDetailSectionId(
  sectionTabs: CareerDetailTab[],
): CareerDetailSectionId | "apply" {
  return sectionTabs[0]?.id ?? "apply";
}
