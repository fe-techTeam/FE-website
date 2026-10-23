"use client";

import { useEffect } from "react";
import gsap from "gsap";

const BTN_SELECTOR = "a.text-cta, a.gsap-btn, button:not(:disabled), input[type='submit']:not(:disabled)";

/** Track bound nodes without mutating React-managed attributes (avoids hydration mismatch). */
const boundButtons = new WeakSet<HTMLElement>();

function shouldSkipButton(el: HTMLElement) {
  return el.closest(".skip-link") !== null || el.hasAttribute("data-no-btn-motion");
}

function resolveButton(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  const el = target.closest(BTN_SELECTOR);
  if (!(el instanceof HTMLElement)) return null;
  if (shouldSkipButton(el)) return null;
  return el;
}

function isSolidButton(el: HTMLElement) {
  if (el.matches("button, input[type='submit']")) return true;
  if (
    el.classList.contains("bg-ink") ||
    el.classList.contains("bg-red") ||
    el.classList.contains("bg-white") ||
    el.classList.contains("bg-paper")
  ) {
    return true;
  }
  // Bordered CTA chips (not text links)
  return el.classList.contains("gsap-btn") && /\bborder\b/.test(el.className);
}

function arrowTargets(el: HTMLElement) {
  const wraps = el.querySelectorAll(
    ":scope > span.grid, :scope > span[aria-hidden], :scope span.rounded-full",
  );
  if (wraps.length) return wraps;
  return el.querySelectorAll(":scope > svg");
}

/** Site-wide GSAP hover / press motion for CTAs and buttons. */
export default function ButtonMotion() {
  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const cleanups: Array<() => void> = [];
      const enterByEl = new WeakMap<HTMLElement, () => void>();

      const bind = (el: HTMLElement) => {
        if (shouldSkipButton(el)) return;
        if (boundButtons.has(el)) return;
        boundButtons.add(el);

        const solid = isSolidButton(el);
        const arrows = arrowTargets(el);

        const enter = () => {
          gsap.killTweensOf(el);
          if (solid) {
            gsap.to(el, {
              scale: 1.04,
              y: -2,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
            });
          } else {
            gsap.to(el, {
              x: 2,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
          if (arrows.length) {
            gsap.to(arrows, {
              x: 5,
              duration: 0.35,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        const leave = () => {
          gsap.killTweensOf([el, ...arrows]);
          gsap.to(el, {
            scale: 1,
            x: 0,
            y: 0,
            duration: 0.4,
            ease: "power3.out",
            overwrite: "auto",
          });
          if (arrows.length) {
            gsap.to(arrows, {
              x: 0,
              duration: 0.4,
              ease: "power3.out",
              overwrite: "auto",
            });
          }
        };

        const down = () => {
          gsap.to(el, {
            scale: solid ? 0.97 : 1,
            y: solid ? 0 : 0,
            duration: 0.15,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const up = () => {
          if (el.matches(":hover, :focus-visible")) enter();
          else leave();
        };

        enterByEl.set(el, enter);

        el.addEventListener("pointerenter", enter);
        el.addEventListener("pointerleave", leave);
        el.addEventListener("focus", enter);
        el.addEventListener("blur", leave);
        el.addEventListener("pointerdown", down);
        el.addEventListener("pointerup", up);
        el.addEventListener("pointercancel", leave);

        cleanups.push(() => {
          el.removeEventListener("pointerenter", enter);
          el.removeEventListener("pointerleave", leave);
          el.removeEventListener("focus", enter);
          el.removeEventListener("blur", leave);
          el.removeEventListener("pointerdown", down);
          el.removeEventListener("pointerup", up);
          el.removeEventListener("pointercancel", leave);
          boundButtons.delete(el);
          enterByEl.delete(el);
          gsap.set(el, { clearProps: "transform" });
          if (arrows.length) gsap.set(arrows, { clearProps: "transform" });
        });
      };

      // Lazy-bind only — never mutate the DOM during hydration (inline styles / classes race SSR).
      const ensureBound = (target: EventTarget | null, playEnter: boolean) => {
        const el = resolveButton(target);
        if (!el) return;
        const already = boundButtons.has(el);
        bind(el);
        if (playEnter && !already) enterByEl.get(el)?.();
      };

      const onPointerOver = (e: PointerEvent) => ensureBound(e.target, false);
      const onFocusIn = (e: FocusEvent) => ensureBound(e.target, true);

      document.addEventListener("pointerover", onPointerOver);
      document.addEventListener("focusin", onFocusIn);

      return () => {
        document.removeEventListener("pointerover", onPointerOver);
        document.removeEventListener("focusin", onFocusIn);
        cleanups.forEach((fn) => fn());
      };
    });

    return () => mm.revert();
  }, []);

  return null;
}
