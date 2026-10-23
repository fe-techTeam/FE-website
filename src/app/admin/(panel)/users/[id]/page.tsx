import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Card, PageHeader, RelativeTime } from "@/components/admin/ui";
import UserDetailForm, { RevokeSessions } from "./UserDetailForm";
import PermissionMatrix from "./PermissionMatrix";
import { prisma } from "@/lib/admin/db";
import { requireArea } from "@/lib/admin/dal";
import { getActiveContentTypes } from "@/lib/admin/structure";
import { roleDefaults } from "@/lib/admin/permissions";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await prisma.user.findUnique({ where: { id }, select: { name: true } });
  return { title: user?.name ?? "User" };
}

export default async function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const actor = await requireArea("users");
  const contentTypes = await getActiveContentTypes();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      permissions: true,
      sessions: {
        where: { revokedAt: null, expiresAt: { gt: new Date() } },
        orderBy: { lastSeenAt: "desc" },
      },
    },
  });

  if (!user) notFound();

  const overrides = new Map(user.permissions.map((permission) => [permission.module, permission]));
  const defaults = roleDefaults(user.role);

  return (
    <>
      <PageHeader
        eyebrow={
          <Link href="/admin/users" className="underline hover:text-ink">
            Users
          </Link>
        }
        title={user.name}
        description={user.email}
      />

      <div className="grid items-start gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-8">
          <Card title="Account">
            <UserDetailForm
              user={{
                id: user.id,
                name: user.name,
                title: user.title,
                role: user.role,
                status: user.status,
              }}
              isSelf={user.id === actor.id}
            />
          </Card>

          <Card
            title="Active sessions"
            description="Forcing a sign-out ends every session immediately."
          >
            {user.sessions.length === 0 ? (
              <p className="text-body-sm m-0 px-5 py-8 text-muted">No active sessions.</p>
            ) : (
              <ul className="admin-rows m-0 list-none p-0">
                {user.sessions.map((session) => (
                  <li key={session.id} className="m-0 px-5 py-3">
                    <p className="m-0 truncate text-xs text-ink">{session.userAgent ?? "Unknown device"}</p>
                    <p className="mt-0.5 m-0 text-xs text-muted">
                      {session.ip ?? "no IP"} · active <RelativeTime value={session.lastSeenAt} />
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="border-t border-line px-5 py-4">
              <RevokeSessions userId={user.id} count={user.sessions.length} />
            </div>
          </Card>
        </div>

        <PermissionMatrix
          userId={user.id}
          role={user.role}
          defaults={defaults}
          modules={contentTypes.map((type) => ({
            key: type.key,
            label: type.label,
            group: type.group,
          }))}
          overrides={Object.fromEntries(
            [...overrides.entries()].map(([key, value]) => [
              key,
              {
                canView: value.canView,
                canEdit: value.canEdit,
                canPublish: value.canPublish,
                canDelete: value.canDelete,
              },
            ]),
          )}
        />
      </div>
    </>
  );
}
