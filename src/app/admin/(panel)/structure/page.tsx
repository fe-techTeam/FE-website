import type { Metadata } from "next";
import Link from "next/link";
import { Plus } from "lucide-react";

import { Card, EmptyState, PageHeader, Pill } from "@/components/admin/ui";
import SeedStructureButton from "./SeedStructureButton";
import { prisma } from "@/lib/admin/db";
import { requireArea } from "@/lib/admin/dal";
import { getContentTypes, getSectionTypes } from "@/lib/admin/structure";

export const metadata: Metadata = { title: "Structure" };
export const dynamic = "force-dynamic";

/**
 * The shape of the site, as data. Adding a page or a section here is what makes
 * the panel survive the site changing — no code edit, no deploy.
 */
export default async function StructurePage() {
  await requireArea("system");

  const [contentTypes, sectionTypes, counts] = await Promise.all([
    getContentTypes(),
    getSectionTypes(),
    prisma.contentEntry.groupBy({ by: ["module"], _count: { _all: true } }),
  ]);

  const entryCounts = new Map(counts.map((row) => [row.module, row._count._all]));
  const groups = [...new Set(contentTypes.map((type) => type.group))];
  const sectionGroups = [...new Set(sectionTypes.map((type) => type.group))];

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Structure"
        description="Content types are the things you can create; sections are the blocks a page is built from. Change either without touching code."
        actions={<SeedStructureButton />}
      />

      <Card
        title={`Content types (${contentTypes.length})`}
        description="Each one appears in the sidebar. Collections hold many entries; pages hold exactly one."
        actions={
          <Link href="/admin/structure/content-types/new" className="admin-btn admin-btn-secondary admin-btn-sm">
            <Plus className="size-3.5" aria-hidden />
            New type
          </Link>
        }
      >
        {contentTypes.length === 0 ? (
          <EmptyState
            title="No content types yet"
            body="Seed the defaults to start from the site's current structure, or create one from scratch."
          />
        ) : (
          groups.map((group) => (
            <div key={group}>
              <p className="admin-eyebrow m-0 bg-mist px-5 py-2">{group}</p>
              <ul className="admin-rows m-0 list-none p-0">
                {contentTypes
                  .filter((type) => type.group === group)
                  .map((type) => (
                    <li key={type.id} className="m-0">
                      <Link
                        href={`/admin/structure/content-types/${type.key}`}
                        className="admin-row group hover:bg-mist"
                      >
                        <span className="min-w-0 flex-1 basis-56">
                          <span className="block truncate text-sm font-semibold text-ink transition group-hover:text-red">
                            {type.label}
                          </span>
                          <span className="admin-mono mt-1 block truncate text-muted">
                            {type.key}
                            {type.detailPath ? ` · ${type.detailPath}` : ""}
                          </span>
                        </span>

                        <span className="admin-meta shrink-0">
                          {type.fields.length} field{type.fields.length === 1 ? "" : "s"} ·{" "}
                          {entryCounts.get(type.key) ?? 0} entries
                        </span>

                        <span className="flex shrink-0 gap-1.5">
                          {type.usesSections ? <Pill>Sections</Pill> : null}
                          {type.kind === "SINGLETON" ? <Pill>Page</Pill> : null}
                          {!type.enabled ? <Pill tone="danger">Hidden</Pill> : null}
                        </span>
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))
        )}
      </Card>

      <Card
        title={`Sections (${sectionTypes.length})`}
        description="The blocks editors stack on a page. Add a new one when the site gains a new kind of band."
        actions={
          <Link href="/admin/structure/sections/new" className="admin-btn admin-btn-secondary admin-btn-sm">
            <Plus className="size-3.5" aria-hidden />
            New section
          </Link>
        }
      >
        {sectionTypes.length === 0 ? (
          <EmptyState
            title="No sections yet"
            body="Seed the defaults to load a starter library modelled on the bands the site already renders."
          />
        ) : (
          sectionGroups.map((group) => (
            <div key={group}>
              <p className="admin-eyebrow m-0 bg-mist px-5 py-2">{group}</p>
              <ul className="admin-rows m-0 list-none p-0">
                {sectionTypes
                  .filter((type) => type.group === group)
                  .map((type) => (
                    <li key={type.id} className="m-0">
                      <Link
                        href={`/admin/structure/sections/${type.key}`}
                        className="admin-row group hover:bg-mist"
                      >
                        <span className="min-w-0 flex-1 basis-56">
                          <span className="block truncate text-sm font-semibold text-ink transition group-hover:text-red">
                            {type.label}
                          </span>
                          <span className="admin-meta mt-1 block truncate">{type.description}</span>
                        </span>

                        <span className="admin-meta shrink-0">
                          {type.fields.length} field{type.fields.length === 1 ? "" : "s"}
                        </span>

                        {!type.enabled ? <Pill tone="danger">Hidden</Pill> : null}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))
        )}
      </Card>
    </>
  );
}
