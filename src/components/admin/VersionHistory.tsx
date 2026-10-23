"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Card, formatRelative } from "@/components/admin/ui";
import type { ContentStatus } from "@/generated/prisma/enums";
import { rollbackAction } from "@/lib/admin/actions/content";

export type VersionRow = {
  id: string;
  version: number;
  label: string;
  note: string | null;
  status: ContentStatus;
  createdAt: string;
  author: string;
};

/** Feature 7 — version list with one-click rollback. */
export default function VersionHistory({
  entryId,
  versions,
  canRollback,
}: {
  entryId: string;
  versions: VersionRow[];
  canRollback: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? versions : versions.slice(0, 6);

  return (
    <Card
      title="Version history"
      description="Every save and publish is snapshotted. Restoring brings a version back as a draft."
      actions={
        versions.length > 6 ? (
          <button
            type="button"
            onClick={() => setExpanded((value) => !value)}
            className="text-cta text-muted transition hover:text-red"
          >
            {expanded ? "Show less" : `All ${versions.length}`}
          </button>
        ) : null
      }
    >
      {versions.length === 0 ? (
        <p className="text-body-sm m-0 px-5 py-10 text-muted">No versions recorded yet.</p>
      ) : (
        <ol className="admin-rows m-0 list-none p-0">
          {visible.map((version, index) => (
            <li key={version.id} className="admin-row m-0">
              <span className="admin-mono w-10 shrink-0 text-muted">v{version.version}</span>

              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium text-ink">
                  {version.label}
                  {index === 0 && !expanded ? (
                    <span className="admin-badge admin-badge-draft ml-2">
                      current
                    </span>
                  ) : null}
                </span>
                <span className="admin-meta mt-1 block">
                  {version.author} · {formatRelative(new Date(version.createdAt))}
                  {version.note ? ` · ${version.note}` : ""}
                </span>
              </span>

              {canRollback && index !== 0 ? (
                <ActionForm action={rollbackAction} banner={false} className="shrink-0">
                  {() => (
                    <>
                      <input type="hidden" name="entryId" value={entryId} />
                      <input type="hidden" name="versionId" value={version.id} />
                      <SubmitButton
                        variant="secondary"
                        confirm={`Restore version ${version.version} as the current draft?`}
                      >
                        <RotateCcw className="size-3.5" aria-hidden />
                        Restore
                      </SubmitButton>
                    </>
                  )}
                </ActionForm>
              ) : null}
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
