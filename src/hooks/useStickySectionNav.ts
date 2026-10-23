"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type RefObject,
} from "react";

export type StickySectionTab = {
  id: string;
  label: string;
};

export type StickyOffsets = {
  header: number;
  tabBar: number;
  total: number;
};

type UseStickySectionNavOptions = {
  tabs: StickySectionTab[];
  /** Update `location.hash` when selecting a tab (Work detail). */
  updateHash?: boolean;
  /** Move focus to the section heading after scroll (Work detail a11y). */
  focusHeading?: boolean;
};

export type StickySectionNavApi = {
  activeTab: string | null;
  stickyOffsets: StickyOffsets;
  tabBarRef: RefObject<HTMLDivElement | null>;
  tabNavRef: RefObject<HTMLDivElement | null>;
  scrollToElement: (elementId: string) => void;
  handleTabKeyDown: (event: KeyboardEvent<HTMLAnchorElement>, index: number) => void;
};

export function useStickySectionNav({
  tabs,
  updateHash = false,
  focusHeading = false,
}: UseStickySectionNavOptions): StickySectionNavApi {
  const tabBarRef = useRef<HTMLDivElement>(null);
  const tabNavRef = useRef<HTMLDivElement>(null);
  const scrollLockRef = useRef<string | null>(null);
  const tabIds = tabs.map((tab) => tab.id).join(",");

  const [activeTab, setActiveTab] = useState<string | null>(tabs[0]?.id ?? null);
  const [stickyOffsets, setStickyOffsets] = useState<StickyOffsets>({
    header: 72,
    tabBar: 56,
    total: 136,
  });

  useEffect(() => {
    setActiveTab(tabs[0]?.id ?? null);
  }, [tabIds, tabs]);

  useEffect(() => {
    const header = document.querySelector("header");

    function updateOffsets() {
      const headerHeight = header?.getBoundingClientRect().height ?? 72;
      const tabBarHeight =
        tabs.length > 0 ? tabBarRef.current?.getBoundingClientRect().height ?? 0 : 0;
      setStickyOffsets({
        header: headerHeight,
        tabBar: tabBarHeight,
        total: headerHeight + tabBarHeight + 12,
      });
    }

    updateOffsets();
    const frame = requestAnimationFrame(updateOffsets);
    window.addEventListener("resize", updateOffsets);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateOffsets);
    };
  }, [tabIds, tabs.length]);

  useEffect(() => {
    if (tabs.length === 0) return;

    let ticking = false;

    function resolveActiveTab() {
      ticking = false;

      if (scrollLockRef.current) {
        setActiveTab(scrollLockRef.current);
        return;
      }

      const offset = stickyOffsets.total + 8;
      let nextActive = tabs[0]?.id ?? null;

      for (const tab of tabs) {
        const section = document.getElementById(tab.id);
        if (!section) continue;
        if (section.getBoundingClientRect().top - offset <= 0) {
          nextActive = tab.id;
        }
      }

      setActiveTab((current) => (current === nextActive ? current : nextActive));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(resolveActiveTab);
      }
    }

    resolveActiveTab();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [tabIds, tabs, stickyOffsets.total]);

  useEffect(() => {
    if (!activeTab) return;

    const nav = tabNavRef.current;
    if (!nav) return;

    const activeButton = nav.querySelector<HTMLElement>(`[data-tab-id="${activeTab}"]`);
    if (!activeButton) return;

    const navRect = nav.getBoundingClientRect();
    const buttonRect = activeButton.getBoundingClientRect();

    if (buttonRect.left < navRect.left + 8 || buttonRect.right > navRect.right - 8) {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      activeButton.scrollIntoView({
        inline: "center",
        block: "nearest",
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }, [activeTab]);

  const scrollToElement = useCallback(
    (elementId: string) => {
      const target = document.getElementById(elementId);
      if (!target) return;

      const tab = tabs.find((item) => item.id === elementId);
      if (tab) {
        scrollLockRef.current = tab.id;
        setActiveTab(tab.id);
        if (updateHash) {
          window.history.replaceState(null, "", `#${tab.id}`);
        }
      }

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const top = target.getBoundingClientRect().top + window.scrollY - stickyOffsets.total;
      window.scrollTo({ top, behavior: reducedMotion ? "auto" : "smooth" });

      if (focusHeading) {
        const heading =
          target.querySelector<HTMLElement>("h2[id], h3[id]") ??
          (target.matches("h2, h3") ? (target as HTMLElement) : null);
        if (heading) {
          if (!heading.hasAttribute("tabindex")) heading.tabIndex = -1;
          window.setTimeout(
            () => heading.focus({ preventScroll: true }),
            reducedMotion ? 0 : 450,
          );
        }
      }

      if (tab) {
        window.setTimeout(() => {
          scrollLockRef.current = null;
        }, 700);
      }
    },
    [tabIds, tabs, stickyOffsets.total, updateHash, focusHeading],
  );

  // Deep-link once on load when hash matches a tab
  const didHashScrollRef = useRef(false);
  useEffect(() => {
    if (!updateHash || didHashScrollRef.current) return;
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash || !tabs.some((tab) => tab.id === hash)) return;
    didHashScrollRef.current = true;
    const frame = requestAnimationFrame(() => scrollToElement(hash));
    return () => cancelAnimationFrame(frame);
  }, [tabIds, scrollToElement, tabs, updateHash]);

  const handleTabKeyDown = useCallback(
    (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
      if (tabs.length === 0) return;

      let nextIndex: number | null = null;

      if (event.key === "ArrowRight") {
        nextIndex = (index + 1) % tabs.length;
      } else if (event.key === "ArrowLeft") {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex === null) return;

      event.preventDefault();
      const nextTab = tabs[nextIndex];
      scrollToElement(nextTab.id);
      tabNavRef.current?.querySelector<HTMLElement>(`[data-tab-id="${nextTab.id}"]`)?.focus();
    },
    [scrollToElement, tabs],
  );

  return {
    activeTab,
    stickyOffsets,
    tabBarRef,
    tabNavRef,
    scrollToElement,
    handleTabKeyDown,
  };
}
