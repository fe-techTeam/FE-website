import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceOfferingIconBySlug } from "@/components/serviceOfferingIcons";
import { SERVICES_CREATIVE_CARD_ENABLED } from "@/content/features";
import { serviceOfferings as allServiceOfferings, type ServiceOffering } from "@/content/serviceOfferings";

// The cards shown in the grid (the footer and page list still use the full list).
const serviceOfferings = allServiceOfferings.filter(
  (service) => SERVICES_CREATIVE_CARD_ENABLED || service.slug !== "creative",
);

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

const pad = (n: number) => String(n).padStart(2, "0");

function ServiceCard({
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
    <li className="ai-stack__card min-w-0">
      <Link
        href={service.href}
        className="ai-stack__card-link group overflow-hidden rounded-[22px] border border-[#e6e6e6] bg-white p-5 shadow-[0_8px_20px_rgba(0,0,0,0.07)] transition-colors duration-200 hover:border-red/35 focus-visible:border-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:rounded-[26px] sm:p-6"
      >
        <div className="flex items-start justify-between gap-4">
          <span
            className={`grid h-14 w-14 shrink-0 place-items-center rounded-full ${accent.bg} ${accent.text}`}
          >
            {Icon ? <Icon size={30} aria-hidden className="h-7 w-7" /> : null}
          </span>
          <span className="font-display text-sm font-bold tracking-[0.2em] text-ink">
            {pad(index + 1)}
            <span className="text-muted"> / {pad(serviceOfferings.length)}</span>
          </span>
        </div>

        <div className="mt-5 flex flex-1 flex-col">
          <h3 className="m-0 font-display text-[1.375rem] leading-[1.1] font-bold tracking-[0.02em] text-ink uppercase sm:text-[1.5rem]">
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

/** Every service visible at once: the AI hub as the intro, then a plain card grid (no inner scroll box). */
export default function AiServicesStack() {
  return (
    <div className="ai-stack">
      <div data-animate="fade-up" className="ai-stack__hub">
        <div className="relative grid aspect-square place-items-center rounded-full bg-gradient-to-br from-[#ef3a3a] via-red to-[#7a0e0e] text-center text-white shadow-[0_20px_50px_rgba(210,37,37,0.4)]">
          <div className="absolute inset-2 rounded-full border border-white/25 sm:inset-3" aria-hidden />
          <div>
            <p className="m-0 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">AI</p>
            <p className="mt-1 mb-0 text-[10px] font-bold uppercase tracking-[0.25em] text-white/85 sm:text-xs">
              At the core
            </p>
            <p className="mt-1 mb-0 text-xl leading-none font-light sm:text-2xl" aria-hidden>
              &#8734;
            </p>
          </div>
        </div>
        <p className="text-body m-0 max-w-[28rem] text-muted">
          AI sits at the centre of every service below, from strategy and creative to media and technology.
        </p>
      </div>

      {/* data-animate-stagger: the page reveal slides the cards in one after another as the section scrolls in. */}
      <ul data-animate-stagger className="ai-stack__cards">
        {serviceOfferings.map((service, i) => (
          <ServiceCard
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
