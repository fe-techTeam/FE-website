"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import { changePasswordAction, revokeOtherSessionsAction } from "@/lib/admin/actions/auth";
import { PASSWORD_RULES } from "@/lib/admin/password-rules";

export function ChangePassword() {
  return (
    <ActionForm action={changePasswordAction} className="px-5 py-4">
      {(state) => (
        <>
          <div>
            <FieldLabel htmlFor="currentPassword">Current password</FieldLabel>
            <input
              id="currentPassword"
              name="currentPassword"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
            />
            <FieldError>{state.fieldErrors?.currentPassword}</FieldError>
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor="new-password">New password</FieldLabel>
            <input
              id="new-password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
            />
            <FieldError>{state.fieldErrors?.password}</FieldError>
            <ul className="mt-2 m-0 list-disc space-y-0.5 pl-4 text-xs text-muted">
              {PASSWORD_RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          <div className="mt-4">
            <FieldLabel htmlFor="confirm-password">Confirm new password</FieldLabel>
            <input
              id="confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
            />
            <FieldError>{state.fieldErrors?.confirmPassword}</FieldError>
          </div>

          <SubmitButton className="mt-5 w-full" pendingLabel="Saving…">
            Update password
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}

export function RevokeOthers() {
  return (
    <ActionForm action={revokeOtherSessionsAction}>
      {() => (
        <SubmitButton
          variant="secondary"
          className="w-full"
          confirm="Sign out of every other device?"
          pendingLabel="Signing out…"
        >
          Sign out other devices
        </SubmitButton>
      )}
    </ActionForm>
  );
}
