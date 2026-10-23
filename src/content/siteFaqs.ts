import type { ServiceFaqItem } from "@/content/servicePages/types";
import { companyOfficeScale, homeOfficeStats, networkStats } from "@/content/stats";

/**
 * Home and About FAQs — the single source for the visible accordions and their FAQPage JSON-LD.
 * Same rules as `servicePages/faqs.ts`: answer first, name the brand, and only use figures that
 * exist in the stats/offices/awards/case-study content (no invented claims). Figures are read
 * from `stats.ts` so they cannot drift from the rest of the site.
 */

const years = homeOfficeStats.find((stat) => stat.label === "Years")?.value ?? 12;
const clients = homeOfficeStats.find((stat) => stat.label === "Active Clients")?.value ?? 83;
const agencies = networkStats.find((stat) => stat.label === "Marketing Agencies")?.value ?? 62;
const markets = networkStats.find((stat) => stat.label === "Markets")?.value ?? 85;
const awards = networkStats.find((stat) => stat.label === "Media Awards")?.value ?? 225;
const people = companyOfficeScale.people.value;

export const homeFaqs: ServiceFaqItem[] = [
  {
    question: "What does First Economy do?",
    answer:
      "First Economy is an integrated digital marketing agency in India. It combines 360° media buying, creative, technology, SEO/AEO/GEO, social media, influencer marketing, video production, marketplace management and AI into one growth system, so brands work with one connected team instead of separate vendors.",
  },
  {
    question: "Where is First Economy based?",
    answer:
      "First Economy is headquartered in Mumbai, with offices in Bengaluru, Pune and Chhatrapati Sambhaji Nagar (Aurangabad). The team serves brands from these four cities.",
  },
  {
    question: "How big is First Economy and how long has it been operating?",
    answer: `First Economy has ${people} specialists across four cities, ${years}+ years of experience and ${clients}+ active clients.`,
  },
  {
    question: "Is First Economy part of a larger agency network?",
    answer: `Yes. First Economy is backed by one of the world’s largest independent agency networks: ${agencies}+ marketing agencies across ${markets}+ markets, with ${awards}+ media awards across the network.`,
  },
  {
    question: "What awards has First Economy won?",
    answer:
      "First Economy and Godrej Properties set a Guinness World Record with 1,000+ influencers live in one hour. The work has also been recognised by afaqs, MOBEXX, e4m and DIGIXX, and the wider network has won 225+ media awards.",
  },
  {
    question: "How do I start a project with First Economy?",
    answer:
      "Send your brief through the contact page. First Economy’s experts reply within 24 hours, and the conversation starts with your business challenge rather than a fixed package.",
  },
];

export const aboutFaqs: ServiceFaqItem[] = [
  {
    question: "What is First Economy?",
    answer: `First Economy is an integrated marketing agency headquartered in Mumbai. ${people} specialists across four Indian cities combine media, creative, technology, SEO, social, influencer marketing and AI into one growth system for brands.`,
  },
  {
    question: "Where are First Economy’s offices?",
    answer:
      "Mumbai (headquarters), Bengaluru, Chhatrapati Sambhaji Nagar (Aurangabad) and Pune. Addresses and local contacts are on the contact page.",
  },
  {
    question: "How many people work at First Economy?",
    answer: `${people} specialists, across media, creative, technology and data, in four cities.`,
  },
  {
    question: "What kind of brands does First Economy work with?",
    answer: `First Economy has ${clients}+ active clients. Published case studies include FedEx, Godrej Properties, Jockey, Amazon × Samsung, Adani Airports, Mahindra Manulife, VIP Industries and Waaree, across retail, real estate, financial services, manufacturing and energy.`,
  },
  {
    question: "Is First Economy hiring?",
    answer:
      "Open roles are listed on the careers page, with locations in Mumbai, Bengaluru, Pune and Chhatrapati Sambhaji Nagar. Each role page explains the requirements and has an application form.",
  },
];
