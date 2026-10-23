import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const DEFAULT_REDUCED_MOTION_SELECTORS = [
  "[data-animate]",
  "[data-animate-stagger] > *",
  "[data-timeline-icon]",
  "[data-timeline-copy]",
  "[data-timeline-line]",
];

export function resetReducedMotion(extraSelectors: string[] = []) {
  const selectors = [...DEFAULT_REDUCED_MOTION_SELECTORS, ...extraSelectors].join(", ");
  gsap.set(selectors, {
    clearProps: "all",
    autoAlpha: 1,
    opacity: 1,
    y: 0,
    scale: 1,
    scaleX: 1,
    scaleY: 1,
  });
}

export function runHeroTimeline() {
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .fromTo(
      "[data-animate='hero-copy']",
      { y: 28, autoAlpha: 0 },
      {
        y: 0,
        autoAlpha: 1,
        duration: 0.9,
        stagger: 0.12,
        clearProps: "transform",
        immediateRender: false,
      },
    )
    .fromTo(
      "[data-animate='hero-visual']",
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.45, immediateRender: false },
      "-=0.7",
    )
    .fromTo(
      "[data-animate='hero-seam']",
      { autoAlpha: 0, scale: 0.86 },
      {
        autoAlpha: 1,
        scale: 1,
        duration: 0.55,
        stagger: 0.08,
        clearProps: "scale",
        immediateRender: false,
      },
      "-=0.25",
    );
  return heroTl;
}

type SectionRevealOptions = {
  start?: string;
};

export function runSectionReveals({ start = "top 78%" }: SectionRevealOptions = {}) {
  gsap.utils.toArray<HTMLElement>("[data-animate-section]").forEach((section) => {
    const intro = section.querySelectorAll("[data-animate='fade-up']");
    const staggerRoots = section.querySelectorAll("[data-animate-stagger]");
    const staggerItems = staggerRoots.length
      ? gsap.utils.toArray<Element>(
          Array.from(staggerRoots).flatMap((root) =>
            Array.from(root.querySelectorAll(":scope > *")),
          ),
        )
      : section.querySelectorAll("[data-animate='stagger-item']");

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start,
        toggleActions: "play none none none",
      },
      defaults: { ease: "power3.out" },
    });

    if (intro.length) {
      tl.fromTo(
        intro,
        { y: 32, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.75,
          stagger: 0.1,
          clearProps: "transform",
          immediateRender: false,
        },
      );
    }

    if (staggerItems.length) {
      tl.fromTo(
        staggerItems,
        { y: 24, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.55,
          stagger: 0.06,
          clearProps: "transform",
          immediateRender: false,
        },
        intro.length ? "-=0.35" : 0,
      );
    }
  });
}

export function animateStoryTimeline(wrapSelector: string) {
  const processWrap = gsap.utils.toArray<HTMLElement>(wrapSelector)[0];
  const processTimeline = processWrap?.querySelector<HTMLElement>("[data-story-timeline]");
  if (!processWrap || !processTimeline) return;

  const line = processWrap.querySelector<HTMLElement>("[data-timeline-line]");
  const icons = processTimeline.querySelectorAll("[data-timeline-icon]");
  const copies = processTimeline.querySelectorAll("[data-timeline-copy]");
  const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

  if (line) {
    gsap.set(line, isDesktop ? { scaleX: 0 } : { scaleY: 0 });
  }
  gsap.set(icons, { scale: 0.55, opacity: 0 });
  gsap.set(copies, { y: 18, opacity: 0 });

  const processTl = gsap.timeline({
    scrollTrigger: {
      trigger: processWrap,
      start: "top 78%",
      toggleActions: "play none none none",
    },
    defaults: { ease: "power3.out" },
  });

  if (line) {
    processTl.to(line, {
      ...(isDesktop ? { scaleX: 1 } : { scaleY: 1 }),
      duration: 0.9,
      ease: "power2.inOut",
    });
  }

  icons.forEach((icon, i) => {
    const at = line ? (i === 0 ? "-=0.35" : "-=0.45") : i === 0 ? 0 : "-=0.45";
    processTl.to(icon, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, at);
    processTl.to(copies[i], { y: 0, opacity: 1, duration: 0.5 }, "-=0.28");
  });
}

export function refreshScrollTriggers() {
  requestAnimationFrame(() => ScrollTrigger.refresh());
}

export { gsap, ScrollTrigger };
