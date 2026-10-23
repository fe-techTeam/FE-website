"use client";

import type { ReactNode } from "react";
import { contactInfo } from "@/content/site";
import { trackEvent } from "@/lib/analytics";

type WhatsAppLinkProps = {
  /** Where the link sits, sent with the event so marketing can compare placements. */
  location: "header" | "footer" | "contact";
  className?: string;
  "aria-label"?: string;
  children: ReactNode;
};

/** Click-to-chat link that records a `whatsapp_click` event on the dataLayer. */
export default function WhatsAppLink({ location, className, children, "aria-label": ariaLabel }: WhatsAppLinkProps) {
  return (
    <a
      href={contactInfo.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className={className}
      onClick={() => trackEvent("whatsapp_click", { location })}
    >
      {children}
    </a>
  );
}
