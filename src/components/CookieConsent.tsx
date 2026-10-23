"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { OPEN_CONSENT_EVENT, readConsent, saveConsent } from "@/lib/consent";

const buttonBase =
  "inline-flex min-h-11 items-center justify-center rounded-full px-6 text-xs font-bold tracking-[0.12em] uppercase transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

/**
 * First-visit cookie banner. Analytics and marketing stay off (Consent Mode "denied") until the visitor chooses;
 * the choice is stored so the banner doesn't return, and "Cookie settings" in the footer reopens it.
 */
export default function CookieConsent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Read on the client after mount so server and client markup match.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!readConsent()) setOpen(true);

    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
  }, []);

  function choose(accepted: boolean) {
    saveConsent({ analytics: accepted, marketing: accepted });
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-3xl rounded-2xl bg-ink p-5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] sm:bottom-5 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <div className="min-w-0">
          <p className="m-0 font-display text-sm font-bold tracking-[0.14em] uppercase">Cookies on this site</p>
          <p className="text-body-sm mt-2 mb-0 text-white/80">
            We use cookies to understand how the site is used and to measure our campaigns. They stay off unless you
            accept. Read our{" "}
            <Link
              href="/cookie-policy"
              className="text-white underline underline-offset-2 hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Cookie Policy
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-none flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => choose(false)}
            className={`${buttonBase} border border-white/50 text-white hover:border-white hover:bg-white/10`}
          >
            Reject
          </button>
          <button
            type="button"
            onClick={() => choose(true)}
            className={`${buttonBase} bg-red text-white hover:bg-white hover:text-ink`}
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
