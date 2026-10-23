/**
 * About page content and media slots.
 * Files live in /public/images/about/.
 */

import { networkStats } from "@/content/stats";

export type MediaSlot = {
  src?: string;
  /** Lucide icon when no `src` (e.g. service page feature icons). */
  icon?: string;
  alt: string;
  label: string;
  fit?: "cover" | "contain";
  grayscale?: boolean;
  /** Optional live proof URL — gallery tiles open this when set. */
  href?: string;
};

export const aboutHero = {
  eyebrow: "About Us",
  headlineBefore: "We don’t just market brands.",
  headlineAccent: "We build their next move.",
  body: "First Economy brings together creative thinking, strategic minds, technology, media and AI to help ambitious brands find smarter ways to grow.",
  image: {
    src: "/images/about/hero/meeting-room.jpg",
    alt: "First Economy team in a glass meeting room",
    label: "Hero meeting photo",
    grayscale: false,
  } satisfies MediaSlot,
  burst: "/images/about/hero/radial-burst.svg",
  arrow: "/images/about/ui/arrow-right-circle.svg",
};

const aboutStatIcons: Record<string, MediaSlot> = {
  "Marketing Agencies": {
    src: "/images/about/stats/globe.svg",
    alt: "",
    label: "Marketing Agencies",
  },
  Markets: { src: "/images/about/stats/cities.svg", alt: "", label: "Markets" },
  "Media Awards": { src: "/images/about/stats/awards.svg", alt: "", label: "Media Awards" },
  Billings: { src: "/images/about/stats/growth-system.svg", alt: "", label: "Billings" },
};

export const aboutStats = networkStats.map((stat) => ({
  ...stat,
  icon: aboutStatIcons[stat.label],
}));

export const aboutStory = {
  eyebrow: "Our Story",
  title: "A partner. A team. A system that works.",
  body: "First Economy began as a digital-first partner for ambitious brands. Over a decade we have grown into 302+ minds across four cities — building one connected growth system instead of a collection of disconnected services.",
};

export const aboutTimeline = [
  {
    year: "2014",
    title: "The Beginning",
    body: "Founded in Mumbai to help brands grow with digital-first thinking.",
    icon: { src: "/images/about/story/rocket.svg", alt: "", label: "Beginning" } satisfies MediaSlot,
  },
  {
    year: "2017",
    title: "Building the Team",
    body: "Specialist teams across media, creative and technology come together.",
    icon: { src: "/images/about/story/team.svg", alt: "", label: "Team" } satisfies MediaSlot,
  },
  {
    year: "2020",
    title: "Expanding Horizons",
    body: "New cities, new capabilities, and a wider network of partners.",
    icon: { src: "/images/about/story/globe.svg", alt: "", label: "Expansion" } satisfies MediaSlot,
  },
  {
    year: "Today",
    title: "Engineering Growth Systems",
    body: "Strategy, creative, media, technology and data working as one.",
    icon: { src: "/images/about/story/target.svg", alt: "", label: "Growth systems" } satisfies MediaSlot,
  },
];

export const aboutWhatWeDo = {
  eyebrow: "What We Do",
  titleBefore: "We don’t believe in doing things",
  titleAccent: "one department at a time.",
  body: "Strategy, creative, media, technology, data and AI work as one connected team at FE. Because better ideas happen when different minds come together.",
  cta: { label: "Explore our services", href: "/services" },
  image: {
    src: "/images/about/what-we-do/office-growth-wall.jpg",
    alt: "Office hallway with STRATEGY, CREATIVE, MEDIA, TECHNOLOGY, DATA = GROWTH on the wall",
    label: "Office hallway photo",
    grayscale: false,
  } satisfies MediaSlot,
};

export type TeamMember = {
  name: string;
  title: string;
  linkedin?: string;
  image: MediaSlot;
};

/** Core leadership — aligned to creds deck (slide 3). */
export const aboutTeamTagline = "Fueled by 300 passionate minds";

