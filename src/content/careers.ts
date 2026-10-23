/**
 * Careers page content and media slots.
 * Assets live in /public/images/careers/.
 */

import type { MediaSlot } from "@/content/about";

const jobIcon = (file: string, label: string): MediaSlot => ({
  src: `/images/careers/job-detail/${file}`,
  alt: "",
  label,
});

/** Job detail page icons — /public/images/careers/job-detail/ */
export const careerJobIcons = {
  briefcase: jobIcon("briefcase.svg", "Department"),
  megaphone: jobIcon("megaphone.svg", "Campaigns"),
  analytics: jobIcon("analytics.svg", "Analytics"),
  innovation: jobIcon("innovation.svg", "Innovation"),
  leadership: jobIcon("leadership.svg", "Leadership"),
  growthImpact: jobIcon("growth-impact.svg", "Growth Impact"),
  learning: jobIcon("learning.svg", "Learning"),
  inclusion: jobIcon("inclusion.svg", "Inclusion"),
  flexibility: jobIcon("flexibility.svg", "Flexibility"),
  wellbeing: jobIcon("wellbeing.svg", "Well-being"),
} as const;

export const careerDetailHeroImage = {
  src: "/images/careers/job-detail/hero-banner.png",
  alt: "First Economy conference room overlooking the city skyline",
  label: "Career detail hero banner",
} satisfies MediaSlot;

export type CareerRole = {
  slug: string;
  title: string;
  location: string;
  department: string;
  type: string;
  experience?: string;
  /** Optional override; defaults to `/careers/[slug]` when omitted. */
  href?: string;
  /** ISO date (YYYY-MM-DD) the role went live — Google requires it for JobPosting rich results. */
  datePosted?: string;
  /** ISO date after which the posting expires. */
  validThrough?: string;
};

export type CareerListItem = {
  title: string;
  body: string;
  icon: MediaSlot;
};

export type CareerWorkArea = {
  title: string;
  body: string;
  icon: MediaSlot;
};

export type CareerRoleDetail = {
  slug: string;
  eyebrow: string;
  headlineBefore: string;
  headlineAccent: string;
  summary: string;
  heroImage: MediaSlot;
  heroBurst: string;
  aboutRole: string;
  responsibilities: CareerListItem[];
  workAreas: CareerWorkArea[];
  requirements: CareerListItem[];
  benefits: CareerListItem[];
  aboutUs: string;
};

export const careersHero = {
  headlineBefore: "Your next big move",
  headlineAccent: "could start here.",
  headlineAfter: "",
  body: "At First Economy, we’re here to make work that gets noticed and build a place where people love doing it. Bring your ideas, challenge the obvious, learn something new and grow with a team that’s always rooting for you.",
  cta: { label: "Explore openings", href: "#open-positions" },
  image: {
    src: "/images/careers/hero/team.png",
    alt: "First Economy teammates collaborating around a long office table",
    label: "Careers hero team photo",
    grayscale: false,
  } satisfies MediaSlot,
  verticalMark: "STRATEGY  CREATIVE  MEDIA  TECHNOLOGY  DATA  =  GROWTH",
  burst: "/images/careers/hero/radial-burst.svg",
  arrow: "/images/careers/hero/arrow-circle.svg",
};

export const careersCulture = {
  eyebrow: "Our Culture",
  titleBefore: "A culture built on",
  titleAccent: "curiosity and collaboration.",
  body: "We are a collective of thinkers, makers and innovators who believe the best work happens when sharp minds come together — across roles, cities and disciplines.",
};

export const careersValues = [
  {
    title: "Ownership",
    body: "We take ownership, act with accountability and deliver results.",
    icon: {
      src: "/images/careers/culture/ownership.svg",
      alt: "",
      label: "Ownership",
    } satisfies MediaSlot,
  },
  {
    title: "Collaboration",
    body: "We believe the best ideas are built together.",
    icon: {
      src: "/images/careers/culture/collaboration.svg",
      alt: "",
      label: "Collaboration",
    } satisfies MediaSlot,
  },
  {
    title: "Impact",
    body: "We focus on outcomes that create real impact for our clients.",
    icon: {
      src: "/images/careers/culture/impact.svg",
      alt: "",
      label: "Impact",
    } satisfies MediaSlot,
  },
  {
    title: "Integrity",
    body: "We operate with honesty, transparency and respect.",
    icon: {
      src: "/images/careers/culture/integrity.svg",
      alt: "",
      label: "Integrity",
    } satisfies MediaSlot,
  },
  {
    title: "Growth",
    body: "We invest in learning, encourage progress and celebrate wins.",
    icon: {
      src: "/images/careers/culture/growth.svg",
      alt: "",
      label: "Growth",
    } satisfies MediaSlot,
  },
  {
    title: "Passion",
    body: "We love what we do and it shows in the work we create.",
    icon: {
      src: "/images/careers/culture/passion.svg",
      alt: "",
      label: "Passion",
    } satisfies MediaSlot,
  },
];

