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

const caseItems = caseStudiesForService("video-production");
const impactStats = impactStatsForService("video-production");

export const videoProductionPage: ServicePageContent = {
  slug: "video-production",
  name: "Video Production",
  seoTitle: "Brand Film & Video Production in India",
  summary:
    "Brand films, social video and campaign production — increasingly accelerated by AI-assisted workflows without losing craft.",
  hero: {
    eyebrow: "Service",
    headlineBefore: "Video",
    headlineAccent: "Production.",
    body: "Brand films, social video and campaign production built for how people actually watch today — craft first, platform-native, and ready to perform.",
    visual: {
      alt: "Video production and film set atmosphere",
      label: "Video production hero",
      fit: "cover",
    } satisfies MediaSlot,
    burst: SERVICE_HERO_BURST,
    arrow: SERVICE_HERO_ARROW,
    highlights: [
      { id: "brand-films", label: "Brand Films", icon: placeholderIcon("Brand films icon") },
      { id: "social-first", label: "Social-First", icon: placeholderIcon("Social-first icon") },
      { id: "motion", label: "Motion & Craft", icon: placeholderIcon("Motion craft icon") },
      { id: "ai-assisted", label: "AI-Assisted", icon: placeholderIcon("AI-assisted icon") },
    ],
  },
  process: {
    eyebrow: "Our Capabilities",
    title: "End-to-End Video Excellence.",
    body: "From the brief to distribution — every stage of production is planned for attention, story and performance across screens.",
    steps: [
      {
        number: "01",
        id: "brand-films-shoots",
        title: "Brand Films & Shoots",
        body: "Narrative-led visuals that define and express the brand universe.",
        icon: { ...processIcons.discover, label: "Brand Films & Shoots" },
      },
      {
        number: "02",
        id: "campaign-films",
        title: "Campaign Films (TVC / DVC)",
        body: "High-impact storytelling built for scale across TV and digital.",
        icon: { ...processIcons.strategize, label: "Campaign Films (TVC / DVC)" },
      },
      {
        number: "03",
        id: "testimonials-explainers",
        title: "Testimonials & Explainers",
        body: "Authentic stories and simplified narratives that build trust.",
        icon: placeholderIcon("Testimonials & Explainers"),
      },
      {
        number: "04",
        id: "3d-animation-cgi",
        title: "3D Animation & CGI",
        body: "Cinematic visualisation of products, spaces, and concepts.",
        icon: placeholderIcon("3D Animation & CGI"),
      },
      {
        number: "05",
        id: "motion-graphics",
        title: "Motion Graphics",
        body: "Design-driven motion for clarity, rhythm, and recall.",
        icon: { ...processIcons.build, label: "Motion Graphics" },
      },
      {
        number: "06",
        id: "a-plus-platform-content",
        title: "A+ Platform Content",
        body: "Performance-ready visuals tailored for marketplaces and feeds.",
        icon: { ...processIcons.optimize, label: "A+ Platform Content" },
      },
      {
        number: "07",
        id: "ai-powered-films",
        title: "AI-Powered Films",
        body: "Next-gen content using AI for speed, scale, and innovation.",
        icon: { ...processIcons.launch, label: "AI-Powered Films" },
      },
    ],
  },
  why: {
    eyebrow: "Why First Economy",
    titleBefore: "Video Built to",
    titleAccent: "Hold Attention",
    body: "We produce for how people watch — short-form, long-form and everything between — without losing brand craft or campaign intent.",
    button: { label: "Let’s talk", href: "/contact" },
    valueCards: [
      {
        id: "story-first",
        title: "Story First",
        body: "Narrative and craft that make people stop scrolling and stay.",
        icon: placeholderIcon("Story first icon"),
      },
      {
        id: "platform-native",
        title: "Platform Native",
        body: "Cuts and formats designed for YouTube, Reels, CTV and paid social.",
        icon: placeholderIcon("Platform native icon"),
      },
      {
        id: "ai-accelerated",
        title: "AI Accelerated",
        body: "AI-assisted scripting, boards and production where it speeds craft — not replaces it.",
        icon: placeholderIcon("AI accelerated icon"),
      },
      {
        id: "campaign-ready",
        title: "Campaign Ready",
        body: "Hero films that cascade into performance and social adaptations.",
        icon: placeholderIcon("Campaign ready icon"),
      },
      {
        id: "end-to-end",
        title: "End-to-End",
        body: "From concept through post and delivery — one accountable team.",
        icon: placeholderIcon("End-to-end icon"),
      },
      {
        id: "proven",
        title: "Proven Work",
        body: "Films and social video that have launched brands and moved metrics.",
        icon: placeholderIcon("Proven work icon"),
      },
    ],
  },
  framework: {
    eyebrow: "Our Process",
    title: "A Full Content Journey",
    body: "Video that works across the journey — from first impression to lasting brand memory.",
    stages: [
      { id: "awareness", title: "Awareness", body: "Stop the scroll and introduce the brand.", icon: placeholderIcon("Awareness icon") },
      { id: "engagement", title: "Engagement", body: "Hold attention with story and craft.", icon: placeholderIcon("Engagement icon") },
      { id: "conversion", title: "Conversion", body: "Drive action with performance cuts.", icon: placeholderIcon("Conversion icon") },
      { id: "loyalty", title: "Loyalty", body: "Keep audiences coming back for more.", icon: placeholderIcon("Loyalty icon") },
    ],
  },
  ...(caseItems.length
    ? {
        caseStudies: {
          eyebrow: "Featured Case Studies",
          titleBefore: "Films That",
          titleAccent: "Deliver.",
          body: "Production work where story, craft and distribution drove measurable outcomes.",
          exploreLabel: "View all case studies",
          exploreHref: "/work?service=video-production",
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
    body: "Let’s build films and social video engineered for attention and outcomes.",
    button: { label: "Let’s talk", href: "/contact" },
  },
};
