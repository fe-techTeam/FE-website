import type { Metadata } from "next";
import Link from "next/link";

import { Card, PageHeader, Pill, RelativeTime } from "@/components/admin/ui";
import InviteUserForm from "./InviteUserForm";
import { prisma } from "@/lib/admin/db";
import { requireArea } from "@/lib/admin/dal";
import { ROLE_LABELS } from "@/lib/admin/permissions";

export const metadata: Metadata = { title: "Users" };
export const dynamic = "force-dynamic";

/** Feature 2 — user list and invites. Super Admin only. */
export default async function UsersPage() {
  await requireArea("users");

  const users = await prisma.user.findMany({
    orderBy: [{ status: "asc" }, { name: "asc" }],
    include: {
      _count: { select: { permissions: true } },
    },
  });

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Users"
        description="Who can sign in, what role they hold, and which modules they can reach."
      />

      <div className="grid items-start gap-8 lg:grid-cols-[1.5fr_1fr]">
        <Card title={`${users.length} account${users.length === 1 ? "" : "s"}`}>
          <ul className="admin-rows m-0 list-none p-0">
            {users.map((user) => (
              <li key={user.id} className="m-0">
                <Link
                  href={`/admin/users/${user.id}`}
                  className="admin-row hover:bg-mist"
                >
                  {/* basis keeps the name readable — the row wraps instead of
                      crushing it when the badges need room. */}
                  <span className="min-w-0 flex-1 basis-52">
                    <span className="block truncate text-sm font-semibold text-ink">
                      {user.name}
                      {user.title ? (
                        <span className="ml-2 font-normal text-muted">{user.title}</span>
                      ) : null}
                    </span>
                    <span className="admin-meta mt-1 block truncate">{user.email}</span>
                  </span>

                  <span className="admin-meta shrink-0 max-sm:order-3">
                    {user.lastLoginAt ? (
                      <>
                        Last seen <RelativeTime value={user.lastLoginAt} />
                      </>
                    ) : (
                      "Never signed in"
                    )}
                  </span>

                  <span className="flex shrink-0 gap-1.5">
                    {user._count.permissions > 0 ? <Pill>Custom access</Pill> : null}
                    <Pill
                      tone={
                        user.status === "ACTIVE"
                          ? "good"
                          : user.status === "DISABLED"
                            ? "danger"
                            : "neutral"
                      }
                    >
                      {user.status === "ACTIVE" ? ROLE_LABELS[user.role] : user.status}
                    </Pill>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Invite someone" description="They set their own password from the link.">
          <InviteUserForm />
        </Card>
      </div>
    </>
  );
}
