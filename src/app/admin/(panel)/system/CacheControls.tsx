"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Card, FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import { rebuildSiteAction, revalidatePathAction } from "@/lib/admin/actions/system";

/** Feature 9 — the manual half of cache control. Publishing does this automatically. */
export default function CacheControls({ paths }: { paths: string[] }) {
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <Card
        title="Rebuild the site"
        description="Refreshes every public route. Publishing already does this for the affected pages — use this after a bulk import or a config change."
      >
        <ActionForm action={rebuildSiteAction} className="px-5 py-4">
          {() => (
            <>
              <SubmitButton
                className="w-full"
                pendingLabel="Rebuilding…"
                confirm={`Refresh all ${paths.length} static routes plus every dynamic route?`}
              >
                Rebuild everything
              </SubmitButton>
              <p className="mt-3 m-0 text-xs leading-relaxed text-muted">
                Marks {paths.length} static routes and the four dynamic route patterns as stale.
                Pages regenerate on their next visit.
              </p>
            </>
          )}
        </ActionForm>
      </Card>

      <Card title="Refresh one path" description="Useful when a single page looks stale.">
        <ActionForm action={revalidatePathAction} className="px-5 py-4">
          {(state) => (
            <>
              <FieldLabel htmlFor="path" hint="e.g. /work/godrej-blue">
                Path
              </FieldLabel>
              <input
                id="path"
                name="path"
                type="text"
                placeholder="/work/godrej-blue"
                required
                className={inputClass}
                list="known-paths"
                aria-invalid={state.fieldErrors?.path ? true : undefined}
              />
              <datalist id="known-paths">
                {paths.map((path) => (
                  <option key={path} value={path} />
                ))}
              </datalist>
              <FieldError>{state.fieldErrors?.path}</FieldError>

              <SubmitButton variant="secondary" className="mt-4 w-full" pendingLabel="Refreshing…">
                Refresh path
              </SubmitButton>
            </>
          )}
        </ActionForm>
      </Card>
    </div>
  );
}
