"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/admin/db";
import { diffJson, writeAudit } from "@/lib/admin/audit";
import { AdminAuthError, assertArea } from "@/lib/admin/dal";
import { duplicateKeys, parseFields, type FieldDef } from "@/lib/admin/fields";
import { seedStructure } from "@/lib/admin/structure";
import {
  contentTypeSchema,
  sectionTypeSchema,
  structureKeySchema,
} from "@/lib/admin/schemas";
import { fieldErrorsOf } from "@/lib/admin/actions/types";
import type { ActionState } from "@/lib/admin/actions/types";

/**
 * Structure management — add, edit and remove the content types and section
 * types that define the shape of the site. Super Admin only.
 */

function refresh(): void {
  revalidatePath("/admin", "layout");
  revalidatePath("/admin/structure");
}

function parseFieldsInput(raw: FormDataEntryValue | null): FieldDef[] | { error: string } {
  const text = String(raw ?? "").trim();
  if (!text) return [];

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { error: "Fields must be valid JSON." };
  }
  if (!Array.isArray(parsed)) return { error: "Fields must be a JSON array." };

  const fields = parseFields(parsed);
  if (fields.length !== parsed.length) {
    return { error: "One or more fields are missing a key, label or valid type." };
  }

  const duplicates = duplicateKeys(fields);
  if (duplicates.length > 0) {
    return { error: `Duplicate field keys: ${duplicates.join(", ")}` };
  }

  return fields;
}

// ---------------------------------------------------------------------------
// Content types
// ---------------------------------------------------------------------------

export async function saveContentTypeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");

    const parsed = contentTypeSchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      key: formData.get("key"),
      label: formData.get("label"),
      singular: formData.get("singular"),
      kind: formData.get("kind"),
      group: formData.get("group"),
      icon: formData.get("icon") || "FileText",
      description: formData.get("description") ?? "",
      detailPath: String(formData.get("detailPath") ?? "").trim() || undefined,
      revalidatePaths: splitLines(formData.get("revalidatePaths")),
      orderable: formData.get("orderable") === "on",
      usesSections: formData.get("usesSections") === "on",
      allowedSectionKeys: formData.getAll("allowedSectionKeys").map(String).filter(Boolean),
      enabled: formData.get("enabled") === "on",
    });

    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };

    const fields = parseFieldsInput(formData.get("fields"));
    if (!Array.isArray(fields)) return { ok: false, fieldErrors: { fields: fields.error } };

    const { id, ...values } = parsed.data;

    const clash = await prisma.contentType.findUnique({ where: { key: values.key } });
    if (clash && clash.id !== id) {
      return { ok: false, fieldErrors: { key: "That key is already in use." } };
    }

    if (id) {
      const before = await prisma.contentType.findUnique({ where: { id } });
      if (!before) return { ok: false, message: "That content type no longer exists." };

      const after = await prisma.contentType.update({
        where: { id },
        data: {
          ...values,
          detailPath: values.detailPath ?? null,
          fields: fields as unknown as object,
        },
      });

      await writeAudit({
        actor,
        action: "STRUCTURE_UPDATED",
        entityType: "structure",
        entityId: after.id,
        entityLabel: after.label,
        summary: `Updated content type "${after.label}"`,
        diff: diffJson(
          { ...before, fields: parseFields(before.fields) },
          { ...after, fields },
        ),
      });

      refresh();
      return { ok: true, message: `Saved "${after.label}".` };
    }

    const last = await prisma.contentType.findFirst({
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const created = await prisma.contentType.create({
      data: {
        ...values,
        detailPath: values.detailPath ?? null,
        fields: fields as unknown as object,
        position: (last?.position ?? -1) + 1,
        isSystem: false,
      },
    });

    await writeAudit({
      actor,
      action: "STRUCTURE_CREATED",
      entityType: "structure",
      entityId: created.id,
      entityLabel: created.label,
      summary: `Created content type "${created.label}"`,
    });

    refresh();
    redirect(`/admin/structure/content-types/${created.key}`);
  } catch (error) {
    return errorState(error);
  }
}

export async function deleteContentTypeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");
    const parsed = structureKeySchema.safeParse({ key: formData.get("key") });
    if (!parsed.success) return { ok: false, message: "Missing content type." };

    const type = await prisma.contentType.findUnique({ where: { key: parsed.data.key } });
    if (!type) return { ok: false, message: "That content type no longer exists." };
    if (type.isSystem) {
      return {
        ok: false,
        message: "Built-in types cannot be deleted. Disable it instead to hide it from the sidebar.",
      };
    }

    const entries = await prisma.contentEntry.count({ where: { module: type.key } });
    if (entries > 0) {
      return {
        ok: false,
        message: `"${type.label}" still has ${entries} entr${entries === 1 ? "y" : "ies"}. Delete them first.`,
      };
    }

    await prisma.contentType.delete({ where: { id: type.id } });

    await writeAudit({
      actor,
      action: "STRUCTURE_DELETED",
      entityType: "structure",
      entityLabel: type.label,
      summary: `Deleted content type "${type.label}"`,
    });

    refresh();
    return { ok: true, message: `Deleted "${type.label}".` };
  } catch (error) {
    return errorState(error);
  }
}

