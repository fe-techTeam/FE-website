"use client";

import Link from "next/link";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import { resetPasswordAction } from "@/lib/admin/actions/auth";

export default function ResetPasswordForm({ token }: { token: string }) {
  return (
    <ActionForm
      action={resetPasswordAction}
      className="mt-8"
      onSuccess={
        <Link
          href="/admin/login"
          className="admin-btn admin-btn-primary mt-5 w-full"
        >
          Go to sign in
        </Link>
      }
    >
      {(state) => (
        <>
          <input type="hidden" name="token" value={token} />

          <div>
            <FieldLabel htmlFor="password">New password</FieldLabel>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              autoFocus
              className={inputClass}
              aria-invalid={state.fieldErrors?.password ? true : undefined}
            />
            <FieldError>{state.fieldErrors?.password}</FieldError>
          </div>

          <div className="mt-5">
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              className={inputClass}
              aria-invalid={state.fieldErrors?.confirmPassword ? true : undefined}
            />
            <FieldError>{state.fieldErrors?.confirmPassword}</FieldError>
          </div>

          <SubmitButton className="mt-8 w-full" arrow pendingLabel="Saving…">
            Set password
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
