import "server-only";

import type { AuditAction } from "@/generated/prisma/enums";
import { prisma } from "@/lib/admin/db";
import { requestContext } from "@/lib/admin/dal";
import type { SessionUser } from "@/lib/admin/permissions";

export type FieldDiff = Record<string, { before: unknown; after: unknown }>;

type WriteAuditInput = {
  actor: Pick<SessionUser, "id" | "email" | "name"> | { id?: null; email: string; name: string };
  action: AuditAction;
  /** Module key, or "auth" / "system". */
  entityType: string;
  entityId?: string | null;
  entityLabel?: string | null;
  summary?: string | null;
  diff?: FieldDiff | null;
};

/**
 * Feature 5 — append-only activity record. Never throws: a failed audit write
 * must not roll back the action the user actually asked for.
 */
export async function writeAudit(input: WriteAuditInput): Promise<void> {
  try {
    const { ip } = await requestContext();

    await prisma.auditLog.create({
      data: {
        userId: input.actor.id ?? null,
        actorEmail: input.actor.email,
        actorName: input.actor.name,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId ?? null,
        entityLabel: input.entityLabel ?? null,
        summary: input.summary ?? null,
        diff: input.diff ? (input.diff as object) : undefined,
        ip,
      },
    });
  } catch (error) {
    console.error("[admin] failed to write audit log", error);
  }
}

const MAX_DEPTH = 4;
const MAX_FIELDS = 60;

/**
 * Flat, human-readable diff of two JSON content payloads. Nested objects are
 * walked to `MAX_DEPTH` and reported with dotted paths ("hero.headline").
 */
export function diffJson(before: unknown, after: unknown): FieldDiff {
  const diff: FieldDiff = {};
  walk(before, after, "", diff, 0);
  return diff;
}

function walk(before: unknown, after: unknown, path: string, diff: FieldDiff, depth: number): void {
  if (Object.keys(diff).length >= MAX_FIELDS) return;

  if (isPlainObject(before) && isPlainObject(after) && depth < MAX_DEPTH) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    for (const key of keys) {
      walk(before[key], after[key], path ? `${path}.${key}` : key, diff, depth + 1);
    }
    return;
  }

  if (Array.isArray(before) && Array.isArray(after)) {
    if (before.length !== after.length) {
      diff[path || "(root)"] = {
        before: `${before.length} item${before.length === 1 ? "" : "s"}`,
        after: `${after.length} item${after.length === 1 ? "" : "s"}`,
      };
      return;
    }
    if (depth < MAX_DEPTH) {
      for (let index = 0; index < after.length; index += 1) {
        walk(before[index], after[index], `${path}[${index}]`, diff, depth + 1);
      }
      return;
    }
  }

  if (!deepEqual(before, after)) {
    diff[path || "(root)"] = { before: summarise(before), after: summarise(after) };
  }
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || b === null || a === undefined || b === undefined) return false;
  if (typeof a !== "object" || typeof b !== "object") return false;
  return JSON.stringify(a) === JSON.stringify(b);
}

/** Keep the log readable — long strings and big objects are truncated. */
function summarise(value: unknown): unknown {
  if (value === undefined) return null;
  if (typeof value === "string") {
    return value.length > 240 ? `${value.slice(0, 240)}…` : value;
  }
  if (typeof value === "object" && value !== null) {
    const json = JSON.stringify(value);
    return json.length > 240 ? `${json.slice(0, 240)}…` : value;
  }
  return value;
}

export function describeDiff(diff: FieldDiff | null | undefined): string {
  if (!diff) return "";
  const fields = Object.keys(diff);
  if (fields.length === 0) return "No field changes";
  if (fields.length <= 3) return `Changed ${fields.join(", ")}`;
  return `Changed ${fields.slice(0, 3).join(", ")} and ${fields.length - 3} more`;
}
