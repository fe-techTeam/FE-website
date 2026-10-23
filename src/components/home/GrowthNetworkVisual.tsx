"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

const SIZE = 1000;
const CENTER = SIZE / 2;
const HUB_R = 82;
const RAY_INNER = 92;
const RAY_OUTER = 305;

type SystemNode = {
  id: string;
  label: string;
  angle: number;
  labelOffset: { x: number; y: number };
  textAnchor: "start" | "middle" | "end";
};

const SYSTEM_NODES: SystemNode[] = [
  {
    id: "media",
    label: "360° MEDIA",
    angle: -90,
    labelOffset: { x: 0, y: -52 },
    textAnchor: "middle",
  },
  {
    id: "technology",
    label: "TECHNOLOGY",
    angle: 0,
    labelOffset: { x: 34, y: 0 },
    textAnchor: "start",
  },
  {
    id: "ai",
    label: "STRATEGY",
    angle: 90,
    labelOffset: { x: 0, y: 54 },
    textAnchor: "middle",
  },
  {
    id: "creative",
    label: "CREATIVITY",
    angle: 180,
    labelOffset: { x: -34, y: 0 },
    textAnchor: "end",
  },
];

const RING_DEFS = [
  { id: "r-ticks-a", type: "ticks" as const, radius: 112, count: 36, duration: 36, direction: 1 },
  { id: "r-dash-a", type: "dashed" as const, radius: 140, duration: 42, direction: -1 },
  { id: "r-ticks-b", type: "ticks" as const, radius: 168, count: 60, duration: 48, direction: 1 },
  { id: "r-solid-a", type: "solid" as const, radius: 192, duration: 0, direction: 1 },
  { id: "r-dash-b", type: "dashed" as const, radius: 216, duration: 58, direction: 1 },
  { id: "r-seg", type: "segmented" as const, radius: 240, duration: 55, direction: -1 },
  { id: "r-dots", type: "dotted" as const, radius: 262, count: 64, duration: 70, direction: 1 },
  { id: "r-ticks-c", type: "ticks" as const, radius: 284, count: 96, duration: 64, direction: -1 },
  { id: "r-outer", type: "solid" as const, radius: 300, duration: 0, direction: 1 },
];

const ORBIT_PARTICLES = [
  { id: "op1", radius: 140, angle: 0, color: "#E1261C", duration: 18, size: 2.2 },
  { id: "op2", radius: 192, angle: 95, color: "#9a9a9a", duration: 26, size: 1.8 },
  { id: "op3", radius: 240, angle: 200, color: "#E1261C", duration: 32, size: 2 },
  { id: "op4", radius: 284, angle: 310, color: "#6a6a6a", duration: 40, size: 1.6 },
];

/** Stable float serialization across SSR / client to avoid hydration drift. */
function coord(n: number) {
  return Number(n.toFixed(2));
}

function polar(angleDeg: number, radius: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return {
    x: coord(CENTER + radius * Math.cos(rad)),
    y: coord(CENTER + radius * Math.sin(rad)),
  };
}

function tickEnds(angleDeg: number, radius: number, length: number) {
  const outer = polar(angleDeg, radius);
  const inner = polar(angleDeg, radius - length);
  return { x1: inner.x, y1: inner.y, x2: outer.x, y2: outer.y };
}

function tickLength(index: number, base: number) {
  if (index % 8 === 0) return base * 1.55;
  if (index % 4 === 0) return base * 1.2;
  return base;
}

function nearAxis(angleDeg: number) {
  return [0, 90, 180, 270].some((a) => {
    const normalized = (((angleDeg + 90) % 360) + 360) % 360;
    const diff = Math.abs(normalized - a);
    return Math.min(diff, 360 - diff) < 8;
  });
}

