"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";

import { FieldLabel, inputClass } from "@/components/admin/ui";
import {
  CONTAINER_FIELD_TYPES,
  FIELD_TYPES,
  FIELD_TYPE_LABELS,
  type FieldDef,
  type FieldType,
} from "@/lib/admin/fields";

/**
 * Visual editor for a `FieldDef[]`.
 *
 * Emits the definitions as JSON in a hidden input, so the server action can
 * validate the whole list in one place. Nested `list` and `group` fields recurse
 * one level, which covers every shape the site currently uses.
 */
export default function FieldBuilder({
  name,
  initialFields,
  contentTypeKeys,
}: {
  name: string;
  initialFields: FieldDef[];
  contentTypeKeys: string[];
}) {
  const [fields, setFields] = useState<FieldDef[]>(initialFields);

  const update = (index: number, patch: Partial<FieldDef>) =>
    setFields((current) =>
      current.map((field, i) => (i === index ? { ...field, ...patch } : field)),
    );

  const move = (index: number, direction: -1 | 1) =>
    setFields((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  return (
    <div>
      <input type="hidden" name={name} value={JSON.stringify(fields)} />

      {fields.length === 0 ? (
        <p className="text-body-sm m-0 border border-dashed border-line px-5 py-8 text-muted">
          No fields yet. Add the first one below.
        </p>
      ) : (
        <ul className="m-0 list-none space-y-3 p-0">
          {fields.map((field, index) => (
            <li key={index} className="m-0 border border-line bg-mist p-4">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1 basis-64">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <FieldLabel htmlFor={`${name}-${index}-label`}>Label</FieldLabel>
                      <input
                        id={`${name}-${index}-label`}
                        value={field.label}
                        onChange={(event) => update(index, { label: event.target.value })}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`${name}-${index}-key`} hint="camelCase">
                        Key
                      </FieldLabel>
                      <input
                        id={`${name}-${index}-key`}
                        value={field.key}
                        onChange={(event) => update(index, { key: event.target.value })}
                        className={`${inputClass} font-mono`}
                      />
                    </div>
                    <div>
                      <FieldLabel htmlFor={`${name}-${index}-type`}>Type</FieldLabel>
                      <select
                        id={`${name}-${index}-type`}
                        value={field.type}
                        onChange={(event) =>
                          update(index, { type: event.target.value as FieldType })
                        }
                        className={inputClass}
                      >
                        {FIELD_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {FIELD_TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <FieldLabel htmlFor={`${name}-${index}-help`} hint="optional">
                        Helper text
                      </FieldLabel>
                      <input
                        id={`${name}-${index}-help`}
                        value={field.help ?? ""}
                        onChange={(event) => update(index, { help: event.target.value })}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {field.type === "reference" ? (
                    <div className="mt-3">
                      <FieldLabel htmlFor={`${name}-${index}-ref`}>Points at</FieldLabel>
                      <select
                        id={`${name}-${index}-ref`}
                        value={field.referenceType ?? ""}
                        onChange={(event) => update(index, { referenceType: event.target.value })}
                        className={inputClass}
                      >
                        <option value="">Choose a content type…</option>
                        {contentTypeKeys.map((key) => (
                          <option key={key} value={key}>
                            {key}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : null}

                  {field.type === "select" ? (
                    <div className="mt-3">
                      <FieldLabel htmlFor={`${name}-${index}-options`} hint="one per line">
                        Options
                      </FieldLabel>
                      <textarea
                        id={`${name}-${index}-options`}
                        rows={3}
                        value={(field.options ?? []).map((option) => option.value).join("\n")}
                        onChange={(event) =>
                          update(index, {
                            options: event.target.value
                              .split("\n")
                              .map((line) => line.trim())
                              .filter(Boolean)
                              .map((value) => ({ label: value, value })),
                          })
                        }
                        className={inputClass}
                      />
                    </div>
                  ) : null}

                  {CONTAINER_FIELD_TYPES.includes(field.type) ? (
                    <NestedFields
                      field={field}
                      onChange={(patch) => update(index, patch)}
                      idPrefix={`${name}-${index}`}
                    />
                  ) : null}

                  <label className="mt-3 flex items-center gap-2 text-sm text-ink">
                    <input
                      type="checkbox"
                      checked={field.required ?? false}
                      onChange={(event) => update(index, { required: event.target.checked })}
                      className="admin-check"
                    />
                    Required
                  </label>
                </div>

                <div className="flex shrink-0 gap-1">
                  <IconButton label="Move up" onClick={() => move(index, -1)}>
                    <ChevronUp className="size-4" aria-hidden />
                  </IconButton>
                  <IconButton label="Move down" onClick={() => move(index, 1)}>
                    <ChevronDown className="size-4" aria-hidden />
                  </IconButton>
                  <IconButton
                    label="Remove field"
                    danger
                    onClick={() => setFields((c) => c.filter((_, i) => i !== index))}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </IconButton>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() =>
          setFields((current) => [
            ...current,
            { key: `field${current.length + 1}`, label: "New field", type: "text" },
          ])
        }
        className="admin-btn admin-btn-secondary mt-4"
      >
        <Plus className="size-3.5" aria-hidden />
        Add field
      </button>
    </div>
  );
}

/** One level of nesting for `list` and `group` fields. */
function NestedFields({
  field,
  onChange,
  idPrefix,
}: {
  field: FieldDef;
  onChange: (patch: Partial<FieldDef>) => void;
  idPrefix: string;
}) {
  const children = field.fields ?? [];

  const updateChild = (index: number, patch: Partial<FieldDef>) =>
    onChange({
      fields: children.map((child, i) => (i === index ? { ...child, ...patch } : child)),
    });

  return (
    <div className="mt-3 border-l-2 border-line pl-4">
      <p className="admin-label m-0">
        {field.type === "list" ? "Each item has" : "Group contains"}
      </p>

      {field.type === "list" ? (
        <label className="mt-2 flex items-center gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={children.length === 0}
            onChange={(event) =>
              onChange(
                event.target.checked
                  ? { fields: [], itemType: "text" }
                  : { fields: [{ key: "title", label: "Title", type: "text" }], itemType: undefined },
              )
            }
            className="admin-check"
          />
          Simple list of single values
        </label>
      ) : null}

      {field.type === "list" && children.length === 0 ? (
        <div className="mt-2">
          <FieldLabel htmlFor={`${idPrefix}-itemType`}>Value type</FieldLabel>
          <select
            id={`${idPrefix}-itemType`}
            value={field.itemType ?? "text"}
            onChange={(event) =>
              onChange({ itemType: event.target.value as FieldDef["itemType"] })
            }
            className={inputClass}
          >
            {FIELD_TYPES.filter((type) => !CONTAINER_FIELD_TYPES.includes(type)).map((type) => (
              <option key={type} value={type}>
                {FIELD_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <>
          <ul className="mt-2 m-0 list-none space-y-2 p-0">
            {children.map((child, index) => (
              <li key={index} className="m-0 flex flex-wrap items-end gap-2">
                <div className="min-w-0 flex-1 basis-32">
                  <FieldLabel htmlFor={`${idPrefix}-child-${index}-label`}>Label</FieldLabel>
                  <input
                    id={`${idPrefix}-child-${index}-label`}
                    value={child.label}
                    onChange={(event) => updateChild(index, { label: event.target.value })}
                    className={inputClass}
                  />
                </div>
                <div className="min-w-0 flex-1 basis-28">
                  <FieldLabel htmlFor={`${idPrefix}-child-${index}-key`}>Key</FieldLabel>
                  <input
                    id={`${idPrefix}-child-${index}-key`}
                    value={child.key}
                    onChange={(event) => updateChild(index, { key: event.target.value })}
                    className={`${inputClass} font-mono`}
                  />
                </div>
                <div className="min-w-0 flex-1 basis-32">
                  <FieldLabel htmlFor={`${idPrefix}-child-${index}-type`}>Type</FieldLabel>
                  <select
                    id={`${idPrefix}-child-${index}-type`}
                    value={child.type}
                    onChange={(event) =>
                      updateChild(index, { type: event.target.value as FieldType })
                    }
                    className={inputClass}
                  >
                    {FIELD_TYPES.filter((type) => type !== "list" && type !== "group").map(
                      (type) => (
                        <option key={type} value={type}>
                          {FIELD_TYPE_LABELS[type]}
                        </option>
                      ),
                    )}
                  </select>
                </div>
                <IconButton
                  label="Remove"
                  danger
                  onClick={() => onChange({ fields: children.filter((_, i) => i !== index) })}
                >
                  <Trash2 className="size-4" aria-hidden />
                </IconButton>
              </li>
            ))}
          </ul>

          <button
            type="button"
            onClick={() =>
              onChange({
                fields: [
                  ...children,
                  { key: `item${children.length + 1}`, label: "New", type: "text" },
                ],
              })
            }
            className="admin-btn admin-btn-secondary admin-btn-sm mt-2"
          >
            <Plus className="size-3.5" aria-hidden />
            Add
          </button>
        </>
      )}
    </div>
  );
}

function IconButton({
  label,
  onClick,
  children,
  danger = false,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`grid size-9 place-items-center border border-line bg-white transition hover:border-ink ${
        danger ? "text-muted hover:text-red" : "text-muted hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
