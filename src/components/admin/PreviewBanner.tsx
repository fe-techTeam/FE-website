import { draftMode } from "next/headers";

import { exitPreviewAction } from "@/lib/admin/actions/preview";

/**
 * Feature 8 — shown on the public site while an editor is previewing a draft,
 * so it is always obvious you are not looking at what visitors see.
 *
 * Renders nothing (and costs nothing) when draft mode is off.
 */
export default async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="sticky top-0 z-50 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 bg-red px-4 py-2 text-center text-white">
      <p className="m-0 text-xs font-semibold uppercase tracking-[0.12em]">
        Draft preview — visitors still see the published version
      </p>
      <form action={exitPreviewAction}>
        <button
          type="submit"
          className="text-cta min-h-9 border border-white/70 px-3.5 text-white transition hover:bg-white hover:text-red"
        >
          Exit preview
        </button>
      </form>
    </div>
  );
}
