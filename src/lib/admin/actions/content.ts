"use server";

import { revalidatePath } from "next/cache";

import { AdminAuthError, assertCapability } from "@/lib/admin/dal";
import {
  ContentError,
  cancelSchedule,
  getEntry,
  publishEntry,
  rollbackToVersion,
  scheduleEntry,
  submitForReview,
  unpublishEntry,
  deleteEntry,
  reorderEntries,
} from "@/lib/admin/content";
import { entryIdSchema, rollbackSchema, scheduleSchema } from "@/lib/admin/schemas";
import { fieldErrorsOf } from "@/lib/admin/actions/types";
import type { ActionState } from "@/lib/admin/actions/types";

/**
 * Features 6 & 7 — workflow transitions driven from the entry screen.
 * Editing forms themselves land in Section B; these actions are the state
 * machine every module will share.
 */

async function entryContext(formData: FormData) {
  const parsed = entryIdSchema.safeParse({ entryId: formData.get("entryId") });
  if (!parsed.success) throw new ContentError("Missing entry.");

  const entry = await getEntry(parsed.data.entryId);
  if (!entry) throw new ContentError("That content no longer exists.");

  return entry;
}

function refresh(moduleKey: string, entryId: string) {
  revalidatePath("/admin");
  revalidatePath(`/admin/content/${moduleKey}`);
  revalidatePath(`/admin/content/${moduleKey}/${entryId}`);
}

export async function publishAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const entry = await entryContext(formData);
    const actor = await assertCapability("publish", entry.module);

    const { entry: published, revalidated } = await publishEntry({ actor, entryId: entry.id });
    refresh(entry.module, entry.id);

    return {
      ok: true,
      message: `"${published.title}" is live. Refreshed ${revalidated.length} route${
        revalidated.length === 1 ? "" : "s"
      }.`,
    };
  } catch (error) {
    return errorState(error);
  }
}

export async function unpublishAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const entry = await entryContext(formData);
    const actor = await assertCapability("publish", entry.module);

    const { entry: updated } = await unpublishEntry({ actor, entryId: entry.id });
    refresh(entry.module, entry.id);

    return { ok: true, message: `"${updated.title}" is no longer public.` };
  } catch (error) {
    return errorState(error);
  }
}

export async function submitForReviewAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const entry = await entryContext(formData);
    const actor = await assertCapability("edit", entry.module);

    const note = String(formData.get("note") ?? "").trim() || undefined;
    const updated = await submitForReview({ actor, entryId: entry.id, note });
    refresh(entry.module, entry.id);

    return { ok: true, message: `"${updated.title}" is waiting for review.` };
  } catch (error) {
    return errorState(error);
  }
}

export async function scheduleAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const parsed = scheduleSchema.safeParse({
      entryId: formData.get("entryId"),
      publishAt: formData.get("publishAt"),
    });
    if (!parsed.success) {
      return { ok: false, fieldErrors: fieldErrorsOf(parsed.error) };
    }

    const entry = await entryContext(formData);
    const actor = await assertCapability("publish", entry.module);

    const updated = await scheduleEntry({
      actor,
      entryId: entry.id,
      publishAt: new Date(parsed.data.publishAt),
    });
    refresh(entry.module, entry.id);

    return {
      ok: true,
      message: `"${updated.title}" will publish on ${new Date(parsed.data.publishAt).toLocaleString()}.`,
    };
  } catch (error) {
    return errorState(error);
  }
}

export async function cancelScheduleAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const entry = await entryContext(formData);
    const actor = await assertCapability("publish", entry.module);

    await cancelSchedule({ actor, entryId: entry.id });
    refresh(entry.module, entry.id);

    return { ok: true, message: "Scheduled publish cancelled." };
  } catch (error) {
    return errorState(error);
  }
}

export async function rollbackAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const parsed = rollbackSchema.safeParse({
      entryId: formData.get("entryId"),
      versionId: formData.get("versionId"),
    });
    if (!parsed.success) return { ok: false, message: "Pick a version to restore." };

    const entry = await entryContext(formData);
    const actor = await assertCapability("edit", entry.module);

    await rollbackToVersion({ actor, entryId: entry.id, versionId: parsed.data.versionId });
    refresh(entry.module, entry.id);

    return {
      ok: true,
      message: "Restored as a draft. Publish it when you are ready to make it live.",
    };
  } catch (error) {
    return errorState(error);
  }
}

export async function deleteEntryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const entry = await entryContext(formData);
    const actor = await assertCapability("delete", entry.module);

    const { title } = await deleteEntry({ actor, entryId: entry.id });
    refresh(entry.module, entry.id);

    return { ok: true, message: `Deleted "${title}".` };
  } catch (error) {
    return errorState(error);
  }
}

export async function reorderAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    const moduleKey = String(formData.get("moduleKey") ?? "");
    const orderedIds = String(formData.get("orderedIds") ?? "")
      .split(",")
      .filter(Boolean);

    if (!moduleKey || orderedIds.length === 0) {
      return { ok: false, message: "Nothing to reorder." };
    }

    const actor = await assertCapability("edit", moduleKey);
    await reorderEntries({ actor, moduleKey, orderedIds });
    revalidatePath(`/admin/content/${moduleKey}`);

    return { ok: true, message: "Order saved. Publish the affected pages to push it live." };
  } catch (error) {
    return errorState(error);
  }
}


function errorState(error: unknown): ActionState {
  if (error instanceof AdminAuthError || error instanceof ContentError) {
    return { ok: false, message: error.message };
  }
  console.error("[admin] content action failed", error);
  return { ok: false, message: "Something went wrong. Try again." };
}
