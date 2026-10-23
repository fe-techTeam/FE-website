/**
 * Case Study Card → Detail Page shared-element transition state.
 * Overlay + Flip.fit live in WorkCaseTransition; cards/detail only signal.
 */

export type WorkCaseTransitionPayload = {
  slug: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  from: { top: number; left: number; width: number; height: number; radius: string };
};

type TargetReadyDetail = {
  slug: string;
  target: HTMLElement;
};

type Listener<T> = (detail: T) => void;

const startListeners = new Set<Listener<WorkCaseTransitionPayload>>();
const targetListeners = new Set<Listener<TargetReadyDetail>>();
const completeListeners = new Set<Listener<{ slug: string }>>();

let pending: WorkCaseTransitionPayload | null = null;
let activeSlug: string | null = null;

export function prefersWorkTransitionReducedMotion() {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isWorkFlipPending(slug: string) {
  return pending?.slug === slug || activeSlug === slug;
}

export function getPendingWorkTransition() {
  return pending;
}

export function peekActiveWorkFlipSlug() {
  return activeSlug;
}

export function onWorkTransitionStart(listener: Listener<WorkCaseTransitionPayload>) {
  startListeners.add(listener);
  return () => {
    startListeners.delete(listener);
  };
}

export function onWorkFlipTargetReady(listener: Listener<TargetReadyDetail>) {
  targetListeners.add(listener);
  return () => {
    targetListeners.delete(listener);
  };
}

export function onWorkFlipComplete(listener: Listener<{ slug: string }>) {
  completeListeners.add(listener);
  return () => {
    completeListeners.delete(listener);
  };
}

export function markWorkFlipActive(slug: string) {
  activeSlug = slug;
  pending = null;
}

export function clearWorkFlipState() {
  pending = null;
  activeSlug = null;
}

export function emitWorkFlipComplete(slug: string) {
  activeSlug = null;
  pending = null;
  completeListeners.forEach((listener) => listener({ slug }));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("work-case-flip-complete", { detail: { slug } }));
  }
}

/** Called from case study cards when the user opens a detail page. */
export function beginWorkCaseTransition(input: {
  slug: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  sourceEl: HTMLElement | null;
}): WorkCaseTransitionPayload | null {
  if (typeof window === "undefined") return null;
  if (prefersWorkTransitionReducedMotion() || !input.sourceEl || !input.imageSrc) {
    return null;
  }

  const rect = input.sourceEl.getBoundingClientRect();
  if (rect.width < 8 || rect.height < 8) return null;

  const styles = window.getComputedStyle(input.sourceEl);
  const payload: WorkCaseTransitionPayload = {
    slug: input.slug,
    href: input.href,
    imageSrc: input.imageSrc,
    imageAlt: input.imageAlt,
    from: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      radius: styles.borderRadius || "0px",
    },
  };

  pending = payload;
  activeSlug = payload.slug;
  startListeners.forEach((listener) => listener(payload));
  return payload;
}

/** Called from the detail hero once the shared image target is in the DOM. */
export function registerWorkFlipTarget(slug: string, target: HTMLElement | null) {
  if (!target) return;
  if (pending?.slug !== slug && activeSlug !== slug) return;
  targetListeners.forEach((listener) => listener({ slug, target }));
}
