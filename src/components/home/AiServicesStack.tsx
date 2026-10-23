"use client";

import { useRef, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { serviceOfferingIconBySlug } from "@/components/serviceOfferingIcons";
import { serviceOfferings, type ServiceOffering } from "@/content/serviceOfferings";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const ACCENTS = [
  { bg: "bg-red/10", text: "text-red" },
  { bg: "bg-violet-100", text: "text-violet-600" },
  { bg: "bg-emerald-100", text: "text-emerald-600" },
  { bg: "bg-rose-100", text: "text-rose-600" },
  { bg: "bg-amber-100", text: "text-amber-600" },
  { bg: "bg-sky-100", text: "text-sky-600" },
  { bg: "bg-fuchsia-100", text: "text-fuchsia-600" },
  { bg: "bg-purple-100", text: "text-purple-600" },
] as const;

// AI is the hub of the diagram, but AI Solutions is still a service — it gets its own card so the
// stack lists exactly what the nav and footer list.
const stackServices = serviceOfferings;

const pad = (n: number) => String(n).padStart(2, "0");

function StackCard({
  service,
  accent,
  index,
}: {
  service: ServiceOffering;
  accent: (typeof ACCENTS)[number];
  index: number;
}) {
  const Icon = serviceOfferingIconBySlug[service.slug];

  return (
    <li
      data-stack-card
      className="ai-stack__card min-w-0"
      style={{ "--i": index } as CSSProperties}
    >
      <Link
        href={service.href}
        className="ai-stack__card-link group overflow-hidden rounded-[22px] border border-[#e6e6e6] bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-colors duration-200 hover:border-red/35 focus-visible:border-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:rounded-[26px] sm:p-7"
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-full sm:h-16 sm:w-16 ${accent.bg} ${accent.text}`}
          >
            {Icon ? <Icon size={30} aria-hidden className="h-7 w-7 sm:h-8 sm:w-8" /> : null}
          </span>
          <span className="font-display text-sm font-bold tracking-[0.2em] text-ink">
            {pad(index + 1)}
            <span className="text-muted"> / {pad(stackServices.length)}</span>
          </span>
        </div>

        <div className="mt-5 flex flex-1 flex-col sm:mt-6">
          <h3 className="m-0 font-display text-[1.375rem] leading-[1.1] font-bold tracking-[0.02em] text-ink uppercase sm:text-[1.75rem]">
            {service.name}
          </h3>
          <p className="text-body mt-3 mb-0 max-w-[30rem] text-muted">{service.description}</p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <span className="text-cta text-ink transition-colors duration-200 group-hover:text-red">
            Explore service
          </span>
          <span
            className="grid h-11 w-11 place-items-center rounded-full border border-red bg-white text-red transition duration-200 group-hover:bg-red group-hover:text-white"
            aria-hidden
          >
            <ArrowRight size={15} strokeWidth={2.25} />
          </span>
        </div>
      </Link>
    </li>
  );
}

export default function AiServicesStack() {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const track = root?.querySelector<HTMLElement>(".ai-stack__cards");
      if (!root || !track) return;

      const cards = gsap.utils.toArray<HTMLElement>("[data-stack-card]", root);
      const links = cards.map((card) => card.querySelector<HTMLElement>(".ai-stack__card-link")!);
      const dots = gsap.utils.toArray<HTMLButtonElement>("[data-stack-dot]", root);
      const ring = root.querySelector<HTMLElement>("[data-stack-ring]");
      const bar = root.querySelector<HTMLElement>("[data-stack-bar]");
      const counter = root.querySelector<HTMLElement>("[data-stack-counter]");
      const last = cards.length - 1;
      if (last < 1) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // The card list becomes a compact inner scroller of sticky cards (see ai-stack.css);
        // the mouse wheel scrolls it while the page keeps its normal height.
        root.classList.add("is-stacking");
        track.tabIndex = 0;
        track.setAttribute("role", "region");
        track.setAttribute("aria-label", "Services — scroll to browse");

        let active = -1;
        const setActive = (index: number) => {
          if (index === active) return;
          active = index;
          // Cards already covered by a newer one shouldn't be tabbable.
          cards.forEach((card, i) => card.toggleAttribute("inert", i < index));
          dots.forEach((dot, i) => {
            dot.dataset.active = String(i === index);
          });
          if (counter) counter.textContent = `${pad(index + 1)} / ${pad(cards.length)}`;
        };

        // How far each card has slid over the previous one (0 = still below, 1 = seated).
        const update = () => {
          let total = 0;
          const trackTop = track.getBoundingClientRect().top;
          const arrived = cards.map((card, k) => {
            if (k === 0) return 0;
            const stick = parseFloat(getComputedStyle(card).top) || 0;
            const a = gsap.utils.clamp(
              0,
              1,
              1 - (card.getBoundingClientRect().top - (trackTop + stick)) / card.offsetHeight,
            );
            total += a;
            return a;
          });

          links.forEach((link, j) => {
            let depth = 0;
            for (let k = j + 1; k <= last; k += 1) depth += arrived[k]!;
            // Only three edges peek out; cards beyond that sit exactly under the front one.
            const cap = 3 - Math.min(j, 3);
            gsap.set(link, { scale: 1 - Math.min(depth, cap) * 0.045 });
          });

          setActive(Math.round(total));
          if (bar) gsap.set(bar, { scaleX: total / last, transformOrigin: "0% 50%" });
          if (ring) gsap.set(ring, { rotation: (total / last) * 360 });
        };

        update();
        // Scroll position of the inner list (not the page) drives everything.
        ScrollTrigger.create({
          scroller: track,
          start: 0,
          end: "max",
          onUpdate: update,
          onRefresh: update,
        });

        const cleanups = dots.map((dot, i) => {
          const onClick = () => {
            const stick = parseFloat(getComputedStyle(cards[i]!).top) || 0;
            const step = cards[0]!.offsetHeight + (parseFloat(getComputedStyle(track).rowGap) || 0);
            track.scrollTo({ top: i * step - stick, behavior: "smooth" });
          };
          dot.addEventListener("click", onClick);
          return () => dot.removeEventListener("click", onClick);
        });

        return () => {
          cleanups.forEach((off) => off());
          cards.forEach((card) => card.removeAttribute("inert"));
          gsap.set([...links, bar, ring].filter(Boolean), { clearProps: "transform" });
          track.removeAttribute("tabindex");
          track.removeAttribute("role");
          track.removeAttribute("aria-label");
          root.classList.remove("is-stacking");
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="ai-stack">
      <div className="ai-stack__hub-col">
        <div className="ai-stack__hub relative grid aspect-square place-items-center rounded-full bg-gradient-to-br from-[#ef3a3a] via-red to-[#7a0e0e] text-center text-white shadow-[0_20px_50px_rgba(210,37,37,0.4)]">
          <span
            data-stack-ring
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-full border border-dashed border-red/45"
          >
            <span className="absolute -top-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-red" />
          </span>
          <div className="absolute inset-2 rounded-full border border-white/25 sm:inset-3" aria-hidden />
          <div>
            <p className="m-0 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">AI</p>
            <p className="mt-1 mb-0 text-[10px] font-bold uppercase tracking-[0.25em] text-white/85 sm:text-xs">
              At the core
            </p>
            <p className="mt-1 mb-0 text-xl leading-none font-light sm:mt-2 sm:text-2xl" aria-hidden>
              &#8734;
            </p>
          </div>
        </div>

        <div className="ai-stack__progress">
          <p
            data-stack-counter
            className="m-0 font-display text-sm font-bold tracking-[0.2em] text-ink lg:text-center"
          >
            {pad(1)} / {pad(stackServices.length)}
          </p>
          <div className="h-[3px] w-full overflow-hidden rounded-full bg-black/10" aria-hidden>
            <span data-stack-bar className="block h-full w-full bg-red" />
          </div>
          {/* Phones swipe the list; the dots (24px hit areas) appear from tablet up. */}
          <ul className="m-0 hidden list-none flex-wrap p-0 sm:flex lg:justify-center">
            {stackServices.map((service, i) => (
              <li key={service.slug}>
                <button
                  type="button"
                  data-stack-dot
                  data-active={i === 0}
                  aria-label={`Show ${service.name}`}
                  className="group grid h-6 w-6 cursor-pointer place-items-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-red"
                >
                  <span className="block h-2.5 w-2.5 rounded-full bg-black/15 transition duration-200 group-hover:bg-red/60 group-data-[active=true]:scale-125 group-data-[active=true]:bg-red" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ul className="ai-stack__cards">
        {stackServices.map((service, i) => (
          <StackCard
            key={service.slug}
            service={service}
            accent={ACCENTS[i % ACCENTS.length]!}
            index={i}
          />
        ))}
      </ul>
    </div>
  );
}
