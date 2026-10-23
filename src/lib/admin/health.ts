import "server-only";

import { access } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";

import { prisma } from "@/lib/admin/db";
import { getContentType } from "@/lib/admin/structure";

/**
 * Feature 4 — the dashboard's "broken link / missing image" warnings.
 *
 * Walks every content entry's JSON looking for asset paths and internal links,
 * then checks that the file exists on disk / the route is real. Results are
 * stored per scan so the dashboard can show the latest run without re-walking
 * hundreds of records on every page load.
 */

export type HealthKind = "missing-image" | "broken-internal-link" | "empty-required-field";

export type HealthFinding = {
  kind: HealthKind;
  module: string;
  entryId: string | null;
  entrySlug: string | null;
  field: string;
  value: string;
  detail?: string;
};

/** Routes the public site actually serves. Anything else is a broken link. */
const STATIC_ROUTES = new Set([
  "/",
  "/about",
  "/awards",
  "/careers",
  "/contact",
  "/privacy-policy",
  "/services",
  "/work",
]);

const DYNAMIC_PREFIXES = ["/work/", "/careers/", "/services/"];

const ASSET_EXTENSIONS = /\.(png|jpe?g|webp|avif|gif|svg|mp4|webm|mov|pdf)$/i;

export async function runHealthScan(): Promise<{ scanId: string; findings: HealthFinding[] }> {
  const scanId = randomUUID();
  const entries = await prisma.contentEntry.findMany({
    select: { id: true, module: true, slug: true, data: true },
  });

  const findings: HealthFinding[] = [];
  const assetCache = new Map<string, boolean>();

  for (const entry of entries) {
    const candidates: { field: string; value: string }[] = [];
    collectStrings(entry.data, "", candidates);

    for (const candidate of candidates) {
      const value = candidate.value;

      if (value.startsWith("/") && ASSET_EXTENSIONS.test(value)) {
        const exists = await assetExists(value, assetCache);
        if (!exists) {
          findings.push({
            kind: "missing-image",
            module: entry.module,
            entryId: entry.id,
            entrySlug: entry.slug,
            field: candidate.field,
            value,
            detail: "No matching file under public/",
          });
        }
        continue;
      }

      if (value.startsWith("/") && !ASSET_EXTENSIONS.test(value)) {
        const route = value.split(/[?#]/)[0].replace(/\/$/, "") || "/";
        const known =
          STATIC_ROUTES.has(route) || DYNAMIC_PREFIXES.some((prefix) => route.startsWith(prefix));
        if (!known) {
          findings.push({
            kind: "broken-internal-link",
            module: entry.module,
            entryId: entry.id,
            entrySlug: entry.slug,
            field: candidate.field,
            value,
            detail: "No route matches this path",
          });
        }
      }
    }
  }

  // Singleton pages that were never imported or created.
  const counts = await prisma.contentEntry.groupBy({ by: ["module"], _count: { _all: true } });
  const populated = new Set(counts.map((row) => row.module));
  for (const moduleKey of ["home-page", "about-page", "site-settings"]) {
    if (!populated.has(moduleKey)) {
      findings.push({
        kind: "empty-required-field",
        module: moduleKey,
        entryId: null,
        entrySlug: null,
        field: "(entry)",
        value: (await getContentType(moduleKey))?.label ?? moduleKey,
        detail: "No content yet — run the importer on the System page",
      });
    }
  }

  if (findings.length > 0) {
    await prisma.healthIssue.createMany({
      data: findings.map((finding) => ({ ...finding, scanId, detail: finding.detail ?? null })),
    });
  }

  // Keep only the newest scans so the table does not grow unbounded.
  await pruneOldScans(scanId);

  return { scanId, findings };
}

export async function latestHealthScan(): Promise<{
  scanId: string | null;
  ranAt: Date | null;
  findings: Awaited<ReturnType<typeof prisma.healthIssue.findMany>>;
}> {
  const latest = await prisma.healthIssue.findFirst({
    orderBy: { createdAt: "desc" },
    select: { scanId: true, createdAt: true },
  });

  if (!latest) return { scanId: null, ranAt: null, findings: [] };

  const findings = await prisma.healthIssue.findMany({
    where: { scanId: latest.scanId },
    orderBy: [{ kind: "asc" }, { module: "asc" }],
  });

  return { scanId: latest.scanId, ranAt: latest.createdAt, findings };
}

function collectStrings(
  value: unknown,
  fieldPath: string,
  out: { field: string; value: string }[],
): void {
  if (typeof value === "string") {
    if (value.startsWith("/")) out.push({ field: fieldPath || "(root)", value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, index) => collectStrings(item, `${fieldPath}[${index}]`, out));
    return;
  }
  if (typeof value === "object" && value !== null) {
    for (const [key, child] of Object.entries(value)) {
      collectStrings(child, fieldPath ? `${fieldPath}.${key}` : key, out);
    }
  }
}

async function assetExists(publicPath: string, cache: Map<string, boolean>): Promise<boolean> {
  const cached = cache.get(publicPath);
  if (cached !== undefined) return cached;

  // Strip query strings and guard against path traversal out of public/.
  const clean = publicPath.split(/[?#]/)[0];
  const publicDir = path.join(process.cwd(), "public");
  const resolved = path.resolve(publicDir, `.${decodeURIComponent(clean)}`);

  if (!resolved.startsWith(publicDir)) {
    cache.set(publicPath, false);
    return false;
  }

  const exists = await access(resolved)
    .then(() => true)
    .catch(() => false);

  cache.set(publicPath, exists);
  return exists;
}

async function pruneOldScans(currentScanId: string): Promise<void> {
  const scans = await prisma.healthIssue.findMany({
    distinct: ["scanId"],
    orderBy: { createdAt: "desc" },
    select: { scanId: true },
    take: 6,
  });

  const keep = new Set(scans.map((scan) => scan.scanId));
  keep.add(currentScanId);

  await prisma.healthIssue.deleteMany({ where: { scanId: { notIn: [...keep] } } });
}
