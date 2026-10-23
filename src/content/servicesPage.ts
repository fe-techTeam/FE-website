/**
 * Services landing page content and media slots.
 * Assets live in /public/images/services/.
 */

import type { MediaSlot } from "@/content/about";

export const servicesHero = {
  headlineBefore: "Big challenges need",
  headlineAccent: "more than one kind",
  headlineAfter: "of thinking.",
  body: "That’s where we come in. From strategy and creative to media, technology and AI, we bring different capabilities together to get brands moving.",
  image: {
    src: "/images/services/hero/meeting.jpg",
    alt: "First Economy team in a glass meeting room with wall graphic Strategy Creative Media Technology Data equals Growth",
    label: "Services hero photo",
    grayscale: false,
  } satisfies MediaSlot,
  burst: "/images/services/hero/radial-burst.svg",
  arrow: "/images/services/hero/arrow-circle.svg",
};

export const servicesGrid = {
  eyebrow: "What we do",
  titleBefore: "Capabilities that",
  titleAfter: "drive growth",
  body: "An integrated suite of solutions across the entire marketing and technology ecosystem — one growth system, not disconnected departments.",
};

export const servicesProcess = {
  eyebrow: "Our Process",
  title: "How We Engineer Growth",
};

export const servicesProcessSteps = [
  {
    number: "01",
    title: "Discover",
    body: "We dig into your brand, audience and market to uncover the real growth constraints.",
    icon: {
      src: "/images/services/process/discover_magnifier.svg",
      alt: "",
      label: "Discover",
    } satisfies MediaSlot,
  },
  {
    number: "02",
    title: "Strategize",
    body: "We define the system — channels, creative, technology and data working as one plan.",
    icon: {
      src: "/images/services/process/strategize_nodes.svg",
      alt: "",
      label: "Strategize",
    } satisfies MediaSlot,
  },
  {
    number: "03",
    title: "Build",
    body: "We produce the assets, platforms and campaigns that turn strategy into execution.",
    icon: {
      src: "/images/services/process/build_gear.svg",
      alt: "",
      label: "Build",
    } satisfies MediaSlot,
  },
  {
    number: "04",
    title: "Launch",
    body: "We go live with precision — media, creative and tech coordinated for day-one impact.",
    icon: {
      src: "/images/services/process/launch_rocket.svg",
      alt: "",
      label: "Launch",
    } satisfies MediaSlot,
  },
  {
    number: "05",
    title: "Optimize",
    body: "We measure, learn and refine so performance compounds instead of resetting.",
    icon: {
      src: "/images/services/process/optimize_chart.svg",
      alt: "",
      label: "Optimize",
    } satisfies MediaSlot,
  },
];

export const servicesTrusted = {
  title: "Trusted by forward-thinking brands",
  logos: [
    {
      name: "Godrej",
      src: "/images/services/logos/godrej.png",
      w: 972,
      h: 479,
    },
    {
      name: "FedEx",
      src: "/images/services/logos/fedex.png",
      w: 806,
      h: 245,
    },
    {
      name: "Mahindra",
      src: "/images/services/logos/mahindra.png",
      w: 954,
      h: 142,
    },
    {
      name: "Ajanta",
      src: "/images/services/logos/ajanta.png",
      w: 905,
      h: 273,
    },
    {
      name: "Waaree",
      src: "/images/services/logos/waaree.png",
      w: 952,
      h: 287,
    },
    {
      name: "Orpat",
      src: "/images/services/logos/orpat.png",
      w: 937,
      h: 276,
    },
  ],
};

export const servicesCta = {
  titleBefore: "Got a challenge?",
  titleAccent: "Bring it on.",
  body: "Ready to scale your brand with strategy, creativity and technology?",
  button: { label: "Let’s talk", href: "/contact" },
};
