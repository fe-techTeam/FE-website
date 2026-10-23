import "server-only";

import { Prisma } from "@/generated/prisma/client";
import type { ContentEntry } from "@/generated/prisma/client";
import type { ContentStatus } from "@/generated/prisma/enums";
import { prisma } from "@/lib/admin/db";
import { diffJson, writeAudit, type FieldDiff } from "@/lib/admin/audit";
import { revalidateEntry } from "@/lib/admin/revalidate";
import { requireContentType } from "@/lib/admin/structure";
import { can, type SessionUser } from "@/lib/admin/permissions";

/**
 * Features 6 & 7 — the draft → review → publish workflow and version history.
 *
 * Every entry carries two payloads:
 *   `data`          the working draft that editors change
 *   `publishedData` the frozen copy the public site renders
 *
 * Publishing copies `data` onto `publishedData`; rolling back copies an old
 * version onto `data` as a new draft, so the live site never changes until
 * someone publishes again.
 */

export type ContentJson = Prisma.JsonObject;

/**
 * Prisma reads JSON columns as `JsonValue` (which includes `null`) but only
 * accepts `InputJsonValue` on write. Round-tripping a payload needs this cast.
 */
export function toInputJson(value: unknown): Prisma.InputJsonValue {
  return (value ?? {}) as Prisma.InputJsonValue;
}

