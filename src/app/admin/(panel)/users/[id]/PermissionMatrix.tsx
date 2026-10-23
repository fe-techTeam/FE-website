"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { Card } from "@/components/admin/ui";
import { clearPermissionAction, setPermissionAction } from "@/lib/admin/actions/users";
import { ROLE_LABELS, type ModuleAccess } from "@/lib/admin/permissions";
import type { Role } from "@/generated/prisma/enums";

type ModuleRow = { key: string; label: string; group: string };
type Override = { canView: boolean; canEdit: boolean; canPublish: boolean; canDelete: boolean };

const COLUMNS = [
  { name: "canView", label: "View" },
  { name: "canEdit", label: "Edit" },
  { name: "canPublish", label: "Publish" },
  { name: "canDelete", label: "Delete" },
] as const;

/**
 * Feature 2 — per-module overrides. Each module is its own small form, so
 * saving one row never clobbers unsaved changes in another. Laid out with a
 * grid rather than a table because a `<form>` cannot live inside a `<tr>`.
 */
export default function PermissionMatrix({
  userId,
  role,
  defaults,
  modules,
  overrides,
}: {
  userId: string;
  role: Role;
  defaults: ModuleAccess;
  modules: ModuleRow[];
  overrides: Record<string, Override>;
}) {
  if (role === "SUPER_ADMIN") {
    return (
      <Card title="Module access">
        <p className="text-body-sm m-0 px-5 py-10 text-muted">
          Super Admins have full access to every module. Change the role to set per-module
          permissions.
        </p>
      </Card>
    );
  }

  const groups = [...new Set(modules.map((module) => module.group))];
  const overriddenKeys = Object.keys(overrides);

  return (
    <Card
      title="Module access"
      description={`Rows without a custom override follow the ${ROLE_LABELS[role]} default: ${describe(defaults)}.`}
    >
      <div className="admin-label grid grid-cols-[minmax(8rem,1fr)_repeat(4,2.75rem)_auto] items-center gap-x-2 border-b border-line px-5 py-2.5">
        <span>Module</span>
        {COLUMNS.map((column) => (
          <span key={column.name} className="text-center">
            {column.label.slice(0, 3)}
          </span>
        ))}
        <span className="sr-only">Save</span>
      </div>

      {groups.map((group) => (
        <div key={group}>
          <p className="admin-eyebrow m-0 bg-mist px-5 py-2">
            {group}
          </p>

          {modules
            .filter((module) => module.group === group)
            .map((module) => {
              const override = overrides[module.key];
              const current: Override = override ?? {
                canView: defaults.view,
                canEdit: defaults.edit,
                canPublish: defaults.publish,
                canDelete: defaults.delete,
              };

              return (
                <ActionForm
                  key={module.key}
                  action={setPermissionAction}
                  banner={false}
                  className="grid grid-cols-[minmax(8rem,1fr)_repeat(4,2.75rem)_auto] items-center gap-x-2 border-b border-line/40 px-5 py-2"
                >
                  {() => (
                    <>
                      <input type="hidden" name="userId" value={userId} />
                      <input type="hidden" name="module" value={module.key} />

                      <span className="min-w-0">
                        <span className="block truncate text-sm text-ink">{module.label}</span>
                        {override ? (
                          <span className="admin-label">
                            custom
                          </span>
                        ) : null}
                      </span>

                      {COLUMNS.map((column) => (
                        <span key={column.name} className="text-center">
                          <input
                            type="checkbox"
                            name={column.name}
                            defaultChecked={current[column.name]}
                            aria-label={`${column.label} ${module.label}`}
                            className="admin-check"
                          />
                        </span>
                      ))}

                      <SubmitButton variant="secondary" className="ml-2">
                        Save
                      </SubmitButton>
                    </>
                  )}
                </ActionForm>
              );
            })}
        </div>
      ))}

      <div className="border-t border-line px-5 py-4">
        {overriddenKeys.length === 0 ? (
          <p className="admin-meta m-0">
            No custom overrides — this user follows their role everywhere.
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            <p className="admin-meta m-0 mr-auto">
              {overriddenKeys.length} custom override{overriddenKeys.length === 1 ? "" : "s"} —
              reset a module to follow the role again.
            </p>
            {overriddenKeys.map((moduleKey) => (
              <ActionForm key={moduleKey} action={clearPermissionAction} banner={false}>
                {() => (
                  <>
                    <input type="hidden" name="userId" value={userId} />
                    <input type="hidden" name="module" value={moduleKey} />
                    <SubmitButton variant="secondary">Reset {moduleKey}</SubmitButton>
                  </>
                )}
              </ActionForm>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}

function describe(access: ModuleAccess): string {
  const granted = Object.entries(access)
    .filter(([, value]) => value)
    .map(([key]) => key);
  return granted.length > 0 ? granted.join(", ") : "no access";
}
