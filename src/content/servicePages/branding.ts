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

const caseItems = caseStudiesForService("branding");
const impactStats = impactStatsForService("branding");

export const brandingPage: ServicePageContent = {
  slug: "branding",
  name: "Project Innovation & Branding",
  seoTitle: "Brand Strategy & Identity Agency in India",
  summary:
    "Brand strategy and identity carried all the way through to physical, on-ground experience — not just a logo and a deck.",
  hero: {
    eyebrow: "Service",
    headlineBefore: "Project Innovation &",
    headlineAccent: "Branding.",
    body: "Brand strategy and identity systems that hold up on a screen and on a storefront — carried through to physical, on-ground experience.",
    visual: {
      alt: "Brand identity and environmental design",
      label: "Branding hero",
      fit: "cover",
    } satisfies MediaSlot,
    burst: SERVICE_HERO_BURST,
    arrow: SERVICE_HERO_ARROW,
    highlights: [
      { id: "strategy", label: "Brand Strategy", icon: placeholderIcon("Brand strategy icon") },
      { id: "identity", label: "Identity Systems", icon: placeholderIcon("Identity systems icon") },
      { id: "experience", label: "Experience Design", icon: placeholderIcon("Experience design icon") },
      { id: "launch", label: "Launch Campaigns", icon: placeholderIcon("Launch campaigns icon") },
    ],
  },
  process: {
    eyebrow: "Our Capabilities",
    title: "End-to-End Brand Excellence.",
    body: "From discovery to launch — identity built to work across digital, retail and on-ground environments.",
    steps: [
      {
        number: "01",
        id: "brand-strategy-positioning",
        title: "Brand Strategy & Positioning",
        body: "Defining the brand’s purpose, positioning, and voice to guide all communication.",
        icon: { ...processIcons.strategize, label: "Brand Strategy & Positioning" },
      },
      {
        number: "02",
        id: "visual-identity-design-systems",
        title: "Visual Identity & Design Systems",
        body: "Creating cohesive logos, color palettes, typography, and visual languages.",
        icon: { ...processIcons.build, label: "Visual Identity & Design Systems" },
      },
      {
        number: "03",
        id: "creative-campaign-ideation",
        title: "Creative & Campaign Ideation",
        body: "Developing strong central ideas that power all brand and campaign communication.",
        icon: { ...processIcons.discover, label: "Creative & Campaign Ideation" },
      },
      {
        number: "04",
        id: "integrated-advertising-communication",
        title: "Integrated Advertising Communication",
        body: "Delivering consistent brand messaging across all consumer touchpoints.",
        icon: { ...processIcons.launch, label: "Integrated Advertising Communication" },
      },
      {
        number: "05",
        id: "print-outdoor-advertising",
        title: "Print & Outdoor Advertising (OOH)",
        body: "Designing high-impact creatives that maximise visibility and brand recall.",
        icon: placeholderIcon("Print & Outdoor Advertising (OOH)"),
      },
      {
        number: "06",
        id: "film-video-audio-communication",
        title: "Film, Video & Audio Communication",
        body: "Crafting compelling stories through films and radio-led brand narratives.",
        icon: placeholderIcon("Film, Video & Audio Communication"),
      },
      {
        number: "07",
        id: "end-to-end-creative-management",
        title: "End-to-End Creative Management",
        body: "Managing ideation, execution, and rollout with consistency and quality control.",
        icon: { ...processIcons.optimize, label: "End-to-End Creative Management" },
      },
    ],
  },
  why: {
    eyebrow: "Why First Economy",
    titleBefore: "Identity That Holds",
    titleAccent: "Everywhere",
    body: "We don’t stop at the logo deck — branding is engineered through every touchpoint where people meet the brand.",
    button: { label: "Let’s talk", href: "/contact" },
    valueCards: [
      {
        id: "strategy-led",
        title: "Strategy Led",
        body: "Positioning and platforms grounded in audience and category insight.",
        icon: placeholderIcon("Strategy led icon"),
      },
      {
        id: "system-thinking",
        title: "System Thinking",
        body: "Identity systems that stay coherent across campaigns and channels.",
        icon: placeholderIcon("System thinking icon"),
      },
      {
        id: "physical-digital",
        title: "Physical + Digital",
        body: "From screens to storefronts, packaging and on-ground activations.",
        icon: placeholderIcon("Physical digital icon"),
      },
      {
        id: "launch-ready",
        title: "Launch Ready",
        body: "Brand work wired into media, creative and experience from day one.",
        icon: placeholderIcon("Launch ready icon"),
      },
      {
        id: "innovation",
        title: "Project Innovation",
        body: "Integrated innovation that turns brand ideas into lived experiences.",
        icon: placeholderIcon("Innovation icon"),
      },
      {
        id: "proven",
        title: "Proven Work",
        body: "Citywide launches and identity systems that created lasting recall.",
        icon: placeholderIcon("Proven work icon"),
      },
    ],
  },
  framework: {
    eyebrow: "Our Process",
    title: "A Full Brand System",
    body: "Every layer of the brand — from strategy to activation — connected as one system.",
    stages: [
      { id: "strategy", title: "Strategy", body: "Define where the brand wins.", icon: placeholderIcon("Strategy icon") },
      { id: "identity", title: "Identity", body: "Make it distinctive and ownable.", icon: placeholderIcon("Identity icon") },
      { id: "expression", title: "Expression", body: "Bring it to life across formats.", icon: placeholderIcon("Expression icon") },
      { id: "activation", title: "Activation", body: "Launch it into the market.", icon: placeholderIcon("Activation icon") },
    ],
  },
  ...(caseItems.length
    ? {
        caseStudies: {
          eyebrow: "Featured Case Studies",
          titleBefore: "Brands Built to",
          titleAccent: "Last.",
          body: "Identity and launch work that held up on screen, on street and in culture.",
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
    body: "Let’s shape identity systems that work on screen and on the storefront.",
    button: { label: "Let’s talk", href: "/contact" },
  },
};
