import "server-only";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/admin/db";
import { getContentType, resolvePath } from "@/lib/admin/structure";

/**
 * Feature 9 — cache control.
 *
 * The public site uses ISR (`export const revalidate` in the route segments),
 * so publishing has to explicitly invalidate the affected routes rather than
 * waiting out the timer.
 */

export type RevalidationResult = {
  ok: boolean;
  paths: string[];
  error?: string;
};

/** Every public route the site serves, used by the manual "rebuild" button. */
export const SITE_PATHS = [
  "/",
  "/about",
  "/awards",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/services",
  "/services/media-buying",
  "/work",
] as const;

/** Dynamic route patterns need the `'page'` type argument. */
const DYNAMIC_PATTERNS = ["/work/[slug]", "/careers/[slug]", "/services/[slug]"];

export async function revalidatePaths(
  paths: string[],
  reason: string,
  actorEmail?: string | null,
): Promise<RevalidationResult> {
  const unique = [...new Set(paths)].filter(Boolean);
  if (unique.length === 0) return { ok: true, paths: [] };

  try {
    for (const path of unique) {
      if (path.includes("[")) {
        revalidatePath(path, "page");
      } else {
        revalidatePath(path);
      }
    }

    await logRevalidation(unique, reason, actorEmail, true);
    return { ok: true, paths: unique };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Revalidation failed";
    await logRevalidation(unique, reason, actorEmail, false, message);
    return { ok: false, paths: unique, error: message };
  }
}

/** Invalidate the routes affected by one content entry. */
export async function revalidateEntry(
  moduleKey: string,
  slug: string,
  reason: string,
  actorEmail?: string | null,
): Promise<RevalidationResult> {
  const mod = await getContentType(moduleKey);
  if (!mod) return { ok: false, paths: [], error: `Unknown content type: ${moduleKey}` };

  const paths = mod.revalidatePaths.map((pattern) => resolvePath(pattern, slug));
  return revalidatePaths(paths, reason, actorEmail);
}

/** Manual full rebuild — every static route plus every dynamic pattern. */
export async function revalidateEverything(
  reason: string,
  actorEmail?: string | null,
): Promise<RevalidationResult> {
  return revalidatePaths([...SITE_PATHS, ...DYNAMIC_PATTERNS], reason, actorEmail);
}

async function logRevalidation(
  paths: string[],
  reason: string,
  actorEmail: string | null | undefined,
  ok: boolean,
  error?: string,
): Promise<void> {
  try {
    await prisma.revalidationLog.create({
      data: { paths, reason, actorEmail: actorEmail ?? null, ok, error: error ?? null },
    });
  } catch (logError) {
    console.error("[admin] failed to log revalidation", logError);
  }
}
