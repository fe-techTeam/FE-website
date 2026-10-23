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

const caseItems = caseStudiesForService("influencer-marketing");
const impactStats = impactStatsForService("influencer-marketing");

export const influencerMarketingPage: ServicePageContent = {
  slug: "influencer-marketing",
  name: "Influencer Marketing",
  seoTitle: "Influencer Marketing Agency in India",
  summary:
    "From celebrity collaborations to micro-creator networks, built for scale, authenticity and measurable amplification.",
  hero: {
    eyebrow: "Service",
    headlineBefore: "Influencer",
    headlineAccent: "Marketing.",
    body: "Creator networks built as a system — from celebrity collaborations to micro-creators — engineered for scale, authenticity and measurable amplification.",
    visual: {
      alt: "Creator and influencer marketing collaboration",
      label: "Influencer marketing hero",
      fit: "cover",
    } satisfies MediaSlot,
    burst: SERVICE_HERO_BURST,
    arrow: SERVICE_HERO_ARROW,
    highlights: [
      { id: "strategy", label: "Creator Strategy", icon: placeholderIcon("Creator strategy icon") },
      { id: "networks", label: "Creator Networks", icon: placeholderIcon("Creator networks icon") },
      { id: "ugc", label: "UGC at Scale", icon: placeholderIcon("UGC at scale icon") },
      { id: "amplify", label: "Media Amplification", icon: placeholderIcon("Media amplification icon") },
    ],
  },
  process: {
    eyebrow: "Our Capabilities",
    title: "End-to-End Creator Excellence.",
    body: "From strategy to reporting — every stage of influencer marketing planned for authenticity and measurable reach.",
    steps: [
      {
        number: "01",
        id: "strategy-audience-platform-planning",
        title: "Strategy, Audience & Platform Planning",
        body: "Campaign strategy aligned to business goals, including audience mapping, platform selection, formats, and regional creator cohorts.",
        icon: { ...processIcons.strategize, label: "Strategy, Audience & Platform Planning" },
      },
      {
        number: "02",
        id: "creator-discovery-vetting-budgeting",
        title: "Creator Discovery, Vetting & Budgeting",
        body: "End-to-end creator identification (celebrity to micro), performance vetting, brand-fit checks, and budget-to-impact optimization.",
        icon: { ...processIcons.discover, label: "Creator Discovery, Vetting & Budgeting" },
      },
      {
        number: "03",
        id: "campaign-content-design",
        title: "Campaign & Content Design",
        body: "Conceptualisation, storytelling frameworks, scripts, messaging, and seamless integration of brand mandates and disclosures.",
        icon: { ...processIcons.build, label: "Campaign & Content Design" },
      },
      {
        number: "04",
        id: "creator-production-execution-management",
        title: "Creator, Production & Execution Management",
        body: "Outreach, negotiation, onboarding, timelines, shoot coordination, styling, props, locations, approvals, and platform-specific quality checks.",
        icon: { ...processIcons.launch, label: "Creator, Production & Execution Management" },
      },
      {
        number: "05",
        id: "compliance-rights-brand-safety",
        title: "Compliance, Rights & Brand Safety",
        body: "Platform guidelines, legal alignment, disclosure norms, usage rights, whitelisting, and brand safety controls.",
        icon: placeholderIcon("Compliance, Rights & Brand Safety"),
      },
      {
        number: "06",
        id: "amplification-reporting-optimization",
        title: "Amplification, Reporting & Optimization",
        body: "Paid amplification strategy, asset repurposing across channels, performance tracking, insights, learnings, and optimization recommendations.",
        icon: { ...processIcons.optimize, label: "Amplification, Reporting & Optimization" },
      },
    ],
  },
  why: {
    eyebrow: "Why First Economy",
    titleBefore: "Creators as a",
    titleAccent: "Growth System",
    body: "We treat influencers as a connected system — not one-off activations — so authenticity scales without losing control.",
    button: { label: "Let’s talk", href: "/contact" },
    valueCards: [
      {
        id: "system-scale",
        title: "System at Scale",
        body: "From Guinness-record live moments to always-on micro networks.",
        icon: placeholderIcon("System at scale icon"),
      },
      {
        id: "authentic",
        title: "Authenticity First",
        body: "Creators briefed for real stories — not scripted product dumps.",
        icon: placeholderIcon("Authenticity icon"),
      },
      {
        id: "full-spectrum",
        title: "Full Spectrum",
        body: "Celebrity, macro and micro creators orchestrated for one outcome.",
        icon: placeholderIcon("Full spectrum icon"),
      },
      {
        id: "ugc-engine",
        title: "UGC Engine",
        body: "User-generated content frameworks that compound beyond paid posts.",
        icon: placeholderIcon("UGC engine icon"),
      },
      {
        id: "amplification",
        title: "Media Amplification",
        body: "Creator content boosted with paid media for efficient reach.",
        icon: placeholderIcon("Amplification icon"),
      },
      {
        id: "measurable",
        title: "Measurable Impact",
        body: "Reporting that connects creator activity to brand and business goals.",
        icon: placeholderIcon("Measurable icon"),
      },
    ],
  },
  framework: {
    eyebrow: "Our Process",
    title: "A Full Creator Funnel",
    body: "From first impression to community — creators working every stage of the journey.",
    stages: [
      { id: "awareness", title: "Awareness", body: "Put the brand in culture.", icon: placeholderIcon("Awareness icon") },
      {
        id: "consideration",
        title: "Consideration",
        body: "Build trust through lived creator stories.",
        icon: placeholderIcon("Consideration icon"),
      },
      {
        id: "amplification",
        title: "Amplification",
        body: "Scale winning content with media and seeding.",
        icon: placeholderIcon("Amplification icon"),
      },
      {
        id: "community",
        title: "Community",
        body: "Turn audiences into advocates.",
        icon: placeholderIcon("Community icon"),
      },
    ],
  },
  ...(caseItems.length
    ? {
        caseStudies: {
          eyebrow: "Featured Case Studies",
          titleBefore: "Creators That",
          titleAccent: "Move Culture.",
          body: "Influencer programmes that delivered scale, authenticity and measurable amplification.",
          exploreLabel: "View all case studies",
          exploreHref: "/work?service=influencer-marketing",
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
    body: "Let’s engineer influencer systems for authenticity and measurable growth.",
    button: { label: "Let’s talk", href: "/contact" },
  },
};
