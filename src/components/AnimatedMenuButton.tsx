"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useEffect, useRef } from "react";

gsap.registerPlugin(useGSAP);

type AnimatedMenuButtonProps = {
  open: boolean;
  onClick: () => void;
  controls: string;
  buttonRef?: React.RefObject<HTMLButtonElement | null>;
};

export default function AnimatedMenuButton({
  open,
  onClick,
  controls,
  buttonRef,
}: AnimatedMenuButtonProps) {
  const localRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLSpanElement>(null);
  const topRef = useRef<HTMLSpanElement>(null);
  const midRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);

  const setRef = (node: HTMLButtonElement | null) => {
    localRef.current = node;
    if (buttonRef && "current" in buttonRef) {
      (buttonRef as React.MutableRefObject<HTMLButtonElement | null>).current = node;
    }
  };

  useEffect(() => {
    const el = localRef.current;
    if (!el) return;
    el.style.willChange = "";
    gsap.set(el, { clearProps: "transform" });
  }, []);

  useGSAP(
    () => {
      const top = topRef.current;
      const mid = midRef.current;
      const bot = botRef.current;
      if (!top || !mid || !bot) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(top, { y: open ? 6 : 0, rotate: open ? 45 : 0 });
        gsap.set(mid, { opacity: open ? 0 : 1, scaleX: open ? 0 : 1 });
        gsap.set(bot, { y: open ? -6 : 0, rotate: open ? -45 : 0 });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.to(top, {
          y: open ? 6 : 0,
          rotate: open ? 45 : 0,
          duration: 0.35,
          ease: open ? "power3.out" : "power2.inOut",
        });
        gsap.to(mid, {
          opacity: open ? 0 : 1,
          scaleX: open ? 0 : 1,
          duration: 0.25,
          ease: "power2.inOut",
        });
        gsap.to(bot, {
          y: open ? -6 : 0,
          rotate: open ? -45 : 0,
          duration: 0.35,
          ease: open ? "power3.out" : "power2.inOut",
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [open] },
  );

  return (
    <button
      ref={setRef}
      type="button"
      data-no-btn-motion
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      aria-controls={controls}
      aria-haspopup="dialog"
      onClick={onClick}
      className="tap-target flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-red lg:hidden"
    >
      <span ref={rootRef} className="relative block h-[14px] w-[22px]" aria-hidden>
        <span
          ref={topRef}
          className="absolute left-0 top-0 block h-[2px] w-full origin-center rounded-full bg-current"
        />
        <span
          ref={midRef}
          className="absolute left-0 top-[6px] block h-[2px] w-full origin-center rounded-full bg-current"
        />
        <span
          ref={botRef}
          className="absolute left-0 top-[12px] block h-[2px] w-full origin-center rounded-full bg-current"
        />
      </span>
    </button>
  );
}
