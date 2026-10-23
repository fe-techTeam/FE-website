"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Card, FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import FieldBuilder from "@/components/admin/FieldBuilder";
import {
  deleteContentTypeAction,
  saveContentTypeAction,
} from "@/lib/admin/actions/structure";
import type { ContentTypeDTO } from "@/lib/admin/structure";

type SectionOption = { key: string; label: string; group: string };

export default function ContentTypeForm({
  type,
  sectionTypes,
  contentTypeKeys,
  groups,
}: {
  type: ContentTypeDTO | null;
  sectionTypes: SectionOption[];
  contentTypeKeys: string[];
  groups: string[];
}) {
  return (
    <>
      <ActionForm action={saveContentTypeAction} className="flex flex-col gap-8">
        {(state) => (
          <>
            <input type="hidden" name="id" value={type?.id ?? ""} />

            <Card title="Basics">
              <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="label">Label</FieldLabel>
                  <input
                    id="label"
                    name="label"
                    defaultValue={type?.label ?? ""}
                    required
                    className={inputClass}
                  />
                  <FieldError>{state.fieldErrors?.label}</FieldError>
                </div>

                <div>
                  <FieldLabel htmlFor="singular" hint="e.g. Case study">
                    Singular name
                  </FieldLabel>
                  <input
                    id="singular"
                    name="singular"
                    defaultValue={type?.singular ?? ""}
                    required
                    className={inputClass}
                  />
                  <FieldError>{state.fieldErrors?.singular}</FieldError>
                </div>

                <div>
                  <FieldLabel htmlFor="key" hint="cannot change safely once used">
                    Key
                  </FieldLabel>
                  <input
                    id="key"
                    name="key"
                    defaultValue={type?.key ?? ""}
                    required
                    readOnly={Boolean(type?.isSystem)}
                    className={`${inputClass} font-mono ${type?.isSystem ? "bg-mist" : ""}`}
                  />
                  <FieldError>{state.fieldErrors?.key}</FieldError>
                </div>

                <div>
                  <FieldLabel htmlFor="kind">Kind</FieldLabel>
                  <select
                    id="kind"
                    name="kind"
                    defaultValue={type?.kind ?? "COLLECTION"}
                    className={inputClass}
                  >
                    <option value="COLLECTION">Collection — many entries</option>
                    <option value="SINGLETON">Page — exactly one entry</option>
                  </select>
                </div>

                <div>
                  <FieldLabel htmlFor="group">Sidebar group</FieldLabel>
                  <input
                    id="group"
                    name="group"
                    defaultValue={type?.group ?? "Content"}
                    list="structure-groups"
                    required
                    className={inputClass}
                  />
                  <datalist id="structure-groups">
                    {groups.map((group) => (
                      <option key={group} value={group} />
                    ))}
                  </datalist>
                  <FieldError>{state.fieldErrors?.group}</FieldError>
                </div>

                <div>
                  <FieldLabel htmlFor="icon" hint="lucide icon name">
                    Icon
                  </FieldLabel>
                  <input
                    id="icon"
                    name="icon"
                    defaultValue={type?.icon ?? "FileText"}
                    className={inputClass}
                  />
                </div>

                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="description">Description</FieldLabel>
                  <textarea
                    id="description"
                    name="description"
                    rows={2}
                    defaultValue={type?.description ?? ""}
                    className={inputClass}
                  />
                </div>
              </div>
            </Card>

            <Card
              title="Routing"
              description="Which public URLs this content owns, so publishing refreshes the right pages."
            >
              <div className="grid gap-5 px-5 py-5 sm:grid-cols-2">
                <div>
                  <FieldLabel htmlFor="detailPath" hint="e.g. /work/[slug]">
                    Detail route
                  </FieldLabel>
                  <input
                    id="detailPath"
                    name="detailPath"
                    defaultValue={type?.detailPath ?? ""}
                    className={`${inputClass} font-mono`}
                  />
                  <FieldError>{state.fieldErrors?.detailPath}</FieldError>
                </div>

                <div>
                  <FieldLabel htmlFor="revalidatePaths" hint="one per line">
                    Routes to refresh on publish
                  </FieldLabel>
                  <textarea
                    id="revalidatePaths"
                    name="revalidatePaths"
                    rows={3}
                    defaultValue={(type?.revalidatePaths ?? []).join("\n")}
                    className={`${inputClass} font-mono`}
                  />
                  <FieldError>{state.fieldErrors?.revalidatePaths}</FieldError>
                </div>
              </div>
            </Card>

            <Card title="Behaviour">
              <div className="flex flex-col gap-3 px-5 py-5">
                <Toggle
                  name="orderable"
                  defaultChecked={type?.orderable ?? false}
                  label="Hand-ordered"
                  help="Editors drag entries into the order the site renders them."
                />
                <Toggle
                  name="usesSections"
                  defaultChecked={type?.usesSections ?? false}
                  label="Built from sections"
                  help="Editors stack sections on each entry instead of filling a fixed form."
                />
                <Toggle
                  name="enabled"
                  defaultChecked={type?.enabled ?? true}
                  label="Show in the sidebar"
                  help="Turn off to hide without deleting anything."
                />
              </div>

              <div className="border-t border-line px-5 py-5">
                <p className="admin-label m-0">Allowed sections</p>
                <p className="text-body-sm mt-1.5 m-0 text-muted">
                  Leave all unticked to allow every section.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {sectionTypes.map((section) => (
                    <label key={section.key} className="flex items-center gap-2 text-sm text-ink">
                      <input
                        type="checkbox"
                        name="allowedSectionKeys"
                        value={section.key}
                        defaultChecked={type?.allowedSectionKeys.includes(section.key) ?? false}
                        className="admin-check"
                      />
                      {section.label}
                    </label>
                  ))}
                </div>
              </div>
            </Card>

            <Card
              title="Fields"
              description="The fixed fields on every entry. Sections add their own fields on top."
            >
              <div className="px-5 py-5">
                <FieldBuilder
                  name="fields"
                  initialFields={type?.fields ?? []}
                  contentTypeKeys={contentTypeKeys}
                />
                <FieldError>{state.fieldErrors?.fields}</FieldError>
              </div>
            </Card>

            <div className="flex flex-wrap gap-3">
              <SubmitButton pendingLabel="Saving…">
                {type ? "Save changes" : "Create content type"}
              </SubmitButton>
            </div>
          </>
        )}
      </ActionForm>

      {type && !type.isSystem ? (
        <Card title="Danger zone">
          <ActionForm action={deleteContentTypeAction} className="px-5 py-5">
            {() => (
              <>
                <input type="hidden" name="key" value={type.key} />
                <SubmitButton
                  variant="danger"
                  confirm={`Delete the "${type.label}" content type?`}
                  pendingLabel="Deleting…"
                >
                  Delete content type
                </SubmitButton>
                <p className="text-body-sm mt-3 m-0 text-muted">
                  Only possible while it has no entries.
                </p>
              </>
            )}
          </ActionForm>
        </Card>
      ) : null}
    </>
  );
}

function Toggle({
  name,
  label,
  help,
  defaultChecked,
}: {
  name: string;
  label: string;
  help: string;
  defaultChecked: boolean;
}) {
  return (
    <label className="flex items-start gap-3">
      <input
        type="checkbox"
        name={name}
        defaultChecked={defaultChecked}
        className="admin-check mt-0.5"
      />
      <span>
        <span className="block text-sm font-semibold text-ink">{label}</span>
        <span className="admin-meta block">{help}</span>
      </span>
    </label>
  );
}
