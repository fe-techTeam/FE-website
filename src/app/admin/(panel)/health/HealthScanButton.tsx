"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { runHealthScanAction } from "@/lib/admin/actions/system";

export default function HealthScanButton() {
  return (
    <ActionForm action={runHealthScanAction} banner={false}>
      {(state) => (
        <div className="flex flex-wrap items-center gap-3">
          {state.message ? (
            <span className={`text-xs ${state.ok ? "text-emerald-700" : "text-red"}`}>
              {state.message}
            </span>
          ) : null}
          <SubmitButton pendingLabel="Scanning…">Run scan</SubmitButton>
        </div>
      )}
    </ActionForm>
  );
}
