"use server";

import { revalidatePath } from "next/cache";
import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

import { AdminAuthError, assertArea, assertCapability } from "@/lib/admin/dal";
import { writeAudit } from "@/lib/admin/audit";
import { revalidateEverything, revalidatePaths } from "@/lib/admin/revalidate";
import { runHealthScan } from "@/lib/admin/health";
import { runImport } from "@/lib/admin/importers/run";
import { importSchema } from "@/lib/admin/schemas";
import { getEntry } from "@/lib/admin/content";
import { publicPath } from "@/lib/admin/structure";
import type { ActionState } from "@/lib/admin/actions/types";

/** Features 8, 9, 10 — preview, cache control and the content importer. */

// ------------------------------------------------------- Feature 9: cache
export async function rebuildSiteAction(
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");
    const result = await revalidateEverything("Manual rebuild", actor.email);

    await writeAudit({
      actor,
      action: "REVALIDATE",
      entityType: "system",
      summary: `Manually rebuilt ${result.paths.length} route${result.paths.length === 1 ? "" : "s"}`,
    });

    revalidatePath("/admin/system");

    return result.ok
      ? { ok: true, message: `Refreshed ${result.paths.length} routes.` }
      : { ok: false, message: result.error ?? "Rebuild failed." };
  } catch (error) {
    return errorState(error);
  }
}

export async function revalidatePathAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");
    const path = String(formData.get("path") ?? "").trim();

    if (!path.startsWith("/")) {
      return { ok: false, fieldErrors: { path: "Paths must start with a slash." } };
    }

    const result = await revalidatePaths([path], "Manual path refresh", actor.email);
    revalidatePath("/admin/system");

    return result.ok
      ? { ok: true, message: `Refreshed ${path}.` }
      : { ok: false, message: result.error ?? "Refresh failed." };
  } catch (error) {
    return errorState(error);
  }
}

// ------------------------------------------------------ Feature 4: health
export async function runHealthScanAction(
  _prev: ActionState,
  _formData: FormData,
): Promise<ActionState> {
  try {
    await assertArea("health");
    const { findings } = await runHealthScan();

    revalidatePath("/admin");
    revalidatePath("/admin/health");

    return {
      ok: true,
      message:
        findings.length === 0
          ? "No broken links or missing images found."
          : `Found ${findings.length} issue${findings.length === 1 ? "" : "s"}.`,
    };
  } catch (error) {
    return errorState(error);
  }
}

// ------------------------------------------------------ Feature 10: import
export async function runImportAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    const actor = await assertArea("system");

    const rawModules = formData.getAll("moduleKeys").map(String).filter(Boolean);
    const parsed = importSchema.safeParse({
      moduleKeys: rawModules.length > 0 ? rawModules : undefined,
      onExisting: formData.get("onExisting") ?? "skip",
      // An unticked checkbox sends nothing at all, so test for the ticked value.
      publish: formData.get("publish") === "on",
    });

    if (!parsed.success) return { ok: false, message: "Check the import options and try again." };

    const summary = await runImport(actor, parsed.data);

    revalidatePath("/admin");
    revalidatePath("/admin/system/import");

    const failures = summary.results.filter((result) => result.error);
    const base =
      `Imported in ${(summary.durationMs / 1000).toFixed(1)}s — ` +
      `${summary.created} created, ${summary.updated} updated, ${summary.skipped} skipped.`;

    if (failures.length > 0) {
      return {
        ok: false,
        message: `${base} ${failures.length} module(s) failed: ${failures
          .map((failure) => `${failure.moduleLabel} (${failure.error})`)
          .join("; ")}`,
      };
    }

    return { ok: true, message: base };
  } catch (error) {
    return errorState(error);
  }
}

// ----------------------------------------------------- Feature 8: preview
/**
 * Turns on Next.js Draft Mode and sends the editor to the public route for
 * this entry, where the draft copy renders instead of the published one.
 */
export async function startPreviewAction(formData: FormData): Promise<void> {
  const entryId = String(formData.get("entryId") ?? "");
  const entry = await getEntry(entryId);
  if (!entry) redirect("/admin");

  await assertCapability("view", entry.module);

  const target = await publicPath(entry.module, entry.slug);
  if (!target) redirect(`/admin/content/${entry.module}/${entry.id}`);

  const draft = await draftMode();
  draft.enable();

  // Remembered so the preview banner can link back to where the editor was.
  const store = await cookies();
  store.set("fe_admin_preview_return", `/admin/content/${entry.module}/${entry.id}`, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60,
  });

  redirect(target);
}

function errorState(error: unknown): ActionState {
  if (error instanceof AdminAuthError) return { ok: false, message: error.message };
  console.error("[admin] system action failed", error);
  return { ok: false, message: "Something went wrong. Try again." };
}
