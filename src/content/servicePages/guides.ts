import type { ServiceGuide } from "@/content/servicePages/types";

/**
 * Long-form "in depth" content for each service page — the substance a buyer (or an AI assistant answering
 * on their behalf) needs to understand what the service is, what is included, how it runs and how it is judged.
 *
 * Writing rules: explain the discipline plainly; describe First Economy's work only as the site already does
 * (process steps, case-study results, listed tools); every figure must trace to a case study or stats file;
 * never state timelines, prices, minimum budgets or guaranteed outcomes — the site does not publish them.
 * Headings are question- or topic-led so a passage still reads correctly when quoted on its own.
 */
export const serviceGuides: Record<string, ServiceGuide> = {
  seo: {
    title: "SEO, AEO and GEO explained",
    intro:
      "Search no longer ends at a list of blue links. People now get answers from Google’s AI Overviews, assistants such as ChatGPT, Gemini and Perplexity, and the classic results page, often in the same session. This guide explains what each discipline does and how First Economy runs them as one programme.",
    sections: [
      {
        heading: "What are SEO, AEO and GEO?",
        paragraphs: [
          "SEO (search engine optimisation) makes a site easy for search engines to crawl, understand and rank, so the right pages appear when people search. AEO (answer engine optimisation) structures content so that search features and assistants can lift a short, direct answer from it. GEO (generative engine optimisation) builds the clarity and credibility that make AI tools cite a brand and describe it accurately when they write an answer.",
          "They are layers, not rivals. Good SEO is the foundation: pages an engine cannot crawl cannot be quoted either. AEO sits on top, shaping pages around the questions people actually ask. GEO extends that to the wider web, because generative tools learn about a brand from many sources, not only its own site.",
        ],
      },
      {
        heading: "Why does search need a different approach now?",
        paragraphs: [
          "AI-generated answers change what a good result looks like. A page can influence a decision without earning a click, and a brand can lose ground simply because an assistant describes a competitor more clearly. The goal therefore widens from ranking to being the source an engine trusts enough to quote.",
          "Most AI crawlers read the HTML a server returns and do not run scripts, so content that only appears after JavaScript loads may never be seen. That makes technical foundations, plain server-rendered text and consistent facts about the brand as important as keywords.",
        ],
      },
      {
        heading: "What does the programme cover?",
        paragraphs: ["The work is grouped into six connected areas, each tied to a business outcome rather than a vanity metric."],
        bullets: [
          "Technical SEO: crawlability, site speed, structure, canonical and redirect hygiene, and structured data, so engines can read the site without friction.",
          "Content architecture: pages designed around real search intent, linked so that authority flows to the pages that matter.",
          "Local SEO: Google Business Profile, local landing pages and consistent name, address and phone details for brands with physical locations.",
          "AEO: question-led headings, concise answer-first paragraphs, FAQ blocks and the matching schema markup.",
          "GEO: entity clarity, digital PR and off-page authority, third-party profiles and listings, and visibility checks inside AI tools.",
          "Measurement: rankings, organic traffic, leads and AI-era visibility reported against business outcomes.",
        ],
      },
      {
        heading: "How does an engagement run?",
        paragraphs: [
          "Every engagement follows the same five stages shown above, adapted to the brand’s size and goals.",
        ],
        bullets: [
          "Audit: uncover technical, content and authority gaps that hold visibility back, including how the brand currently appears in AI answers.",
          "Strategy: prioritise the keywords, site architecture and local opportunities that matter most to the business.",
          "Build: fix technical foundations and publish search-ready content systems rather than one-off articles.",
          "Amplify: earn authority through digital PR, off-page work and local presence, which also feeds how AI tools describe the brand.",
          "Measure: track rankings, traffic and AI-era visibility with clear reporting, then feed what is learned back into the plan.",
        ],
      },
      {
        heading: "How is success measured?",
        paragraphs: [
          "Results are judged on outcomes that matter to the business: organic traffic and leads, the strength of rankings for commercial terms, and visibility inside AI answers. That last measure is checked directly by testing a defined set of prompts across AI tools and recording whether the brand is mentioned, which sources are cited and whether the description is accurate.",
          "The case studies show the range. For Akbar Travels, organic traffic grew 130%+ and monthly visa leads rose from 1,000+ to 20,000+. For Jockey, top-3 keyword rankings grew 3.2x, impressions grew 99.5%, organic revenue grew 19.4% and the AI visibility score reached 80/100. For Royale Touché, community content on Reddit led to a 4.9/5 LLM rating and citations in ChatGPT.",
          "Reporting draws on established tools, including SEMrush, Similarweb, Looker Studio and Supermetrics, so every number can be traced to its source.",
        ],
      },
      {
        heading: "Who is this for?",
        paragraphs: [
          "The programme suits brands whose customers start with a search or a question: businesses with large product catalogues or many pages, brands with several physical locations, lead-generation funnels that depend on organic discovery, and companies that want to be named when an assistant is asked to recommend a provider in their category.",
        ],
      },
      {
        heading: "How do we get started?",
        paragraphs: [
          "A first conversation covers the business goal, the markets and products that matter, and how people currently find the brand. Access to the site, analytics and Search Console accelerates the audit, but the scope is agreed before any work begins. Use the contact page to share a brief; the team replies within 24 hours.",
        ],
      },
    ],
  },

  "media-buying": {
    title: "360° media buying explained",
    intro:
      "Media works best when it is planned as one system. This guide explains what 360° media buying means, which channels it spans and how performance is judged.",
    sections: [
      {
        heading: "What is 360° media buying?",
        paragraphs: [
          "360° media buying plans and buys every relevant channel against one business goal instead of running search, social, programmatic, OTT and outdoor as separate buys. First Economy plans across search, social, programmatic, OTT and hyperlocal OOH, and across online and linear platforms, so budgets move to where they work and reporting shows the whole picture in one place.",
        ],
      },
      {
        heading: "What does it include?",
        paragraphs: ["The practice is built from six capabilities that run together."],
        bullets: [
          "Omnichannel media buying: integrated planning and buying across online and linear platforms.",
          "AI-powered analytics and intelligence: custom dashboards with real-time insight for faster decisions and continuous optimisation.",
          "Full-funnel growth management: execution from awareness through consideration to conversions and lead generation, focused on measurable business outcomes.",
          "Strategic market and competitor intelligence: market mapping and competitor benchmarking that inform the plan.",
          "Marketplace and quick-commerce excellence: retail media expertise across Amazon, Flipkart and quick-commerce platforms to improve visibility, conversion efficiency and sales velocity.",
          "Performance-first creative and automation: conversion-led creative, A/B testing and automated conversational journeys.",
        ],
      },
      {
        heading: "How does the process work?",
        paragraphs: [
          "It starts with audience intelligence and competitor mapping, which shape the channel mix and the budget split. Media is then bought and optimised continuously against the funnel stage each channel serves, with creative and automation tuned by test results rather than opinion. Reporting stays transparent, so a client can see what each channel contributed to the outcome.",
        ],
      },
      {
        heading: "What results has it delivered?",
        paragraphs: [
          "For FedEx’s partnership with the Chennai Super Kings, the campaign delivered 1.2B+ impressions, 175M reach, 85M video views, a 61.1% YouTube view-through rate and a 42% rise in brand search volumes, with a 3.6% absolute brand lift. For VIP Industries, a programme built to turn visibility into visits delivered 64M+ impressions, 72K+ clicks and 912K page views, and measured 2K store footfalls.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Brands that buy media in more than one channel and want it planned as a single system: national campaigns with sports or event moments, retail brands that need to drive footfall as well as clicks, and marketplace sellers that need retail media aligned with wider activity.",
        ],
      },
    ],
  },

  "influencer-marketing": {
    title: "Influencer marketing explained",
    intro:
      "Creator campaigns work when they are run as a system, with the right people, clear briefs and measurement. This guide explains how First Economy plans and runs them.",
    sections: [
      {
        heading: "What is influencer marketing as a system?",
        paragraphs: [
          "Influencer marketing uses creators to reach and persuade audiences in their own voice. Run as a system, it combines celebrity, macro and micro creators around one outcome, adds paid amplification to the best content and measures the result, instead of treating each post as a one-off. The aim is authenticity that scales without losing control of the brand.",
        ],
      },
      {
        heading: "What does the work include?",
        paragraphs: ["Six stages cover a campaign from first plan to final report."],
        bullets: [
          "Strategy, audience and platform planning: campaign strategy tied to business goals, audience mapping, platform selection, formats and regional creator cohorts.",
          "Creator discovery, vetting and budgeting: finding creators from celebrity to micro, checking performance and brand fit, and optimising budget against impact.",
          "Campaign and content design: concepts, storytelling frameworks, scripts and messaging, with brand mandates and disclosures built in.",
          "Creator, production and execution management: outreach, negotiation, onboarding, timelines, shoot coordination, approvals and platform-specific quality checks.",
          "Compliance, rights and brand safety: platform guidelines, legal alignment, disclosure norms, usage rights and whitelisting.",
          "Amplification, reporting and optimisation: paid amplification, repurposing assets across channels, performance tracking and clear recommendations.",
        ],
      },
      {
        heading: "How does it scale?",
        paragraphs: [
          "Scale comes from process. First Economy and Godrej Properties set a Guinness World Record with 1,000+ influencers live in one hour, which required structured briefs, approvals and coordination far beyond a normal campaign. The same discipline applies to always-on networks of micro creators, user-generated content programmes and creator events.",
        ],
      },
      {
        heading: "What results has it delivered?",
        paragraphs: [
          "For Amazon and Samsung’s Great Indian Festival 2025, an influencer campaign positioned the Galaxy M36 5G as the best-value 5G smartphone under ₹15K. For Royale Touché, large influencer activations were one part of a #StayCurious campaign built to drive footfall to 200+ Experience Centres.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Brands launching a product or project that needs fast, credible reach; categories where recommendations from real people carry weight, such as consumer products, real estate and retail; and teams that want creator activity connected to media and measured against brand and business goals.",
        ],
      },
    ],
  },

  "video-production": {
    title: "Video production explained",
    intro:
      "Video is the format most people watch most often, on screens from phones to connected TVs. This guide explains what First Economy produces and how the work is run end to end.",
    sections: [
      {
        heading: "What does video production cover?",
        paragraphs: [
          "Video production covers everything from the idea to the finished file: brand films, campaign films for TV and digital, testimonials and explainers, 3D animation and CGI, motion graphics, platform content for marketplaces and feeds, and AI-powered films. One accountable team handles concept, shoot, post-production and delivery.",
        ],
      },
      {
        heading: "What is included?",
        paragraphs: ["The work is organised into seven formats, each built for a different job."],
        bullets: [
          "Brand films and shoots: narrative-led visuals that define and express the brand universe.",
          "Campaign films (TVC and DVC): high-impact storytelling built for scale across TV and digital.",
          "Testimonials and explainers: authentic stories and simplified narratives that build trust.",
          "3D animation and CGI: cinematic visualisation of products, spaces and concepts.",
          "Motion graphics: design-driven motion for clarity, rhythm and recall.",
          "A+ platform content: performance-ready visuals tailored for marketplaces and feeds.",
          "AI-powered films: content that uses AI for speed, scale and innovation.",
        ],
      },
      {
        heading: "How is it designed for each platform?",
        paragraphs: [
          "A hero film is planned so that it cascades into cut-downs and adaptations: cuts and formats are designed natively for YouTube, Reels, connected TV and paid social rather than resized afterwards. That keeps the idea intact while respecting how people watch on each platform.",
        ],
      },
      {
        heading: "Where does AI help?",
        paragraphs: [
          "AI assists scripting, storyboards and production where it speeds up craft rather than replacing it. For Ajanta Magic Moments, a premium fairy-led film was produced end to end with AI-assisted craft on an accelerated timeline. For Cello Kidzbee’s Back to School campaign, the brand film was produced end to end in under a week.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Brands that need film for a launch or a campaign and want it to work across TV, digital and social; marketplace sellers that need rich product content; and teams that want one partner to take a film from script to delivery.",
        ],
      },
    ],
  },

  branding: {
    title: "Brand strategy and identity explained",
    intro:
      "Branding is more than a logo. This guide explains how identity, communication and on-ground experience are built as one system.",
    sections: [
      {
        heading: "What does Project Innovation & Branding cover?",
        paragraphs: [
          "It starts with purpose, positioning and voice, then builds the identity system that expresses them, and carries both through campaigns, advertising and physical environments. The goal is a brand that holds up on a screen and on a storefront.",
        ],
      },
      {
        heading: "What is included?",
        paragraphs: ["Seven capabilities make up the practice."],
        bullets: [
          "Brand strategy and positioning: defining purpose, positioning and voice to guide all communication.",
          "Visual identity and design systems: logos, colour palettes, typography and visual languages that work together.",
          "Creative and campaign ideation: strong central ideas that power brand and campaign communication.",
          "Integrated advertising communication: consistent messaging across every consumer touchpoint.",
          "Print and outdoor advertising (OOH): high-impact creative designed for visibility and recall.",
          "Film, video and audio communication: stories told through films and radio-led narratives.",
          "End-to-end creative management: ideation, execution and rollout with consistency and quality control.",
        ],
      },
      {
        heading: "How does a brand system get built?",
        paragraphs: [
          "The work moves from strategy to identity to expression to activation. Strategy defines where the brand wins; identity makes it distinctive and ownable; expression brings it to life across formats; activation launches it into the market. Because each stage builds on the last, the identity stays coherent as campaigns and channels multiply.",
        ],
      },
      {
        heading: "What does it look like in practice?",
        paragraphs: [
          "For The Ambassador Hotel, the work gave a timeless icon a fresh brand experience while keeping its original character. For Godrej Properties’ The Greenfront, a campaign was built around the project’s natural surroundings across outdoor and on-ground activation. For Godrej Blue in Kolkata, outdoor, print and influencer activity worked together to build citywide top-of-mind recall.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Brands launching, repositioning or refreshing; businesses whose identity must work across digital, retail and physical spaces; and real estate, hospitality and consumer brands where the on-ground experience is part of the product.",
        ],
      },
    ],
  },

  technology: {
    title: "Technology solutions explained",
    intro:
      "Some businesses outgrow off-the-shelf software. This guide explains what First Economy builds and how the work is run for complex, regulated and operational systems.",
    sections: [
      {
        heading: "What are Tech Solutions?",
        paragraphs: [
          "Tech Solutions covers ground-up digital platforms, ERP builds and system integrations for businesses whose needs have outgrown standard software. The focus is the infrastructure behind campaigns and operations, not only the interface people see.",
        ],
      },
      {
        heading: "What is included?",
        paragraphs: ["Five capability areas cover the lifecycle of a product."],
        bullets: [
          "Development: web, mobile and custom-built software.",
          "Product design and UX/UI: user-centred design, UX strategy and UI systems.",
          "DevOps and infrastructure: cloud setup, deployment automation and scalability.",
          "Martech and data solutions: marketing technology, analytics and data visualisation.",
          "AI solutions and advisory: AI strategy, intelligent agents and automation.",
        ],
      },
      {
        heading: "How are complex systems handled?",
        paragraphs: [
          "Enterprise requirements such as compliance, workflows and multi-brand complexity are handled by design rather than added later. Deep integrations connect payments, KYC, registrars and partner APIs into one stack, and automation removes friction from day-to-day operations. Dashboards give teams the operational visibility to decide in real time.",
        ],
      },
      {
        heading: "What has it delivered?",
        paragraphs: [
          "For Mahindra Manulife, a ground-up rebuild of web and mobile platforms for a regulated asset-management business replaced legacy transaction flows and fragmented integrations, within strict compliance and audit requirements. For Orpat, an ERP joined raw material, SKU-level production, quality control, finished goods, dispatch, sales, accounts and HR into one connected system.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Regulated businesses such as financial services; manufacturers with cross-functional workflows; and brands whose campaigns depend on platforms, integrations and data that standard tools cannot support.",
        ],
      },
    ],
  },

  creative: {
    title: "Creative solutions explained",
    intro:
      "Creative has two jobs: to be remembered and to perform. This guide explains how campaign and performance creative are designed together.",
    sections: [
      {
        heading: "What are creative solutions?",
        paragraphs: [
          "Creative solutions are campaign and performance creative across formats, from static and motion to retail and social-first storytelling. Brand systems and performance assets come from one team, so creative works both in culture and in the media auction.",
        ],
      },
      {
        heading: "How does the creative process work?",
        paragraphs: ["Five steps run from first brief to ongoing improvement."],
        bullets: [
          "Brief: align on the audience, the offer and the job each asset must do.",
          "Concept: develop ideas and routes built for distinctiveness and response.",
          "Design: static, motion and multi-format execution with brand craft.",
          "Adapt: resize and reframe for every channel without losing the idea.",
          "Optimise: iterate on winners using performance signals and learning.",
        ],
      },
      {
        heading: "What makes it different?",
        paragraphs: [
          "Campaign craft and conversion creative are designed together, with brand systems that stay consistent as work scales. Rapid variants support testing and always-on delivery, and creative decisions are informed by what actually performs. Retail-ready creative covers in-store and marketplace formats that convert in context.",
        ],
      },
      {
        heading: "What work has it produced?",
        paragraphs: [
          "Royale Touché’s #StayCurious campaign created multiple digital-first adaptations to drive footfall to 200+ Experience Centres. Ajanta Magic Moments produced a premium, fairy-led creative film end to end with AI-assisted craft.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Brands that need campaign ideas and a steady supply of high-performing assets, retail and marketplace sellers that need creative built for the point of sale, and marketing teams that want creative learning loops tied to results.",
        ],
      },
    ],
  },

  "social-media": {
    title: "Social media management explained",
    intro:
      "Social works when it compounds over time. This guide explains what always-on social includes and how it serves both business and consumer brands.",
    sections: [
      {
        heading: "What does social media management include?",
        paragraphs: [
          "It is the continuous running of a brand’s social presence: strategy, content and community management for both B2B and B2C audiences. Social is treated as an operating model, not a string of disconnected campaigns.",
        ],
      },
      {
        heading: "What is included?",
        paragraphs: ["Five areas of work sit under the service."],
        bullets: [
          "Digital and social: page management, digital content and campaign planning, IP creation, blog writing and translations.",
          "Advanced visuals: AI and CGI videos built for social platforms.",
          "Branding and collaterals: logo and identity, brand books and guidelines, brochures, flipcharts, coffee-table books and merchandise design for brand partnerships.",
          "Innovation: ideation and mock-ups for new formats and ideas.",
          "Creative and production: graphic and video production for digital, lo-fi videos, digital ad creatives, scriptwriting and storyboarding.",
        ],
      },
      {
        heading: "What does always-on mean?",
        paragraphs: [
          "Always-on social keeps content calendars, community response and reporting running between campaigns, so equity builds continuously and launches have an engaged audience to amplify. Community care means listening and responding in ways that protect trust, and reporting feeds each insight into the next creative decision.",
        ],
      },
      {
        heading: "What has it delivered?",
        paragraphs: [
          "For Waaree, integrated social communication strengthened the brand’s presence across B2B and B2C audiences and brought its clean energy story to the forefront. Royale Touché’s campaign used frequent social posting, contests, social ads and large influencer activations to build awareness.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Brands that need a consistent voice on social; businesses selling to both professionals and consumers; and companies that want content, community and creative handled by one team.",
        ],
      },
    ],
  },

  "ai-solutions": {
    title: "AI solutions explained",
    intro:
      "AI is useful when it is applied with purpose. This guide explains where First Economy uses it across creative, analytics, search and operations, and how it is kept under control.",
    sections: [
      {
        heading: "What does AI Solutions cover?",
        paragraphs: [
          "AI Solutions applies AI as a practical accelerator across four areas: creative production, analytics, search discoverability and operations. It is built into how work is done rather than bolted on afterwards.",
        ],
      },
      {
        heading: "What is included?",
        paragraphs: ["Each area has a different job."],
        bullets: [
          "Creative acceleration: scripting, storyboarding, visuals, motion, voice and music sped up with craft intact.",
          "Decision support: dashboards and real-time insight that help teams act faster.",
          "AI search visibility: AEO, GEO and LLM visibility so brands show up in AI answers.",
          "Operational lift: automation that removes friction from day-to-day delivery.",
        ],
      },
      {
        heading: "How is AI introduced responsibly?",
        paragraphs: [
          "Five steps keep adoption practical and accountable. Opportunity: identify where AI creates real leverage. Pilot: prove value with focused experiments and measurable outcomes. Integrate: embed AI into production, analytics and search workflows. Scale: expand what works across teams, brands and markets. Govern: keep quality, brand safety and accountability in the loop as capability grows.",
        ],
      },
      {
        heading: "What has it delivered?",
        paragraphs: [
          "Ajanta Magic Moments was produced end to end with AI-assisted craft on an accelerated timeline. For Royale Touché, Reddit community content produced a 4.9/5 LLM rating and citations in ChatGPT and other LLMs. For Jockey, the SEO and AI search programme reached an AI visibility score of 80/100.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Teams that want to use AI where it clearly helps, without losing brand control; brands that want to be found in AI answers; and businesses looking to automate production or reporting workflows with clear governance.",
        ],
      },
    ],
  },

  "marketplace-management": {
    title: "Marketplace management explained",
    intro:
      "On a marketplace, discovery, content and conversion happen in one place. This guide explains how First Economy manages a brand’s presence as a growth channel.",
    sections: [
      {
        heading: "What is marketplace management?",
        paragraphs: [
          "Marketplace management is the end-to-end running of a brand’s presence on e-commerce marketplaces: listings, catalogue, store optimisation and promotion. It treats the marketplace like a media channel that can be measured, optimised and connected to the wider growth system.",
        ],
      },
      {
        heading: "How does the work run?",
        paragraphs: ["Five stages cover the cycle from first look to ongoing improvement."],
        bullets: [
          "Audit: assess listing health, share of shelf and competitive gaps.",
          "Catalogue: structure products, content and attributes for discoverability.",
          "Optimise: continuously improve stores, content and conversion paths.",
          "Promote: activate marketplace media and promotions that drive sales.",
          "Report: transparent reporting on visibility, conversion and revenue.",
        ],
      },
      {
        heading: "What makes it a growth channel?",
        paragraphs: [
          "Visibility comes first, because shoppers cannot buy what they cannot find. Conversion follows, with content engineered for search, trust and clarity. Retention and scale come next, as share of shelf and revenue grow. Marketplace media is planned against real commercial outcomes, and presence is managed across the marketplaces that matter to the category.",
        ],
      },
      {
        heading: "How does it connect to media buying?",
        paragraphs: [
          "First Economy has retail media expertise across Amazon, Flipkart and quick-commerce platforms, covered under 360° Media Buying. That lets marketplace promotions, product content and wider campaigns work together rather than in separate silos.",
        ],
      },
      {
        heading: "Who is it for?",
        paragraphs: [
          "Brands that sell on marketplaces and want their listings, content and promotions managed as a single programme; sellers whose catalogue is large or changing; and teams that need clear reporting on what is driving sales.",
        ],
      },
    ],
  },
};
