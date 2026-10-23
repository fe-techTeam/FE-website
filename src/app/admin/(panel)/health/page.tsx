import type { Metadata } from "next";
import Link from "next/link";

import { Card, EmptyState, PageHeader, Pill, RelativeTime } from "@/components/admin/ui";
import HealthScanButton from "./HealthScanButton";
import { requireArea } from "@/lib/admin/dal";
import { latestHealthScan } from "@/lib/admin/health";
import { getContentTypes } from "@/lib/admin/structure";

export const metadata: Metadata = { title: "Site health" };
export const dynamic = "force-dynamic";

const KIND_LABELS: Record<string, string> = {
  "missing-image": "Missing image",
  "broken-internal-link": "Broken link",
  "empty-required-field": "Missing content",
};

/** Feature 4 — the detail behind the dashboard's warning tile. */
export default async function HealthPage() {
  await requireArea("health");
  const labels = new Map((await getContentTypes()).map((type) => [type.key, type.label]));
  const { ranAt, findings } = await latestHealthScan();

  const grouped = findings.reduce<Record<string, typeof findings>>((accumulator, finding) => {
    (accumulator[finding.kind] ??= []).push(finding);
    return accumulator;
  }, {});

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Site health"
        description="Scans every stored content entry for image paths that do not resolve and internal links that match no route."
        actions={<HealthScanButton />}
      />

      {ranAt ? (
        <p className="admin-meta m-0">
          Last scan <RelativeTime value={ranAt} /> · {findings.length} issue
          {findings.length === 1 ? "" : "s"}
        </p>
      ) : null}

      {findings.length === 0 ? (
        <Card>
          <EmptyState
            title={ranAt ? "Everything checks out" : "No scan yet"}
            body={
              ranAt
                ? "No missing images or broken internal links in the current content."
                : "Run a scan to check every content entry. It reads the database and the public/ folder — nothing is modified."
            }
          />
        </Card>
      ) : (
        Object.entries(grouped).map(([kind, items]) => (
          <Card key={kind} title={`${KIND_LABELS[kind] ?? kind} (${items.length})`}>
            <ul className="admin-rows m-0 list-none p-0">
              {items.map((finding) => (
                <li key={finding.id} className="admin-row m-0">
                  <span className="min-w-0 flex-1 basis-64">
                    <span className="admin-mono block truncate text-ink">{finding.value}</span>
                    <span className="admin-meta mt-1 block truncate">
                      {labels.get(finding.module) ?? finding.module}
                      {finding.entrySlug ? ` · ${finding.entrySlug}` : ""} · {finding.field}
                    </span>
                  </span>

                  {finding.detail ? <Pill tone="danger">{finding.detail}</Pill> : null}

                  {finding.entryId ? (
                    <Link
                      href={`/admin/content/${finding.module}/${finding.entryId}`}
                      className="text-cta shrink-0 text-muted transition hover:text-red"
                    >
                      Open
                    </Link>
                  ) : null}
                </li>
              ))}
            </ul>
          </Card>
        ))
      )}
    </>
  );
}
