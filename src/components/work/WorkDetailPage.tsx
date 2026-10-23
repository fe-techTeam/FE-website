"use client";

import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StickySectionNav from "@/components/StickySectionNav";
import WorkDetailHero from "@/components/work/WorkDetailHero";
import WorkDetailRelated from "@/components/work/WorkDetailRelated";
import WorkDetailStory from "@/components/work/WorkDetailStory";
import type { WorkDetailModel, WorkDetailSectionId } from "@/content/workDetail";
import { getSectionNumber, getWorkDetailTabs } from "@/content/workDetail";
import { useStickySectionNav } from "@/hooks/useStickySectionNav";
import {
  isWorkFlipPending,
  onWorkFlipComplete,
  registerWorkFlipTarget,
} from "@/lib/workCaseTransition";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type WorkDetailPageProps = {
  model: WorkDetailModel;
};

export default function WorkDetailPage({ model }: WorkDetailPageProps) {
  const {
    caseStudy,
    title,
    familyLabel,
    tags,
    objective,
    mandate,
    executionSummary,
    heroImage,
    gallery,
    galleryGroups,
    videos,
    linkGroups,
    results,
    resultHighlights,
    builtWith,
    related,
  } = model;

  const rootRef = useRef<HTMLDivElement>(null);
  const flipTargetRef = useRef<HTMLDivElement>(null);
  const [flipEntrance, setFlipEntrance] = useState(() => isWorkFlipPending(caseStudy.slug));

  const sectionTabs = useMemo(() => getWorkDetailTabs(model), [model]);
  const sectionNumber = useCallback(
    (id: WorkDetailSectionId) => getSectionNumber(id, sectionTabs),
    [sectionTabs],
  );
  const hasSection = useCallback(
    (id: WorkDetailSectionId) => sectionTabs.some((tab) => tab.id === id),
    [sectionTabs],
  );

  const {
    activeTab,
    stickyOffsets,
    tabBarRef,
    tabNavRef,
    scrollToElement,
    handleTabKeyDown,
  } = useStickySectionNav({
    tabs: sectionTabs,
    updateHash: true,
    focusHeading: true,
  });

  const campaignTitle =
    caseStudy.hashtag &&
    caseStudy.hashtag.toLowerCase() !== caseStudy.campaign.toLowerCase()
      ? `${caseStudy.campaign} – ${caseStudy.hashtag}`
      : caseStudy.campaign;
  // H1 template: "{Client} — {Case title}". The client prefix is skipped when the
  // campaign name already carries it (e.g. "FedEx × Chennai Super Kings").
  const displayTitle = campaignTitle.toLowerCase().includes(caseStudy.client.toLowerCase())
    ? campaignTitle
    : `${caseStudy.client} — ${campaignTitle}`;

  // Shared-element Flip: register hero media as the landing target
  useLayoutEffect(() => {
    if (!isWorkFlipPending(caseStudy.slug)) {
      setFlipEntrance(false);
      return;
    }

    setFlipEntrance(true);
    registerWorkFlipTarget(caseStudy.slug, flipTargetRef.current);

    const unsubscribe = onWorkFlipComplete(({ slug }) => {
      if (slug === caseStudy.slug) setFlipEntrance(false);
    });

    return unsubscribe;
  }, [caseStudy.slug]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          canAnimate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            gsap.set("[data-animate], [data-animate-stagger] > *", {
              clearProps: "all",
              autoAlpha: 1,
              opacity: 1,
              y: 0,
              scale: 1,
            });
            return;
          }

          const runHeroEntrance = (fromFlip: boolean) => {
            const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });

            if (fromFlip) {
              // Image already arrived via Flip — only reveal copy + seam.
              gsap.set("[data-animate='hero-visual']", { autoAlpha: 1, opacity: 1 });
              heroTl
                .fromTo(
                  "[data-animate='hero-copy']",
                  { y: 28, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, clearProps: "transform" },
                )
                .fromTo(
                  "[data-animate='hero-seam']",
                  { opacity: 0, scale: 0.86 },
                  {
                    opacity: 1,
                    scale: 1,
                    duration: 0.5,
                    stagger: 0.08,
                    clearProps: "scale",
                  },
                  "-=0.35",
                );
            } else {
              heroTl
                .fromTo(
                  "[data-animate='hero-copy']",
                  { y: 28, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.85, stagger: 0.1, clearProps: "transform" },
                )
                .fromTo(
                  "[data-animate='hero-visual']",
                  { opacity: 0 },
                  { opacity: 1, duration: 0.45 },
                  "-=0.7",
                )
                .fromTo(
                  "[data-animate='hero-seam']",
                  { opacity: 0, scale: 0.86 },
                  {
                    opacity: 1,
                    scale: 1,
                    duration: 0.55,
                    stagger: 0.08,
                    clearProps: "scale",
                  },
                  "-=0.25",
                );
            }

            return heroTl;
          };

          const runSectionEntrances = () => {
            gsap.utils.toArray<HTMLElement>("[data-animate-section]").forEach((section) => {
              const targets = section.querySelectorAll<HTMLElement>(
                "[data-animate='fade-up'], [data-animate-stagger] > *",
              );
              if (!targets.length) return;

              gsap.fromTo(
                targets,
                { y: 24, opacity: 0 },
                {
                  y: 0,
                  opacity: 1,
                  duration: 0.7,
                  stagger: 0.08,
                  ease: "power2.out",
                  clearProps: "transform",
                  scrollTrigger: {
                    trigger: section,
                    start: "top 82%",
                    once: true,
                  },
                },
              );
            });
          };

          if (isWorkFlipPending(caseStudy.slug)) {
            gsap.set("[data-animate='hero-copy']", { opacity: 0, y: 28 });
            gsap.set("[data-animate='hero-visual']", { opacity: 0 });
            gsap.set("[data-animate='hero-seam']", { opacity: 0, scale: 0.86 });

            let played = false;
            const playAfterFlip = ({ slug }: { slug: string }) => {
              if (played || slug !== caseStudy.slug) return;
              played = true;
              runHeroEntrance(true);
              runSectionEntrances();
            };

            const unsubscribe = onWorkFlipComplete(playAfterFlip);
            return () => unsubscribe();
          }

          runHeroEntrance(false);
          runSectionEntrances();
        },
      );
    },
    { scope: rootRef, dependencies: [caseStudy.slug] },
  );

  const sectionScrollStyle = useMemo(
    () => ({ scrollMarginTop: stickyOffsets.total } as CSSProperties),
    [stickyOffsets.total],
  );

  return (
    <div
      ref={rootRef}
      style={
        {
          "--work-sticky-offset": `${stickyOffsets.total}px`,
          "--insight-sticky-offset": `${stickyOffsets.total}px`,
        } as CSSProperties
      }
    >
      <WorkDetailHero
        caseStudy={caseStudy}
        title={title}
        familyLabel={familyLabel}
        tags={tags}
        heroImage={heroImage}
        displayTitle={displayTitle}
        flipTargetRef={flipTargetRef}
        flipEntrance={flipEntrance}
        firstSectionId={sectionTabs[0]?.id ?? "objective"}
        scrollToElement={scrollToElement}
      />

      <StickySectionNav
        tabs={sectionTabs}
        activeTab={activeTab}
        headerOffset={stickyOffsets.header}
        tabBarRef={tabBarRef}
        tabNavRef={tabNavRef}
        ariaLabel="Case study sections"
        ariaCurrentValue="true"
        onSelect={scrollToElement}
        onTabKeyDown={handleTabKeyDown}
      />

      <WorkDetailStory
        title={title}
        caseStudy={caseStudy}
        objective={objective}
        mandate={mandate}
        executionSummary={executionSummary}
        heroImage={heroImage}
        gallery={gallery}
        galleryGroups={galleryGroups}
        videos={videos}
        linkGroups={linkGroups}
        results={results}
        resultHighlights={resultHighlights}
        builtWith={builtWith}
        hasSection={hasSection}
        sectionNumber={sectionNumber}
        sectionScrollStyle={sectionScrollStyle}
      />

      {hasSection("related") ? (
        <WorkDetailRelated
          related={related}
          sectionNumber={sectionNumber}
          sectionScrollStyle={sectionScrollStyle}
        />
      ) : null}
    </div>
  );
}
