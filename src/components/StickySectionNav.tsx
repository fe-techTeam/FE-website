"use client";

import type { KeyboardEvent, RefObject } from "react";
import type { StickySectionTab } from "@/hooks/useStickySectionNav";

type StickySectionNavProps = {
  tabs: StickySectionTab[];
  activeTab: string | null;
  headerOffset: number;
  tabBarRef: RefObject<HTMLDivElement | null>;
  tabNavRef: RefObject<HTMLDivElement | null>;
  ariaLabel: string;
  /** Prefer `"true"` for Work; Insights/Careers use `"location"`. */
  ariaCurrentValue?: "true" | "location";
  scrollRegion?: boolean;
  onSelect: (id: string) => void;
  onTabKeyDown: (event: KeyboardEvent<HTMLAnchorElement>, index: number) => void;
};

export default function StickySectionNav({
  tabs,
  activeTab,
  headerOffset,
  tabBarRef,
  tabNavRef,
  ariaLabel,
  ariaCurrentValue = "location",
  scrollRegion = true,
  onSelect,
  onTabKeyDown,
}: StickySectionNavProps) {
  if (tabs.length === 0) return null;

  return (
    <div
      ref={tabBarRef}
      className="sticky z-40 border-b border-line bg-white/95 shadow-sm backdrop-blur-sm supports-[backdrop-filter]:bg-white/90"
      style={{ top: headerOffset }}
    >
      <div className="section-shell">
        <div
          ref={tabNavRef}
          {...(scrollRegion
            ? { role: "region" as const, "aria-label": "Section navigation", tabIndex: 0 }
            : {})}
          className="section-inner overflow-x-auto overscroll-x-contain scroll-px-4 [-webkit-overflow-scrolling:touch] insight-detail-tab-nav"
        >
          <nav aria-label={ariaLabel} className="flex min-w-max gap-0">
            {tabs.map((tab, index) => {
              const isActive = activeTab === tab.id;
              return (
                <a
                  key={tab.id}
                  href={`#${tab.id}`}
                  data-tab-id={tab.id}
                  aria-current={isActive ? ariaCurrentValue : undefined}
                  onClick={(event) => {
                    event.preventDefault();
                    onSelect(tab.id);
                  }}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`text-cta tap-target-sm relative inline-flex min-h-11 items-center px-4 py-3 whitespace-nowrap transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:min-h-12 sm:px-5 sm:py-4 ${
                    isActive ? "text-red" : "text-muted hover:text-ink"
                  }`}
                >
                  {tab.label}
                  {isActive ? (
                    <span
                      className="absolute right-4 bottom-0 left-4 h-0.5 bg-red sm:right-5 sm:left-5"
                      aria-hidden
                    />
                  ) : null}
                </a>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
}
