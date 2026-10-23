"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import { inviteUserAction } from "@/lib/admin/actions/users";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/admin/permissions";

const ROLES = ["EDITOR", "AUTHOR", "VIEWER", "SUPER_ADMIN"] as const;

export default function InviteUserForm() {
  return (
    <ActionForm action={inviteUserAction} className="px-5 py-4">
      {(state) => (
        <>
          <div>
            <FieldLabel htmlFor="invite-name">Name</FieldLabel>
            <input
              id="invite-name"
              name="name"
              type="text"
              required
              className={inputClass}
              aria-invalid={state.fieldErrors?.name ? true : undefined}
            />
            <FieldError>{state.fieldErrors?.name}</FieldError>
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor="invite-email">Email</FieldLabel>
            <input
              id="invite-email"
              name="email"
              type="email"
              required
              className={inputClass}
              aria-invalid={state.fieldErrors?.email ? true : undefined}
            />
            <FieldError>{state.fieldErrors?.email}</FieldError>
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor="invite-title" hint="optional">
              Job title
            </FieldLabel>
            <input id="invite-title" name="title" type="text" className={inputClass} />
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor="invite-role">Role</FieldLabel>
            <select id="invite-role" name="role" defaultValue="AUTHOR" className={inputClass}>
              {ROLES.map((role) => (
                <option key={role} value={role}>
                  {ROLE_LABELS[role]} — {ROLE_DESCRIPTIONS[role]}
                </option>
              ))}
            </select>
            <FieldError>{state.fieldErrors?.role}</FieldError>
          </div>

          <SubmitButton className="mt-5 w-full" pendingLabel="Inviting…">
            Send invite
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
