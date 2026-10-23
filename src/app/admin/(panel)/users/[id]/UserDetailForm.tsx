"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import { revokeUserSessionsAction, updateUserAction } from "@/lib/admin/actions/users";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/admin/permissions";
import type { Role, UserStatus } from "@/generated/prisma/enums";

const ROLES: Role[] = ["SUPER_ADMIN", "EDITOR", "AUTHOR", "VIEWER"];
const STATUSES: UserStatus[] = ["ACTIVE", "INVITED", "DISABLED"];

export default function UserDetailForm({
  user,
  isSelf,
}: {
  user: { id: string; name: string; title: string | null; role: Role; status: UserStatus };
  isSelf: boolean;
}) {
  return (
    <ActionForm action={updateUserAction} className="px-5 py-4">
      {(state) => (
        <>
          <input type="hidden" name="userId" value={user.id} />

          <div>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              required
              className={inputClass}
            />
            <FieldError>{state.fieldErrors?.name}</FieldError>
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor="title" hint="optional">
              Job title
            </FieldLabel>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={user.title ?? ""}
              className={inputClass}
            />
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor="role">Role</FieldLabel>
            <select id="role" name="role" defaultValue={user.role} className={inputClass}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]} — {ROLE_DESCRIPTIONS[role]}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor="status">Status</FieldLabel>
            <select
              id="status"
              name="status"
              defaultValue={user.status}
              disabled={isSelf}
              className={inputClass}
            >
              {STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status === "ACTIVE"
                    ? "Active — can sign in"
                    : status === "INVITED"
                      ? "Invited — waiting to set a password"
                      : "Disabled — cannot sign in"}
                </option>
              ))}
            </select>
            {isSelf ? (
              <p className="mt-1.5 m-0 text-xs text-muted">You cannot disable your own account.</p>
            ) : null}
          </div>

          <SubmitButton className="mt-5 w-full" pendingLabel="Saving…">
            Save changes
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function RevokeSessions({ userId, count }: { userId: string; count: number }) {
  return (
    <ActionForm action={revokeUserSessionsAction}>
      {() => (
        <>
          <input type="hidden" name="userId" value={userId} />
          <SubmitButton
            variant="secondary"
            className="w-full"
            confirm="Sign this user out of every device?"
            pendingLabel="Signing out…"
          >
            Force sign-out{count > 0 ? ` (${count})` : ""}
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