export async function reorderContentTypesAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");
    const ids = String(formData.get("orderedIds") ?? "").split(",").filter(Boolean);
    if (ids.length === 0) return { ok: false, message: "Nothing to reorder." };

    await prisma.$transaction(
      ids.map((id, index) => prisma.contentType.update({ where: { id }, data: { position: index } })),
    );

    await writeAudit({
      actor,
      action: "STRUCTURE_UPDATED",
      entityType: "structure",
      summary: "Reordered the sidebar",
    });

    refresh();
    return { ok: true, message: "Order saved." };
  } catch (error) {
    return errorState(error);
  }
}

// ---------------------------------------------------------------------------
// Section types
// ---------------------------------------------------------------------------

export async function saveSectionTypeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");

    const parsed = sectionTypeSchema.safeParse({
      id: String(formData.get("id") ?? "") || undefined,
      key: formData.get("key"),
      label: formData.get("label"),
      description: formData.get("description") ?? "",
      icon: formData.get("icon") || "LayoutTemplate",
      group: formData.get("group") || "Content",
      enabled: formData.get("enabled") === "on",
    });

    if (!parsed.success) return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };

    const fields = parseFieldsInput(formData.get("fields"));
    if (!Array.isArray(fields)) return { ok: false, fieldErrors: { fields: fields.error } };

    const { id, ...values } = parsed.data;

    const clash = await prisma.sectionType.findUnique({ where: { key: values.key } });
    if (clash && clash.id !== id) {
      return { ok: false, fieldErrors: { key: "That key is already in use." } };
    }

    if (id) {
      const before = await prisma.sectionType.findUnique({ where: { id } });
      if (!before) return { ok: false, message: "That section no longer exists." };

      const after = await prisma.sectionType.update({
        where: { id },
        data: { ...values, fields: fields as unknown as object },
      });

      await writeAudit({
        actor,
        action: "STRUCTURE_UPDATED",
        entityType: "structure",
        entityId: after.id,
        entityLabel: after.label,
        summary: `Updated section "${after.label}"`,
        diff: diffJson({ fields: parseFields(before.fields) }, { fields }),
      });

      refresh();
      return { ok: true, message: `Saved "${after.label}".` };
    }

    const last = await prisma.sectionType.findFirst({
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const created = await prisma.sectionType.create({
      data: {
        ...values,
        fields: fields as unknown as object,
        position: (last?.position ?? -1) + 1,
        isSystem: false,
      },
    });

    await writeAudit({
      actor,
      action: "STRUCTURE_CREATED",
      entityType: "structure",
      entityId: created.id,
      entityLabel: created.label,
      summary: `Created section "${created.label}"`,
    });

    refresh();
    redirect(`/admin/structure/sections/${created.key}`);
  } catch (error) {
    return errorState(error);
  }
}

export async function deleteSectionTypeAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");
    const parsed = structureKeySchema.safeParse({ key: formData.get("key") });
    if (!parsed.success) return { ok: false, message: "Missing section." };

    const type = await prisma.sectionType.findUnique({ where: { key: parsed.data.key } });
    if (!type) return { ok: false, message: "That section no longer exists." };
    if (type.isSystem) {
      return { ok: false, message: "Built-in sections cannot be deleted. Disable it instead." };
    }

    await prisma.sectionType.delete({ where: { id: type.id } });

    await writeAudit({
      actor,
      action: "STRUCTURE_DELETED",
      entityType: "structure",
      entityLabel: type.label,
      summary: `Deleted section "${type.label}"`,
    });

    refresh();
    return { ok: true, message: `Deleted "${type.label}".` };
  } catch (error) {
    return errorState(error);
  }
}

/** Re-adds anything missing from the code defaults. Never overwrites. */
export async function seedStructureAction(
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");
    const summary = await seedStructure();

    await writeAudit({
      actor,
      action: "STRUCTURE_CREATED",
      entityType: "structure",
      summary: `Seeded ${summary.contentTypes} content type(s) and ${summary.sectionTypes} section(s)`,
    });

    refresh();

    if (summary.contentTypes === 0 && summary.sectionTypes === 0) {
      return { ok: true, message: "Everything from the defaults is already here." };
    }
    return {
      ok: true,
      message: `Added ${summary.contentTypes} content type(s) and ${summary.sectionTypes} section(s).`,
    };
  } catch (error) {
    return errorState(error);
  }
}

function splitLines(value: FormDataEntryValue | null): string[] {
  return String(value ?? "")
    .split(/[\n,]/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function errorState(error: unknown): ActionState {
  // `redirect()` throws a control-flow signal that must not be swallowed.
  if (error && typeof error === "object" && "digest" in error) throw error;
  if (error instanceof AdminAuthError) return { ok: false, message: error.message };
  console.error("[admin] structure action failed", error);
  return { ok: false, message: "Something went wrong. Try again." };
}