export const careersWhyJoin = {
  eyebrow: "Why Join Us",
  titleBefore: "More than a job.",
  titleAccent: "A place to thrive.",
};

export const careersBenefits = [
  {
    title: "Meaningful Work",
    body: "Work on brands and problems that matter — with outcomes you can measure.",
    icon: {
      src: "/images/careers/why-join/meaningful-work.svg",
      alt: "",
      label: "Meaningful Work",
    } satisfies MediaSlot,
  },
  {
    title: "Career Growth",
    body: "Clear learning paths across craft, platforms and leadership.",
    icon: {
      src: "/images/careers/why-join/career-growth.svg",
      alt: "",
      label: "Career Growth",
    } satisfies MediaSlot,
  },
  {
    title: "Great People",
    body: "Learn alongside specialists across media, creative, tech and data.",
    icon: {
      src: "/images/careers/why-join/great-people.svg",
      alt: "",
      label: "Great People",
    } satisfies MediaSlot,
  },
  {
    title: "Recognition",
    body: "We celebrate wins — for teams, individuals and the work itself.",
    icon: {
      src: "/images/careers/why-join/recognition.svg",
      alt: "",
      label: "Recognition",
    } satisfies MediaSlot,
  },
  {
    title: "Work-Life Balance",
    body: "A flexible, people-first environment built for sustainable performance.",
    icon: {
      src: "/images/careers/why-join/work-life-balance.svg",
      alt: "",
      label: "Work-Life Balance",
    } satisfies MediaSlot,
  },
];

export const careersOpenings = {
  eyebrow: "Open Positions",
  title: "Find your next opportunity.",
  viewAll: { label: "View all openings", href: "#open-positions" },
  emptyNote: "Don’t see the right role?",
  resumeCta: { label: "Send us your resume", href: "mailto:p&c@firsteconomy.com" },
};

// `datePosted` is the date each role was added to the site (from git history), a stand-in until the real posting dates are
// entered. Add `validThrough` (ISO date) to a role that has a closing date; remove the role once it is filled.
export const careersRoles: CareerRole[] = [
  {
    slug: "senior-performance-marketing-manager",
    title: "Senior Performance Marketing Manager",
    location: "Mumbai, India",
    department: "Marketing",
    type: "Full-time",
    experience: "5-8 Yrs",
    href: "/careers/senior-performance-marketing-manager",
    datePosted: "2026-08-27",
  },
  {
    slug: "creative-art-director",
    title: "Creative Art Director",
    location: "Bengaluru",
    department: "Creative",
    type: "Full-time",
    experience: "6-10 Yrs",
    href: "/careers/creative-art-director",
    datePosted: "2026-08-27",
  },
  {
    slug: "video-editor",
    title: "Video Editor",
    location: "Pune",
    department: "Creative",
    type: "Full-time",
    experience: "2-4 Yrs",
    href: "/careers/video-editor",
    datePosted: "2026-08-27",
  },
  {
    slug: "ai-data-analyst",
    title: "AI & Data Analyst",
    location: "Mumbai",
    department: "Data & Technology",
    type: "Full-time",
    experience: "3-5 Yrs",
    href: "/careers/ai-data-analyst",
    datePosted: "2026-08-27",
  },
  {
    slug: "seo-specialist",
    title: "SEO Specialist",
    location: "Bengaluru",
    department: "Marketing",
    type: "Full-time",
    experience: "2-5 Yrs",
    href: "/careers/seo-specialist",
    datePosted: "2026-08-27",
  },
];

export const careerDetailWhyJoin = [
  {
    title: "Growth Impact",
    body: "Work on brands and campaigns where your decisions directly move revenue, market share and long-term growth.",
    icon: careerJobIcons.growthImpact,
  },
  {
    title: "Learning Culture",
    body: "Stay ahead with structured learning, platform certifications and exposure to emerging tools and channels.",
    icon: careerJobIcons.learning,
  },
  {
    title: "Open & Inclusive",
    body: "A collaborative environment where ideas are shared freely and every voice contributes to better outcomes.",
    icon: careerJobIcons.inclusion,
  },
  {
    title: "Flexibility",
    body: "Hybrid work options and flexible schedules designed for sustainable, high-quality performance.",
    icon: careerJobIcons.flexibility,
  },
  {
    title: "Well-being",
    body: "Health benefits, wellness initiatives and a people-first culture that supports you beyond the desk.",
    icon: careerJobIcons.wellbeing,
  },
];

