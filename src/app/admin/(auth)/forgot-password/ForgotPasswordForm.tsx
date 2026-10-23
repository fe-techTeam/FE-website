"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import { requestPasswordResetAction } from "@/lib/admin/actions/auth";

export default function ForgotPasswordForm() {
  return (
    <ActionForm action={requestPasswordResetAction} className="mt-8">
      {(state) => (
        <>
          <div>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              autoFocus
              className={inputClass}
              aria-invalid={state.fieldErrors?.email ? true : undefined}
            />
            <FieldError>{state.fieldErrors?.email}</FieldError>
          </div>

          <SubmitButton className="mt-8 w-full" arrow pendingLabel="Sending…">
            Send reset link
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