export default function GrowthNetworkVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const outerParallaxRef = useRef<SVGGElement>(null);
  const midParallaxRef = useRef<SVGGElement>(null);
  const coreParallaxRef = useRef<SVGGElement>(null);
  const hoverPausedRef = useRef(false);
  const activeIdRef = useRef(SYSTEM_NODES[0].id);

  const [activeId, setActiveId] = useState(SYSTEM_NODES[0].id);
  const [hovered, setHovered] = useState(false);
  const [isCoarse, setIsCoarse] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  const uid = useId().replace(/:/g, "");

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setIsCoarse(coarse.matches);
      setReduceMotion(motion.matches);
    };
    sync();
    coarse.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      coarse.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  const applyActiveVisuals = useCallback(
    (id: string) => {
      const root = rootRef.current;
      if (!root) return;

      SYSTEM_NODES.forEach((node) => {
        const isActive = node.id === id;
        const spoke = root.querySelector<SVGLineElement>(`[data-gs-spoke="${node.id}"]`);
        const nodeDot = root.querySelector<SVGCircleElement>(`[data-gs-node="${node.id}"]`);
        const nodeRing = root.querySelector<SVGCircleElement>(`[data-gs-node-ring="${node.id}"]`);
        const label = root.querySelector<SVGTextElement>(`[data-gs-label="${node.id}"]`);

        if (spoke) {
          const len = Number(spoke.getAttribute("data-len") ?? 0);
          gsap.to(spoke, {
            stroke: isActive ? "#E1261C" : "rgba(8,8,8,0.38)",
            strokeWidth: isActive ? 1.8 : 1.2,
            opacity: isActive ? 1 : 0.45,
            duration: 0.35,
            overwrite: "auto",
          });
          if (isActive && len) {
            gsap.fromTo(
              spoke,
              { strokeDashoffset: len },
              {
                strokeDashoffset: 0,
                duration: 0.7,
                ease: "power2.out",
                overwrite: "auto",
              },
            );
          }
        }

        if (nodeDot) {
          gsap.to(nodeDot, {
            opacity: isActive ? 1 : 0.55,
            duration: 0.3,
            overwrite: "auto",
          });
        }
        if (nodeRing) {
          gsap.to(nodeRing, {
            opacity: isActive ? 0.95 : 0.4,
            duration: 0.3,
            overwrite: "auto",
          });
        }
        if (label) {
          gsap.to(label, {
            fill: isActive ? "#080808" : "#5a5a5a",
            opacity: isActive ? 1 : 0.72,
            attr: { "font-weight": isActive ? 800 : 700 },
            duration: 0.3,
            overwrite: "auto",
          });
        }
      });
    },
    [],
  );

  useEffect(() => {
    applyActiveVisuals(activeId);
  }, [activeId, applyActiveVisuals]);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const coarsePointer = window.matchMedia("(pointer: coarse)").matches;

      SYSTEM_NODES.forEach((node) => {
        const spoke = root.querySelector<SVGLineElement>(`[data-gs-spoke="${node.id}"]`);
        if (!spoke) return;
        const len = spoke.getTotalLength();
        spoke.setAttribute("data-len", String(len));
        spoke.style.strokeDasharray = `${len}`;
        spoke.style.strokeDashoffset = String(len);
      });

      if (reduce) {
        gsap.set(
          "[data-gs-hub], [data-gs-ring], [data-gs-spoke], [data-gs-node-group], [data-gs-label], [data-gs-packet], [data-gs-hub-text]",
          { clearProps: "all", autoAlpha: 1, scale: 1, y: 0 },
        );
        SYSTEM_NODES.forEach((node) => {
          const spoke = root.querySelector<SVGLineElement>(`[data-gs-spoke="${node.id}"]`);
          if (spoke) spoke.style.strokeDashoffset = "0";
        });
        return;
      }

      gsap.set("[data-gs-ring]", { autoAlpha: 0, scale: 0.88, transformOrigin: "50% 50%" });
      gsap.set("[data-gs-hub]", { autoAlpha: 0, scale: 0.8, transformOrigin: "50% 50%" });
      gsap.set("[data-gs-hub-text]", { autoAlpha: 0, y: 6 });
      gsap.set("[data-gs-spoke]", { autoAlpha: 0 });
      gsap.set("[data-gs-node-group]", { autoAlpha: 0, scale: 0.4, transformOrigin: "50% 50%" });
      gsap.set("[data-gs-label]", { autoAlpha: 0, y: 8 });
      gsap.set("[data-gs-packet]", { autoAlpha: 0 });
      gsap.set("[data-gs-scanner]", { autoAlpha: 0 });
      gsap.set("[data-gs-orbit]", { autoAlpha: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to("[data-gs-hub]", { autoAlpha: 1, scale: 1, duration: 0.7 })
        .to(
          "[data-gs-hub-text]",
          { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.08 },
          "-=0.35",
        )
        .to(
          "[data-gs-spoke]",
          {
            autoAlpha: 1,
            duration: 0.15,
            stagger: 0.06,
            onStart() {
              /* draw lines handled below */
            },
          },
          "-=0.2",
        );

      SYSTEM_NODES.forEach((node, i) => {
        const spoke = root.querySelector<SVGLineElement>(`[data-gs-spoke="${node.id}"]`);
        if (!spoke) return;
        const len = Number(spoke.getAttribute("data-len") ?? 0);
        tl.to(
          spoke,
          {
            strokeDashoffset: 0,
            duration: 0.55,
            ease: "power2.out",
          },
          0.55 + i * 0.08,
        );
      });

      tl.to(
        "[data-gs-ring]",
        { autoAlpha: 1, scale: 1, duration: 0.75, stagger: 0.05 },
        0.45,
      )
        .to(
          "[data-gs-node-group]",
          { autoAlpha: 1, scale: 1, duration: 0.4, stagger: 0.08 },
          0.95,
        )
        .to(
          "[data-gs-label]",
          { autoAlpha: 1, y: 0, duration: 0.4, stagger: 0.07 },
          1.05,
        )
        .to("[data-gs-scanner], [data-gs-orbit]", { autoAlpha: 1, duration: 0.5 }, 1.2);

      RING_DEFS.forEach((ring) => {
        if (!ring.duration) return;
        gsap.to(`[data-gs-ring="${ring.id}"]`, {
          rotation: 360 * ring.direction,
          duration: ring.duration,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      });

      ORBIT_PARTICLES.forEach((p) => {
        if (coarsePointer && (p.id === "op3" || p.id === "op4")) return;
        gsap.to(`[data-gs-orbit="${p.id}"]`, {
          rotation: 360,
          duration: p.duration,
          ease: "none",
          repeat: -1,
          transformOrigin: "50% 50%",
        });
      });

      gsap.to("[data-gs-node-ring]", {
        scale: 1.55,
        opacity: 0,
        duration: 2.8,
        ease: "sine.out",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      const activePacketNodes = SYSTEM_NODES.filter((_, i) => !(coarsePointer && i > 1));
      const packetStarts = activePacketNodes.map((node) => polar(node.angle, RAY_OUTER - 10));
      const packetEnds = activePacketNodes.map((node) => polar(node.angle, RAY_INNER + 10));
      const packets = activePacketNodes
        .map((node) => root.querySelector<SVGCircleElement>(`[data-gs-packet="${node.id}"]`))
        .filter((el): el is SVGCircleElement => el !== null);

      packets.forEach((packet, i) => {
        gsap.set(packet, { attr: { cx: packetStarts[i]!.x, cy: packetStarts[i]!.y }, autoAlpha: 0 });
      });

      // All ring dots, orbit particles and spoke packets converge into the hub
      // together, in one synchronized moment, with the core glow bursting as
      // they arrive — then everything resets together for the next cycle.
      const convergeDots = Array.from(
        root.querySelectorAll<SVGCircleElement>(
          '[data-gs-ring="r-dots"] circle, [data-gs-orbit] circle',
        ),
      );

      if (convergeDots.length) {
        const restPositions = convergeDots.map((dot) => ({
          cx: Number(dot.getAttribute("cx")),
          cy: Number(dot.getAttribute("cy")),
        }));

        const convergeTl = gsap.timeline({ repeat: -1, delay: 1.6, repeatDelay: 1.6 });

        convergeTl.to(
          convergeDots,
          {
            attr: { cx: CENTER, cy: CENTER },
            autoAlpha: 0,
            duration: 1.1,
            ease: "power2.in",
          },
          0,
        );

        if (packets.length) {
          convergeTl
            .to(
              packets,
              {
                attr: {
                  cx: (i: number) => packetEnds[i]!.x,
                  cy: (i: number) => packetEnds[i]!.y,
                },
                duration: 1.1,
                ease: "power1.inOut",
              },
              0,
            )
            .to(packets, { autoAlpha: 0.9, duration: 0.18 }, 0)
            .to(packets, { autoAlpha: 0, duration: 0.22 }, "-=0.3");
        }

        convergeTl
          .to(
            "[data-gs-spoke]",
            { stroke: "#E1261C", strokeWidth: 1.8, opacity: 1, duration: 0.3, ease: "power2.out" },
            "-=0.35",
          )
          .to(
            "[data-gs-hub-glow]",
            { attr: { r: HUB_R + 26, "stroke-width": 4 }, duration: 0.3, ease: "power2.out" },
            "<",
          )
          .to(
            "[data-gs-spoke]",
            {
              stroke: "rgba(8,8,8,0.38)",
              strokeWidth: 1.2,
              opacity: 0.45,
              duration: 0.65,
              ease: "power2.inOut",
            },
            "-=0.02",
          )
          .to(
            "[data-gs-hub-glow]",
            { attr: { r: HUB_R + 10, "stroke-width": 2 }, duration: 0.65, ease: "power2.inOut" },
            "<",
          )
          .set(convergeDots, {
            attr: {
              cx: (i: number) => restPositions[i]!.cx,
              cy: (i: number) => restPositions[i]!.cy,
            },
            autoAlpha: 1,
          });

        if (packets.length) {
          convergeTl.set(
            packets,
            {
              attr: {
                cx: (i: number) => packetStarts[i]!.x,
                cy: (i: number) => packetStarts[i]!.y,
              },
              autoAlpha: 0,
            },
            "<",
          );
        }
      }
    },
    { scope: rootRef },
  );

  const onPointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (isCoarse || reduceMotion) return;
    const el = rootRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const nx = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const ny = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    gsap.to(outerParallaxRef.current, {
      x: nx * 5,
      y: ny * 5,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(midParallaxRef.current, {
      x: nx * -3,
      y: ny * -3,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
    gsap.to(coreParallaxRef.current, {
      x: nx * 1.5,
      y: ny * 1.5,
      duration: 0.6,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const onPointerLeaveEngine = () => {
    setHovered(false);
    hoverPausedRef.current = false;
    if (isCoarse || reduceMotion) return;
    gsap.to([outerParallaxRef.current, midParallaxRef.current, coreParallaxRef.current], {
      x: 0,
      y: 0,
      duration: 0.7,
      ease: "power2.out",
      overwrite: "auto",
    });
  };

  const activateNode = (id: string) => {
    hoverPausedRef.current = true;
    setActiveId(id);
  };

  const releaseNode = () => {
    hoverPausedRef.current = false;
  };

  return (
    <div
      ref={rootRef}
      className={`gs-engine${hovered ? " is-hovered" : ""}`}
      onPointerEnter={() => setHovered(true)}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeaveEngine}
    >
      <div ref={stageRef} className="gs-engine__stage">
        <div className="gs-engine__core-glow" aria-hidden />
        <div className="gs-engine__scanner" data-gs-scanner aria-hidden />

        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="gs-engine__svg"
          role="img"
          aria-label="Interactive growth system connecting 360° Media, Technology, Strategy, and Creativity"
          suppressHydrationWarning
        >
          <defs>
            <filter id={`${uid}-glow`} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <radialGradient id={`${uid}-core`} cx="50%" cy="42%" r="62%">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="55%" stopColor="#0c0c0c" />
              <stop offset="100%" stopColor="#050505" />
            </radialGradient>
            <linearGradient id={`${uid}-arc`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.75" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Outer / mid parallax groups */}
          <g ref={outerParallaxRef}>
            {RING_DEFS.filter((r) => r.radius >= 262).map((ring) => (
              <g
                key={ring.id}
                className="gs-ring-layer"
                data-gs-ring={ring.id}
                style={{ opacity: hovered ? 0.72 : 0.52 }}
              >
                {ring.type === "ticks" &&
                  Array.from({ length: ring.count ?? 0 }, (_, i) => {
                    const angle = (360 / (ring.count ?? 1)) * i - 90;
                    if (nearAxis(angle)) return null;
                    const len = tickLength(i, 14);
                    const line = tickEnds(angle, ring.radius, len);
                    return (
                      <line
                        key={`${ring.id}-${i}`}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#1a1a1a"
                        strokeWidth={1.2}
                        strokeLinecap="round"
                        opacity={0.35 + (i % 8 === 0 ? 0.25 : 0)}
                        suppressHydrationWarning
                      />
                    );
                  })}
                {ring.type === "solid" && (
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ring.radius}
                    fill="none"
                    stroke="rgba(8,8,8,0.18)"
                    strokeWidth={1}
                  />
                )}
                {ring.type === "dotted" &&
                  Array.from({ length: ring.count ?? 0 }, (_, i) => {
                    const angle = (360 / (ring.count ?? 1)) * i - 90;
                    if (nearAxis(angle)) return null;
                    const p = polar(angle, ring.radius);
                    return (
                      <circle
                        key={`${ring.id}-${i}`}
                        cx={p.x}
                        cy={p.y}
                        r={1.35}
                        fill="rgba(8,8,8,0.4)"
                        suppressHydrationWarning
                      />
                    );
                  })}
              </g>
            ))}
          </g>

          <g ref={midParallaxRef}>
            {RING_DEFS.filter((r) => r.radius < 262).map((ring) => (
              <g
                key={ring.id}
                className="gs-ring-layer"
                data-gs-ring={ring.id}
                style={{ opacity: hovered ? 0.78 : 0.58 }}
              >
                {ring.type === "ticks" &&
                  Array.from({ length: ring.count ?? 0 }, (_, i) => {
                    const angle = (360 / (ring.count ?? 1)) * i - 90;
                    if (nearAxis(angle)) return null;
                    const len = tickLength(i, 11);
                    const line = tickEnds(angle, ring.radius, len);
                    return (
                      <line
                        key={`${ring.id}-${i}`}
                        x1={line.x1}
                        y1={line.y1}
                        x2={line.x2}
                        y2={line.y2}
                        stroke="#1a1a1a"
                        strokeWidth={1.15}
                        strokeLinecap="round"
                        opacity={0.4 + (i % 8 === 0 ? 0.22 : 0)}
                        suppressHydrationWarning
                      />
                    );
                  })}
                {ring.type === "dashed" && (
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ring.radius}
                    fill="none"
                    stroke="rgba(8,8,8,0.32)"
                    strokeWidth={1.15}
                    strokeDasharray="3 7"
                  />
                )}
                {ring.type === "solid" && (
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={ring.radius}
                    fill="none"
                    stroke="rgba(8,8,8,0.16)"
                    strokeWidth={1}
                  />
                )}
                {ring.type === "segmented" && (
                  <>
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      r={ring.radius}
                      fill="none"
                      stroke="rgba(8,8,8,0.12)"
                      strokeWidth={1}
                    />
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      r={ring.radius}
                      fill="none"
                      stroke={`url(#${uid}-arc)`}
                      strokeWidth={2.2}
                      strokeDasharray="70 520"
                      strokeLinecap="round"
                    />
                    <circle
                      cx={CENTER}
                      cy={CENTER}
                      r={ring.radius}
                      fill="none"
                      stroke={`url(#${uid}-arc)`}
                      strokeWidth={2.2}
                      strokeDasharray="40 550"
                      strokeDashoffset={180}
                      strokeLinecap="round"
                      opacity={0.7}
                    />
                  </>
                )}
              </g>
            ))}

            {/* Cross-axis guides (full) */}
            <line
              x1={CENTER}
              y1={CENTER - RAY_OUTER}
              x2={CENTER}
              y2={CENTER + RAY_OUTER}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth={1}
              aria-hidden
            />
            <line
              x1={CENTER - RAY_OUTER}
              y1={CENTER}
              x2={CENTER + RAY_OUTER}
              y2={CENTER}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth={1}
              aria-hidden
            />

            {SYSTEM_NODES.map((node) => {
              const inner = polar(node.angle, RAY_INNER);
              const outer = polar(node.angle, RAY_OUTER);
              return (
                <line
                  key={`spoke-${node.id}`}
                  data-gs-spoke={node.id}
                  x1={inner.x}
                  y1={inner.y}
                  x2={outer.x}
                  y2={outer.y}
                  stroke="rgba(8,8,8,0.38)"
                  strokeWidth={1.2}
                  suppressHydrationWarning
                />
              );
            })}

            {SYSTEM_NODES.map((node) => {
              const start = polar(node.angle, RAY_OUTER - 10);
              return (
                <circle
                  key={`packet-${node.id}`}
                  data-gs-packet={node.id}
                  cx={start.x}
                  cy={start.y}
                  r={3}
                  fill="#E1261C"
                  filter={`url(#${uid}-glow)`}
                  suppressHydrationWarning
                />
              );
            })}

            {!isCoarse &&
              ORBIT_PARTICLES.map((p) => {
                const pt = polar(p.angle, p.radius);
                return (
                  <g key={p.id} className="gs-orbit-dot" data-gs-orbit={p.id}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={p.size}
                      fill={p.color}
                      opacity={0.85}
                      filter={p.color === "#E1261C" ? `url(#${uid}-glow)` : undefined}
                      suppressHydrationWarning
                    />
                  </g>
                );
              })}
          </g>

          <g ref={coreParallaxRef} data-gs-hub>
            <circle
              data-gs-hub-glow
              cx={CENTER}
              cy={CENTER}
              r={HUB_R + 10}
              fill="none"
              stroke="rgba(225,38,28,0.35)"
              strokeWidth={2}
              filter={`url(#${uid}-glow)`}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={HUB_R + 4}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={HUB_R}
              fill={`url(#${uid}-core)`}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={HUB_R - 14}
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth={1}
            />
            <circle
              cx={CENTER}
              cy={CENTER}
              r={HUB_R - 26}
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth={1}
            />
            <text
              textAnchor="middle"
              fill="#ffffff"
              fontSize={32}
              style={{
                fontFamily: "var(--font-barlow), Barlow Condensed, sans-serif",
                fontWeight: 800,
                letterSpacing: "0.08em",
              }}
            >
              <tspan
                data-gs-hub-text
                x={CENTER}
                y={CENTER - 16}
                dominantBaseline="central"
              >
                GROWTH
              </tspan>
              <tspan
                data-gs-hub-text
                x={CENTER}
                y={CENTER + 18}
                dominantBaseline="central"
              >
                SYSTEM
              </tspan>
            </text>
          </g>

          {SYSTEM_NODES.map((node) => {
            const tip = polar(node.angle, RAY_OUTER);
            const isActive = activeId === node.id;
            return (
              <g key={node.id} data-gs-node-group={node.id}>
                <g
                  className="gs-node-hit"
                  role="button"
                  tabIndex={0}
                  aria-label={node.label}
                  aria-pressed={isActive}
                  onPointerEnter={() => activateNode(node.id)}
                  onPointerLeave={releaseNode}
                  onFocus={() => activateNode(node.id)}
                  onBlur={releaseNode}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      activateNode(node.id);
                    }
                  }}
                >
                  <circle
                    cx={tip.x}
                    cy={tip.y}
                    r={16}
                    fill="transparent"
                    suppressHydrationWarning
                  />
                  <circle
                    data-gs-node-ring={node.id}
                    cx={tip.x}
                    cy={tip.y}
                    r={10}
                    fill="none"
                    stroke="#E1261C"
                    strokeWidth={1.2}
                    opacity={0.55}
                    suppressHydrationWarning
                  />
                  <circle
                    data-gs-node={node.id}
                    cx={tip.x}
                    cy={tip.y}
                    r={5}
                    fill="#E1261C"
                    filter={`url(#${uid}-glow)`}
                    suppressHydrationWarning
                  />
                </g>
                <text
                  data-gs-label={node.id}
                  x={coord(tip.x + node.labelOffset.x)}
                  y={coord(tip.y + node.labelOffset.y)}
                  textAnchor={node.textAnchor}
                  dominantBaseline="middle"
                  fill="#3a3a3a"
                  fontSize={18}
                  fontWeight={isActive ? 800 : 700}
                  style={{
                    fontFamily: "var(--font-barlow), Barlow Condensed, sans-serif",
                    letterSpacing: "0.06em",
                  }}
                  suppressHydrationWarning
                >
                  {node.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
