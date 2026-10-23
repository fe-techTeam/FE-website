import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { aboutLocations } from "@/content/about";

export default function LocationsSection() {
  return (
    <section
      id="locations"
      data-animate-section
      className="section-shell section-pad bg-paper"
      aria-labelledby="locations-heading"
    >
      <div className="section-inner grid grid-cols-1 items-start gap-7 sm:gap-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.8fr)] lg:gap-10">
        <div data-animate="fade-up" className="min-w-0 lg:pt-1">
          <p className="text-eyebrow m-0">Our offices</p>
          <h2 id="locations-heading" className="text-display-md mt-4 mb-0 sm:mt-5">
            Where we <span className="text-red">operate.</span>
          </h2>
          <Link href="/contact#offices" className="text-cta link-cta text-ink">
            View all locations
            <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <ul
          data-animate-stagger
          className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:gap-4 lg:grid-cols-4"
        >
          {aboutLocations.map((office) => (
            <li key={office.slug} className="min-w-0">
              <Link
                href="/contact#offices"
                aria-label={`${office.city}${office.isHq ? " headquarters" : ""} — ${office.description}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white transition-[border-color,box-shadow] duration-200 hover:border-ink focus-visible:border-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
              >
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-3.5 py-6 text-center sm:gap-3.5 sm:px-4 sm:py-7 lg:px-5 lg:py-8">
                  <span
                    className="grid h-9 w-9 flex-none place-items-center rounded-full border border-red bg-white text-red sm:h-10 sm:w-10"
                    aria-hidden
                  >
                    <MapPin size={16} fill="currentColor" strokeWidth={0} />
                  </span>
                  <p className="m-0 flex min-w-0 flex-wrap items-baseline justify-center gap-x-1.5 gap-y-0.5 text-balance font-display text-base leading-[1.15] font-bold tracking-[0.04em] uppercase sm:text-lg lg:text-xl">
                    <span className="min-w-0">{office.city}</span>
                    {office.isHq ? (
                      <span className="shrink-0 text-xs tracking-[0.12em] text-red sm:text-sm">HQ</span>
                    ) : null}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
