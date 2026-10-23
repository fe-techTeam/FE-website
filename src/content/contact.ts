/**
 * Contact page content.
 * Office cards keep the About card layout and use live office addresses.
 */

import type { MediaSlot } from "@/content/about";
import { officeLocations } from "@/content/offices";
import { contactInfo } from "@/content/site";

export const contactHero = {
  eyebrow: "Contact Us",
  headlineBefore: "Let’s Discuss",
  headlineAccentWords: [
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

export const contactInterests = [
  "360° Media Buying",
  "Creative Solutions",
  "Technology",
  "AI Solutions",
  "SEO",
  "Social Media",
  "Influencer Marketing",
  "Video Production",
  "Project Innovation & Branding",
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
