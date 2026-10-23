"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as Icons from "lucide-react";

type NavModule = { key: string; label: string; group: string; icon: string };

export type AdminNav = {
  modules: NavModule[];
  /** Sidebar group order, derived from the content types in the database. */
  groups: string[];
  areas: { href: string; label: string; icon: string }[];
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Component = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[
    name
  ];
  if (!Component) return <Icons.Circle className={className} />;
  return <Component className={className} />;
}

export default function AdminSidebar({ nav }: { nav: AdminNav }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const groups = nav.groups
    .map((group) => ({
      group,
      modules: nav.modules.filter((module) => module.group === group),
    }))
    .filter((entry) => entry.modules.length > 0);

  return (
    <>
      {/* Mobile trigger — mirrors the site header's bar height and type */}
      <div className="flex items-center justify-between border-b border-line bg-paper px-[var(--gutter)] py-3 lg:hidden">
        <Link href="/admin" className="flex items-center" aria-label="Admin dashboard">
          <Image
            src="/images/brand/fe_logo_black.svg"
            alt="First Economy"
            width={143}
            height={46}
            unoptimized
            className="h-8 w-auto"
          />
        </Link>
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="admin-nav"
          className="text-cta inline-flex min-h-11 items-center gap-2 px-2 text-ink transition hover:text-red"
        >
          {open ? <Icons.X className="size-4" aria-hidden /> : <Icons.Menu className="size-4" aria-hidden />}
          Menu
        </button>
      </div>

      <nav
        id="admin-nav"
        aria-label="Admin sections"
        className={`${
          open ? "block" : "hidden"
        } border-b border-line bg-mist lg:sticky lg:top-0 lg:block lg:h-dvh lg:w-[var(--admin-sidebar)] lg:shrink-0 lg:overflow-y-auto lg:border-b-0 lg:border-r`}
      >
        <div className="hidden border-b border-line px-5 py-[18px] lg:block">
          <Link href="/admin" className="block" aria-label="Admin dashboard">
            <Image
              src="/images/brand/fe_logo_black.svg"
              alt="First Economy"
              width={143}
              height={46}
              priority
              unoptimized
              className="h-[38px] w-auto"
            />
          </Link>
          <p className="admin-eyebrow mt-3 m-0">Admin panel</p>
        </div>

        <div className="px-2 py-4">
          <NavLink
            href="/admin"
            icon="LayoutDashboard"
            label="Dashboard"
            pathname={pathname}
            onNavigate={() => setOpen(false)}
            exact
          />
        </div>

        {groups.map(({ group, modules }) => (
          <NavGroup key={group} title={group}>
            {modules.map((module) => (
              <NavLink
                key={module.key}
                href={`/admin/content/${module.key}`}
                icon={module.icon}
                label={module.label}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </NavGroup>
        ))}

        {nav.areas.length > 0 ? (
          <NavGroup title="Administration">
            {nav.areas.map((area) => (
              <NavLink
                key={area.href}
                href={area.href}
                icon={area.icon}
                label={area.label}
                pathname={pathname}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </NavGroup>
        ) : null}

        <div className="border-t border-line px-5 py-5">
          <Link href="/" target="_blank" rel="noreferrer" className="link-cta text-cta m-0 text-ink">
            View site
            <Icons.ArrowUpRight className="size-4" aria-hidden />
          </Link>
        </div>
      </nav>
    </>
  );
}

function NavGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line/70 px-2 py-4">
      <p className="admin-eyebrow m-0 px-3 pb-2.5">{title}</p>
      <ul className="m-0 list-none space-y-px p-0">{children}</ul>
    </div>
  );
}

function NavLink({
  href,
  icon,
  label,
  pathname,
  onNavigate,
  exact = false,
}: {
  href: string;
  icon: string;
  label: string;
  pathname: string;
  /** Closes the mobile drawer on tap. */
  onNavigate?: () => void;
  exact?: boolean;
}) {
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <li className="m-0">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        onClick={onNavigate}
        className="admin-nav-link"
      >
        <Icon name={icon} className="size-[15px] shrink-0" />
        <span className="truncate">{label}</span>
      </Link>
    </li>
  );
}
