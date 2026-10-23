"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Eye, EyeOff, Plus, Trash2 } from "lucide-react";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Card, EmptyState, Pill } from "@/components/admin/ui";
import {
  addSectionAction,
  moveSectionAction,
  removeSectionAction,
  toggleSectionAction,
} from "@/lib/admin/actions/sections";
import type { SectionInstance } from "@/lib/admin/documents";

export type SectionOption = {
  key: string;
  label: string;
  description: string;
  group: string;
  fieldCount: number;
};

/**
 * The page composer. Editors add, reorder, hide and remove the sections that
 * make up a page, so a redesigned page is a content change here rather than a
 * code change.
 *
 * Editing the fields *inside* a section is Section B of the plan.
 */
export default function SectionBuilder({
  entryId,
  sections,
  available,
  canEdit,
}: {
  entryId: string;
  sections: SectionInstance[];
  available: SectionOption[];
  canEdit: boolean;
}) {
  const [picking, setPicking] = useState(false);
  const byKey = new Map(available.map((option) => [option.key, option]));
  const groups = [...new Set(available.map((option) => option.group))];

  return (
    <Card
      title={`Sections (${sections.length})`}
      description="The blocks this page is built from, top to bottom."
      actions={
        canEdit ? (
          <button
            type="button"
            onClick={() => setPicking((value) => !value)}
            className="admin-btn admin-btn-secondary admin-btn-sm"
          >
            <Plus className="size-3.5" aria-hidden />
            {picking ? "Cancel" : "Add section"}
          </button>
        ) : null
      }
    >
      {picking ? (
        <div className="border-b border-line bg-mist px-5 py-5">
          <p className="admin-label m-0">Choose a section</p>
          <div className="mt-3 flex flex-col gap-4">
            {groups.map((group) => (
              <div key={group}>
                <p className="admin-eyebrow m-0">{group}</p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {available
                    .filter((option) => option.group === group)
                    .map((option) => (
                      <ActionForm key={option.key} action={addSectionAction} banner={false}>
                        {() => (
                          <>
                            <input type="hidden" name="entryId" value={entryId} />
                            <input type="hidden" name="sectionType" value={option.key} />
                            <button
                              type="submit"
                              className="w-full border border-line bg-white px-4 py-3 text-left transition hover:border-ink"
                            >
                              <span className="block text-sm font-semibold text-ink">
                                {option.label}
                              </span>
                              <span className="admin-meta mt-1 block">{option.description}</span>
                            </button>
                          </>
                        )}
                      </ActionForm>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {sections.length === 0 ? (
        <EmptyState
          title="No sections yet"
          body={
            canEdit
              ? "Add the first section to start building this page."
              : "Nothing has been added to this page yet."
          }
        />
      ) : (
        <ol className="admin-rows m-0 list-none p-0">
          {sections.map((section, index) => {
            const option = byKey.get(section.type);
            const filled = Object.values(section.data).filter(
              (value) => value !== "" && value !== null && value !== undefined,
            ).length;

            return (
              <li key={section.id} className="admin-row m-0">
                <span className="admin-mono w-8 shrink-0 text-muted">{index + 1}</span>

                <span className="min-w-0 flex-1 basis-48">
                  <span
                    className={`block truncate text-sm font-semibold ${
                      section.enabled ? "text-ink" : "text-muted line-through"
                    }`}
                  >
                    {option?.label ?? section.type}
                  </span>
                  <span className="admin-meta mt-1 block truncate">
                    {filled} of {option?.fieldCount ?? "?"} fields filled
                    {option ? "" : " · this section type no longer exists"}
                  </span>
                </span>

                {!section.enabled ? <Pill tone="danger">Hidden</Pill> : null}

                {canEdit ? (
                  <span className="flex shrink-0 gap-1">
                    <SectionAction
                      action={moveSectionAction}
                      entryId={entryId}
                      sectionId={section.id}
                      extra={{ direction: "up" }}
                      label="Move up"
                      disabled={index === 0}
                    >
                      <ChevronUp className="size-4" aria-hidden />
                    </SectionAction>
                    <SectionAction
                      action={moveSectionAction}
                      entryId={entryId}
                      sectionId={section.id}
                      extra={{ direction: "down" }}
                      label="Move down"
                      disabled={index === sections.length - 1}
                    >
                      <ChevronDown className="size-4" aria-hidden />
                    </SectionAction>
                    <SectionAction
                      action={toggleSectionAction}
                      entryId={entryId}
                      sectionId={section.id}
                      label={section.enabled ? "Hide section" : "Show section"}
                    >
                      {section.enabled ? (
                        <Eye className="size-4" aria-hidden />
                      ) : (
                        <EyeOff className="size-4" aria-hidden />
                      )}
                    </SectionAction>
                    <SectionAction
                      action={removeSectionAction}
                      entryId={entryId}
                      sectionId={section.id}
                      label="Remove section"
                      confirm="Remove this section and its content?"
                      danger
                    >
                      <Trash2 className="size-4" aria-hidden />
                    </SectionAction>
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      )}

      <p className="text-body-sm m-0 border-t border-line bg-mist px-5 py-4 text-muted">
        <strong className="text-ink">Section A scope.</strong> You can compose a page here — add,
        reorder, hide and remove sections. Editing the fields inside each section is Section B.
      </p>
    </Card>
  );
}

function SectionAction({
  action,
  entryId,
  sectionId,
  label,
  children,
  extra,
  confirm,
  danger = false,
  disabled = false,
}: {
  action: Parameters<typeof ActionForm>[0]["action"];
  entryId: string;
  sectionId: string;
  label: string;
  children: React.ReactNode;
  extra?: Record<string, string>;
  confirm?: string;
  danger?: boolean;
  disabled?: boolean;
}) {
  if (disabled) {
    return (
      <span
        aria-hidden
        className="grid size-9 place-items-center border border-line bg-white text-muted/30"
      >
        {children}
      </span>
    );
  }

  return (
    <ActionForm action={action} banner={false}>
      {() => (
        <>
          <input type="hidden" name="entryId" value={entryId} />
          <input type="hidden" name="sectionId" value={sectionId} />
          {Object.entries(extra ?? {}).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}
          <SubmitButton
            variant="secondary"
            size="sm"
            confirm={confirm}
            className={`size-9 !px-0 ${danger ? "hover:!text-red" : ""}`}
          >
            <span className="sr-only">{label}</span>
            {children}
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
