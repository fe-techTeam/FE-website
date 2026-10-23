"use client";

import { useRef } from "react";
import { Clock, Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import PageHero from "@/components/PageHero";
import RotatingWord from "@/components/RotatingWord";
import ContactForm from "@/components/contact/ContactForm";
import { usePageReveal } from "@/hooks/usePageReveal";
import {
  contactFormCopy,
  contactHero,
  contactOffices,
  contactOfficesCopy,
  contactTouch,
} from "@/content/contact";

const touchIcons: Record<(typeof contactTouch.items)[number]["icon"], LucideIcon> = {
  phone: Phone,
  email: Mail,
  hours: Clock,
};

export default function ContactPage() {
  const rootRef = useRef<HTMLDivElement>(null);

  usePageReveal({ scope: rootRef });

  return (
    <div ref={rootRef}>
      <PageHero
        headingId="contact-hero-heading"
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]}
        breadcrumbCurrentClassName="text-ink"
        titleClassName="text-display-xl mt-4 mb-0 text-balance"
        titleAriaLabel="Let’s discuss your next move"
        title={
          <>
            {contactHero.headlineBefore}
            <br className="hidden xs:block" />
            <span className="xs:hidden"> </span>
            <RotatingWord words={contactHero.headlineAccentWords} className="text-red" />
          </>
        }
        media={null}
        showMediaRule={false}
        gridClassName="grid grid-cols-1"
        copyColumnClassName="relative z-[1] mx-auto flex max-w-5xl min-w-0 flex-col items-center text-center"
        burstSrc={contactHero.burst}
        burstClassName="hidden"
      />

      <section
        id="contact-form"
        data-animate-section
        className="section-shell section-pad bg-white"
        aria-label="Send a message and get in touch"
      >
        <div className="section-inner grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.85fr)] lg:gap-16 xl:gap-20">
          <div className="min-w-0" aria-labelledby="contact-form-heading">
            <SectionMark id="contact-form-heading" title={contactFormCopy.title} />
            <div data-animate="fade-up" className="mt-8 sm:mt-10">
              <ContactForm />
            </div>
          </div>

          <aside className="min-w-0" aria-labelledby="contact-touch-heading">
            <SectionMark id="contact-touch-heading" title={contactTouch.title} />
            <ul data-animate-stagger className="mt-8 m-0 flex list-none flex-col gap-7 p-0 sm:mt-10 sm:gap-8">
              {contactTouch.items.map((item) => {
                const Icon = touchIcons[item.icon];
                return (
                  <li key={item.label} className="flex items-start gap-4">
                    <span
                      className="grid h-12 w-12 flex-none place-items-center rounded-full bg-ink text-white"
                      aria-hidden
                    >
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <div className="min-w-0 pt-0.5">
                      <p className="m-0 font-display text-xs font-bold tracking-[0.14em] text-muted uppercase">
                        {item.label}
                      </p>
                      {"href" in item && item.href ? (
                        <a
                          href={item.href}
                          className="text-body mt-1 inline-flex min-h-11 items-center break-words text-ink transition hover:text-red focus-visible:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-body mt-1 mb-0 text-ink">{item.value}</p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </aside>
        </div>
      </section>

      <section
        id="offices"
        data-animate-section
        className="section-shell section-pad scroll-mt-[5.5rem] bg-mist"
        aria-labelledby="contact-offices-heading"
      >
        <div className="section-inner">
          <h2
            data-animate="fade-up"
            id="contact-offices-heading"
            className="text-display-md m-0"
          >
            {contactOfficesCopy.title}
          </h2>

          <ul
            data-animate-stagger
            className="mt-8 grid list-none grid-cols-1 gap-3 p-0 xs:grid-cols-2 lg:mt-10 lg:grid-cols-4"
          >
            {contactOffices.map((office) => (
              <li key={office.slug} className="min-w-0">
                <article
                  aria-label={`First Economy ${office.city}${office.isHq ? " headquarters" : " office"} — ${office.address}`}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-white"
                >
                  <div className="flex flex-1 items-start gap-3 px-3.5 py-3.5 sm:gap-3.5 sm:px-4 sm:py-4 lg:px-5 lg:py-[18px]">
                    <span
                      className="grid h-9 w-9 flex-none place-items-center rounded-full border border-red bg-white text-red sm:h-10 sm:w-10"
                      aria-hidden
                    >
                      <MapPin size={16} fill="currentColor" strokeWidth={0} />
                    </span>
                    <div className="min-w-0 text-left">
                      <p className="m-0 font-display text-sm leading-[1.1] font-bold tracking-[0.04em] uppercase sm:text-[15px]">
                        {office.city}
                        {office.isHq ? (
                          <span className="ml-1.5 text-xs tracking-[0.1em] text-red">HQ</span>
                        ) : null}
                      </p>
                      <p className="text-body-sm mt-1.5 mb-0 break-words leading-snug text-muted">
                        {office.address}
                      </p>
                      {"contact" in office && office.contact ? (
                        <div className="mt-3 space-y-1">
                          <p className="m-0 text-xs font-semibold tracking-[0.04em] text-ink">
                            {office.contact.name}
                          </p>
                          <p className="m-0">
                            <a
                              href={`mailto:${office.contact.email}`}
                              className="text-body-sm break-all text-muted transition hover:text-red"
                            >
                              {office.contact.email}
                            </a>
                          </p>
                          <p className="m-0">
                            <a
                              href={office.contact.phoneHref}
                              className="text-body-sm text-muted transition hover:text-red"
                            >
                              {office.contact.phone}
                            </a>
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function SectionMark({ id, title }: { id: string; title: string }) {
  return (
    <div data-animate="fade-up">
      <span className="mb-3 block h-[3px] w-10 bg-red" aria-hidden />
      <h2 id={id} className="m-0 font-display text-xl tracking-[0.06em] uppercase sm:text-2xl">
        {title}
      </h2>
    </div>
  );
}
