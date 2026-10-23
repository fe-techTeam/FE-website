"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { clientLogos, type PartnerLogo } from "@/content/partners";

gsap.registerPlugin(useGSAP);

const mid = Math.ceil(clientLogos.length / 2);
const rowLeft = clientLogos.slice(0, mid);
const rowRight = clientLogos.slice(mid);

type PartnerLogoFrameProps = {
  partner: PartnerLogo;
  alt: string;
  sizes: string;
  imageClassName?: string;
};

function PartnerLogoFrame({ partner, alt, sizes, imageClassName = "" }: PartnerLogoFrameProps) {
  const box = partner.contentBox;

  if (!box) {
    return (
      <Image
        src={partner.src}
        alt={alt}
        width={partner.width}
        height={partner.height}
        unoptimized
        sizes={sizes}
        className={`h-auto max-h-full w-auto max-w-full object-contain ${imageClassName}`.trim()}
      />
    );
  }

  const [x0, y0, cw, ch] = box;
  const { width: iw, height: ih, src } = partner;

  // SVG viewBox crops to contentBox optically; preserveAspectRatio fills the cell without overflow.
  // Original PNG bytes are unchanged — only display framing.
  return (
    <svg
      viewBox={`${x0} ${y0} ${cw} ${ch}`}
      className={`h-full w-full ${imageClassName}`.trim()}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={alt || undefined}
      aria-hidden={alt === "" ? true : undefined}
    >
      {alt ? <title>{alt}</title> : null}
      <image href={src} width={iw} height={ih} preserveAspectRatio="none" />
    </svg>
  );
}

function LogoItem({ partner, duplicate }: { partner: PartnerLogo; duplicate?: boolean }) {
  return (
    <li
      className="group flex h-20 w-[220px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-line bg-white sm:h-24 sm:w-[250px] md:h-28 md:w-[280px]"
      aria-hidden={duplicate || undefined}
    >
      <span className="flex h-full w-full min-h-0 min-w-0 items-center justify-center px-4 py-3 sm:px-5 sm:py-4">
        <PartnerLogoFrame
          partner={partner}
          alt={duplicate ? "" : `${partner.name} logo`}
          sizes="300px"
          imageClassName="opacity-90 transition duration-300 group-hover:opacity-100"
        />
      </span>
    </li>
  );
}

function GridLogoItem({ partner }: { partner: PartnerLogo }) {
  return (
    <li className="flex h-[7.5rem] items-center justify-center overflow-hidden rounded-xl border border-line bg-white sm:h-[8rem]">
      <span className="flex h-full w-full min-h-0 min-w-0 items-center justify-center p-4 sm:p-5">
        <PartnerLogoFrame
          partner={partner}
          alt={`${partner.name} logo`}
          sizes="(max-width: 640px) 40vw, 220px"
        />
      </span>
    </li>
  );
}

/** About-style logo grid — reusable for client logos, platform partners, etc. */
export function LogoMarkGrid({
  logos,
  className = "m-0 grid list-none grid-cols-2 gap-2.5 p-0 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
}: {
  logos: PartnerLogo[];
  className?: string;
}) {
  return (
    <ul className={className}>
      {logos.map((partner) => (
        <GridLogoItem key={partner.slug} partner={partner} />
      ))}
    </ul>
  );
}

function PartnerLogoGrid() {
  return <LogoMarkGrid logos={clientLogos} />;
}

