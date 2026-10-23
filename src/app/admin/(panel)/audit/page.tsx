import type { Metadata } from "next";
import Link from "next/link";

import { Card, EmptyState, PageHeader, Pill, RelativeTime } from "@/components/admin/ui";
import { prisma } from "@/lib/admin/db";
import { requireArea } from "@/lib/admin/dal";
import { getContentTypes } from "@/lib/admin/structure";
import type { FieldDiff } from "@/lib/admin/audit";

export const metadata: Metadata = { title: "Activity log" };
export const dynamic = "force-dynamic";

const PAGE_SIZE = 40;

/** Feature 5 — who changed what, when, with a field-level diff. */
export default async function AuditPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; type?: string }>;
}) {
  await requireArea("audit");
  const labels = new Map((await getContentTypes()).map((type) => [type.key, type.label]));

  const { page: rawPage, type } = await searchParams;
  const page = Math.max(1, Number(rawPage) || 1);

  const where = type ? { entityType: type } : {};

  const [logs, total, entityTypes] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.groupBy({ by: ["entityType"], _count: { _all: true } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Activity log"
        description="Every sign-in, edit, publish and permission change, oldest kept indefinitely."
      />

      <div className="flex flex-wrap gap-1.5">
        <FilterChip href="/admin/audit" label={`All (${total})`} active={!type} />
        {entityTypes
          .sort((a, b) => b._count._all - a._count._all)
          .map((entity) => (
            <FilterChip
              key={entity.entityType}
              href={`/admin/audit?type=${entity.entityType}`}
              label={`${labels.get(entity.entityType) ?? entity.entityType} (${entity._count._all})`}
              active={type === entity.entityType}
            />
          ))}
      </div>

      <Card>
        {logs.length === 0 ? (
          <EmptyState title="Nothing logged yet" body="Activity appears here as soon as someone signs in or edits content." />
        ) : (
          <ul className="admin-rows m-0 list-none p-0">
            {logs.map((log) => {
              const diff = log.diff as FieldDiff | null;
              const fields = diff ? Object.entries(diff) : [];

              return (
                <li key={log.id} className="m-0 px-5 py-3.5">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    <Pill tone={log.action === "LOGIN_FAILED" ? "danger" : "neutral"}>
                      {log.action.replace(/_/g, " ")}
                    </Pill>
                    <span className="text-sm font-semibold text-ink">{log.actorName}</span>
                    <span className="text-xs text-muted">{log.actorEmail}</span>
                    <span className="ml-auto text-xs text-muted">
                      <RelativeTime value={log.createdAt} />
                    </span>
                  </div>

                  {log.summary ? (
                    <p className="mt-1.5 m-0 text-sm text-ink">{log.summary}</p>
                  ) : null}

                  <p className="mt-1 m-0 text-xs text-muted">
                    {labels.get(log.entityType) ?? log.entityType}
                    {log.entityLabel ? ` · ${log.entityLabel}` : ""}
                    {log.ip ? ` · ${log.ip}` : ""}
                  </p>

                  {fields.length > 0 ? (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-xs font-semibold uppercase tracking-[0.08em] text-muted hover:text-ink">
                        {fields.length} field{fields.length === 1 ? "" : "s"} changed
                      </summary>
                      <dl className="mt-2 m-0 space-y-1.5 border-l-2 border-line pl-3">
                        {fields.map(([field, change]) => (
                          <div key={field}>
                            <dt className="admin-mono m-0 text-ink">{field}</dt>
                            <dd className="admin-meta m-0">
                              <span className="text-red/80 line-through">{render(change.before)}</span>
                              {" → "}
                              <span className="text-emerald-700">{render(change.after)}</span>
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </details>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      {totalPages > 1 ? (
        <nav className="flex items-center justify-between gap-3" aria-label="Activity log pages">
          <PageLink
            href={`/admin/audit?page=${page - 1}${type ? `&type=${type}` : ""}`}
            disabled={page <= 1}
          >
            Previous
          </PageLink>
          <span className="text-xs text-muted">
            Page {page} of {totalPages}
          </span>
          <PageLink
            href={`/admin/audit?page=${page + 1}${type ? `&type=${type}` : ""}`}
            disabled={page >= totalPages}
          >
            Next
          </PageLink>
        </nav>
      ) : null}
    </>
  );
}

function FilterChip({ href, label, active }: { href: string; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-8 items-center border px-3 text-xs font-semibold transition ${
        active ? "border-ink bg-ink text-white" : "border-line bg-white text-muted hover:border-ink hover:text-ink"
      }`}
    >
      {label}
    </Link>
  );
}

function PageLink({
  href,
  disabled,
  children,
}: {
  href: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  if (disabled) {
    return (
      <span className="admin-btn admin-btn-secondary admin-btn-sm opacity-40">
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="admin-btn admin-btn-secondary admin-btn-sm"
    >
      {children}
    </Link>
  );
}

function render(value: unknown): string {
  if (value === null || value === undefined) return "—";
  if (typeof value === "string") return value || '""';
  return JSON.stringify(value);
}
