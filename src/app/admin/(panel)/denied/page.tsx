import type { Metadata } from "next";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

import { Card } from "@/components/admin/ui";
import { requireUser } from "@/lib/admin/dal";
import { getContentTypes } from "@/lib/admin/structure";
import { ROLE_LABELS } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "No access" };

export default async function DeniedPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string; area?: string; need?: string }>;
}) {
  const user = await requireUser();
  const labels = new Map((await getContentTypes()).map((type) => [type.key, type.label]));
  const { module: moduleKey, area, need } = await searchParams;

  const what = moduleKey ? (labels.get(moduleKey) ?? moduleKey) : (area ?? "that area");

  return (
    <Card>
      <div className="flex flex-col items-start gap-4 px-5 py-10">
        <ShieldAlert className="size-8 text-red" aria-hidden />
        <div>
          <h1 className="admin-title m-0 text-ink">You do not have access</h1>
          <p className="text-body-sm mt-3 m-0 max-w-md text-muted">
            Your role ({ROLE_LABELS[user.role]}) does not include{" "}
            {need ? <strong className="text-ink">{need}</strong> : "access"} for{" "}
            <strong className="text-ink">{what}</strong>. Ask a Super Admin if you need it.
          </p>
        </div>
        <Link
          href="/admin"
          className="admin-btn admin-btn-primary"
        >
          Back to dashboard
        </Link>
      </div>
    </Card>
  );
}
