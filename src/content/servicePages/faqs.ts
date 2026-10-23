import type { ServiceFaqItem } from "@/content/servicePages/types";

/**
 * Service-page FAQs — the single source for both the visible accordion and the FAQPage JSON-LD.
 *
 * Writing rules (AEO): the first sentence of every answer states the answer outright; 40–80 words;
 * name the brand and service explicitly so a passage still makes sense when quoted on its own;
 * every figure must trace to a case study or stats file — never invent timelines, prices or results.
 */
export const serviceFaqs: Record<string, ServiceFaqItem[]> = {
  seo: [
    {
      question: "What is the difference between SEO, AEO and GEO?",
      answer:
        "SEO helps your pages rank in search results. AEO (answer engine optimisation) structures content so search features and assistants can lift a direct answer from it. GEO (generative engine optimisation) builds the clarity and credibility that make AI tools such as ChatGPT, Gemini and Perplexity cite and describe your brand correctly. First Economy runs all three as one programme.",
    },
    {
      question: "What does an SEO/AEO/GEO engagement with First Economy include?",
      answer:
        "It runs in five stages: an audit of technical, content and authority gaps; a strategy that prioritises keywords, site architecture and local opportunities; a build of technical fixes and search-ready content; amplification through digital PR, off-page and local presence; and measurement of rankings, traffic and AI-era visibility with clear reporting.",
    },
    {
      question: "Can you help a brand appear in Google AI Overviews and AI assistant answers?",
      answer:
        "Yes — AI Overview readiness is built into the programme through AEO and GEO work on content depth, entity presence and authority. For Jockey, First Economy’s SEO and AI search programme reached an AI visibility score of 80/100. For Royale Touché, Reddit community content led to a 4.9/5 LLM rating and citations in ChatGPT and other LLMs.",
    },
    {
      question: "What SEO results has First Economy delivered?",
      answer:
        "For Akbar Travels, organic traffic grew 130%+ and monthly visa leads rose from 1,000+ to 20,000+. For Jockey, top-3 keyword rankings grew 3.2x, impressions grew 99.5% and organic revenue grew 19.4%. Full breakdowns are in the case studies below.",
    },
    {
      question: "Do you offer local SEO for businesses with physical locations?",
      answer:
        "Yes. Local SEO is part of the programme, including Google Business Profile optimisation and local presence work designed to drive footfall to stores, centres and offices, alongside the technical and content work on the main website.",
    },
  ],
  "media-buying": [
    {
      question: "What is 360° media buying?",
      answer:
        "360° media buying is planning and buying media across every relevant channel as one connected system instead of separate buys. First Economy’s approach spans search, social, programmatic, OTT and hyperlocal outdoor, with online and linear platforms planned together against one business goal and reported in one place.",
    },
    {
      question: "Which channels does First Economy plan and buy?",
      answer:
        "Search, social, programmatic, OTT and hyperlocal OOH, plus retail media on Amazon, Flipkart and quick-commerce platforms. Channels are chosen from audience and competitor intelligence for each brand, not from a fixed package.",
    },
    {
      question: "How do you measure whether media is working?",
      answer:
        "Through custom AI-enabled dashboards that give real-time insight, tied to measurable business outcomes across the funnel — awareness, consideration, conversion and lead generation. For FedEx’s Chennai Super Kings partnership, results included 1.2B+ impressions, 175M reach and a 42% rise in brand search volumes.",
    },
    {
      question: "Can media buying drive store visits as well as online results?",
      answer:
        "Yes. For VIP Industries, a media programme turned visibility into visits, delivering 64M+ impressions, 72K+ clicks and 912K page views, with measured store footfall. Online and offline channels are planned together so that results connect to the business outcome.",
    },
    {
      question: "Do you manage marketplace and quick-commerce advertising?",
      answer:
        "Yes. The team has specialised retail media expertise across Amazon, Flipkart and quick-commerce platforms, focused on visibility, conversion efficiency and sales velocity, and connected to the wider media plan.",
    },
  ],
  "influencer-marketing": [
    {
      question: "What does an influencer marketing agency do?",
      answer:
        "An influencer marketing agency plans, runs and measures creator campaigns on a brand’s behalf. First Economy handles strategy and audience planning, creator discovery and vetting, content design, production and execution, compliance and rights, and paid amplification with reporting — from celebrity collaborations to micro-creator networks.",
    },
    {
      question: "Can you activate a large number of creators at once?",
      answer:
        "Yes. First Economy and Godrej Properties set a Guinness World Record with 1,000+ influencers live in one hour. The same system approach — structured briefs, approvals and coordination — applies to always-on micro-creator networks as well as single moments.",
    },
    {
      question: "How do you choose the right creators for a brand?",
      answer:
        "Creators are identified end to end, from celebrity to micro, then vetted for performance and brand fit, and budgeted against the impact they can deliver. Audience mapping, platform selection and regional creator cohorts come first, so selection follows the business goal.",
    },
    {
      question: "How do you keep influencer content authentic and brand-safe?",
      answer:
        "Creators are briefed for real stories rather than scripted product mentions, and every campaign runs with platform guidelines, disclosure norms, usage rights, whitelisting and brand-safety controls in place before content goes live.",
    },
    {
      question: "How is influencer marketing performance measured?",
      answer:
        "Performance tracking and reporting connect creator activity to brand and business goals, covering reach, engagement and insights, with optimisation recommendations after every phase. Creator content can also be boosted with paid media and repurposed across channels.",
    },
  ],
  "video-production": [
    {
      question: "What types of video does First Economy produce?",
      answer:
        "Brand films and shoots, campaign films for TV and digital, testimonials and explainers, 3D animation and CGI, motion graphics, platform content for marketplaces and feeds, and AI-powered films — delivered end to end, from concept through post-production and delivery.",
    },
    {
      question: "Do you produce video end to end?",
      answer:
        "Yes. One accountable team handles concept, shoot, post and delivery, and hero films are planned so they cascade into performance and social adaptations for each platform.",
    },
    {
      question: "How is AI used in video production?",
      answer:
        "AI assists scripting, storyboards and production where it speeds up craft, rather than replacing it. For Ajanta Magic Moments, a premium fairy-led film was produced end to end with AI-assisted craft on an accelerated timeline.",
    },
    {
      question: "Can you make videos for social platforms and CTV as well as TV?",
      answer:
        "Yes. Cuts and formats are designed natively for YouTube, Reels, connected TV and paid social, as well as TV and digital campaign films, so each platform gets a version built for how people watch there.",
    },
    {
      question: "What kind of video work has First Economy delivered for brands?",
      answer:
        "Examples include Ajanta Magic Moments, an AI-assisted brand film, and Cello Kidzbee’s Back to School campaign, which turned everyday school moments into colourful experiences. Both are featured in the case studies below.",
    },
  ],
  branding: [
    {
      question: "What does Project Innovation & Branding cover?",
      answer:
        "It covers brand strategy and positioning, visual identity and design systems, campaign ideation, integrated communication, print and outdoor advertising, film, video and audio communication, and end-to-end creative management — carried through to physical, on-ground experience.",
    },
    {
      question: "Do you work on physical and on-ground brand experiences?",
      answer:
        "Yes. Identity systems are designed to work on screen and on a storefront, carried through to storefronts, packaging and on-ground activations. The Ambassador Hotel brand experience and Godrej Properties’ The Greenfront campaign are examples.",
    },
    {
      question: "Is branding at First Economy only about a logo and identity?",
      answer:
        "No. A logo is one layer. Branding here starts with purpose, positioning and voice, then builds identity systems and applies them across every touchpoint, including on-ground environments, and wires them into media and creative from day one.",
    },
    {
      question: "Can you support a citywide or multi-channel brand launch?",
      answer:
        "Yes. For Godrej Blue in Kolkata, the goal was citywide top-of-mind recall for Godrej Properties’ arrival in the city, delivered through an integrated launch across outdoor, print and influencer activity.",
    },
    {
      question: "Do you create brand guidelines and collateral?",
      answer:
        "Yes. Identity work covers logos, colour palettes, typography and visual languages built into design systems, and the same team can produce brand books, guidelines and collateral such as brochures and merchandise for brand partnerships.",
    },
  ],
  "marketplace-management": [
    {
      question: "What is marketplace management?",
      answer:
        "Marketplace management is running a brand’s presence on e-commerce marketplaces as a growth channel. First Economy manages listings, catalogue, store optimisation and promotion, with transparent reporting on visibility, conversion and revenue.",
    },
    {
      question: "What does First Economy manage on marketplaces?",
      answer:
        "The work runs from an audit of listing health, share of shelf and competitive gaps, through catalogue structure, continuous store and content optimisation, marketplace promotion and media, to regular reporting on visibility, conversion and revenue.",
    },
    {
      question: "Which marketplaces do you work with?",
      answer:
        "Presence is managed across the marketplaces that matter to the brand’s category, and the team has retail media expertise across Amazon, Flipkart and quick-commerce platforms.",
    },
    {
      question: "How is marketplace work connected to advertising?",
      answer:
        "Marketplace media is planned against real commercial outcomes and connected to the wider growth system, so promotions, content and store optimisation work together. The team manages presence like media: measurable, continuously optimised and reported transparently.",
    },
    {
      question: "Do you handle product content and catalogue quality?",
      answer:
        "Yes. Product content is engineered for search, conversion and brand trust, with attributes and structure designed for discoverability, and improved continuously rather than set once and left.",
    },
  ],
  technology: [
    {
      question: "What technology work does First Economy do?",
      answer:
        "Ground-up digital platforms, ERP builds and system integrations for businesses that have outgrown off-the-shelf software: web, mobile and custom software development, product design and UX/UI, DevOps and infrastructure, martech and data solutions, and AI solutions and advisory.",
    },
    {
      question: "Can you build for regulated industries such as financial services?",
      answer:
        "Yes. For Mahindra Manulife, First Economy delivered a ground-up rebuild of web and mobile platforms for a regulated asset-management business, working within strict compliance and audit requirements and unifying fragmented integrations.",
    },
    {
      question: "Do you build custom ERP systems?",
      answer:
        "Yes. For Orpat, First Economy built an ERP spanning raw material, SKU-level production, quality control, finished goods, dispatch, sales, accounts and HR, to streamline complex cross-functional manufacturing workflows.",
    },
    {
      question: "Can you integrate with payments, KYC and partner APIs?",
      answer:
        "Yes. Deep integrations with payments, KYC, registrars and partner APIs are wired into one stack, and workflows are automated to remove friction and speed up operations.",
    },
    {
      question: "How does technology connect to marketing at First Economy?",
      answer:
        "Technology is built to align with media, creative and commercial outcomes rather than sit apart. Dashboards and martech solutions give real-time operational visibility, and the same team can connect the platform to campaigns.",
    },
  ],
  creative: [
    {
      question: "What are creative solutions?",
      answer:
        "Creative solutions are campaign and performance creative across formats, from static and motion to retail and social-first storytelling. First Economy builds brand systems and performance assets from one team, so creative works both in culture and in the media auction.",
    },
    {
      question: "How does your creative process work?",
      answer:
        "It runs in five steps: brief (audience, offer and the job each asset must do), concept (distinctive routes), design (static, motion and multi-format execution), adapt (resizing and reframing for each channel), and optimise (iterating on winners using performance signals).",
    },
    {
      question: "Do you make creative for performance marketing as well as brand campaigns?",
      answer:
        "Yes. Campaign craft and conversion creative are designed together, with rapid variants for testing and always-on delivery, and creative decisions informed by what actually performs.",
    },
    {
      question: "Can you create in-store and marketplace creative?",
      answer:
        "Yes. Retail-ready creative covers in-store and marketplace formats designed to convert in context, alongside social-first and brand campaign work.",
    },
    {
      question: "What creative work can I see?",
      answer:
        "Case studies include Royale Touché’s #StayCurious, an integrated campaign to drive footfall to 200+ Experience Centres, and Ajanta Magic Moments, an AI-assisted creative film. See the case studies below.",
    },
  ],
  "social-media": [
    {
      question: "What does social media management include at First Economy?",
      answer:
        "Always-on strategy, content and community management for B2B and B2C brands: page management, content and campaign planning, IP creation, blog writing and translations, graphic and video production, scriptwriting and storyboarding, and AI and CGI videos built for social platforms.",
    },
    {
      question: "Do you work with both B2B and B2C brands?",
      answer:
        "Yes. Voice and formats are tuned separately for professional and consumer audiences. For Waaree, the work strengthened an integrated brand presence across B2B and B2C audiences in the clean energy space.",
    },
    {
      question: "What is always-on social?",
      answer:
        "Always-on social is a continuous programme of content, community response and reporting that builds brand equity between campaigns. It also gives launches an audience that is already engaged, so campaigns amplify existing presence.",
    },
    {
      question: "Do you handle community management and listening?",
      answer:
        "Yes. Community care covers listening and response that protect trust and deepen relationships, and social reporting feeds the next creative decision.",
    },
    {
      question: "Can you create social-first video and creative?",
      answer:
        "Yes. Creative is made for feeds rather than resized from print — including lo-fi videos, digital ad creatives, and AI and CGI videos built for social platforms.",
    },
  ],
  "ai-solutions": [
    {
      question: "What does First Economy’s AI Solutions service cover?",
      answer:
        "AI applied across creative production, analytics, search discoverability and operations. That includes AI-assisted creative, dashboards and decision support, AEO and GEO for visibility in AI answers, and automation that removes day-to-day friction.",
    },
    {
      question: "How do you decide where AI is worth using?",
      answer:
        "The process starts by identifying where AI creates real leverage, then proves value with focused pilots tied to measurable outcomes before integrating, scaling and governing what works. The approach is practical first, not AI for its own sake.",
    },
    {
      question: "Can you make AI-generated creative that keeps brand control?",
      answer:
        "Yes. AI speeds up scripting, storyboarding, visuals, motion, voice and music while craft stays intact, and quality and brand safety stay in the loop as adoption grows. Ajanta Magic Moments was produced end to end with AI-assisted craft.",
    },
    {
      question: "Can AI help a brand show up in ChatGPT and Google AI Overviews?",
      answer:
        "Yes. AEO, GEO and LLM visibility work is part of AI Solutions. For Royale Touché, Reddit community content earned a 4.9/5 LLM rating and citations in ChatGPT and other LLMs, and Jockey reached an AI visibility score of 80/100.",
    },
    {
      question: "Do you build AI agents and automation?",
      answer:
        "Yes. AI strategy, intelligent agents and automation are offered through First Economy’s Tech Solutions practice, and automation is applied to production, analytics and operations workflows.",
    },
  ],
};
