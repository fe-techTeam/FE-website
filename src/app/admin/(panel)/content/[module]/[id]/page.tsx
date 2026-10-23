import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";

import { Card, PageHeader, RelativeTime, StatusBadge } from "@/components/admin/ui";
import EntryWorkflow from "@/components/admin/EntryWorkflow";
import VersionHistory from "@/components/admin/VersionHistory";
import SectionBuilder from "@/components/admin/SectionBuilder";
import { getEntry, listVersions } from "@/lib/admin/content";
import { accessFor, requireCapability } from "@/lib/admin/dal";
import { getContentType, publicPath, sectionTypesFor } from "@/lib/admin/structure";
import { toDocument } from "@/lib/admin/documents";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const entry = await getEntry(id);
  return { title: entry?.title ?? "Entry" };
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ module: string; id: string }>;
}) {
  const { module: moduleKey, id } = await params;

  const mod = await getContentType(moduleKey);
  if (!mod) notFound();

  const user = await requireCapability("view", mod.key);
  const entry = await getEntry(id);
  if (!entry || entry.module !== mod.key) notFound();

  const [versions, access] = await Promise.all([
    listVersions(entry.id),
    Promise.resolve(accessFor(user, mod.key)),
  ]);

  const live = await publicPath(mod.key, entry.slug);

  // Sections are stored inside the entry payload; legacy imports have none.
  const document = toDocument(entry.data);
  const sectionOptions = mod.usesSections
    ? (await sectionTypesFor(mod)).map((section) => ({
        key: section.key,
        label: section.label,
        description: section.description,
        group: section.group,
        fieldCount: section.fields.length,
      }))
    : [];

  return (
    <>
      <PageHeader
        eyebrow={
          <Link href={`/admin/content/${mod.key}`} className="underline hover:text-ink">
            {mod.label}
          </Link>
        }
        title={entry.title}
        description={mod.description}
        actions={
          live && entry.status === "PUBLISHED" ? (
            <Link
              href={live}
              target="_blank"
              rel="noreferrer"
              className="admin-btn admin-btn-secondary"
            >
              <ExternalLink className="size-3.5" aria-hidden />
              View live
            </Link>
          ) : null
        }
      />

      <div className="grid min-w-0 gap-8 lg:grid-cols-[1.35fr_1fr]">
        <div className="flex min-w-0 flex-col gap-8">
          <Card title="Status">
            <dl className="m-0 grid gap-px bg-line sm:grid-cols-2">
              <Detail label="Current status">
                <StatusBadge status={entry.status} pendingChanges={entry.hasUnpublishedChanges} />
              </Detail>
              <Detail label="Public URL">
                <span className="font-mono text-xs">{live ?? "—"}</span>
              </Detail>
              <Detail label="Last updated">
                <RelativeTime value={entry.updatedAt} />
              </Detail>
              <Detail label="Published">
                {entry.publishedAt ? <RelativeTime value={entry.publishedAt} /> : "Never"}
              </Detail>
              <Detail label="Scheduled">
                {entry.scheduledFor ? entry.scheduledFor.toLocaleString() : "Not scheduled"}
              </Detail>
              <Detail label="Versions">{versions.length}</Detail>
              <Detail label="Fields">
                {mod.fields.length} declared
                {mod.usesSections ? ` · ${document.sections.length} sections` : ""}
              </Detail>
            </dl>
          </Card>

          {mod.usesSections ? (
            <SectionBuilder
              entryId={entry.id}
              sections={document.sections}
              available={sectionOptions}
              canEdit={access.edit}
            />
          ) : null}

          <Card
            title="Content"
            description="Raw stored payload. Field-by-field editors arrive in Section B."
          >
            <pre className="admin-mono m-0 max-h-96 overflow-auto bg-ink px-5 py-4 leading-relaxed text-white/85">
              {JSON.stringify(entry.data, null, 2)}
            </pre>
          </Card>

          <VersionHistory
            entryId={entry.id}
            versions={versions.map((version) => ({
              id: version.id,
              version: version.version,
              label: version.label,
              note: version.note,
              status: version.status,
              createdAt: version.createdAt.toISOString(),
              author: version.createdBy?.name ?? "System",
            }))}
            canRollback={access.edit}
          />
        </div>

        <EntryWorkflow
          entryId={entry.id}
          status={entry.status}
          hasUnpublishedChanges={entry.hasUnpublishedChanges}
          scheduledFor={entry.scheduledFor?.toISOString() ?? null}
          canEdit={access.edit}
          canPublish={access.publish}
          canDelete={access.delete}
          hasPublicRoute={Boolean(live)}
        />
      </div>
    </>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="bg-white px-5 py-4">
      <dt className="admin-label m-0">{label}</dt>
      <dd className="mt-2 m-0 text-sm text-ink">{children}</dd>
    </div>
  );
}
