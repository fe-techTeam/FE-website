"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const RING_R = 148;
const PROGRESS_R = 132;
const CIRCUMFERENCE = 2 * Math.PI * PROGRESS_R;

/** Keep SSR/client SVG attrs identical (avoids float hydration mismatches). */
function roundCoord(n: number) {
  return Math.round(n * 1000) / 1000;
}

function polarDeg(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: roundCoord(cx + r * Math.cos(rad)),
    y: roundCoord(cy + r * Math.sin(rad)),
  };
}

function isHomePath(pathname: string | null) {
  return pathname === "/";
}

/** Must match the inline script in app/layout.tsx that flags first-visit loads before first paint. */
const PRELOAD_ATTR = "data-preload";
const SEEN_KEY = "fe-preloaded";

function hasSeenPreloader() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markPreloaderSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage unavailable — the overlay simply shows again next time */
  }
}

export default function Preloader() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<SVGCircleElement>(null);
  const dotGroupRef = useRef<SVGGElement>(null);
  const percentRef = useRef<HTMLParagraphElement>(null);
  const prevPathRef = useRef<string | null>(null);
  const onHome = isHomePath(pathname);
  // `visible` only decides whether the overlay markup exists (home route); the pre-paint
  // `data-preload` flag on <html> decides whether it is actually shown.
  const [visible, setVisible] = useState(onHome);
  const [active, setActive] = useState(false);

  useEffect(() => {
    prevPathRef.current = pathname;

    // Once per browser session, on the home page only — never re-gate content on return visits.
    if (!isHomePath(pathname) || hasSeenPreloader()) {
      setVisible(false);
      setActive(false);
      document.documentElement.removeAttribute(PRELOAD_ATTR);
      document.body.style.overflow = "";
      return;
    }

    document.documentElement.setAttribute(PRELOAD_ATTR, "1");
    setVisible(true);
    setActive(true);
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [pathname]);

  useGSAP(
    () => {
      if (!active) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const progress = { value: 0 };

      if (percentRef.current) percentRef.current.textContent = "0%";
      gsap.set(rootRef.current, { autoAlpha: 1 });

      const finish = () => {
        gsap.to(rootRef.current, {
          autoAlpha: 0,
          duration: 0.55,
          ease: "power2.inOut",
          onComplete: () => {
            markPreloaderSeen();
            document.documentElement.removeAttribute(PRELOAD_ATTR);
            setVisible(false);
            setActive(false);
            document.body.style.overflow = "";
          },
        });
      };

      if (reduce) {
        finish();
        return;
      }

      gsap.set("[data-preloader-ring]", { autoAlpha: 0, scale: 0.92, transformOrigin: "50% 50%" });
      gsap.set("[data-preloader-streak]", { autoAlpha: 0, scaleX: 0, transformOrigin: "0% 50%" });
      gsap.set("[data-preloader-center]", { autoAlpha: 0, y: 8 });
      gsap.set(progressRef.current, {
        strokeDasharray: CIRCUMFERENCE,
        strokeDashoffset: CIRCUMFERENCE,
      });

      const intro = gsap.timeline();
      intro
        .to("[data-preloader-ring]", { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.06, ease: "power3.out" })
        .to("[data-preloader-streak]", {
          autoAlpha: 1,
          scaleX: 1,
          duration: 0.7,
          stagger: 0.04,
          ease: "power2.out",
        }, "-=0.5")
        .to("[data-preloader-center]", { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" }, "-=0.35");

      gsap.to("[data-preloader-particle]", {
        x: "+=18",
        autoAlpha: 0,
        duration: 1.4,
        stagger: { each: 0.12, repeat: -1 },
        ease: "power1.in",
      });

      gsap.to("[data-preloader-particle-left]", {
        x: "-=18",
        autoAlpha: 0,
        duration: 1.4,
        stagger: { each: 0.12, repeat: -1 },
        ease: "power1.in",
      });

      const loadPromise = new Promise<void>((resolve) => {
        if (document.readyState === "complete") {
          resolve();
          return;
        }
        window.addEventListener("load", () => resolve(), { once: true });
      });

      const minDelay = new Promise<void>((resolve) => setTimeout(resolve, 900));

      Promise.all([loadPromise, minDelay]).then(() => {
        gsap.to(progress, {
          value: 100,
          duration: 0.7,
          ease: "power2.inOut",
          onUpdate: () => {
            const pct = Math.round(progress.value);
            if (percentRef.current) percentRef.current.textContent = `${pct}%`;
            const offset = CIRCUMFERENCE * (1 - progress.value / 100);
            gsap.set(progressRef.current, { strokeDashoffset: offset });

            const dotPos = polarDeg(200, 200, PROGRESS_R, (progress.value / 100) * 360);
            gsap.set(dotGroupRef.current, {
              attr: { transform: `translate(${dotPos.x} ${dotPos.y})` },
            });
          },
          onComplete: finish,
        });
      });
    },
    { scope: rootRef, dependencies: [active] },
  );

  if (!visible) return null;

  const cx = 200;
  const cy = 200;

  return (
    <div
      ref={rootRef}
      className="fe-preloader fixed inset-0 z-[200] items-center justify-center bg-white"
      aria-hidden
    >
      <div className="relative w-[min(92vw,480px)]">
        {/* Horizontal data streaks */}
        <div className="pointer-events-none absolute inset-y-0 -left-[18%] w-[36%]">
          <div className="flex h-full flex-col justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`l-${i}`}
                data-preloader-streak
                className="h-px origin-right bg-gradient-to-l from-black/25 to-transparent"
                style={{ width: `${55 + i * 14}%`, marginLeft: `${i * 6}%` }}
              />
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={`lp-${i}`}
              data-preloader-particle-left
              className="absolute h-1 w-1 rounded-full bg-black/30"
              style={{ top: `${28 + i * 11}%`, right: `${10 + i * 8}%` }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-y-0 -right-[18%] w-[36%]">
          <div className="flex h-full flex-col justify-center gap-3">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={`r-${i}`}
                data-preloader-streak
                className="h-px origin-left bg-gradient-to-r from-red to-transparent"
                style={{ width: `${55 + i * 14}%`, marginRight: `${i * 6}%` }}
              />
            ))}
          </div>
          {[0, 1, 2, 3, 4].map((i) => (
            <span
              key={`rp-${i}`}
              data-preloader-particle
              className="absolute h-1 w-1 rounded-full bg-red"
              style={{ top: `${28 + i * 11}%`, left: `${10 + i * 8}%` }}
            />
          ))}
        </div>

        <svg viewBox="0 0 400 400" className="mx-auto block w-full" aria-hidden>
          <defs>
            <filter id="preloader-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Faint radial spokes */}
          {Array.from({ length: 12 }, (_, i) => {
            const angle = (360 / 12) * i;
            const outer = polarDeg(cx, cy, RING_R + 6, angle);
            return (
              <line
                key={`spoke-${i}`}
                data-preloader-ring
                x1={cx}
                y1={cy}
                x2={outer.x}
                y2={outer.y}
                stroke="#e8e8e8"
                strokeWidth={0.5}
              />
            );
          })}

          {/* Outer ring */}
          <circle
            data-preloader-ring
            cx={cx}
            cy={cy}
            r={RING_R}
            fill="none"
            stroke="#d4d4d4"
            strokeWidth={1}
          />

          {/* Dotted inner ring */}
          <circle
            data-preloader-ring
            cx={cx}
            cy={cy}
            r={RING_R - 22}
            fill="none"
            stroke="#c9c9c9"
            strokeWidth={0.75}
            strokeDasharray="2 6"
          />

          {/* Progress track */}
          <circle
            data-preloader-ring
            cx={cx}
            cy={cy}
            r={PROGRESS_R}
            fill="none"
            stroke="#ececec"
            strokeWidth={2.5}
          />

          {/* Progress arc */}
          <circle
            ref={progressRef}
            cx={cx}
            cy={cy}
            r={PROGRESS_R}
            fill="none"
            stroke="#d22525"
            strokeWidth={2.5}
            strokeLinecap="round"
            transform={`rotate(-90 ${cx} ${cy})`}
            filter="url(#preloader-glow)"
          />

          {/* Leading dot */}
          <g ref={dotGroupRef} data-preloader-ring transform={`translate(${cx} ${cy - PROGRESS_R})`}>
            <circle r={5} fill="#0a0a0a" filter="url(#preloader-glow)" />
            <circle r={2.5} fill="#ffffff" />
          </g>
        </svg>

        {/* Center content */}
        <div
          data-preloader-center
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center"
        >
          <Image
            src="/images/brand/fe_logo_black.svg"
            alt="First Economy"
            width={200}
            height={64}
            priority
            unoptimized
            className="h-auto w-[min(200px,48vw)]"
          />
          <p className="font-display text-[11px] font-semibold uppercase tracking-[0.22em] text-muted">
            Your Growth Partner
          </p>
          <p
            ref={percentRef}
            className="font-display text-[28px] font-extrabold leading-none tracking-wide text-red tabular-nums sm:text-[32px]"
          >
            0%
          </p>
          <p className="font-display text-[10px] font-semibold uppercase tracking-[0.28em] text-muted/80">
            Loading Experience
          </p>
        </div>
      </div>
    </div>
  );
}
