"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { FieldError, FieldLabel, inputClass } from "@/components/admin/ui";
import { loginAction } from "@/lib/admin/actions/auth";

export default function LoginForm({ next }: { next?: string }) {
  return (
    <ActionForm action={loginAction} className="mt-8">
      {(state) => (
        <>
          <input type="hidden" name="next" value={next ?? ""} />

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

          <div className="mt-5">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className={inputClass}
              aria-invalid={state.fieldErrors?.password ? true : undefined}
            />
            <FieldError>{state.fieldErrors?.password}</FieldError>
          </div>

          <SubmitButton className="mt-8 w-full" pendingLabel="Signing in…" arrow>
            Sign in
          </SubmitButton>
        </>
      )}
    </ActionForm>
  );
}
