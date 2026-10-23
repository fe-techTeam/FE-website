import { Plus } from "lucide-react";
import type { ServiceFaqItem } from "@/content/servicePages/types";

/**
 * Native <details> keeps every answer in the server HTML (crawlers and answer engines read it
 * without JS) and stays keyboard accessible. Text here must match the FAQPage JSON-LD, which is
 * built from the same array.
 *
 * `animate` adds the page-reveal data attributes; turn it off on pages whose own scripts hide
 * every `[data-animate]` element they do not manage (the home page).
 */
export default function FaqSection({
  idPrefix,
  titleBefore,
  titleAccent = "Questions, Answered.",
  items,
  animate = true,
  className = "bg-mist",
}: {
  idPrefix: string;
  titleBefore: string;
  titleAccent?: string;
  items: ServiceFaqItem[];
  animate?: boolean;
  className?: string;
}) {
  const headingId = `${idPrefix}-faq-heading`;
  const fade = animate ? ({ "data-animate": "fade-up" } as const) : {};

  return (
    <section
      id={`${idPrefix}-faq`}
      {...(animate ? { "data-animate-section": true } : {})}
      className={`section-shell section-pad ${className} scroll-mt-[5.5rem]`}
      aria-labelledby={headingId}
    >
      <div className="section-inner">
        <p {...fade} className="text-eyebrow m-0">
          FAQ
        </p>
        <div className="section-intro">
          <h2 {...fade} id={headingId} className="text-display-md m-0">
            {titleBefore} <span className="text-red">{titleAccent}</span>
          </h2>
        </div>

        <div {...fade} className="section-media mx-auto w-full max-w-4xl">
          <div className="divide-y divide-ink/15 border-y border-ink/15">
            {items.map((item) => (
              <details key={item.question} className="group py-1">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 marker:hidden [&::-webkit-details-marker]:hidden">
                  <h3 className="text-body m-0 font-semibold text-ink">{item.question}</h3>
                  <Plus
                    size={20}
                    aria-hidden
                    className="mt-0.5 shrink-0 text-red transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="text-body section-copy-on-light m-0 max-w-3xl pb-6">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