export const STATUS_LABELS: Record<ContentStatus, string> = {
  DRAFT: "Draft",
  IN_REVIEW: "In review",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

export class ContentError extends Error {}

// ---------------------------------------------------------------------------
// Reads
// ---------------------------------------------------------------------------

export async function listEntries(moduleKey: string): Promise<ContentEntry[]> {
  const mod = await requireContentType(moduleKey);

  return prisma.contentEntry.findMany({
    where: { module: mod.key },
    orderBy: mod.orderable
      ? [{ position: "asc" }, { title: "asc" }]
      : [{ updatedAt: "desc" }],
  });
}

export async function getEntry(id: string): Promise<ContentEntry | null> {
  return prisma.contentEntry.findUnique({ where: { id } });
}

export async function getEntryBySlug(moduleKey: string, slug: string): Promise<ContentEntry | null> {
  return prisma.contentEntry.findUnique({ where: { module_slug: { module: moduleKey, slug } } });
}

export async function listVersions(entryId: string) {
  return prisma.contentVersion.findMany({
    where: { entryId },
    orderBy: { version: "desc" },
    include: { createdBy: { select: { name: true, email: true } } },
  });
}

/**
 * Feature 8 — what the public site should render. Draft mode returns the
 * working copy; everyone else gets the published copy.
 */
export async function readPublished<T = unknown>(
  moduleKey: string,
  slug: string,
  options: { draft?: boolean } = {},
): Promise<T | null> {
  const entry = await getEntryBySlug(moduleKey, slug);
  if (!entry) return null;

  if (options.draft) return entry.data as T;
  if (entry.status !== "PUBLISHED" || !entry.publishedData) return null;
  return entry.publishedData as T;
}

export async function readPublishedList<T = unknown>(
  moduleKey: string,
  options: { draft?: boolean } = {},
): Promise<T[]> {
  const mod = await requireContentType(moduleKey);

  const entries = await prisma.contentEntry.findMany({
    where: options.draft
      ? { module: mod.key, status: { not: "ARCHIVED" } }
      : { module: mod.key, status: "PUBLISHED" },
    orderBy: mod.orderable ? [{ position: "asc" }] : [{ createdAt: "asc" }],
  });

  return entries
    .map((entry) => (options.draft ? entry.data : entry.publishedData) as T)
    .filter((value): value is T => value !== null && value !== undefined);
}

// ---------------------------------------------------------------------------
// Writes
// ---------------------------------------------------------------------------

async function nextVersionNumber(entryId: string, tx: Prisma.TransactionClient): Promise<number> {
  const latest = await tx.contentVersion.findFirst({
    where: { entryId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  return (latest?.version ?? 0) + 1;
}

export async function createEntry(input: {
  actor: SessionUser;
  moduleKey: string;
  slug: string;
  title: string;
  data: ContentJson;
}): Promise<ContentEntry> {
  const mod = await requireContentType(input.moduleKey);
  const slug = normaliseSlug(input.slug);

  if (!slug) throw new ContentError("A slug is required.");
  if (!input.title.trim()) throw new ContentError("A title is required.");

  const existing = await getEntryBySlug(mod.key, slug);
  if (existing) throw new ContentError(`"${slug}" already exists in ${mod.label}.`);

  if (mod.kind === "SINGLETON") {
    const count = await prisma.contentEntry.count({ where: { module: mod.key } });
    if (count > 0) throw new ContentError(`${mod.label} is a single page and already exists.`);
  }

  const entry = await prisma.$transaction(async (tx) => {
    const last = await tx.contentEntry.findFirst({
      where: { module: mod.key },
      orderBy: { position: "desc" },
      select: { position: true },
    });

    const created = await tx.contentEntry.create({
      data: {
        module: mod.key,
        slug,
        title: input.title.trim(),
        data: toInputJson(input.data),
        status: "DRAFT",
        position: (last?.position ?? -1) + 1,
        createdById: input.actor.id,
        updatedById: input.actor.id,
      },
    });

    await tx.contentVersion.create({
      data: {
        entryId: created.id,
        version: 1,
        data: toInputJson(input.data),
        status: "DRAFT",
        label: "Created",
        createdById: input.actor.id,
      },
    });

    return created;
  });

  await writeAudit({
    actor: input.actor,
    action: "CREATE",
    entityType: mod.key,
    entityId: entry.id,
    entityLabel: entry.title,
    summary: `Created ${mod.singular.toLowerCase()} "${entry.title}"`,
  });

  return entry;
}

export async function saveDraft(input: {
  actor: SessionUser;
  entryId: string;
  title?: string;
  slug?: string;
  data: ContentJson;
  note?: string;
}): Promise<{ entry: ContentEntry; diff: FieldDiff }> {
  const current = await requireEntry(input.entryId);
  const mod = await requireContentType(current.module);

  if (!can(input.actor, "edit", mod.key)) {
    throw new ContentError("You do not have permission to edit this content.");
  }

  const slug = input.slug ? normaliseSlug(input.slug) : current.slug;
  if (slug !== current.slug) {
    const clash = await getEntryBySlug(mod.key, slug);
    if (clash) throw new ContentError(`"${slug}" is already used by another entry.`);
  }

  const diff = diffJson(current.data, input.data);
  const titleChanged = input.title !== undefined && input.title.trim() !== current.title;
  const slugChanged = slug !== current.slug;

  if (Object.keys(diff).length === 0 && !titleChanged && !slugChanged) {
    return { entry: current, diff };
  }

  const entry = await prisma.$transaction(async (tx) => {
    const version = await nextVersionNumber(current.id, tx);

    await tx.contentVersion.create({
      data: {
        entryId: current.id,
        version,
        data: toInputJson(input.data),
        status: current.status === "PUBLISHED" ? "DRAFT" : current.status,
        label: "Draft saved",
        note: input.note,
        createdById: input.actor.id,
      },
    });

    return tx.contentEntry.update({
      where: { id: current.id },
      data: {
        data: toInputJson(input.data),
        title: input.title?.trim() || current.title,
        slug,
        // A published entry stays published; the edit lives alongside it as a
        // pending change until someone publishes again.
        hasUnpublishedChanges: current.status === "PUBLISHED",
        updatedById: input.actor.id,
      },
    });
  });

  await writeAudit({
    actor: input.actor,
    action: "UPDATE",
    entityType: mod.key,
    entityId: entry.id,
    entityLabel: entry.title,
    summary: `Saved draft of "${entry.title}"`,
    diff,
  });

  return { entry, diff };
}

/** Author submits work they cannot publish themselves (feature 6). */
export async function submitForReview(input: {
  actor: SessionUser;
  entryId: string;
  note?: string;
}): Promise<ContentEntry> {
  const current = await requireEntry(input.entryId);
  const mod = await requireContentType(current.module);

  if (!can(input.actor, "edit", mod.key)) {
    throw new ContentError("You do not have permission to edit this content.");
  }
  if (current.status === "PUBLISHED" && !current.hasUnpublishedChanges) {
    throw new ContentError("There are no pending changes to review.");
  }

  const entry = await prisma.contentEntry.update({
    where: { id: current.id },
    data: { status: "IN_REVIEW", updatedById: input.actor.id },
  });

  await writeAudit({
    actor: input.actor,
    action: "SUBMIT_FOR_REVIEW",
    entityType: mod.key,
    entityId: entry.id,
    entityLabel: entry.title,
    summary: input.note ? `Submitted for review — ${input.note}` : "Submitted for review",
  });

  return entry;
}

export async function publishEntry(input: {
  actor: SessionUser;
  entryId: string;
  note?: string;
}): Promise<{ entry: ContentEntry; revalidated: string[] }> {
  const current = await requireEntry(input.entryId);
  const mod = await requireContentType(current.module);

  if (!can(input.actor, "publish", mod.key)) {
    throw new ContentError("You do not have permission to publish this content.");
  }

  const entry = await prisma.$transaction(async (tx) => {
    const version = await nextVersionNumber(current.id, tx);

    await tx.contentVersion.create({
      data: {
        entryId: current.id,
        version,
        data: toInputJson(current.data),
        status: "PUBLISHED",
        label: "Published",
        note: input.note,
        createdById: input.actor.id,
      },
    });

    return tx.contentEntry.update({
      where: { id: current.id },
      data: {
        status: "PUBLISHED",
        publishedData: toInputJson(current.data),
        publishedAt: new Date(),
        publishedById: input.actor.id,
        hasUnpublishedChanges: false,
        scheduledFor: null,
        updatedById: input.actor.id,
      },
    });
  });

  const result = await revalidateEntry(mod.key, entry.slug, `Published ${entry.title}`, input.actor.email);

  await writeAudit({
    actor: input.actor,
    action: "PUBLISH",
    entityType: mod.key,
    entityId: entry.id,
    entityLabel: entry.title,
    summary: `Published "${entry.title}"`,
  });

  return { entry, revalidated: result.paths };
}

export async function unpublishEntry(input: {
  actor: SessionUser;
  entryId: string;
}): Promise<{ entry: ContentEntry; revalidated: string[] }> {
  const current = await requireEntry(input.entryId);
  const mod = await requireContentType(current.module);

  if (!can(input.actor, "publish", mod.key)) {
    throw new ContentError("You do not have permission to unpublish this content.");
  }
  if (current.status !== "PUBLISHED") {
    throw new ContentError("This entry is not published.");
  }

  const entry = await prisma.contentEntry.update({
    where: { id: current.id },
    data: {
      status: "DRAFT",
      publishedData: Prisma.DbNull,
      publishedAt: null,
      hasUnpublishedChanges: false,
      updatedById: input.actor.id,
    },
  });

  const result = await revalidateEntry(
    mod.key,
    entry.slug,
    `Unpublished ${entry.title}`,
    input.actor.email,
  );

  await writeAudit({
    actor: input.actor,
    action: "UNPUBLISH",
    entityType: mod.key,
    entityId: entry.id,
    entityLabel: entry.title,
    summary: `Unpublished "${entry.title}" — it is no longer visible on the site`,
  });

  return { entry, revalidated: result.paths };
}

/** Feature 6 — schedule a publish for later; the cron route does the work. */
export async function scheduleEntry(input: {
  actor: SessionUser;
  entryId: string;
  publishAt: Date;
}): Promise<ContentEntry> {
  const current = await requireEntry(input.entryId);
  const mod = await requireContentType(current.module);

  if (!can(input.actor, "publish", mod.key)) {
    throw new ContentError("You do not have permission to schedule this content.");
  }
  if (input.publishAt.getTime() <= Date.now()) {
    throw new ContentError("Pick a time in the future.");
  }

  const entry = await prisma.contentEntry.update({
    where: { id: current.id },
    data: { scheduledFor: input.publishAt, updatedById: input.actor.id },
  });

  await writeAudit({
    actor: input.actor,
    action: "SCHEDULE",
    entityType: mod.key,
    entityId: entry.id,
    entityLabel: entry.title,
    summary: `Scheduled to publish at ${input.publishAt.toISOString()}`,
  });

  return entry;
}

export async function cancelSchedule(input: {
  actor: SessionUser;
  entryId: string;
}): Promise<ContentEntry> {
  const current = await requireEntry(input.entryId);
  const mod = await requireContentType(current.module);

  if (!can(input.actor, "publish", mod.key)) {
    throw new ContentError("You do not have permission to change the schedule.");
  }

  const entry = await prisma.contentEntry.update({
    where: { id: current.id },
    data: { scheduledFor: null, updatedById: input.actor.id },
  });

  await writeAudit({
    actor: input.actor,
    action: "UNSCHEDULE",
    entityType: mod.key,
    entityId: entry.id,
    entityLabel: entry.title,
    summary: "Cancelled scheduled publish",
  });

  return entry;
}

/** Feature 7 — restore an old version as the current draft. */
export async function rollbackToVersion(input: {
  actor: SessionUser;
  entryId: string;
  versionId: string;
}): Promise<ContentEntry> {
  const current = await requireEntry(input.entryId);
  const mod = await requireContentType(current.module);

  if (!can(input.actor, "edit", mod.key)) {
    throw new ContentError("You do not have permission to edit this content.");
  }

  const target = await prisma.contentVersion.findUnique({ where: { id: input.versionId } });
  if (!target || target.entryId !== current.id) {
    throw new ContentError("That version does not belong to this entry.");
  }

  const diff = diffJson(current.data, target.data);

  const entry = await prisma.$transaction(async (tx) => {
    const version = await nextVersionNumber(current.id, tx);

    await tx.contentVersion.create({
      data: {
        entryId: current.id,
        version,
        data: toInputJson(target.data),
        status: "DRAFT",
        label: `Rolled back to v${target.version}`,
        createdById: input.actor.id,
      },
    });

    return tx.contentEntry.update({
      where: { id: current.id },
      data: {
        data: toInputJson(target.data),
        hasUnpublishedChanges: current.status === "PUBLISHED",
        updatedById: input.actor.id,
      },
    });
  });

  await writeAudit({
    actor: input.actor,
    action: "ROLLBACK",
    entityType: mod.key,
    entityId: entry.id,
    entityLabel: entry.title,
    summary: `Rolled back "${entry.title}" to version ${target.version}. Publish to make it live.`,
    diff,
  });

  return entry;
}

export async function deleteEntry(input: {
  actor: SessionUser;
  entryId: string;
}): Promise<{ moduleKey: string; title: string }> {
  const current = await requireEntry(input.entryId);
  const mod = await requireContentType(current.module);

  if (!can(input.actor, "delete", mod.key)) {
    throw new ContentError("You do not have permission to delete this content.");
  }

  await prisma.contentEntry.delete({ where: { id: current.id } });

  if (current.status === "PUBLISHED") {
    await revalidateEntry(mod.key, current.slug, `Deleted ${current.title}`, input.actor.email);
  }

  await writeAudit({
    actor: input.actor,
    action: "DELETE",
    entityType: mod.key,
    entityId: current.id,
    entityLabel: current.title,
    summary: `Deleted "${current.title}"`,
  });

  return { moduleKey: mod.key, title: current.title };
}

export async function reorderEntries(input: {
  actor: SessionUser;
  moduleKey: string;
  orderedIds: string[];
}): Promise<void> {
  const mod = await requireContentType(input.moduleKey);

  if (!can(input.actor, "edit", mod.key)) {
    throw new ContentError("You do not have permission to reorder this content.");
  }

  await prisma.$transaction(
    input.orderedIds.map((id, index) =>
      prisma.contentEntry.update({ where: { id }, data: { position: index } }),
    ),
  );

  await writeAudit({
    actor: input.actor,
    action: "UPDATE",
    entityType: mod.key,
    summary: `Reordered ${mod.label}`,
  });
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireEntry(id: string): Promise<ContentEntry> {
  const entry = await getEntry(id);
  if (!entry) throw new ContentError("That content no longer exists.");
  return entry;
}

export function normaliseSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