/** Slide 3 order: Jigar & Jeffrey first, then top row L→R, bottom row L→R. */
export const aboutTeam: TeamMember[] = [
  {
    name: "Jigar Zatakia",
    title: "Founder & Joint CEO",
    linkedin: "https://www.linkedin.com/in/jigarzatakia",
    image: {
      src: "/images/about/leadership/jigar-zatakia.jpg",
      alt: "Portrait of Jigar Zatakia",
      label: "Jigar Zatakia",
      grayscale: true,
    },
  },
  {
    name: "Jeffrey Crasto",
    title: "Partner & Joint CEO",
    linkedin: "https://www.linkedin.com/in/jeffrey-crasto-229565130/",
    image: {
      src: "/images/about/leadership/jeffrey-crasto.jpg",
      alt: "Portrait of Jeffrey Crasto",
      label: "Jeffrey Crasto",
      grayscale: true,
    },
  },
  {
    name: "Parth Gandhi",
    title: "Chief Technology Officer",
    linkedin: "https://www.linkedin.com/in/parth-gandhi-08a84b376/",
    image: {
      src: "/images/about/leadership/parth-gandhi.jpg",
      alt: "Portrait of Parth Gandhi",
      label: "Parth Gandhi",
      grayscale: true,
    },
  },
  {
    name: "Vaibhav Jain",
    title: "Head — Media Planning",
    linkedin: "https://www.linkedin.com/in/vaibhav-jain1989/",
    image: {
      src: "/images/about/leadership/vaibhav-jain.jpg",
      alt: "Portrait of Vaibhav Jain",
      label: "Vaibhav Jain",
      grayscale: true,
    },
  },
  {
    name: "Jamshid Doctor",
    title: "Head — Business Solutions",
    linkedin: "https://www.linkedin.com/in/jamshid-doctor/",
    image: {
      src: "/images/about/leadership/jamshid-doctor.jpg",
      alt: "Portrait of Jamshid Doctor",
      label: "Jamshid Doctor",
      grayscale: true,
    },
  },
  {
    name: "Rushabh Ashar",
    title: "Head — Video Production",
    linkedin: "https://www.linkedin.com/in/rushabhashar1/",
    image: {
      src: "/images/about/leadership/rushabh-ashar.jpg",
      alt: "Portrait of Rushabh Ashar",
      label: "Rushabh Ashar",
      grayscale: true,
    },
  },
  {
    name: "Pratik Panvalkar",
    title: "Head — Branding & Design",
    linkedin: "https://www.linkedin.com/in/pratik-panvalkar-a880227a/",
    image: {
      src: "/images/about/leadership/pratik-panvalkar.jpg",
      alt: "Portrait of Pratik Panvalkar",
      label: "Pratik Panvalkar",
      grayscale: true,
    },
  },
  {
    name: "Chirag Kaku",
    title: "Head — Strategy",
    linkedin: "https://www.linkedin.com/in/chirag-kaku/",
    image: {
      src: "/images/about/leadership/chirag-kaku.jpg",
      alt: "Portrait of Chirag Kaku",
      label: "Chirag Kaku",
      grayscale: true,
    },
  },
  {
    name: "Herat Panchal",
    title: "Chief Growth Officer",
    linkedin: "https://www.linkedin.com/in/herat-panchal-1895321b/",
    image: {
      src: "/images/about/leadership/herat-panchal.jpg",
      alt: "Portrait of Herat Panchal",
      label: "Herat Panchal",
      grayscale: true,
    },
  },
  {
    name: "Bilal Shaikh",
    title: "Head — New Business, Mumbai",
    linkedin: "https://www.linkedin.com/in/bilal-shaikh-100b89125/",
    image: {
      src: "/images/about/leadership/bilal-shaikh.jpg",
      alt: "Portrait of Bilal Shaikh",
      label: "Bilal Shaikh",
      grayscale: true,
    },
  },
  {
    name: "Megha Mathur",
    title: "Head — New Business, Bengaluru",
    linkedin: "https://www.linkedin.com/in/megzamazing/",
    image: {
      src: "/images/about/leadership/megha-mathur.jpg",
      alt: "Portrait of Megha Mathur",
      label: "Megha Mathur",
      grayscale: true,
    },
  },
  {
    name: "Deep Ajmera",
    title: "Head — New Business, Pune",
    linkedin: "https://www.linkedin.com/in/deep-ajmera-670b38ba/",
    image: {
      src: "/images/about/leadership/deep-ajmera.jpg",
      alt: "Portrait of Deep Ajmera",
      label: "Deep Ajmera",
      grayscale: true,
    },
  },
  {
    name: "Arab Iqbal",
    title: "Head — Creative & Branding Solution",
    image: {
      src: "/images/about/leadership/iqbal-arab.jpg",
      alt: "Portrait of Arab Iqbal",
      label: "Arab Iqbal",
      grayscale: true,
    },
  },
  {
    name: "Pramod Vishwakarma",
    title: "Head — Social Media",
    linkedin: "https://www.linkedin.com/in/pramod-vishwakarma-1a447630/",
    image: {
      src: "/images/about/leadership/pramod-vishwakarma.jpg",
      alt: "Portrait of Pramod Vishwakarma",
      label: "Pramod Vishwakarma",
      grayscale: true,
    },
  },
];

