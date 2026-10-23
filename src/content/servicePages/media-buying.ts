/**
 * 360° Media Buying service page content.
 * Assets live in /public/images/services/media-buying/ (add when ready).
 */

import type { MediaSlot } from "@/content/about";
import {
  SERVICE_HERO_ARROW,
  SERVICE_HERO_BURST,
  caseStudiesForService,
  placeholderIcon,
  processIcons,
} from "@/content/servicePages/shared";
import type { ServicePageContent } from "@/content/servicePages/types";

const caseItems = caseStudiesForService("media-buying");

export const mediaBuyingPage: ServicePageContent = {
  slug: "media-buying",
  name: "360° Media Buying",
  seoTitle: "360° Media Buying Agency in India",
  summary:
    "Integrated media strategy across search, social, programmatic, OTT and hyperlocal OOH — planned as one system, not separate buys.",
  hero: {
    eyebrow: "Service",
    headlineBefore: "360° Media",
    headlineAccent: "Buying.",
    body: "Data-driven media planning and buying that connects your brand with the right audience at the right moment — across every channel that matters.",
    visual: {
      alt: "City billboards and digital out-of-home media at night",
      label: "Media buying hero — city billboards",
      fit: "cover",
    } satisfies MediaSlot,
    burst: SERVICE_HERO_BURST,
    arrow: SERVICE_HERO_ARROW,
    highlights: [
      { id: "full-funnel", label: "Full-Funnel Coverage", icon: placeholderIcon("Full-funnel coverage icon") },
      { id: "data-led", label: "Data-Led Decisions", icon: placeholderIcon("Data-led decisions icon") },
      { id: "performance", label: "Performance Optimized", icon: placeholderIcon("Performance optimized icon") },
      { id: "omnichannel", label: "Omnichannel Reach", icon: placeholderIcon("Omnichannel reach icon") },
    ],
  },
  process: {
    eyebrow: "Our Capabilities",
    title: "End-to-End Media Excellence.",
    body: "From audience intelligence to transparent reporting — every stage of media is planned, bought and optimized as one connected system.",
    steps: [
      {
        number: "01",
        id: "omnichannel-media-buying",
        title: "Omnichannel Media Buying",
        body: "Integrated planning and buying across online and linear platforms — understanding business challenges across domains and providing solutions.",
        icon: { ...processIcons.launch, label: "Omnichannel Media Buying" },
      },
      {
        number: "02",
        id: "ai-analytics-intelligence",
        title: "AI-Powered Analytics & Intelligence",
        body: "Custom AI-enabled dashboards delivering real-time insights, sharper decision-making, and continuous optimisation.",
        icon: placeholderIcon("AI-Powered Analytics & Intelligence"),
      },
      {
        number: "03",
        id: "full-funnel-growth",
        title: "Full-Funnel Growth Management",
        body: "End-to-end execution from awareness, driving consideration to conversions and performance, lead generation — focused on measurable business outcomes.",
        icon: { ...processIcons.optimize, label: "Full-Funnel Growth Management" },
      },
      {
        number: "04",
        id: "market-competitor-intelligence",
        title: "Strategic Market & Competitor Intelligence",
        body: "Deep market mapping and competitor benchmarking to inform smarter strategies and sustain competitive advantage.",
        icon: { ...processIcons.discover, label: "Strategic Market & Competitor Intelligence" },
      },
      {
        number: "05",
        id: "marketplace-quick-commerce",
        title: "Marketplace & Quick-Commerce Excellence",
        body: "Specialized retail media expertise across Amazon, Flipkart and Quick-Commerce platforms to maximise visibility, conversion efficiency and sales velocity.",
        icon: placeholderIcon("Marketplace & Quick-Commerce Excellence"),
      },
      {
        number: "06",
        id: "performance-creative-automation",
        title: "Performance-First Creative & Automation",
        body: "Conversion-led creative production and automated conversational journeys powered by A/B testing, platform-native optimisation and precision-led execution.",
        icon: { ...processIcons.build, label: "Performance-First Creative & Automation" },
      },
    ],
  },
  caseStudies: {
    eyebrow: "Featured Case Studies",
    titleBefore: "Media That Delivers",
    titleAccent: "Results.",
    body: "Campaigns where integrated media planning drove measurable brand and business outcomes.",
    exploreLabel: "View all case studies",
    exploreHref: "/work?service=media-buying",
    items: caseItems,
  },
  impact: {
    eyebrow: "Impact That Matters",
    titleBefore: "Real Numbers.",
    titleAccent: "Real Impact.",
    stats: [
      { value: "1.204B+", label: "Impressions Delivered" },
      { value: "175M+", label: "People Reached" },
      { value: "54M+", label: "Engagements" },
      { value: "85M+", label: "Video Views" },
      { value: "32%+", label: "Average ROI Improvement" },
    ],
  },
  cta: {
    titleBefore: "Got a challenge?",
    titleAccent: "Bring it on.",
    body: "Let’s connect the right audience with the right message and drive measurable growth.",
    button: { label: "Let’s talk", href: "/contact" },
  },
};
