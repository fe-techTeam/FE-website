"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { RefObject } from "react";
import {
  animateStoryTimeline,
  gsap,
  refreshScrollTriggers,
  resetReducedMotion,
  runHeroTimeline,
  runSectionReveals,
} from "@/lib/gsap/pageReveal";

gsap.registerPlugin(ScrollTrigger);

export type PageRevealContext = {
  gsap: typeof gsap;
  ScrollTrigger: typeof ScrollTrigger;
  reduceMotion: boolean;
  animateStoryTimeline: (wrapSelector: string) => void;
};

type UsePageRevealOptions = {
  scope: RefObject<HTMLElement | null>;
  dependencies?: unknown[];
  hero?: boolean;
  sections?: boolean;
  sectionStart?: string;
  reducedMotionSelectors?: string[];
  onReveal?: (context: PageRevealContext) => void;
};

export function usePageReveal({
  scope,
  dependencies = [],
  hero = true,
  sections = true,
  sectionStart,
  reducedMotionSelectors = [],
  onReveal,
}: UsePageRevealOptions) {
  const onRevealRef = useRef(onReveal);
  onRevealRef.current = onReveal;

  useEffect(() => {
    const root = scope.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          reduceMotion: "(prefers-reduced-motion: reduce)",
          canAnimate: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          const { reduceMotion } = context.conditions ?? {};

          if (reduceMotion) {
            resetReducedMotion(reducedMotionSelectors);
            return;
          }

          if (hero) {
            runHeroTimeline();
          }

          if (sections) {
            runSectionReveals({ start: sectionStart });
          }

          onRevealRef.current?.({
            gsap,
            ScrollTrigger,
            reduceMotion: false,
            animateStoryTimeline,
          });

          refreshScrollTriggers();
        },
      );

      return () => mm.revert();
    }, root);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- scope ref is stable; caller controls reruns via dependencies
  }, [scope, hero, sections, sectionStart, reducedMotionSelectors, ...dependencies]);
}