export const aboutUi = {
  arrow: "/images/about/ui/arrow-right.svg",
  arrowWhite: "/images/about/ui/arrow-right-white.svg",
  arrowCircle: "/images/about/ui/arrow-right-circle.svg",
};

export const aboutValues = [
  {
    title: "We Own It",
    body: "We take responsibility from brief to delivery. No passing the buck, no excuses, just a commitment to make things happen.",
  },
  {
    title: "We Stay Curious",
    body: "We question the obvious, explore what’s next and keep learning. Because better work starts with better questions.",
  },
  {
    title: "We Respect People",
    body: "Good work comes from good relationships. We listen, speak up, give credit and treat every client, colleague and partner with respect.",
  },
  {
    title: "We Move Together",
    body: "Ideas get better when people come together. We collaborate across teams, share what we know and have each other’s backs.",
  },
  {
    title: "We Keep Raising the Bar",
    body: "We don’t just chase big wins. We notice the small breakthroughs, learn from every project and keep pushing the work forward.",
  },
];

export type CampaignAward = {
  client: string;
  organization: string;
  accolade: string;
  category: string;
  image: MediaSlot;
};

/** Campaign awards — creds deck slides 10–11. */
export const campaignAwards: CampaignAward[] = [
  {
    client: "Godrej Properties",
    organization: "Guinness World Records",
    accolade: "One of our biggest achievements",
    category: "1,000+ influencers went live within one hour — an official Guinness World Record.",
    image: {
      src: "/images/about/awards/godrej-guinness-record.png",
      alt: "Godrej Properties Guinness World Record campaign",
      label: "Godrej Properties",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Akbar Travels",
    organization: "e4m ICMA",
    accolade: "Content Marketing by Sector Award",
    category: "Travel & Hospitality — Content Marketing by Sector, 2024.",
    image: {
      src: "/images/about/awards/akbar-travels-icma-content-marketing.png",
      alt: "Akbar Travels e4m ICMA Content Marketing by Sector award",
      label: "Akbar Travels",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Glutone",
    organization: "e4m Health & Wellness Marketing Awards",
    accolade: "Best Audio/Video Campaign",
    category: "FMCG/Wellness — #GlowWithGlutone, 2025.",
    image: {
      src: "/images/about/awards/glutone-e4m-health-wellness-av.png",
      alt: "Glutone e4m Health & Wellness Marketing Awards trophy",
      label: "Glutone",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Royalé Touché",
    organization: "afaqs! Brand Storyz Awards",
    accolade: "Best Lead Generation Campaign (Silver)",
    category: "Brand Campaigns — ‘Sample Chhota, Toh Mazaa Bhi Chhota’.",
    image: {
      src: "/images/about/awards/royale-touche-brand-storyz-lead-gen.png",
      alt: "Royalé Touché afaqs! Brand Storyz Award",
      label: "Royalé Touché",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "VIP",
    organization: "e4m Mobile Awards",
    accolade: "Best Use of UGC",
    category: "‘In the Bag: VIP’s UGC Success Story’.",
    image: {
      src: "/images/about/awards/vip-e4m-mobile-best-ugc.png",
      alt: "VIP e4m Mobile Awards Best Use of UGC trophy",
      label: "VIP",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Abhi Loans",
    organization: "Datamatrix Awards",
    accolade: "Search Engine Marketing (Gold)",
    category: "Excellence in Data-Driven Search Engine Marketing Campaigns.",
    image: {
      src: "/images/about/awards/abhi-loans-datamatrix-sem.png",
      alt: "Abhi Loans Datamatrix Awards Search Engine Marketing trophy",
      label: "Abhi Loans",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Abhi Loans",
    organization: "afaqs! Brand Storyz Awards",
    accolade: "Best Use of Webinars (Silver)",
    category: "Brand Initiatives — Best Use of Webinars.",
    image: {
      src: "/images/about/awards/abhi-loans-brand-storyz-webinar.png",
      alt: "Abhi Loans afaqs! Brand Storyz Awards Best Use of Webinars trophy",
      label: "Abhi Loans",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Adani Group",
    organization: "IMPACT Digital Influencer Awards",
    accolade: "Most Creative Influencer Marketing Campaign",
    category: "Health, Wellness & Fitness — ‘Hum Karke Dikhate Hai’, 2025.",
    image: {
      src: "/images/about/awards/adani-impact-influencer.png",
      alt: "Adani Group IMPACT Digital Influencer Awards trophy",
      label: "Adani Group",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Akbar Travels",
    organization: "BrandWagon ACE Awards",
    accolade: "Performance Marketing Campaign",
    category: "Financial Express BrandWagon ACE Awards, 3rd Edition.",
    image: {
      src: "/images/about/awards/akbar-travels-brandwagon-ace-performance.png",
      alt: "Akbar Travels BrandWagon ACE Awards trophy",
      label: "Akbar Travels",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Karnataka One",
    organization: "Jagran FOXGLOVE Awards",
    accolade: "Best Corporate Brand — West Zone (Bronze)",
    category: "2014.",
    image: {
      src: "/images/about/awards/karnataka-one-foxglove-corporate-brand.png",
      alt: "Karnataka One Jagran FOXGLOVE Awards trophy",
      label: "Karnataka One",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Candid",
    organization: "IMPACT Digital Influencer Awards",
    accolade: "Best Multi Influencer Campaign",
    category: "Health, Wellness & Fitness — ‘Hata Khujli Laga Candid’, 2024.",
    image: {
      src: "/images/about/awards/candid-impact-influencer.png",
      alt: "Candid IMPACT Digital Influencer Awards trophy",
      label: "Candid",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Candid Dusting Powder",
    organization: "BW Marketing MERIT Awards",
    accolade: "Use of Content (Gold)",
    category: "‘Voting Day 2024’ campaign, 2025.",
    image: {
      src: "/images/about/awards/candid-bw-merit-content.png",
      alt: "Candid Dusting Powder BW Marketing MERIT Awards Use of Content trophy",
      label: "Candid Dusting Powder",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Candid Dusting Powder",
    organization: "e4m Health & Wellness Marketing Awards",
    accolade: "Best Content Marketing Campaign",
    category: "Over-the-Counter Health Heroes — #HataKhujliLagaCandid, 2025.",
    image: {
      src: "/images/about/awards/candid-e4m-content-marketing.png",
      alt: "Candid Dusting Powder e4m Health & Wellness Marketing Awards trophy",
      label: "Candid Dusting Powder",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Candid Dusting Powder",
    organization: "BW Marketing MERIT Awards",
    accolade: "Healthcare (Bronze)",
    category: "#HataKhujliLagaCandid, 2025.",
    image: {
      src: "/images/about/awards/candid-bw-merit-healthcare.png",
      alt: "Candid Dusting Powder BW Marketing MERIT Awards Healthcare trophy",
      label: "Candid Dusting Powder",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "FedEx",
    organization: "MOBEXX Summit Awards",
    accolade: "Best Integrated Multi-Channel Campaign (Gold)",
    category: "MOBEXX Summit Awards, Gold Winner.",
    image: {
      src: "/images/about/awards/fedex-mobexx-integrated-multichannel.png",
      alt: "FedEx MOBEXX Summit Awards Best Integrated Multi-Channel Campaign trophy",
      label: "FedEx",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "FedEx",
    organization: "afaqs!",
    accolade: "Best Online Integrated Campaign",
    category: "‘Where Now Meets Next’ campaign.",
    image: {
      src: "/images/about/awards/fedex-best-online-integrated.png",
      alt: "FedEx Best Online Integrated Campaign trophy",
      label: "FedEx",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Godrej Blue",
    organization: "BW Marketing MERIT Awards",
    accolade: "Real Estate & Construction (Silver)",
    category: "‘Painting Kolkata Blue’, 2025.",
    image: {
      src: "/images/about/awards/godrej-blue-bw-merit-realestate.png",
      alt: "Godrej Blue BW Marketing MERIT Awards Real Estate & Construction trophy",
      label: "Godrej Blue",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Godrej Blue",
    organization: "IMPACT Digital Influencer Awards",
    accolade: "Best Multi Influencer Campaign",
    category: "Real Estate — ‘Painting Kolkata Blue’, 2024.",
    image: {
      src: "/images/about/awards/godrej-blue-impact-influencer.png",
      alt: "Godrej Blue IMPACT Digital Influencer Awards trophy",
      label: "Godrej Blue",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Godrej Properties",
    organization: "DIGIXX Summit Awards",
    accolade: "Best Influencer Activation at Scale",
    category: "Godrej Ivara — Guinness World Record, 2026.",
    image: {
      src: "/images/about/awards/godrej-properties-digixx-influencer-activation.png",
      alt: "Godrej Properties DIGIXX Summit Awards Best Influencer Activation trophy",
      label: "Godrej Properties",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Kanakia",
    organization: "afaqs!",
    accolade: "Best Corporate Website",
    category: "Kanakia Group.",
    image: {
      src: "/images/about/awards/kanakia-best-corporate-website.png",
      alt: "Kanakia Best Corporate Website trophy",
      label: "Kanakia",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Lacto Calamine",
    organization: "Influencer Awards 2025",
    accolade: "Best Omni Channel Influencer Campaign",
    category: "Health, Wellness & Fitness — Piramal.",
    image: {
      src: "/images/about/awards/lacto-calamine-influencer-awards-omnichannel.png",
      alt: "Lacto Calamine Influencer Awards 2025 Best Omni Channel Influencer Campaign trophy",
      label: "Lacto Calamine",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "K.C. Mahindra — Nanhi Kali",
    organization: "DIGIXX Summit Awards",
    accolade: "Best Community Engagement Campaign (Bronze)",
    category: "‘Two Laljos, One Story’, 2022.",
    image: {
      src: "/images/about/awards/mahindra-digixx-community-engagement.png",
      alt: "K.C. Mahindra Nanhi Kali DIGIXX Summit Awards trophy",
      label: "K.C. Mahindra — Nanhi Kali",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Mahindra",
    organization: "JioCinema DIGIES",
    accolade: "Best Online Integrated Marketing",
    category: "Digital — ‘Nanhi Kali’, 2024.",
    image: {
      src: "/images/about/awards/mahindra-jiocinema-digies-online-integrated.png",
      alt: "Mahindra JioCinema DIGIES Best Online Integrated Marketing trophy",
      label: "Mahindra",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Natural’s Ice Cream",
    organization: "afaqs! DIGIES Awards",
    accolade: "Best Brand Awareness Campaign",
    category: "Digital.",
    image: {
      src: "/images/about/awards/naturals-icecream-digies-brand-awareness.png",
      alt: "Natural’s Ice Cream afaqs! DIGIES Awards trophy",
      label: "Natural’s Ice Cream",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Netroid Ranks",
    organization: "MOBEX Summit Awards",
    accolade: "Mobile Advertising Excellence & Performance Campaign (Bronze)",
    category: "MOBEX Summit Awards.",
    image: {
      src: "/images/about/awards/netroid-ranks-mobex-performance.png",
      alt: "Netroid Ranks MOBEX Summit Awards trophy",
      label: "Netroid Ranks",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Nicobar",
    organization: "JioCinema DIGIES",
    accolade: "Best Use of Data Analytics",
    category: "Digital.",
    image: {
      src: "/images/about/awards/nicobar-jiocinema-digies-data-analytics.png",
      alt: "Nicobar JioCinema DIGIES Best Use of Data Analytics trophy",
      label: "Nicobar",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Nicobar",
    organization: "afaqs! Startup Brands Awards",
    accolade: "Best Influencer Marketing — Single (Silver)",
    category: "Digital.",
    image: {
      src: "/images/about/awards/nicobar-startup-brands-influencer.png",
      alt: "Nicobar afaqs! Startup Brands Awards trophy",
      label: "Nicobar",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Nicobar",
    organization: "afaqs! FOXGLOVE Awards",
    accolade: "Best Performance Marketing — National (Bronze)",
    category: "2023.",
    image: {
      src: "/images/about/awards/nicobar-foxglove-performance-marketing.png",
      alt: "Nicobar afaqs! FOXGLOVE Awards trophy",
      label: "Nicobar",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Piramal Healthcare",
    organization: "IMPACT Digital Influencer Awards",
    accolade: "Most Creative Influencer Marketing Campaign",
    category: "Health, Wellness & Fitness — ‘i-woman #HarPillipilldailyNahiHoti’, 2025.",
    image: {
      src: "/images/about/awards/piramal-healthcare-impact-influencer.png",
      alt: "Piramal Healthcare IMPACT Digital Influencer Awards trophy",
      label: "Piramal Healthcare",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Wesmarc Super Doors",
    organization: "IMPACT Digital Influencer Awards",
    accolade: "Best Multi Influencer Campaign",
    category: "Real Estate — ‘The Wesmarc Super Doors Story’.",
    image: {
      src: "/images/about/awards/wesmarc-super-doors-impact-influencer.png",
      alt: "Wesmarc Super Doors IMPACT Digital Influencer Awards trophy",
      label: "Wesmarc Super Doors",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Samco Securities",
    organization: "Pitch BFSI Marketing Awards",
    accolade: "Most Effective Marketing Campaign",
    category: "Online Trading Platform — #AnDekhaSach, 2024.",
    image: {
      src: "/images/about/awards/samco-pitch-bfsi-most-effective.png",
      alt: "Samco Securities Pitch BFSI Marketing Awards trophy",
      label: "Samco Securities",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Samco Securities",
    organization: "afaqs! Startup Brands Awards",
    accolade: "Outstanding Personal Branding by Founder(s) (Silver)",
    category: "For Jimeet Modi.",
    image: {
      src: "/images/about/awards/samco-startup-brands-personal-branding.png",
      alt: "Samco Securities afaqs! Startup Brands Awards trophy",
      label: "Samco Securities",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Society Tea",
    organization: "MOBEXX Summit Awards",
    accolade: "Mobile Advertising Excellence in Cross-Screen Campaign (Silver)",
    category: "MOBEXX Summit Awards.",
    image: {
      src: "/images/about/awards/society-tea-mobexx-cross-screen.png",
      alt: "Society Tea MOBEXX Summit Awards trophy",
      label: "Society Tea",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "SOIE",
    organization: "afaqs!",
    accolade: "Best Use of Social Media for CSR",
    category: "‘Scarred & Proud’ campaign.",
    image: {
      src: "/images/about/awards/soie-best-use-social-media-csr.png",
      alt: "SOIE Best Use of Social Media for CSR trophy",
      label: "SOIE",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "SOIE",
    organization: "ET BrandEquity.com Influencer Marketing Awards",
    accolade: "Cause-Led Campaign",
    category: "‘Scarred & Proud’, 2022.",
    image: {
      src: "/images/about/awards/soie-brandequity-cause-led.png",
      alt: "SOIE ET BrandEquity.com Influencer Marketing Awards trophy",
      label: "SOIE",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Spigen",
    organization: "BW Marketing MERIT Awards",
    accolade: "Consumer Durables (Gold)",
    category: "Spigen Surge, 2025.",
    image: {
      src: "/images/about/awards/spigen-bw-merit-consumer-durable.png",
      alt: "Spigen BW Marketing MERIT Awards Consumer Durables trophy",
      label: "Spigen",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "VIP",
    organization: "Datamatrix Group Awards",
    accolade: "Most Innovative Use of Customer Data (Gold)",
    category: "‘Data-Led Precision for Every Kind of Traveler’.",
    image: {
      src: "/images/about/awards/vip-datamatrix-customer-data.png",
      alt: "VIP Datamatrix Group Awards Most Innovative Use of Customer Data trophy",
      label: "VIP",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
  {
    client: "Cello",
    organization: "Media Strategy Awards",
    accolade: "Influencer Media Plan",
    category: "‘Your All Day Dost’ campaign, 2021.",
    image: {
      src: "/images/about/awards/cello-media-strategy-influencer-plan.png",
      alt: "Cello Media Strategy Awards Influencer Media Plan trophy",
      label: "Cello",
      fit: "contain",
      grayscale: false,
    } satisfies MediaSlot,
  },
];

export const aboutFeaturedAchievement = {
  client: "Godrej Properties",
  eyebrow: "One of our biggest achievements",
  title: "Guinness World Record — 1,000+ influencers live in one hour",
  body: "1,000+ influencers went live within one hour, earning Godrej Properties an official Guinness World Record.",
  href: "/work/godrej-blue",
  sectionCta: { label: "View all awards", href: "/awards" },
};

export const aboutCta = {
  titleBefore: "Got a challenge?",
  titleAccent: "Bring it on.",
  body: "Partner with a team built around strategy, creative, media, technology and data — working as one growth system.",
  button: { label: "Let’s talk", href: "/contact" },
  secondary: { label: "View awards", href: "/awards" },
  tertiary: { label: "Our offices", href: "/contact#offices" },
  burst: "/images/about/hero/radial-burst.svg",
};

export { officeLocations as aboutLocations } from "@/content/offices";
export type { OfficeLocation as AboutLocation } from "@/content/offices";

export const featuredCampaignAward = campaignAwards[0];
