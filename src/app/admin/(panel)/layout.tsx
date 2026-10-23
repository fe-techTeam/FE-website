import AdminSidebar, { type AdminNav } from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";
import { requireUser } from "@/lib/admin/dal";
import { getActiveContentTypes } from "@/lib/admin/structure";
import { can, canAccessArea } from "@/lib/admin/permissions";

/**
 * Feature 3 — the authenticated admin shell.
 *
 * `requireUser()` is the authoritative session check (the proxy only does an
 * optimistic cookie test), so every page below this layout is protected.
 * Navigation is filtered by the signed-in user's permissions, so people never
 * see links they cannot open.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const contentTypes = await getActiveContentTypes();

  const nav: AdminNav = {
    modules: contentTypes
      .filter((type) => can(user, "view", type.key))
      .map((type) => ({
        key: type.key,
        label: type.label,
        group: type.group,
        icon: type.icon,
      })),
    groups: [...new Set(contentTypes.map((type) => type.group))],
    areas: [
      canAccessArea(user, "health")
        ? { href: "/admin/health", label: "Site Health", icon: "Stethoscope" }
        : null,
      canAccessArea(user, "audit")
        ? { href: "/admin/audit", label: "Activity Log", icon: "ScrollText" }
        : null,
      canAccessArea(user, "users")
        ? { href: "/admin/users", label: "Users", icon: "Users" }
        : null,
      canAccessArea(user, "system")
        ? { href: "/admin/structure", label: "Structure", icon: "Blocks" }
        : null,
      canAccessArea(user, "system")
        ? { href: "/admin/system", label: "System", icon: "Wrench" }
        : null,
    ].filter((area): area is NonNullable<typeof area> => area !== null),
  };

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <AdminSidebar nav={nav} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar user={user} />
        <main className="flex-1 px-[var(--gutter)] py-8 sm:py-10">
          <div className="mx-auto flex w-full min-w-0 max-w-6xl flex-col gap-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
