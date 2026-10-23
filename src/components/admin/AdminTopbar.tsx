import Link from "next/link";
import { LogOut, UserRound } from "lucide-react";

import { logoutAction } from "@/lib/admin/actions/auth";
import { ROLE_LABELS, type SessionUser } from "@/lib/admin/permissions";

/** Matches the public header: paper bar, hairline rule, uppercase CTA type. */
export default function AdminTopbar({ user }: { user: SessionUser }) {
  return (
    <header className="sticky top-0 z-20 border-b border-line bg-paper/95 backdrop-blur">
      <div className="flex items-center justify-end gap-3 px-[var(--gutter)] py-3">
        <Link
          href="/admin/account"
          className="group flex min-w-0 items-center gap-2.5 py-1 transition"
        >
          <span className="grid size-9 shrink-0 place-items-center border border-line text-muted transition group-hover:border-ink group-hover:text-ink">
            <UserRound className="size-4" aria-hidden />
          </span>
          <span className="min-w-0 text-left">
            <span className="block truncate text-[13px] font-semibold leading-tight text-ink transition group-hover:text-red">
              {user.name}
            </span>
            <span className="admin-label block truncate">{ROLE_LABELS[user.role]}</span>
          </span>
        </Link>

        <form action={logoutAction} className="ml-1">
          <button
            type="submit"
            className="text-cta inline-flex min-h-11 items-center gap-2 border border-line px-4 text-ink transition hover:border-ink hover:text-red"
          >
            <LogOut className="size-3.5" aria-hidden />
            <span className="max-sm:sr-only">Sign out</span>
          </button>
        </form>
      </div>
    </header>
  );
}
