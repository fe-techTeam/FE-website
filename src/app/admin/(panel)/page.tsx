import type { Metadata } from "next";
import Link from "next/link";
import { AlertTriangle, ArrowRight, Clock } from "lucide-react";

import {
  Card,
  EmptyState,
  PageHeader,
  Pill,
  RelativeTime,
  StatTile,
  StatusBadge,
} from "@/components/admin/ui";
import { prisma } from "@/lib/admin/db";
import { requireUser } from "@/lib/admin/dal";
import { latestHealthScan } from "@/lib/admin/health";
import { getActiveContentTypes } from "@/lib/admin/structure";
import { can, canAccessArea } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

/** Feature 4 — counts, recent activity, unread submissions and health warnings. */
export default async function DashboardPage() {
  const user = await requireUser();
  const contentTypes = await getActiveContentTypes();
  const visibleModules = contentTypes.filter((mod) => can(user, "view", mod.key));
  const visibleKeys = visibleModules.map((mod) => mod.key);

  const [counts, recentEdits, pendingReview, scheduled, unreadSubmissions, health, totalEntries] =
    await Promise.all([
      prisma.contentEntry.groupBy({
        by: ["module", "status"],
        where: { module: { in: visibleKeys } },
        _count: { _all: true },
      }),
      prisma.contentEntry.findMany({
        where: { module: { in: visibleKeys } },
        orderBy: { updatedAt: "desc" },
        take: 8,
        include: { updatedBy: { select: { name: true } } },
      }),
      prisma.contentEntry.count({
        where: { module: { in: visibleKeys }, status: "IN_REVIEW" },
      }),
      prisma.contentEntry.findMany({
        where: { module: { in: visibleKeys }, scheduledFor: { not: null } },
        orderBy: { scheduledFor: "asc" },
        take: 5,
      }),
      prisma.formSubmission.count({ where: { status: "NEW" } }),
      latestHealthScan(),
      prisma.contentEntry.count({ where: { module: { in: visibleKeys } } }),
    ]);

  const publishedCount = counts
    .filter((row) => row.status === "PUBLISHED")
    .reduce((total, row) => total + row._count._all, 0);
  const draftCount = counts
    .filter((row) => row.status === "DRAFT")
    .reduce((total, row) => total + row._count._all, 0);

  const countsByModule = new Map<string, number>();
  for (const row of counts) {
    countsByModule.set(row.module, (countsByModule.get(row.module) ?? 0) + row._count._all);
  }

  const typeByKey = new Map(contentTypes.map((type) => [type.key, type]));
  const isEmpty = totalEntries === 0;

  return (
    <>
      <PageHeader
        eyebrow={`Welcome back, ${user.name.split(" ")[0]}`}
        title="Dashboard"
        description="Everything that changed recently, what is waiting on you, and anything broken on the live site."
      />

      {isEmpty && canAccessArea(user, "system") ? (
        <div className="flex flex-col gap-4 border-l-2 border-red bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="admin-card-title m-0 text-ink">No content in the database yet</p>
            <p className="text-body-sm mt-2 m-0 text-muted">
              Run the importer to pull the existing site content out of the source files.
            </p>
          </div>
          <Link href="/admin/system/import" className="admin-btn admin-btn-primary shrink-0">
            Import content
            <span className="admin-btn-arrow" aria-hidden>
              <ArrowRight size={13} />
            </span>
          </Link>
        </div>
      ) : null}

      <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Live" value={publishedCount} hint="Published on the site" />
        <StatTile label="Drafts" value={draftCount} hint="Not yet public" />
        <StatTile
          label="Awaiting review"
          value={pendingReview}
          hint={pendingReview > 0 ? "Needs a publisher" : "Nothing queued"}
          tone="warn"
        />
        <StatTile
          label="New enquiries"
          value={unreadSubmissions}
          hint="Contact, careers, newsletter"
          tone="warn"
        />
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <Card
          title="Recent edits"
          actions={
            canAccessArea(user, "audit") ? (
              <Link href="/admin/audit" className="text-cta text-muted transition hover:text-red">
                Full log
              </Link>
            ) : null
          }
        >
          {recentEdits.length === 0 ? (
            <EmptyState
              title="Nothing edited yet"
              body="Content changes appear here as soon as someone saves a draft or publishes a page."
            />
          ) : (
            <ul className="admin-rows m-0 list-none p-0">
              {recentEdits.map((entry) => {
                const mod = typeByKey.get(entry.module);
                return (
                  <li key={entry.id} className="m-0">
                    <Link
                      href={`/admin/content/${entry.module}/${entry.id}`}
                      className="admin-row justify-between"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {entry.title}
                        </span>
                        <span className="admin-meta mt-1 block">
                          {mod?.label ?? entry.module}
                          {entry.updatedBy ? ` · ${entry.updatedBy.name}` : ""} ·{" "}
                          <RelativeTime value={entry.updatedAt} />
                        </span>
                      </span>
                      <StatusBadge
                        status={entry.status}
                        pendingChanges={entry.hasUnpublishedChanges}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <div className="flex min-w-0 flex-col gap-8">
          <Card title="Scheduled">
            {scheduled.length === 0 ? (
              <EmptyState
                title="Nothing scheduled"
                body="Entries queued to publish later show up here."
              />
            ) : (
              <ul className="admin-rows m-0 list-none p-0">
                {scheduled.map((entry) => (
                  <li key={entry.id} className="m-0">
                    <Link
                      href={`/admin/content/${entry.module}/${entry.id}`}
                      className="admin-row items-start"
                    >
                      <Clock className="mt-0.5 size-4 shrink-0 text-red" aria-hidden />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-ink">
                          {entry.title}
                        </span>
                        <span className="admin-meta mt-1 block">
                          {entry.scheduledFor?.toLocaleString()}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card
            title="Site health"
            actions={
              <Link href="/admin/health" className="text-cta text-muted transition hover:text-red">
                Details
              </Link>
            }
          >
            {health.findings.length === 0 ? (
              <EmptyState
                title={health.ranAt ? "No issues found" : "Not scanned yet"}
                body={
                  health.ranAt
                    ? "The last scan found no missing images or broken internal links."
                    : "Run a scan to check every content entry for missing images and broken links."
                }
              />
            ) : (
              <div className="px-5 py-5">
                <p className="admin-stat m-0 flex items-center gap-3 text-red">
                  <AlertTriangle className="size-6" aria-hidden />
                  {health.findings.length}
                </p>
                <p className="admin-label mt-2 m-0">
                  issue{health.findings.length === 1 ? "" : "s"} found
                </p>
                <p className="admin-meta mt-1 m-0">
                  Last scan <RelativeTime value={health.ranAt} />
                </p>
                <ul className="mt-4 m-0 list-none space-y-1.5 border-t border-line p-0 pt-4">
                  {health.findings.slice(0, 4).map((finding) => (
                    <li key={finding.id} className="admin-mono m-0 truncate text-muted">
                      {finding.value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>

      <Card title="Content" description="Everything you have access to.">
        <ul className="m-0 grid list-none gap-px bg-line p-0 sm:grid-cols-2 lg:grid-cols-3">
          {visibleModules.map((mod) => (
            <li key={mod.key} className="m-0 bg-white">
              <Link
                href={`/admin/content/${mod.key}`}
                className="group flex h-full items-start justify-between gap-4 px-5 py-4 transition hover:bg-mist"
              >
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-ink transition group-hover:text-red">
                    {mod.label}
                  </span>
                  <span className="admin-meta mt-1 block">{mod.description}</span>
                </span>
                <span className="shrink-0 pt-0.5">
                  {mod.kind === "SINGLETON" ? (
                    <Pill>Page</Pill>
                  ) : (
                    <span className="font-display text-xl leading-none text-ink">
                      {countsByModule.get(mod.key) ?? 0}
                    </span>
                  )}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
