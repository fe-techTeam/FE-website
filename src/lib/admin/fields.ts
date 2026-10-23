import { z } from "zod";

/**
 * The field vocabulary the whole admin is built on.
 *
 * A content type and a section type each carry a `FieldDef[]`. Editing forms,
 * validation and the health scanner all read from these definitions, so adding
 * a field to a page section is a data change — no new component, no deploy.
 *
 * Client-safe: no server-only imports.
 */

export const FIELD_TYPES = [
  "text",
  "textarea",
  "richtext",
  "number",
  "boolean",
  "slug",
  "url",
  "email",
  "date",
  "color",
  "select",
  "image",
  "video",
  "file",
  "list",
  "group",
  "reference",
] as const;

export type FieldType = (typeof FIELD_TYPES)[number];

export type FieldOption = { label: string; value: string };

export type FieldDef = {
  /** Key in the stored JSON payload. */
  key: string;
  label: string;
  type: FieldType;
  /** Helper text under the input. */
  help?: string;
  required?: boolean;
  placeholder?: string;
  /** `select` choices. */
  options?: FieldOption[];
  /** Children for `group`, and for `list` when items are objects. */
  fields?: FieldDef[];
  /** For a `list` of scalars — the type of each item. Omit for object items. */
  itemType?: Exclude<FieldType, "list" | "group">;
  /** Button label, e.g. "Add metric". */
  itemLabel?: string;
  /** For `reference` — the content type key being pointed at. */
  referenceType?: string;
  /** `reference` may select several entries. */
  multiple?: boolean;
  min?: number;
  max?: number;
  /** Layout hint for the form grid. */
  width?: "full" | "half";
};

/** Field types whose value is a path under /public — used by the health scan. */
export const ASSET_FIELD_TYPES: FieldType[] = ["image", "video", "file"];

/** Field types that hold nested definitions. */
export const CONTAINER_FIELD_TYPES: FieldType[] = ["list", "group"];

export const FIELD_TYPE_LABELS: Record<FieldType, string> = {
  text: "Single-line text",
  textarea: "Paragraph",
  richtext: "Rich text",
  number: "Number",
  boolean: "Toggle",
  slug: "Slug",
  url: "URL or path",
  email: "Email",
  date: "Date",
  color: "Colour",
  select: "Choice",
  image: "Image",
  video: "Video",
  file: "File",
  list: "Repeatable list",
  group: "Group",
  reference: "Link to other content",
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export const FIELD_KEY_PATTERN = /^[a-z][a-zA-Z0-9]*$/;

const baseFieldSchema = z.object({
  key: z
    .string()
    .min(1, { error: "Every field needs a key." })
    .regex(FIELD_KEY_PATTERN, {
      error: "Use camelCase letters and numbers, starting with a lowercase letter.",
    }),
  label: z.string().min(1, { error: "Every field needs a label." }),
  type: z.enum(FIELD_TYPES),
  help: z.string().optional(),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  options: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
  itemType: z.enum(FIELD_TYPES).exclude(["list", "group"]).optional(),
  itemLabel: z.string().optional(),
  referenceType: z.string().optional(),
  multiple: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  width: z.enum(["full", "half"]).optional(),
});

/** Recursive — `list` and `group` nest further field definitions. */
export const fieldDefSchema: z.ZodType<FieldDef> = baseFieldSchema
  .extend({
    fields: z.lazy(() => z.array(fieldDefSchema)).optional(),
  })
  .refine((field) => field.type !== "select" || (field.options?.length ?? 0) > 0, {
    error: "A choice field needs at least one option.",
    path: ["options"],
  });

export const fieldListSchema = z.array(fieldDefSchema);

/** Parses a stored JSON blob into FieldDef[], tolerating bad rows. */
export function parseFields(value: unknown): FieldDef[] {
  const result = fieldListSchema.safeParse(value);
  if (result.success) return result.data;
  if (!Array.isArray(value)) return [];

  // Keep whatever is individually valid so one broken field cannot hide a page.
  return value.flatMap((item) => {
    const parsed = fieldDefSchema.safeParse(item);
    return parsed.success ? [parsed.data] : [];
  });
}

export function duplicateKeys(fields: FieldDef[]): string[] {
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  for (const field of fields) {
    if (seen.has(field.key)) duplicates.add(field.key);
    seen.add(field.key);
  }
  return [...duplicates];
}

// ---------------------------------------------------------------------------
// Values
// ---------------------------------------------------------------------------

/** A blank value of the right shape, used when adding a section or entry. */
export function emptyValue(field: FieldDef): unknown {
  switch (field.type) {
    case "boolean":
      return false;
    case "number":
      return null;
    case "list":
      return [];
    case "group":
      return emptyValues(field.fields ?? []);
    case "reference":
      return field.multiple ? [] : null;
    case "image":
    case "video":
    case "file":
      return { src: "", alt: "", label: field.label };
    default:
      return "";
  }
}

export function emptyValues(fields: FieldDef[]): Record<string, unknown> {
  const value: Record<string, unknown> = {};
  for (const field of fields) value[field.key] = emptyValue(field);
  return value;
}

/** Walks a value against its definitions, yielding every asset path found. */
export function collectAssetPaths(
  fields: FieldDef[],
  value: unknown,
  path = "",
): { field: string; value: string }[] {
  if (!value || typeof value !== "object") return [];
  const record = value as Record<string, unknown>;
  const found: { field: string; value: string }[] = [];

  for (const field of fields) {
    const child = record[field.key];
    const childPath = path ? `${path}.${field.key}` : field.key;
    if (child === undefined || child === null) continue;

    if (ASSET_FIELD_TYPES.includes(field.type)) {
      const src = typeof child === "string" ? child : (child as { src?: string }).src;
      if (typeof src === "string" && src.startsWith("/")) {
        found.push({ field: childPath, value: src });
      }
      continue;
    }

    if (field.type === "group" && field.fields) {
      found.push(...collectAssetPaths(field.fields, child, childPath));
      continue;
    }

    if (field.type === "list" && field.fields && Array.isArray(child)) {
      child.forEach((item, index) => {
        found.push(...collectAssetPaths(field.fields ?? [], item, `${childPath}[${index}]`));
      });
    }
  }

  return found;
}
