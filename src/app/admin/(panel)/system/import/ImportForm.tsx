"use client";

import { useState } from "react";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Card, Pill } from "@/components/admin/ui";
import { runImportAction } from "@/lib/admin/actions/system";

export type ImportRow = {
  moduleKey: string;
  moduleLabel: string;
  source: number;
  inDatabase: number;
  error?: string;
};

export default function ImportForm({ modules }: { modules: ImportRow[] }) {
  const importable = modules.filter((row) => !row.error);
  const [selected, setSelected] = useState<string[]>(importable.map((row) => row.moduleKey));

  const allSelected = selected.length === importable.length;

  return (
    <ActionForm action={runImportAction}>
      {() => (
        <Card
          title="Choose what to import"
          actions={
            <button
              type="button"
              onClick={() =>
                setSelected(allSelected ? [] : importable.map((row) => row.moduleKey))
              }
              className="text-cta text-muted transition hover:text-red"
            >
              {allSelected ? "Clear all" : "Select all"}
            </button>
          }
        >
          <ul className="admin-rows m-0 list-none p-0">
            {modules.map((row) => (
              <li key={row.moduleKey} className="m-0">
                <label
                  className={`flex flex-wrap items-center gap-3 px-5 py-3 ${
                    row.error ? "opacity-60" : "cursor-pointer hover:bg-mist"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="moduleKeys"
                    value={row.moduleKey}
                    checked={selected.includes(row.moduleKey)}
                    disabled={Boolean(row.error)}
                    onChange={(event) =>
                      setSelected((current) =>
                        event.target.checked
                          ? [...current, row.moduleKey]
                          : current.filter((key) => key !== row.moduleKey),
                      )
                    }
                    className="admin-check shrink-0"
                  />

                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold text-ink">{row.moduleLabel}</span>
                    <span className="mt-0.5 block font-mono text-xs text-muted">{row.moduleKey}</span>
                  </span>

                  {row.error ? (
                    <Pill tone="danger">{row.error}</Pill>
                  ) : (
                    <span className="admin-meta shrink-0">
                      <strong className="text-ink">{row.source}</strong> in source ·{" "}
                      {row.inDatabase} stored
                    </span>
                  )}
                </label>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-4 border-t border-line px-5 py-4">
            <fieldset className="m-0 border-0 p-0">
              <legend className="admin-label m-0 mb-2.5 p-0">
                If an entry already exists
              </legend>
              <label className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="radio"
                  name="onExisting"
                  value="skip"
                  defaultChecked
                  className="admin-check"
                />
                Skip it — never touch content that has been edited here
              </label>
              <label className="mt-1.5 flex items-center gap-2 text-sm text-ink">
                <input
                  type="radio"
                  name="onExisting"
                  value="overwrite"
                  className="admin-check"
                />
                Overwrite from the source files — discards admin edits
              </label>
            </fieldset>

            <label className="flex items-center gap-2 text-sm text-ink">
              <input
                type="checkbox"
                name="publish"
                defaultChecked
                className="admin-check"
              />
              Publish imported entries immediately
            </label>

            <SubmitButton
              className="w-full"
              pendingLabel="Importing…"
              confirm="Run the import now?"
            >
              Import {selected.length} module{selected.length === 1 ? "" : "s"}
            </SubmitButton>
          </div>
        </Card>
      )}
    </ActionForm>
  );
}
