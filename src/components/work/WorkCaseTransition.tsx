"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import gsap from "gsap";
import { Flip } from "gsap/Flip";
import {
  clearWorkFlipState,
  emitWorkFlipComplete,
  markWorkFlipActive,
  onWorkFlipTargetReady,
  onWorkTransitionStart,
  type WorkCaseTransitionPayload,
} from "@/lib/workCaseTransition";

gsap.registerPlugin(Flip);

const FLIP_DURATION = 0.95;
const REVEAL_DURATION = 0.85;

/**
 * Case Study Card → Detail Page shared element transition (GSAP Flip).
 * Mount once in the root layout. Cards call beginWorkCaseTransition();
 * detail heroes register via registerWorkFlipTarget().
 */
export default function WorkCaseTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const layerRef = useRef<HTMLDivElement>(null);
  const cloneRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const runningRef = useRef(false);
  const payloadRef = useRef<WorkCaseTransitionPayload | null>(null);
  const targetWaitRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const clone = cloneRef.current;
    const veil = veilRef.current;
    if (!layer || !clone || !veil) return;

    const resetLayer = () => {
      runningRef.current = false;
      payloadRef.current = null;
      if (targetWaitRef.current) {
        clearTimeout(targetWaitRef.current);
        targetWaitRef.current = null;
      }
      gsap.killTweensOf([layer, clone, veil, clone.querySelector("img")]);
      gsap.set(layer, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(veil, { autoAlpha: 0, clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(clone, {
        clearProps: "all",
        autoAlpha: 0,
      });
      clone.replaceChildren();
      document.documentElement.removeAttribute("data-work-flip");
      document.getElementById("main-content")?.removeAttribute("data-work-flip-reveal");
      document.body.style.removeProperty("overflow");
    };

    const finish = (slug: string, target?: HTMLElement | null) => {
      if (target) gsap.set(target, { autoAlpha: 1, clearProps: "opacity,visibility" });
      emitWorkFlipComplete(slug);
      resetLayer();
    };

    const abort = () => {
      const slug = payloadRef.current?.slug;
      clearWorkFlipState();
      if (slug) emitWorkFlipComplete(slug);
      resetLayer();
    };

    const playToTarget = (target: HTMLElement) => {
      const payload = payloadRef.current;
      if (!payload || !runningRef.current) return;

      if (!clone.querySelector("img")) {
        finish(payload.slug, target);
        return;
      }

      const main = document.getElementById("main-content");

      // Measure while the page is still visually hidden (html[data-work-flip]).
      const targetRect = target.getBoundingClientRect();
      const cx = ((targetRect.left + targetRect.width / 2) / window.innerWidth) * 100;
      const cy = ((targetRect.top + targetRect.height / 2) / window.innerHeight) * 100;

      gsap.set(target, { autoAlpha: 0 });
      gsap.set(veil, {
        autoAlpha: 1,
        backgroundColor: "var(--color-paper, #f7f5f0)",
      });

      // Reveal the page under a circular clip that expands from the hero image.
      main?.setAttribute("data-work-flip-reveal", "");
      if (main) {
        gsap.set(main, { clipPath: `circle(8% at ${cx}% ${cy}%)` });
      }

      const tl = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(target, { autoAlpha: 1 });
          if (main) gsap.set(main, { clearProps: "clip-path" });
          gsap.to(clone, {
            autoAlpha: 0,
            duration: 0.22,
            ease: "power1.out",
            onComplete: () => finish(payload.slug, target),
          });
        },
      });

      // Shared element: card media → detail hero (Flip.fit).
      tl.add(
        Flip.fit(clone, target, {
          duration: FLIP_DURATION,
          ease: "power3.inOut",
          scale: true,
          absolute: true,
          fitChild: clone.querySelector("img"),
        }) as gsap.core.Tween,
        0,
      );

      tl.to(
        veil,
        {
          autoAlpha: 0,
          duration: 0.45,
          ease: "power2.out",
        },
        0.15,
      );

      if (main) {
        tl.to(
          main,
          {
            clipPath: `circle(160% at ${cx}% ${cy}%)`,
            duration: REVEAL_DURATION,
            ease: "power3.inOut",
          },
          0.12,
        );
      }
    };

    const waitForTarget = (slug: string) => {
      if (targetWaitRef.current) clearTimeout(targetWaitRef.current);
      // Safety timeout if navigation fails or target never mounts
      targetWaitRef.current = setTimeout(() => {
        if (payloadRef.current?.slug === slug && runningRef.current) {
          abort();
          router.push(`/work/${slug}`);
        }
      }, 4000);
    };

    const unsubscribeStart = onWorkTransitionStart((payload) => {
      if (runningRef.current) return;
      runningRef.current = true;
      payloadRef.current = payload;
      markWorkFlipActive(payload.slug);
      document.documentElement.setAttribute("data-work-flip", payload.slug);
      document.body.style.overflow = "hidden";

      clone.replaceChildren();
      const img = document.createElement("img");
      img.src = payload.imageSrc;
      img.alt = "";
      img.setAttribute("aria-hidden", "true");
      img.decoding = "async";
      img.draggable = false;
      Object.assign(img.style, {
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
      });
      clone.appendChild(img);

      gsap.set(layer, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(veil, { autoAlpha: 0 });
      gsap.set(clone, {
        position: "fixed",
        top: payload.from.top,
        left: payload.from.left,
        width: payload.from.width,
        height: payload.from.height,
        borderRadius: payload.from.radius,
        overflow: "hidden",
        zIndex: 2,
        autoAlpha: 1,
        margin: 0,
        boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
      });

      // Dim the outgoing page slightly while we navigate.
      gsap.fromTo(
        layer,
        { backgroundColor: "rgba(247, 245, 240, 0)" },
        { backgroundColor: "rgba(247, 245, 240, 0.35)", duration: 0.35, ease: "power2.out" },
      );

      waitForTarget(payload.slug);
      router.push(payload.href);
    });

    const unsubscribeTarget = onWorkFlipTargetReady(({ slug, target }) => {
      if (!runningRef.current || payloadRef.current?.slug !== slug) return;
      if (targetWaitRef.current) {
        clearTimeout(targetWaitRef.current);
        targetWaitRef.current = null;
      }

      // Wait a frame so layout (sticky header, fonts, images) settles.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => playToTarget(target));
      });
    });

    return () => {
      unsubscribeStart();
      unsubscribeTarget();
      if (targetWaitRef.current) clearTimeout(targetWaitRef.current);
      gsap.killTweensOf([layer, clone, veil]);
    };
  }, [router]);

  // If the user navigates away mid-flip, clean up.
  useEffect(() => {
    const slug = payloadRef.current?.slug;
    if (!slug || !runningRef.current) return;
    if (pathname === `/work/${slug}`) return;
    // Still on listing or elsewhere before push settles — ignore brief mismatches
    if (pathname.startsWith("/work/") && pathname !== `/work/${slug}`) {
      clearWorkFlipState();
      runningRef.current = false;
      payloadRef.current = null;
      const layer = layerRef.current;
      const clone = cloneRef.current;
      const veil = veilRef.current;
      if (layer && clone && veil) {
        gsap.set(layer, { autoAlpha: 0, pointerEvents: "none" });
        gsap.set(veil, { autoAlpha: 0 });
        gsap.set(clone, { autoAlpha: 0 });
        clone.replaceChildren();
      }
      document.documentElement.removeAttribute("data-work-flip");
      document.body.style.removeProperty("overflow");
    }
  }, [pathname]);

  return (
    <div
      ref={layerRef}
      className="pointer-events-none fixed inset-0 z-[110] opacity-0"
      aria-hidden
      data-work-flip-layer
    >
      <div ref={veilRef} className="absolute inset-0 opacity-0" data-work-flip-veil />
      <div ref={cloneRef} className="opacity-0" data-work-flip-clone />
    </div>
  );
}
