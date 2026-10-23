import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Card, PageHeader, Pill, RelativeTime } from "@/components/admin/ui";
import CacheControls from "./CacheControls";
import { prisma } from "@/lib/admin/db";
import { requireArea } from "@/lib/admin/dal";
import { SITE_PATHS } from "@/lib/admin/revalidate";

export const metadata: Metadata = { title: "System" };
export const dynamic = "force-dynamic";

/** Feature 9 — cache control, plus the entry point to the importer (feature 10). */
export default async function SystemPage() {
  await requireArea("system");

  const [recent, entryCount, userCount] = await Promise.all([
    prisma.revalidationLog.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.contentEntry.count(),
    prisma.user.count({ where: { status: "ACTIVE" } }),
  ]);

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="System"
        description="Cache control, content migration and environment status."
      />

      <Card title="Content migration" description="Feature 10 — import the site's source files into the database.">
        <div className="flex flex-col gap-4 px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-body-sm m-0 text-muted">
            {entryCount === 0
              ? "The database has no content yet. Import the existing site content to get started."
              : `${entryCount} entries currently stored. Re-running the import is safe — existing entries are skipped by default.`}
          </p>
          <Link
            href="/admin/system/import"
            className="admin-btn admin-btn-primary shrink-0"
          >
            Open importer
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </div>
      </Card>

      <CacheControls paths={[...SITE_PATHS]} />

      <Card title="Recent revalidations">
        {recent.length === 0 ? (
          <p className="text-body-sm m-0 px-5 py-8 text-muted">Nothing revalidated yet.</p>
        ) : (
          <ul className="admin-rows m-0 list-none p-0">
            {recent.map((log) => (
              <li key={log.id} className="admin-row m-0">
                <span className="min-w-0 flex-1 basis-64">
                  <span className="block text-sm text-ink">{log.reason}</span>
                  <span className="admin-mono mt-1 block truncate text-muted">
                    {log.paths.slice(0, 4).join(", ")}
                    {log.paths.length > 4 ? ` +${log.paths.length - 4} more` : ""}
                  </span>
                </span>
                {log.ok ? <Pill tone="good">OK</Pill> : <Pill tone="danger">Failed</Pill>}
                <span className="admin-meta shrink-0">
                  <RelativeTime value={log.createdAt} />
                </span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title="Environment">
        <dl className="m-0 grid gap-px bg-line sm:grid-cols-3">
          <Item label="Node environment" value={process.env.NODE_ENV} />
          <Item label="Content entries" value={String(entryCount)} />
          <Item label="Active users" value={String(userCount)} />
          <Item label="Database" value={process.env.DATABASE_URL ? "Connected" : "Not configured"} />
          <Item
            label="Session secret"
            value={process.env.ADMIN_SESSION_SECRET ? "Set" : "Missing"}
          />
          <Item label="Cron secret" value={process.env.ADMIN_CRON_SECRET ? "Set" : "Missing"} />
        </dl>
      </Card>
    </>
  );
}

function Item({ label, value }: { label: string; value: string | undefined }) {
  return (
    <div className="bg-white px-5 py-3.5">
      <dt className="admin-label m-0">
        {label}
      </dt>
      <dd className="mt-1 m-0 text-sm text-ink">{value ?? "—"}</dd>
    </div>
  );
}
