"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

type DeviceShowcaseImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

type DeviceShowcaseProps = {
  /** Device frame PNG under /public and its natural pixel size. */
  frameSrc: string;
  frameWidth: number;
  frameHeight: number;
  /** Screen bounds as % of the frame — measure against the frame's own pixels (alpha for a true cutout, color for an opaque screen). */
  screenInset: { top: number; left: number; right: number; bottom: number };
  /** Tailwind arbitrary border-radius value matching the screen's own corner curve, e.g. "1%" or "12%". */
  screenRadius: string;
  /** True when the frame's screen is opaque (phone mockups) and content must paint above it; false for a real transparent cutout (laptop), where content sits behind the frame. */
  contentAboveFrame: boolean;
  /** Virtual viewport the live site renders at before being scaled down to fit the screen — e.g. a 15" laptop or a phone's logical resolution. */
  viewport: { width: number; height: number };
  /** Live site to embed in an iframe — falls back to `images` if it fails or is blocked from framing. */
  liveUrl?: string;
  images: DeviceShowcaseImage[];
  /** Responsive max-width classes for the whole device. */
  maxWidthClassName: string;
  className?: string;
};

/** How long to wait for the live site to signal it loaded before giving up and showing the fallback. */
const LIVE_LOAD_TIMEOUT_MS = 7000;

/** Realistic device mockup with a scrollable "screen" — embeds a live site (rendered at its own reference viewport, then scaled to fit) when possible, otherwise stacks real screenshots to scroll through. */
export default function DeviceShowcase({
  frameSrc,
  frameWidth,
  frameHeight,
  screenInset,
  screenRadius,
  contentAboveFrame,
  viewport,
  liveUrl,
  images,
  maxWidthClassName,
  className = "",
}: DeviceShowcaseProps) {
  const [liveFailed, setLiveFailed] = useState(!liveUrl);
  const [scale, setScale] = useState(0);
  const screenRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!liveUrl) return;
    const timer = window.setTimeout(() => {
      if (!loadedRef.current) setLiveFailed(true);
    }, LIVE_LOAD_TIMEOUT_MS);
    return () => window.clearTimeout(timer);
  }, [liveUrl]);

  useEffect(() => {
    const el = screenRef.current;
    if (!el) return;
    const updateScale = () => setScale(el.clientWidth / viewport.width);
    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);
    return () => observer.disconnect();
  }, [viewport.width]);

  const showLive = Boolean(liveUrl) && !liveFailed;

  const frame = (
    <Image
      src={frameSrc}
      alt=""
      aria-hidden
      width={frameWidth}
      height={frameHeight}
      priority
      className={`pointer-events-none relative block h-auto w-full select-none ${contentAboveFrame ? "z-0" : "z-10"}`}
      sizes="(max-width: 1024px) 90vw, 40rem"
    />
  );

  const screen = (
    <div
      ref={screenRef}
      className={`absolute overflow-hidden bg-ink ${contentAboveFrame ? "z-10" : "z-0"} ${showLive ? "" : "laptop-screen-scroll overflow-y-auto"}`}
      style={{
        top: `${screenInset.top}%`,
        left: `${screenInset.left}%`,
        right: `${screenInset.right}%`,
        bottom: `${screenInset.bottom}%`,
        borderRadius: screenRadius,
      }}
    >
      {liveUrl ? (
        <div
          className={liveFailed ? "hidden" : "block"}
          style={{
            width: viewport.width,
            height: viewport.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          <iframe
            src={liveUrl}
            title={`Live preview of ${liveUrl}`}
            width={viewport.width}
            height={viewport.height}
            className="border-0"
            loading="lazy"
            onLoad={() => {
              loadedRef.current = true;
            }}
            onError={() => setLiveFailed(true)}
          />
        </div>
      ) : null}
      {!showLive
        ? images.map((image) => (
            <Image
              key={image.src}
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="block h-auto w-full"
              sizes="(max-width: 1024px) 65vw, 29rem"
            />
          ))
        : null}
    </div>
  );

  return (
    <div className={`relative mx-auto w-full ${maxWidthClassName} ${className}`}>
      {frame}
      {screen}
    </div>
  );
}
