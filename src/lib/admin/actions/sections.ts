"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/admin/db";
import { writeAudit } from "@/lib/admin/audit";
import { AdminAuthError, assertCapability } from "@/lib/admin/dal";
import { ContentError, getEntry, toInputJson } from "@/lib/admin/content";
import {
  fromDocument,
  moveSection,
  newSection,
  toDocument,
  type SectionInstance,
} from "@/lib/admin/documents";
import { getSectionType, requireContentType } from "@/lib/admin/structure";
import { sectionInstanceSchema, sectionMoveSchema, sectionToggleSchema } from "@/lib/admin/schemas";
import type { ActionState } from "@/lib/admin/actions/types";

/**
 * The section builder — add, remove, reorder and toggle the sections that make
 * up a page. Changing a page's composition is content work, not a code change.
 *
 * Every mutation writes a new draft; the live site only changes on publish.
 */

async function loadEditable(entryId: string) {
  const entry = await getEntry(entryId);
  if (!entry) throw new ContentError("That content no longer exists.");

  const actor = await assertCapability("edit", entry.module);
  const contentType = await requireContentType(entry.module);

  if (!contentType.usesSections) {
    throw new ContentError(`${contentType.label} does not use sections.`);
  }

  return { entry, actor, contentType, document: toDocument(entry.data) };
}

async function saveSections(
  entryId: string,
  sections: SectionInstance[],
  document: { fields: Record<string, unknown> },
  actorId: string,
): Promise<void> {
  const next = fromDocument({ fields: document.fields, sections });

  await prisma.contentEntry.update({
    where: { id: entryId },
    data: {
      data: toInputJson(next),
      hasUnpublishedChanges: true,
      updatedById: actorId,
    },
  });
}

function refresh(moduleKey: string, entryId: string): void {
  revalidatePath(`/admin/content/${moduleKey}/${entryId}`);
}

export async function addSectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = sectionInstanceSchema.safeParse({
      entryId: formData.get("entryId"),
      sectionType: formData.get("sectionType"),
    });
    if (!parsed.success) return { ok: false, message: "Pick a section to add." };

    const { entry, actor, contentType, document } = await loadEditable(parsed.data.entryId);

    const sectionType = await getSectionType(parsed.data.sectionType);
    if (!sectionType || !sectionType.enabled) {
      return { ok: false, message: "That section is not available." };
    }
    if (
      contentType.allowedSectionKeys.length > 0 &&
      !contentType.allowedSectionKeys.includes(sectionType.key)
    ) {
      return { ok: false, message: `${sectionType.label} is not allowed on ${contentType.label}.` };
    }

    const sections = [
      ...document.sections,
      newSection(sectionType.key, sectionType.fields, document.sections.length),
    ];

    await saveSections(entry.id, sections, document, actor.id);

    await writeAudit({
      actor,
      action: "SECTION_ADDED",
      entityType: entry.module,
      entityId: entry.id,
      entityLabel: entry.title,
      summary: `Added a "${sectionType.label}" section to "${entry.title}"`,
    });

    refresh(entry.module, entry.id);
    return { ok: true, message: `Added ${sectionType.label}. Publish to make it live.` };
  } catch (error) {
    return errorState(error);
  }
}

export async function removeSectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = sectionToggleSchema.safeParse({
      entryId: formData.get("entryId"),
      sectionId: formData.get("sectionId"),
    });
    if (!parsed.success) return { ok: false, message: "Missing section." };

    const { entry, actor, document } = await loadEditable(parsed.data.entryId);

    const target = document.sections.find((section) => section.id === parsed.data.sectionId);
    if (!target) return { ok: false, message: "That section is already gone." };

    const sections = document.sections.filter((section) => section.id !== parsed.data.sectionId);
    await saveSections(entry.id, sections, document, actor.id);

    await writeAudit({
      actor,
      action: "SECTION_REMOVED",
      entityType: entry.module,
      entityId: entry.id,
      entityLabel: entry.title,
      summary: `Removed the "${target.type}" section from "${entry.title}"`,
    });

    refresh(entry.module, entry.id);
    return { ok: true, message: "Section removed. Publish to make it live." };
  } catch (error) {
    return errorState(error);
  }
}

export async function moveSectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = sectionMoveSchema.safeParse({
      entryId: formData.get("entryId"),
      sectionId: formData.get("sectionId"),
      direction: formData.get("direction"),
    });
    if (!parsed.success) return { ok: false, message: "Missing section." };

    const { entry, actor, document } = await loadEditable(parsed.data.entryId);
    const sections = moveSection(document.sections, parsed.data.sectionId, parsed.data.direction);

    if (sections === document.sections) {
      return { ok: false, message: "That section is already at the end." };
    }

    await saveSections(entry.id, sections, document, actor.id);

    await writeAudit({
      actor,
      action: "SECTION_REORDERED",
      entityType: entry.module,
      entityId: entry.id,
      entityLabel: entry.title,
      summary: `Reordered sections on "${entry.title}"`,
    });

    refresh(entry.module, entry.id);
    return { ok: true, message: "Order saved. Publish to make it live." };
  } catch (error) {
    return errorState(error);
  }
}

/** Hide a section without deleting its content. */
export async function toggleSectionAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsed = sectionToggleSchema.safeParse({
      entryId: formData.get("entryId"),
      sectionId: formData.get("sectionId"),
    });
    if (!parsed.success) return { ok: false, message: "Missing section." };

    const { entry, actor, document } = await loadEditable(parsed.data.entryId);

    let enabled = true;
    const sections = document.sections.map((section) => {
      if (section.id !== parsed.data.sectionId) return section;
      enabled = !section.enabled;
      return { ...section, enabled };
    });

    await saveSections(entry.id, sections, document, actor.id);

    refresh(entry.module, entry.id);
    return {
      ok: true,
      message: enabled ? "Section shown. Publish to make it live." : "Section hidden. Publish to make it live.",
    };
  } catch (error) {
    return errorState(error);
  }
}

function errorState(error: unknown): ActionState {
  if (error instanceof AdminAuthError || error instanceof ContentError) {
    return { ok: false, message: error.message };
  }
  console.error("[admin] section action failed", error);
  return { ok: false, message: "Something went wrong. Try again." };
}
