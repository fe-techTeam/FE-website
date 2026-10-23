"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import AnimatedMenuButton from "@/components/AnimatedMenuButton";
import GrowthCta from "@/components/GrowthCta";
import MobileNavSidebar from "@/components/MobileNavSidebar";

const primaryNav = [
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Careers", href: "/careers" },
  { label: "Contact Us", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrollLocked, setScrollLocked] = useState(false);
  const menuId = useId();
  const titleId = useId();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLElement>(null);

  const closeMenu = useCallback(() => setOpen(false), []);
  const toggleMenu = useCallback(() => setOpen((v) => !v), []);
  const handleClosed = useCallback(() => setScrollLocked(false), []);

  useEffect(() => {
    if (open) setScrollLocked(true);
  }, [open]);

  useEffect(() => {
    if (!scrollLocked) return;

    const panel = panelRef.current;

    function getFocusable() {
      if (!panel) return [] as HTMLElement[];
      return Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled") && el.getAttribute("aria-hidden") !== "true");
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        closeMenu();
        return;
      }

      if (e.key !== "Tab") return;
      const focusable = getFocusable();
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    requestAnimationFrame(() => {
      getFocusable()[0]?.focus();
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [scrollLocked, closeMenu]);

  useEffect(() => {
    if (open || scrollLocked) return;
    buttonRef.current?.focus();
  }, [open, scrollLocked]);

  useEffect(() => {
    const desktopNav = window.matchMedia("(min-width: 1024px)");

    function handleDesktopNav(event: MediaQueryListEvent | MediaQueryList) {
      if (event.matches && open) closeMenu();
    }

    handleDesktopNav(desktopNav);
    desktopNav.addEventListener("change", handleDesktopNav);
    return () => desktopNav.removeEventListener("change", handleDesktopNav);
  }, [open, closeMenu]);

  return (
    <>
      <header
        className={`sticky top-0 border-b border-black/5 bg-paper px-[var(--gutter)] py-3.5 sm:py-[18px] ${
          open ? "z-[120]" : "z-50"
        }`}
      >
        <div className="mx-auto flex max-w-[var(--content)] items-center justify-between gap-2 sm:gap-[clamp(16px,2.5vw,40px)]">
          <Link href="/" className="flex min-w-0 flex-none items-center" aria-label="First Economy home">
            <Image
              src="/images/brand/fe_logo_black.svg"
              alt="First Economy — Your Growth Partner"
              width={143}
              height={46}
              priority
              unoptimized
              className="h-9 w-auto max-w-[min(143px,42vw)] sm:h-[46px] sm:max-w-none"
            />
          </Link>

          <nav
            className="text-nav hidden min-w-0 flex-1 items-center justify-center gap-3 overflow-x-auto whitespace-nowrap lg:flex lg:gap-4 xl:gap-[clamp(12px,1.9vw,32px)]"
            aria-label="Primary"
          >
            {primaryNav.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-sm pb-0.5 transition hover:text-red focus-visible:outline-offset-4 ${
                    active ? "text-red" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative z-[121] flex flex-none items-center gap-1.5 sm:gap-3">
            <GrowthCta href="/contact" variant="primary" compact className="max-[360px]:hidden!">
              Let&rsquo;s talk
            </GrowthCta>

            <AnimatedMenuButton
              open={open}
              onClick={toggleMenu}
              controls={menuId}
              buttonRef={buttonRef}
            />
          </div>
        </div>
      </header>

      <MobileNavSidebar
        open={open}
        onClose={closeMenu}
        onClosed={handleClosed}
        items={primaryNav}
        menuId={menuId}
        titleId={titleId}
        panelRef={panelRef}
      />
    </>
  );
}
