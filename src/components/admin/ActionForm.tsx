"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

import type { ActionState } from "@/lib/admin/actions/types";

/**
 * Wraps a server action in `useActionState` and renders its result banner.
 * The render prop receives the current state so fields can show inline errors.
 */
export function ActionForm({
  action,
  children,
  className = "",
  banner = true,
  onSuccess,
}: {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  children: (state: ActionState) => ReactNode;
  className?: string;
  banner?: boolean;
  onSuccess?: ReactNode;
}) {
  const [state, formAction] = useActionState(action, { ok: false });

  return (
    <form action={formAction} className={className}>
      {banner && state.message ? (
        <p
          role="status"
          className={`text-body-sm m-0 mb-5 border-l-2 py-2.5 pl-4 ${
            state.ok ? "border-ink bg-mist text-ink" : "border-red bg-red/5 text-red"
          }`}
        >
          {state.message}
        </p>
      ) : null}
      {children(state)}
      {state.ok && onSuccess ? onSuccess : null}
    </form>
  );
}

export function SubmitButton({
  children,
  variant = "primary",
  size = "md",
  pendingLabel,
  confirm,
  className = "",
  name,
  value,
  /** Adds the site's arrow-in-circle glyph, as on the "Let's talk" CTA. */
  arrow = false,
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  size?: "md" | "sm";
  pendingLabel?: string;
  /** Shows a native confirm() dialog before submitting. */
  confirm?: string;
  className?: string;
  name?: string;
  value?: string;
  arrow?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      name={name}
      value={value}
      disabled={pending}
      onClick={(event) => {
        if (confirm && !window.confirm(confirm)) event.preventDefault();
      }}
      className={`admin-btn admin-btn-${variant} ${size === "sm" ? "admin-btn-sm" : ""} ${className}`}
    >
      {pending && pendingLabel ? pendingLabel : children}
      {arrow && !pending ? (
        <span className="admin-btn-arrow" aria-hidden>
          <ArrowRight size={13} />
        </span>
      ) : null}
    </button>
  );
}