function MarqueeRow({
  items,
  direction,
}: {
  items: PartnerLogo[];
  direction: "left" | "right";
}) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);

  const copies = 3;

  useGSAP(
    () => {
      const track = trackRef.current;
      const viewport = viewportRef.current;
      if (!track || !viewport) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(track, { x: 0, clearProps: "transform" });
      });

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        let tween: gsap.core.Tween | undefined;
        let lastSetWidth = 0;
        let pending = false;

        // Only actually restart (and snap position) when the measured width
        // has genuinely changed — late image `load` events and incidental
        // resize ticks would otherwise re-trigger this with an unchanged
        // width and yank the track back to its start, jerking the marquee.
        const recalc = () => {
          const setWidth = track.scrollWidth / copies;
          const viewportWidth = viewport.clientWidth;
          if (setWidth < 40 || viewportWidth < 40) return;

          if (tween && Math.abs(setWidth - lastSetWidth) < 1) return;
          lastSetWidth = setWidth;

          tween?.kill();

          const fromX = direction === "right" ? -setWidth : 0;
          const toX = direction === "right" ? 0 : -setWidth;

          gsap.set(track, { x: fromX });
          tween = gsap.to(track, {
            x: toX,
            // Slower crawl (~28px/s instead of ~45px/s) so more logos stay
            // on screen at once during a typical glance at the section.
            duration: Math.max(setWidth / 28, 36),
            ease: "none",
            repeat: -1,
          });
        };

        // Coalesce bursts of triggers (many images loading in quick
        // succession) into a single recalculation per animation frame.
        const requestRecalc = () => {
          if (pending) return;
          pending = true;
          requestAnimationFrame(() => {
            pending = false;
            recalc();
          });
        };

        recalc();

        const ro = new ResizeObserver(() => requestRecalc());
        ro.observe(viewport);
        ro.observe(track);

        const images = track.querySelectorAll("img");
        images.forEach((img) => {
          if (!img.complete) img.addEventListener("load", requestRecalc, { once: true });
        });

        const pause = () => tween?.pause();
        const play = () => tween?.play();
        viewport.addEventListener("pointerenter", pause);
        viewport.addEventListener("pointerleave", play);

        return () => {
          ro.disconnect();
          viewport.removeEventListener("pointerenter", pause);
          viewport.removeEventListener("pointerleave", play);
          tween?.kill();
        };
      });

      return () => mm.revert();
    },
    { dependencies: [direction, items], scope: viewportRef },
  );

  return (
    <div ref={viewportRef} className="w-full overflow-hidden">
      <ul
        ref={trackRef}
        className="flex w-max list-none items-center gap-3 p-0 will-change-transform sm:gap-4"
      >
        {Array.from({ length: copies }, (_, setIndex) =>
          items.map((partner) => (
            <LogoItem
              key={`${setIndex}-${partner.slug}`}
              partner={partner}
              duplicate={setIndex > 0}
            />
          )),
        )}
      </ul>
    </div>
  );
}

type PartnerLogosProps = {
  sectionId?: string;
  layout?: "marquee" | "grid";
};

export default function PartnerLogos({ sectionId = "partners", layout = "marquee" }: PartnerLogosProps) {
  const isAboutGrid = layout === "grid";

  return (
    <section
      id={sectionId}
      className="section-shell section-pad-sm scroll-mt-[5.5rem] bg-mist"
      aria-labelledby="partners-heading"
    >
      <div className="section-inner">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end sm:gap-6">
          <h2 id="partners-heading" className="text-eyebrow m-0">
            Trusted by
          </h2>
          {!isAboutGrid ? (
            <Link href="/about#trusted-by" className="text-cta link-cta text-ink">
              View all partners
              <ArrowRight size={16} aria-hidden />
            </Link>
          ) : null}
        </div>

        {isAboutGrid ? (
          <div className="section-media" aria-label="Partner logos">
            <PartnerLogoGrid />
          </div>
        ) : (
          <div className="section-media flex flex-col gap-2 sm:gap-3" aria-label="Partner logos">
            <ul className="sr-only">
              {clientLogos.map((partner) => (
                <li key={partner.slug}>{partner.name}</li>
              ))}
            </ul>
            <div aria-hidden="true" className="flex flex-col gap-3 sm:gap-4">
              <MarqueeRow items={rowLeft} direction="left" />
              <MarqueeRow items={rowRight} direction="right" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
