"use client";

import gsap from "gsap";
import { X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import GrowthCta from "@/components/GrowthCta";
import { contactInfo } from "@/content/site";

type NavItem = { label: string; href: string };

type MobileNavSidebarProps = {
  open: boolean;
  onClose: () => void;
  onClosed?: () => void;
  items: NavItem[];
  menuId: string;
  titleId: string;
  panelRef?: React.RefObject<HTMLElement | null>;
};

function setClosedState(
  backdrop: HTMLElement,
  panel: HTMLElement,
  links: NodeListOf<HTMLElement>,
  footerItems: Iterable<HTMLElement>,
) {
  gsap.set(backdrop, { opacity: 0, pointerEvents: "none" });
  gsap.set(panel, { xPercent: 100 });
  gsap.set(links, { opacity: 1, x: 0, clearProps: "transform,opacity" });
  gsap.set(footerItems, { opacity: 1, y: 0, clearProps: "transform,opacity" });
}

export default function MobileNavSidebar({
  open,
  onClose,
  onClosed,
  items,
  menuId,
  titleId,
  panelRef: externalPanelRef,
}: MobileNavSidebarProps) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const localPanelRef = useRef<HTMLElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const prevOpenRef = useRef(false);
  const prevPathRef = useRef(pathname);

  const setPanelRef = (node: HTMLElement | null) => {
    localPanelRef.current = node;
    if (externalPanelRef && "current" in externalPanelRef) {
      (externalPanelRef as React.MutableRefObject<HTMLElement | null>).current = node;
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleClose = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    if (prevPathRef.current === pathname) return;
    prevPathRef.current = pathname;
    if (open) handleClose();
  }, [pathname, open, handleClose]);

  useLayoutEffect(() => {
    if (!mounted) return;

    const backdrop = backdropRef.current;
    const panel = localPanelRef.current;
    const nav = navRef.current;
    const footer = footerRef.current;
    if (!backdrop || !panel || !nav) return;

    const links = nav.querySelectorAll<HTMLElement>("[data-nav-link]");
    const footerItems = footer
      ? Array.from(footer.querySelectorAll<HTMLElement>("[data-sidebar-footer]"))
      : [];

    const wasOpen = prevOpenRef.current;
    prevOpenRef.current = open;

    timelineRef.current?.kill();
    timelineRef.current = null;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (open) {
      if (reduced) {
        gsap.set(backdrop, { opacity: 1, pointerEvents: "auto" });
        gsap.set(panel, { xPercent: 0 });
        gsap.set(links, { opacity: 1, x: 0 });
        if (footerItems.length) gsap.set(footerItems, { opacity: 1, y: 0 });
        return;
      }

      timelineRef.current = gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .set(backdrop, { pointerEvents: "auto" })
        .to(backdrop, { opacity: 1, duration: 0.4 }, 0)
        .to(panel, { xPercent: 0, duration: 0.65, ease: "power3.out" }, 0)
        .fromTo(
          links,
          { x: 48, opacity: 0 },
          { x: 0, opacity: 1, stagger: 0.06, duration: 0.45 },
          0.15,
        )
        .fromTo(
          footerItems,
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.06, duration: 0.35 },
          0.3,
        );
      return;
    }

    if (!wasOpen) {
      setClosedState(backdrop, panel, links, footerItems);
      return;
    }

    if (reduced) {
      setClosedState(backdrop, panel, links, footerItems);
      onClosed?.();
      return;
    }

    timelineRef.current = gsap
      .timeline({
        defaults: { ease: "power2.in" },
        onComplete: () => {
          setClosedState(backdrop, panel, links, footerItems);
          onClosed?.();
        },
      })
      .to(links, { x: 24, opacity: 0, stagger: 0.03, duration: 0.18 }, 0)
      .to(footerItems, { y: 8, opacity: 0, stagger: 0.03, duration: 0.16 }, 0)
      .to(panel, { xPercent: 100, duration: 0.45, ease: "power3.in" }, 0.06)
      .to(backdrop, { opacity: 0, duration: 0.3 }, 0.1)
      .set(backdrop, { pointerEvents: "none" });
  }, [open, mounted, onClosed]);

  useEffect(() => {
    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  if (!mounted) return null;

  const sidebar = (
    <div ref={rootRef} className="lg:hidden" aria-hidden={!open}>
      <div
        ref={backdropRef}
        className="fixed inset-0 z-[100] bg-ink/50"
        onClick={handleClose}
        aria-hidden
      />

      <aside
        id={menuId}
        ref={setPanelRef}
        className="fixed inset-y-0 right-0 z-[110] flex w-[min(100vw-2.5rem,26rem)] flex-col border-l border-black/8 bg-paper shadow-[-12px_0_40px_rgba(10,10,10,0.12)] will-change-transform sm:w-[min(100vw-4rem,28rem)]"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-hidden={!open}
        inert={!open || undefined}
      >
        <div className="flex items-center justify-between border-b border-black/6 px-[var(--gutter)] py-4">
          <Link
            href="/"
            onClick={handleClose}
            className="flex items-center"
            aria-label="First Economy home"
            tabIndex={open ? 0 : -1}
          >
            <Image
              src="/images/brand/fe_logo_black.svg"
              alt=""
              width={120}
              height={38}
              unoptimized
              className="h-8 w-auto"
            />
          </Link>
          <button
            type="button"
            aria-label="Close menu"
            onClick={handleClose}
            tabIndex={open ? 0 : -1}
            className="tap-target grid h-11 w-11 place-items-center rounded-full border border-black/10 text-ink transition hover:border-red hover:text-red focus-visible:outline-offset-2"
          >
            <X size={20} aria-hidden />
          </button>
        </div>

        <p id={titleId} className="sr-only">
          Site navigation
        </p>

        <nav
          ref={navRef}
          className="flex flex-1 flex-col gap-1 overflow-y-auto px-[var(--gutter)] py-8"
          aria-label="Mobile"
        >
          {items.map((item, index) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(`${item.href}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                data-nav-link
                onClick={handleClose}
                aria-current={active ? "page" : undefined}
                tabIndex={open ? 0 : -1}
                className={`group flex items-baseline gap-4 border-b border-black/6 py-4 transition-colors focus-visible:outline-offset-4 sm:py-5 ${
                  active ? "text-red" : "text-ink hover:text-red"
                }`}
              >
                <span
                  className="font-body text-[0.6875rem] font-medium tracking-[0.2em] text-muted tabular-nums"
                  aria-hidden
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-[clamp(1.625rem,7vw,2.125rem)] uppercase leading-none tracking-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div
          ref={footerRef}
          className="mt-auto border-t border-black/6 px-[var(--gutter)] py-6"
        >
          <GrowthCta
            href="/contact"
            variant="primary"
            block
            data-sidebar-footer
            onClick={handleClose}
            tabIndex={open ? 0 : -1}
            className="mb-5"
          >
            Let&rsquo;s talk
          </GrowthCta>
          <div className="flex flex-col gap-2 text-sm" data-sidebar-footer>
            <a
              href={contactInfo.phoneHref}
              className="flex min-h-11 items-center text-muted transition hover:text-red focus-visible:outline-offset-2"
              tabIndex={open ? 0 : -1}
            >
              {contactInfo.phone}
            </a>
            <a
              href={contactInfo.emailHref}
              className="flex min-h-11 items-center text-muted transition hover:text-red focus-visible:outline-offset-2"
              tabIndex={open ? 0 : -1}
            >
              {contactInfo.email}
            </a>
          </div>
        </div>
      </aside>
    </div>
  );

  return createPortal(sidebar, document.body);
}
