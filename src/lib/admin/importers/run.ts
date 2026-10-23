import "server-only";

import { prisma } from "@/lib/admin/db";
import { writeAudit } from "@/lib/admin/audit";
import { getContentType } from "@/lib/admin/structure";
import { toInputJson } from "@/lib/admin/content";
import type { SessionUser } from "@/lib/admin/permissions";
import { IMPORTERS, getImporter, type ImportRecord } from "@/lib/admin/importers";

export type ModuleImportResult = {
  moduleKey: string;
  moduleLabel: string;
  created: number;
  updated: number;
  skipped: number;
  total: number;
  error?: string;
};

export type ImportSummary = {
  results: ModuleImportResult[];
  created: number;
  updated: number;
  skipped: number;
  failed: number;
  durationMs: number;
};

export type ImportOptions = {
  /** Which modules to import. Defaults to all of them. */
  moduleKeys?: string[];
  /**
   * `skip`      leave existing entries untouched (default — safe re-run)
   * `overwrite` replace the draft and publish it again from source
   */
  onExisting?: "skip" | "overwrite";
  /** Publish imported entries immediately so the site keeps rendering them. */
  publish?: boolean;
};

/**
 * Feature 10 — pull `src/content/**` into the database.
 *
 * Imported entries are published by default: the intent is to mirror what the
 * site already shows, not to take everything offline pending review.
 */
export async function runImport(
  actor: SessionUser,
  options: ImportOptions = {},
): Promise<ImportSummary> {
  const startedAt = Date.now();
  const onExisting = options.onExisting ?? "skip";
  const publish = options.publish ?? true;

  const selected = options.moduleKeys?.length
    ? IMPORTERS.filter((importer) => options.moduleKeys?.includes(importer.moduleKey))
    : IMPORTERS;

  const results: ModuleImportResult[] = [];

  for (const importer of selected) {
    const contentType = await getContentType(importer.moduleKey);
    const moduleLabel = contentType?.label ?? importer.moduleKey;

    try {
      const records = await importer.load();
      const outcome = await importModule(actor, importer.moduleKey, records, onExisting, publish);
      results.push({ moduleKey: importer.moduleKey, moduleLabel, ...outcome });
    } catch (error) {
      results.push({
        moduleKey: importer.moduleKey,
        moduleLabel,
        created: 0,
        updated: 0,
        skipped: 0,
        total: 0,
        error: error instanceof Error ? error.message : "Import failed",
      });
    }
  }

  const summary: ImportSummary = {
    results,
    created: sum(results, "created"),
    updated: sum(results, "updated"),
    skipped: sum(results, "skipped"),
    failed: results.filter((result) => result.error).length,
    durationMs: Date.now() - startedAt,
  };

  await writeAudit({
    actor,
    action: "IMPORT",
    entityType: "system",
    summary:
      `Imported content from source files — ${summary.created} created, ` +
      `${summary.updated} updated, ${summary.skipped} skipped` +
      (summary.failed ? `, ${summary.failed} mod(s) failed` : ""),
    diff: null,
  });

  return summary;
}

async function importModule(
  actor: SessionUser,
  moduleKey: string,
  records: ImportRecord[],
  onExisting: "skip" | "overwrite",
  publish: boolean,
): Promise<Omit<ModuleImportResult, "moduleKey" | "moduleLabel">> {
  let created = 0;
  let updated = 0;
  let skipped = 0;

  const existing = await prisma.contentEntry.findMany({
    where: { module: moduleKey },
    select: { id: true, slug: true },
  });
  const bySlug = new Map(existing.map((entry) => [entry.slug, entry.id]));

  for (const [index, record] of records.entries()) {
    const existingId = bySlug.get(record.slug);

    if (existingId && onExisting === "skip") {
      skipped += 1;
      continue;
    }

    const now = new Date();
    const publishFields = publish
      ? {
          status: "PUBLISHED" as const,
          publishedData: toInputJson(record.data),
          publishedAt: now,
          publishedById: actor.id,
          hasUnpublishedChanges: false,
        }
      : { status: "DRAFT" as const };

    if (existingId) {
      await prisma.$transaction(async (tx) => {
        const latest = await tx.contentVersion.findFirst({
          where: { entryId: existingId },
          orderBy: { version: "desc" },
          select: { version: true },
        });

        await tx.contentVersion.create({
          data: {
            entryId: existingId,
            version: (latest?.version ?? 0) + 1,
            data: toInputJson(record.data),
            status: publish ? "PUBLISHED" : "DRAFT",
            label: "Imported from source files",
            createdById: actor.id,
          },
        });

        await tx.contentEntry.update({
          where: { id: existingId },
          data: {
            title: record.title,
            data: toInputJson(record.data),
            position: index,
            updatedById: actor.id,
            ...publishFields,
          },
        });
      });
      updated += 1;
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const entry = await tx.contentEntry.create({
        data: {
          module: moduleKey,
          slug: record.slug,
          title: record.title,
          data: toInputJson(record.data),
          position: index,
          createdById: actor.id,
          updatedById: actor.id,
          ...publishFields,
        },
      });

      await tx.contentVersion.create({
        data: {
          entryId: entry.id,
          version: 1,
          data: toInputJson(record.data),
          status: publish ? "PUBLISHED" : "DRAFT",
          label: "Imported from source files",
          createdById: actor.id,
        },
      });
    });
    created += 1;
  }

  return { created, updated, skipped, total: records.length };
}

/** Counts in source files vs the database, for the migration screen. */
export async function importPreview(): Promise<
  { moduleKey: string; moduleLabel: string; source: number; inDatabase: number; error?: string }[]
> {
  const dbCounts = await prisma.contentEntry.groupBy({
    by: ["module"],
    _count: { _all: true },
  });
  const countByModule = new Map(dbCounts.map((row) => [row.module, row._count._all]));

  return Promise.all(
    IMPORTERS.map(async (importer) => {
      const moduleLabel = (await getContentType(importer.moduleKey))?.label ?? importer.moduleKey;
      try {
        const records = await importer.load();
        return {
          moduleKey: importer.moduleKey,
          moduleLabel,
          source: records.length,
          inDatabase: countByModule.get(importer.moduleKey) ?? 0,
        };
      } catch (error) {
        return {
          moduleKey: importer.moduleKey,
          moduleLabel,
          source: 0,
          inDatabase: countByModule.get(importer.moduleKey) ?? 0,
          error: error instanceof Error ? error.message : "Could not read source",
        };
      }
    }),
  );
}

function sum(results: ModuleImportResult[], key: "created" | "updated" | "skipped"): number {
  return results.reduce((total, result) => total + result[key], 0);
}

export { getImporter };
