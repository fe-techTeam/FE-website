import type { Industry } from "@/content/types";

export const industries: Industry[] = [
  {
    slug: "real-estate",
    name: "Real Estate",
    overview:
      "From city-wide launch takeovers to campaigns built around a site’s own character, we help real estate brands turn attention into footfall and sales.",
    clients: ["Godrej Properties"],
    caseStudySlugs: ["godrej-blue", "godrej-greenfront"],
    tone: "campaign",
  },
  {
    slug: "bfsi",
    name: "BFSI & Financial Services",
    overview:
      "Regulated, compliance-heavy and trust-driven — we build the technology, content and awareness systems that financial brands need to grow responsibly.",
    clients: ["Poonawalla Fincorp", "Mahindra Manulife"],
    caseStudySlugs: ["mahindra-manulife"],
    tone: "restrained",
  },
  {
    slug: "consumer-retail",
    name: "Consumer, Retail & E-commerce",
    overview:
      "Category-crowded, always-on and highly competitive — we combine media, creative and marketplace expertise to win attention and conversion.",
    clients: ["VIP Industries", "Amazon", "Samsung", "Cello", "Royale Touché", "Jockey"],
    caseStudySlugs: [
      "vip-industries",
      "cello-kidzbee",
      "amazon-samsung-great-indian-festival",
      "royale-touche-stay-curious",
      "jockey-seo",
    ],
    tone: "fast",
  },
  {
    slug: "travel-hospitality",
    name: "Travel & Hospitality",
    overview:
      "From search-driven booking growth to on-ground brand experience, we help travel and hospitality brands earn trust at every stage of the journey.",
    clients: ["Adani Airports", "Akbar Travels", "The Ambassador Hotel"],
    caseStudySlugs: ["adani-airports-safar-ke-humsafar", "akbar-travels-seo", "ambassador-hotel"],
    tone: "cinematic",
  },
  {
    slug: "healthcare-beauty-wellness",
    name: "Healthcare, Beauty & Wellness",
    overview:
      "Sensitive, high-trust categories that need precise, credible communication — content and campaigns built with care.",
    clients: [],
    caseStudySlugs: [],
    tone: "premium",
  },
  {
    slug: "technology-manufacturing-energy",
    name: "Technology, Manufacturing & Energy",
    overview:
      "Complex B2B and industrial businesses need systems as much as campaigns — we build both, from ERP transformation to integrated brand narratives.",
    clients: ["Orpat", "Waaree"],
    caseStudySlugs: ["orpat-erp", "waaree"],
    tone: "technical",
  },
];
