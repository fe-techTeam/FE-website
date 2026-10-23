import type { MediaSlot } from "@/content/about";
import {
  SERVICE_HERO_ARROW,
  SERVICE_HERO_BURST,
  caseStudiesForService,
  placeholderIcon,
  processIcons,
} from "@/content/servicePages/shared";
import type { ServicePageContent } from "@/content/servicePages/types";

const caseItems = caseStudiesForService("seo");

/** Curated for the impact strip — raw case metrics include ranges/phrases that overflow. */
const impactStats = [
  { value: "130%+", label: "Traffic Growth" },
  { value: "20K+", label: "Monthly Visa Leads" },
  { value: "165%", label: "Top 3 Keyword Lift" },
  { value: "87.1K", label: "AI Overview Keywords" },
];

export const seoPage: ServicePageContent = {
  slug: "seo",
  name: "SEO/AEO/GEO",
  seoTitle: "SEO, AEO & GEO Services in India",
  summary:
    "Technical, on-page and local SEO built for how search actually works now — including AI Overviews, AEO and GEO.",
  hero: {
    eyebrow: "Service",
    headlineBefore: "SEO",
    headlineAccent: "Solutions.",
    body: "Technical, on-page and local SEO built for how search works now — including AI Overviews, AEO and GEO — so brands get found by engines and by AI.",
    visual: {
      alt: "Search and SEO analytics",
      label: "SEO solutions hero",
      fit: "cover",
    } satisfies MediaSlot,
    burst: SERVICE_HERO_BURST,
    arrow: SERVICE_HERO_ARROW,
    highlights: [
      { id: "technical", label: "Technical SEO", icon: placeholderIcon("Technical SEO icon") },
      { id: "local", label: "Local SEO", icon: placeholderIcon("Local SEO icon") },
      { id: "content", label: "Search Content", icon: placeholderIcon("Search content icon") },
      { id: "aeo", label: "AEO & GEO", icon: placeholderIcon("AEO GEO icon") },
    ],
  },
  process: {
    eyebrow: "Our Capabilities",
    title: "End-to-End Search Excellence.",
    body: "From audit to measurement — search visibility engineered for classical SEO and the AI era.",
    steps: [
      {
        number: "01",
        id: "audit",
        title: "Audit",
        body: "Uncover technical, content and authority gaps holding visibility back.",
        icon: { ...processIcons.discover, label: "Audit" },
      },
      {
        number: "02",
        id: "strategy",
        title: "Strategy",
        body: "Prioritise keywords, architecture and local opportunities that matter.",
        icon: { ...processIcons.strategize, label: "Strategy" },
      },
      {
        number: "03",
        id: "build",
        title: "Build",
        body: "Fix technical foundations and publish search-ready content systems.",
        icon: { ...processIcons.build, label: "Build" },
      },
      {
        number: "04",
        id: "amplify",
        title: "Amplify",
        body: "Earn authority through digital PR, off-page and local presence.",
        icon: { ...processIcons.launch, label: "Amplify" },
      },
      {
        number: "05",
        id: "measure",
        title: "Measure",
        body: "Track rankings, traffic and AI-era visibility with clear reporting.",
        icon: { ...processIcons.optimize, label: "Measure" },
      },
    ],
  },
  why: {
    eyebrow: "Why First Economy",
    titleBefore: "Built to Be",
    titleAccent: "Found",
    body: "We optimise for search engines and for AI discovery — technical depth, content architecture and local presence as one system.",
    button: { label: "Let’s talk", href: "/contact" },
    valueCards: [
      {
        id: "technical",
        title: "Technical Depth",
        body: "Crawlability, speed and structure fixed at the foundation.",
        icon: placeholderIcon("Technical depth icon"),
      },
      {
        id: "content-arch",
        title: "Content Architecture",
        body: "Internal linking and pages designed around real search intent.",
        icon: placeholderIcon("Content architecture icon"),
      },
      {
        id: "local",
        title: "Local Excellence",
        body: "Google Business Profile and local SEO that drive footfall.",
        icon: placeholderIcon("Local excellence icon"),
      },
      {
        id: "ai-era",
        title: "AI-Era Search",
        body: "AEO, GEO and AI Overview readiness built into the programme.",
        icon: placeholderIcon("AI-era search icon"),
      },
      {
        id: "authority",
        title: "Authority Building",
        body: "Digital PR and off-page work that earns trusted links.",
        icon: placeholderIcon("Authority building icon"),
      },
      {
        id: "measurable",
        title: "Measurable Growth",
        body: "SEO analytics tied to traffic, visibility and business outcomes.",
        icon: placeholderIcon("Measurable growth icon"),
      },
    ],
  },
  framework: {
    eyebrow: "Our Process",
    title: "A Full Search System",
    body: "Technical, on-page, local and AI-era search — connected for durable discoverability.",
    stages: [
      { id: "technical", title: "Technical", body: "Foundations engines can trust.", icon: placeholderIcon("Technical icon") },
      { id: "on-page", title: "On-Page", body: "Content structured for intent.", icon: placeholderIcon("On-page icon") },
      { id: "local", title: "Local", body: "Presence where people search nearby.", icon: placeholderIcon("Local icon") },
      { id: "aeo-geo", title: "AEO / GEO", body: "Visibility in AI answers and maps.", icon: placeholderIcon("AEO GEO icon") },
    ],
  },
  ...(caseItems.length
    ? {
        caseStudies: {
          eyebrow: "Featured Case Studies",
          titleBefore: "Search That",
          titleAccent: "Converts.",
          body: "SEO programmes that improved visibility, traffic and local discovery.",
          exploreLabel: "View all case studies",
          exploreHref: "/work?service=seo",
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
    body: "Let’s build technical, local and AI-era SEO that compounds discoverability.",
    button: { label: "Let’s talk", href: "/contact" },
  },
};
