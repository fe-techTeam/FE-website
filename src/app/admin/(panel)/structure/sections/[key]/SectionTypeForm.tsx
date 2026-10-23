"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Card, FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import FieldBuilder from "@/components/admin/FieldBuilder";
import {
  deleteSectionTypeAction,
  saveSectionTypeAction,
} from "@/lib/admin/actions/structure";
import type { SectionTypeDTO } from "@/lib/admin/structure";

export default function SectionTypeForm({
  section,
  contentTypeKeys,
  groups,
}: {
  section: SectionTypeDTO | null;
  contentTypeKeys: string[];
  groups: string[];
}) {
  return (
    <>
      <ActionForm action={saveSectionTypeAction} className="flex flex-col gap-8">
        {(state) => (
          <>
            <input type="hidden" name="id" value={section?.id ?? ""} />

            <Card title="Basics">
              <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="label">Label</FieldLabel>
                  <input
                    id="label"
                    name="label"
                    defaultValue={section?.label ?? ""}
                    required
                    className={inputClass}
                  />
                  <FieldError>{state.fieldErrors?.label}</FieldError>
                </div>

                <div>
                  <FieldLabel htmlFor="key">Key</FieldLabel>
                  <input
                    id="key"
                    name="key"
                    defaultValue={section?.key ?? ""}
                    required
                    readOnly={Boolean(section?.isSystem)}
                    className={`${inputClass} font-mono ${section?.isSystem ? "bg-mist" : ""}`}
                  />
                  <FieldError>{state.fieldErrors?.key}</FieldError>
                </div>

                <div>
                  <FieldLabel htmlFor="group">Group</FieldLabel>
                  <input
                    id="group"
                    name="group"
                    defaultValue={section?.group ?? "Content"}
                    list="section-groups"
                    className={inputClass}
                  />
                  <datalist id="section-groups">
                    {groups.map((group) => (
                      <option key={group} value={group} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <FieldLabel htmlFor="icon" hint="lucide icon name">
                    Icon
                  </FieldLabel>
                  <input
                    id="icon"
                    name="icon"
                    defaultValue={section?.icon ?? "LayoutTemplate"}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    defaultValue={section?.description ?? ""}
                    className={inputClass}
                  />
                  <p className="admin-meta mt-2 m-0">
                    Shown to editors in the &ldquo;add section&rdquo; picker.
                  </p>
                </div>

                <label className="flex items-start gap-3 sm:col-span-2">
                  <input
                    type="checkbox"
                    name="enabled"
                    defaultChecked={section?.enabled ?? true}
                    className="admin-check mt-0.5"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">Available to editors</span>
                    <span className="admin-meta block">
                      Turn off to retire a section without affecting pages that already use it.
                    </span>
                  </span>
                </label>
              </div>
            </Card>

            <Card title="Fields" description="What an editor fills in for this section.">
              <div className="px-5 py-5">
                <FieldBuilder
                  name="fields"
                  initialFields={section?.fields ?? []}
                  contentTypeKeys={contentTypeKeys}
                />
                <FieldError>{state.fieldErrors?.fields}</FieldError>
              </div>
            </Card>

            <div>
              <SubmitButton pendingLabel="Saving…">
                {section ? "Save changes" : "Create section"}
              </SubmitButton>
            </div>
          </>
        )}
      </ActionForm>

      {section && !section.isSystem ? (
        <Card title="Danger zone">
          <ActionForm action={deleteSectionTypeAction} className="px-5 py-5">
            {() => (
              <>
                <input type="hidden" name="key" value={section.key} />
                <SubmitButton
                  variant="danger"
                  confirm={`Delete the "${section.label}" section?`}
                  pendingLabel="Deleting…"
                >
                  Delete section
                </SubmitButton>
                <p className="text-body-sm mt-3 m-0 text-muted">
                  Pages already using it keep their stored content, but it can no longer be added.
                </p>
              </>
            )}
          </ActionForm>
        </Card>
      ) : null}
    </>
  );
}
