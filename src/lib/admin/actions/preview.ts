"use server";

import { cookies, draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Exits draft preview without pulling in the admin database layer. */
export async function exitPreviewAction(): Promise<void> {
  const draft = await draftMode();
  draft.disable();

  const store = await cookies();
  const returnTo = store.get("fe_admin_preview_return")?.value;
  store.delete("fe_admin_preview_return");

  redirect(returnTo?.startsWith("/admin") ? returnTo : "/admin");
}
