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

const caseItems = caseStudiesForService("creative");
const impactStats = impactStatsForService("creative");

export const creativePage: ServicePageContent = {
  slug: "creative",
  name: "Creative Solutions",
  seoTitle: "Performance Creative Agency in India",
  summary:
    "Campaign and performance creative across formats — from static and motion to retail and social-first storytelling.",
  hero: {
    eyebrow: "Service",
    headlineBefore: "Creative",
    headlineAccent: "Solutions.",
    body: "Campaign and performance creative across formats — from static and motion to retail and social-first storytelling — built to perform, not just look good.",
    visual: {
      alt: "Creative design and campaign artwork",
      label: "Creative solutions hero",
      fit: "cover",
    } satisfies MediaSlot,
    burst: SERVICE_HERO_BURST,
    arrow: SERVICE_HERO_ARROW,
    highlights: [
      { id: "campaign", label: "Campaign Creative", icon: placeholderIcon("Campaign creative icon") },
      { id: "performance", label: "Performance Creative", icon: placeholderIcon("Performance creative icon") },
      { id: "social", label: "Social-First", icon: placeholderIcon("Social-first icon") },
      { id: "adaptation", label: "Rapid Adaptation", icon: placeholderIcon("Rapid adaptation icon") },
    ],
  },
  process: {
    eyebrow: "Our Capabilities",
    title: "End-to-End Creative Excellence.",
    body: "From brief to optimisation — creative engineered for brand, performance and every format that matters.",
    steps: [
      {
        number: "01",
        id: "brief",
        title: "Brief",
        body: "Align on audience, offer and the job each asset must do.",
        icon: { ...processIcons.discover, label: "Brief" },
      },
      {
        number: "02",
        id: "concept",
        title: "Concept",
        body: "Ideas and routes built for distinctiveness and response.",
        icon: { ...processIcons.strategize, label: "Concept" },
      },
      {
        number: "03",
        id: "design",
        title: "Design",
        body: "Static, motion and multi-format execution with brand craft.",
        icon: { ...processIcons.build, label: "Design" },
      },
      {
        number: "04",
        id: "adapt",
        title: "Adapt",
        body: "Resize and reframe for every channel without losing the idea.",
        icon: { ...processIcons.launch, label: "Adapt" },
      },
      {
        number: "05",
        id: "optimise",
        title: "Optimise",
        body: "Iterate on winners using performance signals and learning.",
        icon: { ...processIcons.optimize, label: "Optimise" },
      },
    ],
  },
  why: {
    eyebrow: "Why First Economy",
    titleBefore: "Creative Built to",
    titleAccent: "Perform",
    body: "We make creative that works in culture and in the auction — brand systems and performance assets from one team.",
    button: { label: "Let’s talk", href: "/contact" },
    valueCards: [
      {
        id: "brand-performance",
        title: "Brand + Performance",
        body: "Campaign craft and conversion creative designed together.",
        icon: placeholderIcon("Brand performance icon"),
      },
      {
        id: "format-fluent",
        title: "Format Fluent",
        body: "Static, motion, retail and social-first storytelling.",
        icon: placeholderIcon("Format fluent icon"),
      },
      {
        id: "systems",
        title: "Brand Systems",
        body: "Visual languages that stay consistent as campaigns scale.",
        icon: placeholderIcon("Brand systems icon"),
      },
      {
        id: "speed",
        title: "Adaptation Speed",
        body: "Rapid creative variants for testing and always-on delivery.",
        icon: placeholderIcon("Adaptation speed icon"),
      },
      {
        id: "retail",
        title: "Retail Ready",
        body: "In-store and marketplace creative that converts in context.",
        icon: placeholderIcon("Retail ready icon"),
      },
      {
        id: "learning",
        title: "Learning Loops",
        body: "Creative decisions informed by what actually performs.",
        icon: placeholderIcon("Learning loops icon"),
      },
    ],
  },
  framework: {
    eyebrow: "Our Process",
    title: "A Full Creative System",
    body: "Creative that covers brand, performance, social and retail — as one connected practice.",
    stages: [
      { id: "brand", title: "Brand", body: "Distinctive campaign platforms.", icon: placeholderIcon("Brand icon") },
      { id: "performance", title: "Performance", body: "Assets built to convert.", icon: placeholderIcon("Performance icon") },
      { id: "social", title: "Social", body: "Native storytelling for feeds.", icon: placeholderIcon("Social icon") },
      { id: "retail", title: "Retail", body: "Creative that sells in context.", icon: placeholderIcon("Retail icon") },
    ],
  },
  ...(caseItems.length
    ? {
        caseStudies: {
          eyebrow: "Featured Case Studies",
          titleBefore: "Creative That",
          titleAccent: "Works.",
          body: "Campaign and performance creative that moved brands and metrics.",
          exploreLabel: "View all case studies",
          exploreHref: "/work?service=creative",
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
    body: "Let’s build campaign and performance creative across every format that matters.",
    button: { label: "Let’s talk", href: "/contact" },
  },
};
