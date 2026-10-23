import "server-only";

import { cache } from "react";

import { prisma } from "@/lib/admin/db";
import { parseFields, type FieldDef } from "@/lib/admin/fields";
import {
  CONTENT_TYPE_SEEDS,
  SECTION_TYPE_SEEDS,
  type ContentTypeSeed,
  type SectionTypeSeed,
} from "@/lib/admin/structure-defaults";

/**
 * Runtime access to the site's structure.
 *
 * `ContentType` and `SectionType` rows in the database are the source of truth.
 * `structure-defaults.ts` only seeds them, so pages and sections can be added
 * or reshaped from Admin → Structure without a deploy.
 *
 * Reads are memoised per request with React `cache`.
 */

export type ContentTypeDTO = {
  id: string;
  key: string;
  label: string;
  singular: string;
  kind: "COLLECTION" | "SINGLETON";
  group: string;
  icon: string;
  description: string;
  detailPath: string | null;
  revalidatePaths: string[];
  orderable: boolean;
  usesSections: boolean;
  allowedSectionKeys: string[];
  fields: FieldDef[];
  position: number;
  enabled: boolean;
  isSystem: boolean;
};

export type SectionTypeDTO = {
  id: string;
  key: string;
  label: string;
  description: string;
  icon: string;
  group: string;
  fields: FieldDef[];
  position: number;
  enabled: boolean;
  isSystem: boolean;
};

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export const getContentTypes = cache(async (): Promise<ContentTypeDTO[]> => {
  const rows = await prisma.contentType.findMany({ orderBy: [{ position: "asc" }, { label: "asc" }] });
  return rows.map(toContentTypeDTO);
});

/** Only the types that should appear in navigation. */
export const getActiveContentTypes = cache(async (): Promise<ContentTypeDTO[]> => {
  const types = await getContentTypes();
  return types.filter((type) => type.enabled);
});

export const getContentType = cache(async (key: string): Promise<ContentTypeDTO | null> => {
  const types = await getContentTypes();
  return types.find((type) => type.key === key) ?? null;
});

export async function requireContentType(key: string): Promise<ContentTypeDTO> {
  const type = await getContentType(key);
  if (!type) throw new Error(`Unknown content type: ${key}`);
  return type;
}

export const getSectionTypes = cache(async (): Promise<SectionTypeDTO[]> => {
  const rows = await prisma.sectionType.findMany({ orderBy: [{ position: "asc" }, { label: "asc" }] });
  return rows.map(toSectionTypeDTO);
});

export const getSectionType = cache(async (key: string): Promise<SectionTypeDTO | null> => {
  const types = await getSectionTypes();
  return types.find((type) => type.key === key) ?? null;
});

/** Section types an editor may add to this content type. */
export async function sectionTypesFor(contentType: ContentTypeDTO): Promise<SectionTypeDTO[]> {
  const all = (await getSectionTypes()).filter((type) => type.enabled);
  if (contentType.allowedSectionKeys.length === 0) return all;
  return all.filter((type) => contentType.allowedSectionKeys.includes(type.key));
}

export async function contentTypeKeys(): Promise<string[]> {
  return (await getContentTypes()).map((type) => type.key);
}

/** Distinct sidebar groups, in seed order with any new ones appended. */
export async function contentGroups(): Promise<string[]> {
  const types = await getActiveContentTypes();
  const seen: string[] = [];
  for (const type of types) {
    if (!seen.includes(type.group)) seen.push(type.group);
  }
  return seen;
}

// ---------------------------------------------------------------------------
// Route helpers (previously in modules.ts)
// ---------------------------------------------------------------------------

export function resolvePath(pattern: string, slug: string): string {
  return pattern.replace("[slug]", slug);
}

export async function revalidationPaths(typeKey: string, slug: string): Promise<string[]> {
  const type = await getContentType(typeKey);
  if (!type) return [];
  return type.revalidatePaths.map((pattern) => resolvePath(pattern, slug));
}

/** Public URL of an entry, for preview and "view live" links. */
export async function publicPath(typeKey: string, slug: string): Promise<string | null> {
  const type = await getContentType(typeKey);
  if (!type) return null;
  if (type.detailPath) return resolvePath(type.detailPath, slug);
  return type.revalidatePaths[0] ?? null;
}

// ---------------------------------------------------------------------------
// Seeding
// ---------------------------------------------------------------------------

export type SeedSummary = { contentTypes: number; sectionTypes: number; skipped: number };

/**
 * Inserts anything from `structure-defaults.ts` that is not already present.
 * Never overwrites: once a type exists, the database wins.
 */
export async function seedStructure(): Promise<SeedSummary> {
  const [existingTypes, existingSections] = await Promise.all([
    prisma.contentType.findMany({ select: { key: true } }),
    prisma.sectionType.findMany({ select: { key: true } }),
  ]);

  const typeKeys = new Set(existingTypes.map((row) => row.key));
  const sectionKeys = new Set(existingSections.map((row) => row.key));

  let contentTypes = 0;
  let sectionTypes = 0;
  let skipped = 0;

  for (const [index, seed] of SECTION_TYPE_SEEDS.entries()) {
    if (sectionKeys.has(seed.key)) {
      skipped += 1;
      continue;
    }
    await prisma.sectionType.create({ data: sectionTypeData(seed, index) });
    sectionTypes += 1;
  }

  for (const [index, seed] of CONTENT_TYPE_SEEDS.entries()) {
    if (typeKeys.has(seed.key)) {
      skipped += 1;
      continue;
    }
    await prisma.contentType.create({ data: contentTypeData(seed, index) });
    contentTypes += 1;
  }

  return { contentTypes, sectionTypes, skipped };
}

function contentTypeData(seed: ContentTypeSeed, index: number) {
  return {
    key: seed.key,
    label: seed.label,
    singular: seed.singular,
    kind: seed.kind,
    group: seed.group,
    icon: seed.icon,
    description: seed.description,
    detailPath: seed.detailPath ?? null,
    revalidatePaths: seed.revalidatePaths,
    orderable: seed.orderable ?? false,
    usesSections: seed.usesSections ?? false,
    allowedSectionKeys: seed.allowedSectionKeys ?? [],
    fields: seed.fields as unknown as object,
    position: index,
    enabled: true,
    isSystem: true,
  };
}

function sectionTypeData(seed: SectionTypeSeed, index: number) {
  return {
    key: seed.key,
    label: seed.label,
    description: seed.description,
    icon: seed.icon,
    group: seed.group,
    fields: seed.fields as unknown as object,
    position: index,
    enabled: true,
    isSystem: true,
  };
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

type ContentTypeRow = Awaited<ReturnType<typeof prisma.contentType.findMany>>[number];
type SectionTypeRow = Awaited<ReturnType<typeof prisma.sectionType.findMany>>[number];

function toContentTypeDTO(row: ContentTypeRow): ContentTypeDTO {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    singular: row.singular,
    kind: row.kind,
    group: row.group,
    icon: row.icon,
    description: row.description,
    detailPath: row.detailPath,
    revalidatePaths: row.revalidatePaths,
    orderable: row.orderable,
    usesSections: row.usesSections,
    allowedSectionKeys: row.allowedSectionKeys,
    fields: parseFields(row.fields),
    position: row.position,
    enabled: row.enabled,
    isSystem: row.isSystem,
  };
}

function toSectionTypeDTO(row: SectionTypeRow): SectionTypeDTO {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    description: row.description,
    icon: row.icon,
    group: row.group,
    fields: parseFields(row.fields),
    position: row.position,
    enabled: row.enabled,
    isSystem: row.isSystem,
  };
}
