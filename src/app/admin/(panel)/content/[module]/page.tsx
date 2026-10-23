import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import {
  Card,
  EmptyState,
  PageHeader,
  RelativeTime,
  StatusBadge,
} from "@/components/admin/ui";
import { listEntries } from "@/lib/admin/content";
import { requireCapability } from "@/lib/admin/dal";
import { getContentType, publicPath } from "@/lib/admin/structure";
import { accessFor } from "@/lib/admin/dal";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ module: string }>;
}): Promise<Metadata> {
  const { module: moduleKey } = await params;
  return { title: (await getContentType(moduleKey))?.label ?? "Content" };
}

export default async function ModuleListPage({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const { module: moduleKey } = await params;
  const mod = await getContentType(moduleKey);
  if (!mod) notFound();

  const user = await requireCapability("view", mod.key);
  const access = accessFor(user, mod.key);
  const entries = await listEntries(mod.key);

  // Resolve public URLs up front — publicPath reads the content type.
  const livePaths = new Map(
    await Promise.all(
      entries.map(async (entry) => [entry.id, await publicPath(mod.key, entry.slug)] as const),
    ),
  );

  // A singleton has no list worth showing — go straight to its editor.
  if (mod.kind === "SINGLETON" && entries.length === 1) {
    redirect(`/admin/content/${mod.key}/${entries[0].id}`);
  }

  return (
    <>
      <PageHeader
        eyebrow={mod.group}
        title={mod.label}
        description={mod.description}
        actions={
          access.edit && mod.kind === "COLLECTION" ? (
            <span className="admin-btn admin-btn-secondary cursor-not-allowed opacity-60">
              New {mod.singular.toLowerCase()} — Section B
            </span>
          ) : null
        }
      />

      <Card>
        {entries.length === 0 ? (
          <EmptyState
            title={`No ${mod.label.toLowerCase()} yet`}
            body="Run the content importer on the System page to pull the existing site content into the database."
            action={
              <Link href="/admin/system/import" className="admin-btn admin-btn-primary">
                Go to importer
              </Link>
            }
          />
        ) : (
          <ul className="admin-rows m-0 list-none p-0">
            {entries.map((entry) => {
              const live = livePaths.get(entry.id) ?? null;
              return (
                <li key={entry.id} className="m-0">
                  <div className="admin-row group hover:bg-mist">
                    <Link
                      href={`/admin/content/${mod.key}/${entry.id}`}
                      className="min-w-0 flex-1 basis-64"
                    >
                      <span className="block truncate text-sm font-semibold text-ink transition group-hover:text-red">
                        {entry.title}
                      </span>
                      <span className="admin-mono mt-1 block truncate text-muted">
                        {live ?? `/${entry.slug}`}
                      </span>
                    </Link>

                    <span className="admin-meta shrink-0 max-sm:order-3">
                      Updated <RelativeTime value={entry.updatedAt} />
                    </span>

                    <span className="shrink-0">
                      <StatusBadge status={entry.status} pendingChanges={entry.hasUnpublishedChanges} />
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <p className="text-body-sm m-0 border-l-2 border-line bg-mist px-5 py-4 text-muted">
        <strong className="text-ink">Section A scope.</strong> This screen lists entries and gives
        you the workflow, version history and preview on each one. The per-module editing forms
        (rich text, media pickers, repeatable field groups) are Section B of the plan.
      </p>
    </>
  );
}
