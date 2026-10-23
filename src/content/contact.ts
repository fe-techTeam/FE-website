/**
 * Contact page content.
 * Office cards keep the About card layout and use live office addresses.
 */

import type { MediaSlot } from "@/content/about";
import { officeLocations } from "@/content/offices";
import { serviceOfferings } from "@/content/serviceOfferings";
import { contactInfo } from "@/content/site";

export const contactHero = {
  eyebrow: "Contact Us",
  headlineBefore: "Let’s Discuss",
  // First word is what the server-rendered <h1> reads, so /contact is not described as "Media Buying".
  headlineAccentWords: [
    "Your Next Move",
    "Media Buying",
    "AI",
    "SEO",
    "Strategy",
    "Innovation & Branding",
    "Social Media",
    "Video Production",
    "Tech",
  ],
  body: "Tell us about your challenge and our experts will get back to you within 24 hours.",
  cta: { label: "Send a message", href: "#contact-form" },
  image: {
    src: "/images/contact/hero/team-meeting.jpg",
    alt: "First Economy team in a glass meeting room",
    label: "Contact hero meeting photo",
    grayscale: false,
  } satisfies MediaSlot,
  verticalMark: "CALL  ·  EMAIL  ·  VISIT  ·  PARTNER",
  burst: "/images/about/hero/radial-burst.svg",
  arrow: "/images/about/ui/arrow-right-circle.svg",
};

export const contactFormCopy = {
  title: "Send us a message",
  submit: "Send message",
  successTitle: "Message sent.",
  successBody: "Thank you. Our team will get back to you within 24 working hours.",
};

// Optional lead-qualification choices (audit CRO-04): they help route enquiries and never block a submit.
export const contactBudgets = ["Under ₹5 lakh", "₹5–25 lakh", "₹25 lakh – ₹1 crore", "Above ₹1 crore", "Not sure yet"];
export const contactTimelines = ["As soon as possible", "Within 1–3 months", "In 3+ months", "Just exploring"];

/** Country codes for the phone field; India first since it is the default. */
export const contactCountryCodes = [
  { code: "+91", label: "India (+91)" },
  { code: "+1", label: "US / Canada (+1)" },
  { code: "+44", label: "UK (+44)" },
  { code: "+971", label: "UAE (+971)" },
  { code: "+65", label: "Singapore (+65)" },
  { code: "+61", label: "Australia (+61)" },
  { code: "+49", label: "Germany (+49)" },
  { code: "+966", label: "Saudi Arabia (+966)" },
  { code: "+974", label: "Qatar (+974)" },
  { code: "+977", label: "Nepal (+977)" },
  { code: "+94", label: "Sri Lanka (+94)" },
];

// Service options come from the canonical services list so the form never drifts from the nav, footer and cards.
// Marketplace Management has a page but is not in the public services list, so its enquiry option is kept here.
export const contactInterests = [
  ...serviceOfferings.map((service) => service.name),
  "Marketplace Management",
  "Careers",
  "Partnership",
  "Other",
];

export const contactTouch = {
  title: "Get in touch",
  items: [
    {
      label: "Call us",
      value: contactInfo.phone,
      href: contactInfo.phoneHref,
      icon: "phone" as const,
    },
    {
      label: "WhatsApp us",
      value: "Chat with us now",
      href: contactInfo.whatsappHref,
      icon: "whatsapp" as const,
    },
    {
      label: "Email us",
      value: contactInfo.email,
      href: contactInfo.emailHref,
      icon: "email" as const,
    },
    {
      label: "Business hours",
      value: "Mon - Fri: 10:30 AM – 7:30 PM",
      icon: "hours" as const,
    },
  ],
};

export const contactOfficesCopy = {
  eyebrow: "Our Offices",
  title: "Our Offices",
  body: "Four cities. One mission. Building growth systems that drive real impact.",
};

export const contactOffices = officeLocations.map(({ slug, city, isHq, address, contact }) => ({
  slug,
  city,
  ...(isHq ? { isHq: true as const } : {}),
  address,
  ...(contact ? { contact } : {}),
}));
