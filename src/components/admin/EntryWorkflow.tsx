"use client";

import { Eye } from "lucide-react";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Card, FieldLabel, inputClass } from "@/components/admin/ui";
import type { ContentStatus } from "@/generated/prisma/enums";
import {
  cancelScheduleAction,
  deleteEntryAction,
  publishAction,
  scheduleAction,
  submitForReviewAction,
  unpublishAction,
} from "@/lib/admin/actions/content";
import { startPreviewAction } from "@/lib/admin/actions/system";

/**
 * Features 6, 7 and 8 — the workflow controls for one entry.
 * Buttons appear only for transitions the signed-in user is allowed to make.
 */
export default function EntryWorkflow({
  entryId,
  status,
  hasUnpublishedChanges,
  scheduledFor,
  canEdit,
  canPublish,
  canDelete,
  hasPublicRoute,
}: {
  entryId: string;
  status: ContentStatus;
  hasUnpublishedChanges: boolean;
  scheduledFor: string | null;
  canEdit: boolean;
  canPublish: boolean;
  canDelete: boolean;
  hasPublicRoute: boolean;
}) {
  const isPublished = status === "PUBLISHED";
  const canGoLive = canPublish && (!isPublished || hasUnpublishedChanges);

  return (
    <div className="flex min-w-0 flex-col gap-6">
      <Card title="Workflow">
        <div className="flex flex-col gap-4 px-5 py-4">
          {!canEdit ? (
            <p className="text-body-sm m-0 text-muted">
              You have read-only access to this content.
            </p>
          ) : null}

          {canGoLive ? (
            <ActionForm action={publishAction}>
              {() => (
                <>
                  <input type="hidden" name="entryId" value={entryId} />
                  <SubmitButton className="w-full" pendingLabel="Publishing…">
                    {isPublished ? "Publish changes" : "Publish"}
                  </SubmitButton>
                  <p className="mt-2 m-0 text-xs leading-relaxed text-muted">
                    Copies the draft to the live site and refreshes the affected pages.
                  </p>
                </>
              )}
            </ActionForm>
          ) : null}

          {canEdit && !canPublish ? (
            <ActionForm action={submitForReviewAction}>
              {() => (
                <>
                  <input type="hidden" name="entryId" value={entryId} />
                  <div className="mb-3">
                    <FieldLabel htmlFor="note" hint="optional">
                      Note for the reviewer
                    </FieldLabel>
                    <input id="note" name="note" type="text" className={inputClass} />
                  </div>
                  <SubmitButton className="w-full" pendingLabel="Submitting…">
                    Submit for review
                  </SubmitButton>
                  <p className="mt-2 m-0 text-xs leading-relaxed text-muted">
                    Your role cannot publish directly — an Editor will review and publish.
                  </p>
                </>
              )}
            </ActionForm>
          ) : null}

          {isPublished && canPublish ? (
            <ActionForm action={unpublishAction}>
              {() => (
                <>
                  <input type="hidden" name="entryId" value={entryId} />
                  <SubmitButton
                    variant="secondary"
                    className="w-full"
                    pendingLabel="Unpublishing…"
                    confirm="Take this off the live site?"
                  >
                    Unpublish
                  </SubmitButton>
                </>
              )}
            </ActionForm>
          ) : null}
        </div>
      </Card>

      {hasPublicRoute ? (
        <Card title="Preview" description="See the draft on the real page, before it goes live.">
          <form action={startPreviewAction} className="px-5 py-4">
            <input type="hidden" name="entryId" value={entryId} />
            <button
              type="submit"
              className="admin-btn admin-btn-secondary w-full"
            >
              <Eye className="size-3.5" aria-hidden />
              Preview draft
            </button>
            <p className="mt-2 m-0 text-xs leading-relaxed text-muted">
              Opens the public route in draft mode. Only you see the draft; everyone else keeps
              seeing the published version.
            </p>
          </form>
        </Card>
      ) : null}

      {canPublish ? (
        <Card title="Schedule">
          {scheduledFor ? (
            <ActionForm action={cancelScheduleAction} className="px-5 py-4">
              {() => (
                <>
                  <input type="hidden" name="entryId" value={entryId} />
                  <p className="m-0 text-sm text-ink">
                    Scheduled for{" "}
                    <strong>{new Date(scheduledFor).toLocaleString()}</strong>
                  </p>
                  <SubmitButton variant="secondary" className="mt-3 w-full">
                    Cancel schedule
                  </SubmitButton>
                </>
              )}
            </ActionForm>
          ) : (
            <ActionForm action={scheduleAction} className="px-5 py-4">
              {(state) => (
                <>
                  <input type="hidden" name="entryId" value={entryId} />
                  <FieldLabel htmlFor="publishAt">Publish at</FieldLabel>
                  <input
                    id="publishAt"
                    name="publishAt"
                    type="datetime-local"
                    required
                    className={inputClass}
                    aria-invalid={state.fieldErrors?.publishAt ? true : undefined}
                  />
                  {state.fieldErrors?.publishAt ? (
                    <p role="alert" className="mt-1.5 m-0 text-xs font-medium text-red">
                      {state.fieldErrors.publishAt}
                    </p>
                  ) : null}
                  <SubmitButton variant="secondary" className="mt-3 w-full">
                    Schedule publish
                  </SubmitButton>
                </>
              )}
            </ActionForm>
          )}
        </Card>
      ) : null}

      {canDelete ? (
        <Card title="Danger zone">
          <ActionForm action={deleteEntryAction} className="px-5 py-4">
            {() => (
              <>
                <input type="hidden" name="entryId" value={entryId} />
                <SubmitButton
                  variant="danger"
                  className="w-full"
                  confirm="Delete this entry and all its version history? This cannot be undone."
                  pendingLabel="Deleting…"
                >
                  Delete entry
                </SubmitButton>
                <p className="mt-2 m-0 text-xs leading-relaxed text-muted">
                  Removes the entry and its version history permanently.
                </p>
              </>
            )}
          </ActionForm>
        </Card>
      ) : null}
    </div>
  );
}
