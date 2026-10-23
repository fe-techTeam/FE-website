"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import WorkCaseCard from "@/components/work/WorkCaseCard";
import {
  matchesWorkFilter,
  orderedWorkStudies,
  workFilterFromService,
  workFilters,
  type WorkFilterKey,
} from "@/content/workPage";
import type { CaseStudy } from "@/content/types";

export default function WorkCaseBrowser({ caseStudies }: { caseStudies: CaseStudy[] }) {
  const [active, setActive] = useState<WorkFilterKey>("all");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterWrapRef = useRef<HTMLDivElement>(null);

  // Deep links like /work?service=seo preselect their tab. Read after mount (not during render)
  // so the server-rendered HTML always lists every case study.
  useEffect(() => {
    const fromUrl = workFilterFromService(new URLSearchParams(window.location.search).get("service"));
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with the URL, an external system
    if (fromUrl) setActive(fromUrl);
  }, []);

  const ordered = useMemo(() => orderedWorkStudies(caseStudies), [caseStudies]);

  const filtered = useMemo(() => {
    return ordered.filter((study) => matchesWorkFilter(study, active));
  }, [ordered, active]);

  const activeLabel = workFilters.find((filter) => filter.key === active)?.label ?? "All Cases";

  useEffect(() => {
    if (!filtersOpen) return;

    const onPointerDown = (event: MouseEvent | PointerEvent) => {
      if (!filterWrapRef.current?.contains(event.target as Node)) {
        setFiltersOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setFiltersOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [filtersOpen]);

  function selectFilter(key: WorkFilterKey) {
    setActive(key);
    setFiltersOpen(false);
  }

  return (
    <div>
      <div className="hidden sm:block">
        <div
          role="group"
          aria-label="Filter case studies by capability"
          className="work-filter-tabs"
        >
          {workFilters.map((filter) => {
            const selected = active === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                aria-pressed={selected}
                className={`text-cta tap-target shrink-0 px-3.5 py-2.5 whitespace-nowrap transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red ${
                  selected ? "bg-ink text-white" : "text-ink hover:bg-mist focus-visible:bg-mist"
                }`}
                onClick={() => setActive(filter.key)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="sm:hidden">
        <div ref={filterWrapRef} className="relative w-fit">
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-haspopup="listbox"
            aria-controls="work-capability-filters"
            aria-label={`Filter by capability, ${activeLabel} selected`}
            className={`text-cta tap-target inline-flex w-fit items-center gap-2.5 border px-4 py-2.5 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red ${
              filtersOpen ? "border-ink bg-ink text-white" : "border-line text-ink hover:border-ink hover:text-red"
            }`}
            onClick={() => setFiltersOpen((open) => !open)}
          >
            {activeLabel}
            <ChevronDown
              size={18}
              strokeWidth={2}
              aria-hidden
              className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
            />
          </button>

          <div
            id="work-capability-filters"
            hidden={!filtersOpen}
            role="listbox"
            aria-label="Filter by capability"
            className="absolute top-[calc(100%+0.5rem)] left-0 z-30 w-[min(18.5rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-line bg-white py-2 shadow-[0_16px_40px_rgba(0,0,0,0.12)]"
          >
            <ul className="m-0 list-none p-0">
              {workFilters.map((filter) => {
                const selected = active === filter.key;
                return (
                  <li key={filter.key} role="presentation">
                    <button
                      type="button"
                      role="option"
                      aria-selected={selected}
                      className={`text-cta tap-target flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-red ${
                        selected ? "bg-ink text-white" : "text-ink hover:bg-mist focus-visible:bg-mist"
                      }`}
                      onClick={() => selectFilter(filter.key)}
                    >
                      <span className="min-w-0 truncate">{filter.label}</span>
                      {selected ? (
                        <Check size={16} strokeWidth={2.5} className="shrink-0" aria-hidden />
                      ) : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {filtered.length} case {filtered.length === 1 ? "study" : "studies"} shown
      </p>

      {filtered.length > 0 ? (
        <ul
          data-animate-stagger
          className="section-media m-0 grid list-none grid-cols-1 gap-x-5 gap-y-8 p-0 xs:grid-cols-2 xs:gap-y-10 md:gap-x-6 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-12 xl:grid-cols-4"
        >
          {filtered.map((study) => (
            <li key={study.slug} className="min-w-0">
              <WorkCaseCard caseStudy={study} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-body section-media mb-0 max-w-md text-muted" role="status">
          No case studies match this filter. Try another capability.
        </p>
      )}
    </div>
  );
}