export type CareerDetailSectionId =
  | "overview"
  | "responsibilities"
  | "requirements"
  | "benefits"
  | "about-us";

export type CareerDetailTab = {
  id: CareerDetailSectionId;
  label: string;
};

export const careerRoleDetails: Record<string, CareerRoleDetail> = {
  "senior-performance-marketing-manager": {
    slug: "senior-performance-marketing-manager",
    eyebrow: "We are hiring",
    headlineBefore: "Senior Performance",
    headlineAccent: "Marketing Manager",
    summary:
      "Drive high-impact campaigns, optimize ROI, and scale growth across channels for leading brands. Lead strategy, execution and measurement across paid media.",
    heroImage: careerDetailHeroImage,
    heroBurst: "/images/careers/hero/radial-burst.svg",
    aboutRole:
      "As Senior Performance Marketing Manager, you will own end-to-end performance strategy for key accounts — from media planning and channel mix to creative testing, attribution and growth reporting. You will partner with strategy, creative, data and client teams to engineer campaigns that deliver measurable business outcomes.",
    responsibilities: [
      {
        title: "Campaign strategy & planning",
        body: "Define channel strategy, budget allocation and testing roadmaps aligned to client growth goals and seasonal priorities.",
        icon: careerJobIcons.megaphone,
      },
      {
        title: "Paid media execution",
        body: "Launch, optimize and scale campaigns across search, social, programmatic and emerging performance channels.",
        icon: careerJobIcons.megaphone,
      },
      {
        title: "Measurement & attribution",
        body: "Build reporting frameworks, track KPIs and translate data into actionable insights for continuous improvement.",
        icon: careerJobIcons.analytics,
      },
      {
        title: "Creative & landing optimization",
        body: "Partner with creative teams on ad formats, messaging tests and landing experiences that improve conversion rates.",
        icon: careerJobIcons.innovation,
      },
      {
        title: "Client partnership",
        body: "Present performance reviews, recommend growth levers and maintain trusted relationships with client stakeholders.",
        icon: careerJobIcons.leadership,
      },
      {
        title: "Team mentorship",
        body: "Guide junior specialists on platform best practices, QA processes and structured experimentation.",
        icon: careerJobIcons.leadership,
      },
    ],
    workAreas: [
      {
        title: "High-impact Campaigns",
        body: "Plan and run multi-channel campaigns for national and global brands across categories.",
        icon: careerJobIcons.megaphone,
      },
      {
        title: "Data & Insights",
        body: "Turn platform data, analytics and attribution models into clear growth recommendations.",
        icon: careerJobIcons.analytics,
      },
      {
        title: "Growth Innovation",
        body: "Test new channels, bidding strategies and automation workflows to stay ahead of the curve.",
        icon: careerJobIcons.innovation,
      },
      {
        title: "Team Leadership",
        body: "Collaborate across media, creative and technology squads to deliver integrated outcomes.",
        icon: careerJobIcons.leadership,
      },
    ],
    requirements: [
      {
        title: "Experience",
        body: "5–8 years in performance marketing, paid media or growth marketing with agency or brand-side exposure.",
        icon: careerJobIcons.briefcase,
      },
      {
        title: "Platform expertise",
        body: "Hands-on experience with Google Ads, Meta, programmatic platforms and analytics tools (GA4, GTM).",
        icon: careerJobIcons.analytics,
      },
      {
        title: "Analytical mindset",
        body: "Strong comfort with dashboards, funnel analysis, A/B testing and ROI-focused decision making.",
        icon: careerJobIcons.analytics,
      },
      {
        title: "Communication",
        body: "Ability to present complex performance narratives clearly to clients and internal stakeholders.",
        icon: careerJobIcons.megaphone,
      },
    ],
    benefits: [
      {
        title: "Competitive compensation",
        body: "Market-aligned salary with performance-linked incentives and annual reviews.",
        icon: careerJobIcons.growthImpact,
      },
      {
        title: "Learning budget",
        body: "Certifications, conferences and platform training to keep your skills current.",
        icon: careerJobIcons.learning,
      },
      {
        title: "Hybrid flexibility",
        body: "Balanced in-office and remote work with core collaboration days.",
        icon: careerJobIcons.flexibility,
      },
      {
        title: "Health & wellness",
        body: "Medical coverage and wellness programs for you and your family.",
        icon: careerJobIcons.wellbeing,
      },
    ],
    aboutUs:
      "First Economy is a growth partner for brands that want to go beyond marketing. We bring strategy, creative, media, technology and data together as one integrated team — engineering growth systems that create real, measurable impact.",
  },
};

