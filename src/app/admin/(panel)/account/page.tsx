import type { Metadata } from "next";

import { Card, PageHeader, RelativeTime } from "@/components/admin/ui";
import { ChangePassword, RevokeOthers } from "./AccountForms";
import { prisma } from "@/lib/admin/db";
import { requireUser } from "@/lib/admin/dal";
import { readSessionCookie } from "@/lib/admin/session";
import { ROLE_DESCRIPTIONS, ROLE_LABELS } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Your account" };
export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const user = await requireUser();
  const current = await readSessionCookie();

  const sessions = await prisma.session.findMany({
    where: { userId: user.id, revokedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { lastSeenAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title={user.name}
        description={`${user.email} · ${ROLE_LABELS[user.role]}`}
      />

      <div className="grid items-start gap-8 lg:grid-cols-2">
        <Card title="Role">
          <div className="px-5 py-4">
            <p className="admin-card-title m-0 text-ink">{ROLE_LABELS[user.role]}</p>
            <p className="mt-1 m-0 text-sm text-muted">{ROLE_DESCRIPTIONS[user.role]}</p>
            <p className="mt-3 m-0 text-xs text-muted">
              Only a Super Admin can change your role or module access.
            </p>
          </div>
        </Card>

        <Card title="Change password">
          <ChangePassword />
        </Card>
      </div>

      <Card
        title={`Active sessions (${sessions.length})`}
        description="Signing out other devices takes effect immediately."
      >
        <ul className="admin-rows m-0 list-none p-0">
          {sessions.map((session) => (
            <li key={session.id} className="admin-row m-0">
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs text-ink">
                  {session.userAgent ?? "Unknown device"}
                </span>
                <span className="admin-meta mt-1 block">
                  {session.ip ?? "no IP"} · active <RelativeTime value={session.lastSeenAt} />
                </span>
              </span>
              {session.id === current?.sessionId ? (
                <span className="admin-badge admin-badge-live shrink-0">
                  This device
                </span>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-5 py-4">
          <RevokeOthers />
        </div>
      </Card>
    </>
  );
}
