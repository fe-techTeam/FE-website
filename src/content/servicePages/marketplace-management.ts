import type { MediaSlot } from "@/content/about";
import {
  SERVICE_HERO_ARROW,
  SERVICE_HERO_BURST,
  caseStudiesForService,
  impactStatsForService,
  placeholderIcon,
  processIcons,
} from "@/content/servicePages/shared";
import type { ServicePageContent } from "@/content/servicePages/types";

const caseItems = caseStudiesForService("marketplace-management");
const impactStats = impactStatsForService("marketplace-management");

export const marketplaceManagementPage: ServicePageContent = {
  slug: "marketplace-management",
  name: "Marketplace Management",
  seoTitle: "E-commerce Marketplace Management in India",
  summary:
    "End-to-end management of brand presence on e-commerce marketplaces — listings, catalogue, store optimisation and promotion.",
  hero: {
    eyebrow: "Service",
    headlineBefore: "Marketplace",
    headlineAccent: "Management.",
    body: "End-to-end brand presence on e-commerce marketplaces — listings, catalogue, store optimisation and promotion — managed as a growth channel.",
    visual: {
      alt: "E-commerce marketplace and retail media",
      label: "Marketplace management hero",
      fit: "cover",
    } satisfies MediaSlot,
    burst: SERVICE_HERO_BURST,
    arrow: SERVICE_HERO_ARROW,
    highlights: [
      { id: "listings", label: "Listing Excellence", icon: placeholderIcon("Listing excellence icon") },
      { id: "catalogue", label: "Catalogue Ops", icon: placeholderIcon("Catalogue ops icon") },
      { id: "store", label: "Store Optimisation", icon: placeholderIcon("Store optimisation icon") },
      { id: "retail-media", label: "Retail Media", icon: placeholderIcon("Retail media icon") },
    ],
  },
  process: {
    eyebrow: "Our Capabilities",
    title: "End-to-End Marketplace Excellence.",
    body: "From audit to reporting — every stage of marketplace presence managed for visibility, conversion and growth.",
    steps: [
      {
        number: "01",
        id: "audit",
        title: "Audit",
        body: "Assess listing health, share of shelf and competitive gaps.",
        icon: { ...processIcons.discover, label: "Audit" },
      },
      {
        number: "02",
        id: "catalogue",
        title: "Catalogue",
        body: "Structure products, content and attributes for discoverability.",
        icon: { ...processIcons.strategize, label: "Catalogue" },
      },
      {
        number: "03",
        id: "optimise",
        title: "Optimise",
        body: "Improve stores, content and conversion paths continuously.",
        icon: { ...processIcons.build, label: "Optimise" },
      },
      {
        number: "04",
        id: "promote",
        title: "Promote",
        body: "Activate marketplace media and promotions that drive sales.",
        icon: { ...processIcons.launch, label: "Promote" },
      },
      {
        number: "05",
        id: "report",
        title: "Report",
        body: "Transparent reporting on visibility, conversion and revenue.",
        icon: { ...processIcons.optimize, label: "Report" },
      },
    ],
  },
  why: {
    eyebrow: "Why First Economy",
    titleBefore: "Marketplaces as a",
    titleAccent: "Growth Channel",
    body: "We manage marketplace presence like media — measurable, optimised and connected to the wider growth system.",
    button: { label: "Let’s talk", href: "/contact" },
    valueCards: [
      {
        id: "full-funnel",
        title: "Full-Funnel Ops",
        body: "Listings, catalogue, store and media managed as one operating layer.",
        icon: placeholderIcon("Full-funnel ops icon"),
      },
      {
        id: "content-quality",
        title: "Content Quality",
        body: "Product content engineered for search, conversion and brand trust.",
        icon: placeholderIcon("Content quality icon"),
      },
      {
        id: "retail-media",
        title: "Retail Media",
        body: "Marketplace media planned against real commercial outcomes.",
        icon: placeholderIcon("Retail media icon"),
      },
      {
        id: "always-on",
        title: "Always-On",
        body: "Continuous optimisation — not set-and-forget storefronts.",
        icon: placeholderIcon("Always-on icon"),
      },
      {
        id: "multi-platform",
        title: "Multi-Platform",
        body: "Presence managed across the marketplaces that matter to your category.",
        icon: placeholderIcon("Multi-platform icon"),
      },
      {
        id: "transparent",
        title: "Transparent Reporting",
        body: "Clear visibility into what is working and what needs to move.",
        icon: placeholderIcon("Transparent reporting icon"),
      },
    ],
  },
  framework: {
    eyebrow: "Our Process",
    title: "A Full Marketplace Engine",
    body: "From first discoverability to repeat purchase — marketplace managed for commercial growth.",
    stages: [
      { id: "visibility", title: "Visibility", body: "Get found in search and browse.", icon: placeholderIcon("Visibility icon") },
      { id: "conversion", title: "Conversion", body: "Turn visits into orders.", icon: placeholderIcon("Conversion icon") },
      { id: "retention", title: "Retention", body: "Keep buyers coming back.", icon: placeholderIcon("Retention icon") },
      { id: "scale", title: "Scale", body: "Grow share of shelf and revenue.", icon: placeholderIcon("Scale icon") },
    ],
  },
  ...(caseItems.length
    ? {
        caseStudies: {
          eyebrow: "Featured Case Studies",
          titleBefore: "Marketplaces That",
          titleAccent: "Convert.",
          body: "Marketplace programmes where presence, content and promotion drove growth.",
          exploreLabel: "View all case studies",
          exploreHref: "/work",
          items: caseItems,
        },
      }
    : {}),
  ...(impactStats.length
    ? {
        impact: {
          eyebrow: "Impact That Matters",
          titleBefore: "Real Numbers.",
          titleAccent: "Real Impact.",
          stats: impactStats,
        },
      }
    : {}),
  cta: {
    titleBefore: "Got a challenge?",
    titleAccent: "Bring it on.",
    body: "Let’s manage listings, stores and retail media as one connected system.",
    button: { label: "Let’s talk", href: "/contact" },
  },
};
