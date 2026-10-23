import { emptyValues, type FieldDef } from "@/lib/admin/fields";

/**
 * The shape stored in `ContentEntry.data` / `publishedData`.
 *
 *   { fields: {...}, sections: [ { id, type, enabled, data } ] }
 *
 * `fields` holds the content type's fixed fields; `sections` is the stack an
 * editor builds on a page. A page gaining or losing a section is a change to
 * this array — no schema migration.
 *
 * Client-safe.
 */

export type SectionInstance = {
  /** Stable id so reordering does not remount the wrong editor. */
  id: string;
  /** SectionType.key */
  type: string;
  enabled: boolean;
  data: Record<string, unknown>;
};

export type EntryDocument = {
  fields: Record<string, unknown>;
  sections: SectionInstance[];
};

/**
 * Reads any stored payload as an EntryDocument.
 *
 * Entries imported from the old TypeScript content files are flat objects with
 * no `sections` key. Those are treated as `fields`, so nothing has to be
 * re-imported when a type switches to sections.
 */
export function toDocument(value: unknown): EntryDocument {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { fields: {}, sections: [] };
  }

  const record = value as Record<string, unknown>;
  const hasEnvelope =
    Object.hasOwn(record, "sections") ||
    (Object.hasOwn(record, "fields") && typeof record.fields === "object");

  if (!hasEnvelope) {
    // Legacy flat payload.
    return { fields: record, sections: [] };
  }

  return {
    fields:
      record.fields && typeof record.fields === "object" && !Array.isArray(record.fields)
        ? (record.fields as Record<string, unknown>)
        : {},
    sections: Array.isArray(record.sections)
      ? record.sections.flatMap((item) => {
          const section = toSection(item);
          return section ? [section] : [];
        })
      : [],
  };
}

function toSection(value: unknown): SectionInstance | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  if (typeof record.type !== "string" || !record.type) return null;

  return {
    id: typeof record.id === "string" && record.id ? record.id : createSectionId(record.type, 0),
    type: record.type,
    enabled: record.enabled !== false,
    data:
      record.data && typeof record.data === "object" && !Array.isArray(record.data)
        ? (record.data as Record<string, unknown>)
        : {},
  };
}

export function fromDocument(document: EntryDocument): Record<string, unknown> {
  return { fields: document.fields, sections: document.sections };
}

/**
 * Ids must be stable but generated on the server; `crypto.randomUUID` is
 * available in both the Node and browser runtimes Next uses.
 */
export function createSectionId(typeKey: string, index: number): string {
  const random =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 8)
      : `${index}`;
  return `${typeKey}-${random}`;
}

export function newSection(typeKey: string, fields: FieldDef[], index = 0): SectionInstance {
  return {
    id: createSectionId(typeKey, index),
    type: typeKey,
    enabled: true,
    data: emptyValues(fields),
  };
}

export function moveSection(
  sections: SectionInstance[],
  id: string,
  direction: "up" | "down",
): SectionInstance[] {
  const index = sections.findIndex((section) => section.id === id);
  if (index === -1) return sections;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= sections.length) return sections;

  const next = [...sections];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

/** Only what the public site should render: enabled sections, in order. */
export function publishedSections(document: EntryDocument): SectionInstance[] {
  return document.sections.filter((section) => section.enabled);
}
