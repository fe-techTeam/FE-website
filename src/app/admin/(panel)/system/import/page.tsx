import type { Metadata } from "next";
import Link from "next/link";

import { Card, PageHeader } from "@/components/admin/ui";
import ImportForm from "./ImportForm";
import { requireArea } from "@/lib/admin/dal";
import { importPreview } from "@/lib/admin/importers/run";

export const metadata: Metadata = { title: "Import content" };
export const dynamic = "force-dynamic";

/** Feature 10 — the migration screen. */
export default async function ImportPage() {
  await requireArea("system");
  const preview = await importPreview();

  const totalSource = preview.reduce((total, row) => total + row.source, 0);
  const totalStored = preview.reduce((total, row) => total + row.inDatabase, 0);

  return (
    <>
      <PageHeader
        eyebrow={
          <Link href="/admin/system" className="underline hover:text-ink">
            System
          </Link>
        }
        title="Import content"
        description="Reads the TypeScript content in src/content and writes it into the database so the admin panel starts populated instead of empty."
      />

      <Card>
        <div className="grid gap-px bg-line sm:grid-cols-2">
          <div className="bg-white px-5 py-4">
            <p className="admin-label m-0">
              In source files
            </p>
            <p className="admin-stat mt-3 m-0 text-ink">{totalSource}</p>
          </div>
          <div className="bg-white px-5 py-4">
            <p className="admin-label m-0">
              In database
            </p>
            <p className="admin-stat mt-3 m-0 text-ink">{totalStored}</p>
          </div>
        </div>
      </Card>

      <ImportForm modules={preview} />

      <Card title="What this does">
        <ul className="text-body-sm m-0 list-disc space-y-2.5 px-5 py-5 pl-9 text-muted">
          <li>
            Creates one <code className="font-mono text-xs text-ink">ContentEntry</code> per case
            study, role, page and list item, keyed by module and slug.
          </li>
          <li>
            Records an initial version for each entry, so version history starts from the import.
          </li>
          <li>
            Publishes them by default, mirroring what the site already shows. Untick that to import
            everything as drafts instead.
          </li>
          <li>
            Safe to re-run: existing entries are skipped unless you choose to overwrite them. The
            source files are never modified.
          </li>
        </ul>
      </Card>
    </>
  );
}
