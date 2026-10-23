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

const caseItems = caseStudiesForService("ai-solutions");
const impactStats = impactStatsForService("ai-solutions");

export const aiSolutionsPage: ServicePageContent = {
  slug: "ai-solutions",
  name: "AI Solutions",
  seoTitle: "AI Solutions for Marketing in India",
  summary:
    "AI applied across creative production, analytics and search discoverability — a practical accelerator, not a buzzword.",
  hero: {
    eyebrow: "Service",
    headlineBefore: "AI",
    headlineAccent: "Solutions.",
    body: "AI applied across creative production, analytics and search discoverability — intelligence built into the system, not bolted on.",
    visual: {
      alt: "AI systems and intelligent workflows",
      label: "AI solutions hero",
      fit: "cover",
    } satisfies MediaSlot,
    burst: SERVICE_HERO_BURST,
    arrow: SERVICE_HERO_ARROW,
    highlights: [
      { id: "creative", label: "AI for Creative", icon: placeholderIcon("AI for creative icon") },
      { id: "analytics", label: "AI for Analytics", icon: placeholderIcon("AI for analytics icon") },
      { id: "search", label: "AI for Search", icon: placeholderIcon("AI for search icon") },
      { id: "ops", label: "AI for Operations", icon: placeholderIcon("AI for operations icon") },
    ],
  },
  process: {
    eyebrow: "Our Capabilities",
    title: "End-to-End AI Excellence.",
    body: "From opportunity to governance — AI introduced where it accelerates craft, insight and operations with clear control.",
    steps: [
      {
        number: "01",
        id: "opportunity",
        title: "Opportunity",
        body: "Identify where AI creates real leverage in creative, data or ops.",
        icon: { ...processIcons.discover, label: "Opportunity" },
      },
      {
        number: "02",
        id: "pilot",
        title: "Pilot",
        body: "Prove value quickly with focused experiments and measurable outcomes.",
        icon: { ...processIcons.strategize, label: "Pilot" },
      },
      {
        number: "03",
        id: "integrate",
        title: "Integrate",
        body: "Embed AI into production, analytics and search workflows.",
        icon: { ...processIcons.build, label: "Integrate" },
      },
      {
        number: "04",
        id: "scale",
        title: "Scale",
        body: "Expand what works across teams, brands and markets.",
        icon: { ...processIcons.launch, label: "Scale" },
      },
      {
        number: "05",
        id: "govern",
        title: "Govern",
        body: "Keep quality, brand safety and accountability as capability grows.",
        icon: { ...processIcons.optimize, label: "Govern" },
      },
    ],
  },
  why: {
    eyebrow: "Why First Economy",
    titleBefore: "Intelligence Built",
    titleAccent: "In",
    body: "We apply AI as a practical accelerator across creative, analytics, search and operations — not as a slideware promise.",
    button: { label: "Let’s talk", href: "/contact" },
    valueCards: [
      {
        id: "creative-ai",
        title: "Creative Acceleration",
        body: "Scripting, storyboarding, visuals, motion, voice and music — sped up with craft intact.",
        icon: placeholderIcon("Creative acceleration icon"),
      },
      {
        id: "analytics-ai",
        title: "Decision Support",
        body: "Dashboards and real-time insight that help teams act faster.",
        icon: placeholderIcon("Decision support icon"),
      },
      {
        id: "search-ai",
        title: "AI Search Visibility",
        body: "AEO, GEO and LLM visibility so brands show up in AI answers.",
        icon: placeholderIcon("AI search visibility icon"),
      },
      {
        id: "ops-ai",
        title: "Operational Lift",
        body: "Automation that removes friction from day-to-day delivery.",
        icon: placeholderIcon("Operational lift icon"),
      },
      {
        id: "practical",
        title: "Practical First",
        body: "Pilots tied to outcomes — no AI theatre.",
        icon: placeholderIcon("Practical first icon"),
      },
      {
        id: "governed",
        title: "Governed Scale",
        body: "Quality and brand safety kept in the loop as adoption grows.",
        icon: placeholderIcon("Governed scale icon"),
      },
    ],
  },
  framework: {
    eyebrow: "Our Process",
    title: "A Full AI Application Layer",
    body: "Creative, analytics, search and operations — AI applied where it compounds the growth system.",
    stages: [
      { id: "creative", title: "Creative", body: "Faster production without losing craft.", icon: placeholderIcon("Creative icon") },
      { id: "analytics", title: "Analytics", body: "Insight that supports decisions.", icon: placeholderIcon("Analytics icon") },
      { id: "search", title: "Search", body: "Visibility in AI-era discovery.", icon: placeholderIcon("Search icon") },
      { id: "operations", title: "Operations", body: "Automation that frees the team.", icon: placeholderIcon("Operations icon") },
    ],
  },
  ...(caseItems.length
    ? {
        caseStudies: {
          eyebrow: "Featured Case Studies",
          titleBefore: "AI That",
          titleAccent: "Delivers.",
          body: "Practical AI applied to creative, analytics and discoverability with measurable results.",
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
    body: "Let’s apply intelligence across creative, analytics, search and operations.",
    button: { label: "Let’s talk", href: "/contact" },
  },
};