/** "a Video Editor" / "an AI & Data Analyst" / "an SEO Specialist". */
function withArticle(title: string) {
  const first = title.split(" ")[0] ?? "";
  const vowelSound = /^[AEIOU]/i.test(first) || (/^[A-Z]{2,4}$/.test(first) && /^[FHLMNRSX]/.test(first));
  return `${vowelSound ? "an" : "a"} ${title}`;
}

function buildFallbackDetail(role: CareerRole): CareerRoleDetail {
  const titleParts = role.title.split(" ");
  const splitAt = Math.ceil(titleParts.length / 2);

  return {
    slug: role.slug,
    eyebrow: "We are hiring",
    headlineBefore: titleParts.slice(0, splitAt).join(" "),
    headlineAccent: titleParts.slice(splitAt).join(" "),
    summary: `Join our ${role.department} team in ${role.location} as ${withArticle(role.title)}. Help us engineer growth for leading brands across channels and markets.`,
    heroImage: careerDetailHeroImage,
    heroBurst: "/images/careers/hero/radial-burst.svg",
    aboutRole: `We are looking for ${withArticle(role.title)} to join our ${role.department} practice in ${role.location}. This is a ${role.type.toLowerCase()} role${
      role.experience ? ` suited for professionals with ${role.experience} of relevant experience` : ""
    }.`,
    responsibilities: [
      {
        title: "Own delivery",
        body: "Lead day-to-day execution and quality for your area of work.",
        icon: careerJobIcons.leadership,
      },
      {
        title: "Collaborate cross-functionally",
        body: "Partner with strategy, creative, media and data teams on integrated growth programs.",
        icon: careerJobIcons.inclusion,
      },
      {
        title: "Drive outcomes",
        body: "Focus on measurable results and continuous improvement for clients and the business.",
        icon: careerJobIcons.growthImpact,
      },
    ],
    workAreas: [
      {
        title: "Client programs",
        body: "Contribute to campaigns and growth initiatives for leading brands.",
        icon: careerJobIcons.megaphone,
      },
      {
        title: "Innovation",
        body: "Explore new tools, formats and approaches that raise the bar for our work.",
        icon: careerJobIcons.innovation,
      },
    ],
    requirements: [
      {
        title: "Experience",
        body: role.experience
          ? `${role.experience} of relevant experience in ${role.department.toLowerCase()} or a related discipline.`
          : `Relevant experience in ${role.department.toLowerCase()} or a related discipline.`,
        icon: careerJobIcons.briefcase,
      },
      {
        title: "Skills",
        body: "Strong craft, communication and problem-solving skills with a growth mindset.",
        icon: careerJobIcons.learning,
      },
    ],
    benefits: careerDetailWhyJoin.slice(0, 4).map((item) => ({
      title: item.title,
      body: item.body,
      icon: item.icon,
    })),
    aboutUs:
      "First Economy is a growth partner for brands that want to go beyond marketing. We bring strategy, creative, media, technology and data together as one integrated team.",
  };
}

export { buildFallbackDetail };

/** "Life at First Economy" photo gallery — sits right after Open Positions. */
export const careersGallery = {
  eyebrow: "Life at First Economy",
  title: "Where the work happens.",
  images: [
    { src: "/images/careers/life-at-fe/01.jpg", alt: "The First Economy team celebrating a Guinness World Records achievement" },
    { src: "/images/careers/life-at-fe/02.jpg", alt: "The First Economy team together in the office" },
    { src: "/images/careers/life-at-fe/03.jpg", alt: "The team celebrating together at a company event" },
    { src: "/images/careers/life-at-fe/04.jpg", alt: "The whole First Economy team at an office celebration" },
    { src: "/images/careers/life-at-fe/05.jpg", alt: "The First Economy team in branded tees at an outdoor gathering" },
    { src: "/images/careers/life-at-fe/06.jpg", alt: "The First Economy team at a company offsite retreat" },
  ],
};

export const careersCta = {
  titleBefore: "Got a challenge?",
  titleAccent: "Bring it on.",
  email: {
    label: "Send your resume to",
    value: "p&c@firsteconomy.com",
    href: "mailto:p&c@firsteconomy.com",
    icon: {
      src: "/images/careers/cta/send-resume.svg",
      alt: "",
      label: "Send resume",
    } satisfies MediaSlot,
  },
  culture: {
    label: "Life at First Economy",
    value: "Explore our culture",
    href: "#our-culture",
    icon: {
      src: "/images/careers/cta/life-at-fe.svg",
      alt: "",
      label: "Life at FE",
    } satisfies MediaSlot,
  },
  button: { label: "Join our team", href: "mailto:p&c@firsteconomy.com" },
};
