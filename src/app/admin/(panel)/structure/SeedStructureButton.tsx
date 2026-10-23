"use client";

import { ActionForm, SubmitButton } from "@/components/admin/ActionForm";
import { seedStructureAction } from "@/lib/admin/actions/structure";

export default function SeedStructureButton() {
  return (
    <ActionForm action={seedStructureAction} banner={false}>
      {(state) => (
        <div className="flex flex-wrap items-center gap-3">
          {state.message ? (
            <span className={`text-xs ${state.ok ? "text-ink" : "text-red"}`}>{state.message}</span>
          ) : null}
          <SubmitButton variant="secondary" pendingLabel="Seeding…">
            Load defaults
          </SubmitButton>
        </div>
      )}
    </ActionForm>
  );
}
