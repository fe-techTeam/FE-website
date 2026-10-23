import { officeLocations } from "@/content/offices";
import { serviceOfferings } from "@/content/serviceOfferings";
import { contactInfo, socialLinks } from "@/content/site";
import { companyOfficeScale } from "@/content/stats";

export const SITE_NAME = "First Economy";

/**
 * One source of truth for the public origin. Canonical, og:url, sitemap and
 * JSON-LD all derive from this — set NEXT_PUBLIC_SITE_URL per environment.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.firsteconomy.com").replace(/\/$/, "");

export const DEFAULT_OG_IMAGE = "/og-default.png";

/** Site-wide positioning sentence: root meta description and Organization/WebSite schema. */
export const SITE_DESCRIPTION =
  "First Economy is an integrated digital marketing agency in India combining media buying, creative, technology, SEO, social, influencer marketing and AI.";

export function absoluteUrl(path = "/") {
  if (path === "/" || path === "") return `${SITE_URL}/`;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Staging/preview deploys set SITE_NOINDEX=true; production leaves it unset. */
export const isNoIndex = () => process.env.SITE_NOINDEX === "true";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    logo: `${SITE_URL}/icons/icon-512.png`,
    description: SITE_DESCRIPTION,
    email: contactInfo.email,
    telephone: contactInfo.phone,
    address: hqAddress(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: contactInfo.phone,
      email: contactInfo.email,
      areaServed: "IN",
      availableLanguage: ["English"],
    },
    numberOfEmployees: { "@type": "QuantitativeValue", value: companyOfficeScale.people.value },
    areaServed: { "@type": "Country", name: "India" },
    knowsAbout: serviceOfferings.map((service) => service.name),
    award: "Guinness World Record — 1,000+ influencers live in one hour, with Godrej Properties",
    sameAs: socialLinks.map((link) => link.href),
  };
}

function hqAddress() {
  const hq = officeLocations.find((office) => office.isHq) ?? officeLocations[0];
  return {
    "@type": "PostalAddress",
    streetAddress: hq.address,
    addressLocality: hq.city,
    addressCountry: "IN",
  };
}

/** Pairs with Organization: names the site, its language and its publisher. No SearchAction — the site has no search. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: SITE_DESCRIPTION,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/** Case study as an Article. `dateModified` comes from git history; no datePublished is emitted because the campaigns' real publication dates are not in the content. */
export function caseStudyJsonLd({
  headline,
  description,
  path,
  image,
  client,
  dateModified,
}: {
  headline: string;
  description: string;
  path: string;
  image?: string;
  client: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    ...(image ? { image: absoluteUrl(image) } : {}),
    ...(dateModified ? { dateModified } : {}),
    about: { "@type": "Organization", name: client },
    author: { "@id": `${SITE_URL}/#organization` },
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-IN",
  };
}

export function localBusinessJsonLd() {
  return officeLocations.map((office) => ({
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${SITE_URL}/contact#${office.slug}`,
    name: `${SITE_NAME} — ${office.city}`,
    url: absoluteUrl("/contact"),
    image: absoluteUrl(office.image.src),
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    telephone: office.contact?.phone ?? contactInfo.phone,
    email: office.contact?.email ?? contactInfo.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: office.address,
      addressLocality: office.city,
      addressCountry: "IN",
    },
  }));
}

export type BreadcrumbEntry = { label: string; href?: string };

/** The current (last) page has no href, so it is emitted without `item`, which Google allows. */
export function breadcrumbJsonLd(items: BreadcrumbEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function serviceJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: absoluteUrl(path),
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "India" },
  };
}

/** Text must match the visible FAQ exactly — render both from the same array. */
export function faqPageJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** One VideoObject per case-study film. Google needs name, thumbnail and uploadDate; skip a video that lacks any of them. */
export function videoObjectJsonLd({
  name,
  description,
  thumbnail,
  contentUrl,
  uploadDate,
  pagePath,
}: {
  name: string;
  description: string;
  thumbnail: string;
  contentUrl: string;
  uploadDate: string;
  pagePath: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: absoluteUrl(thumbnail),
    contentUrl: absoluteUrl(contentUrl),
    uploadDate,
    url: absoluteUrl(pagePath),
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function jobPostingJsonLd({
  title,
  description,
  path,
  location,
  employmentType,
  datePosted,
  validThrough,
}: {
  title: string;
  description: string;
  path: string;
  location: string;
  employmentType: string;
  datePosted?: string;
  validThrough?: string;
}) {
  const type = employmentType.toLowerCase().includes("part")
    ? "PART_TIME"
    : employmentType.toLowerCase().includes("intern")
      ? "INTERN"
      : employmentType.toLowerCase().includes("contract")
        ? "CONTRACTOR"
        : "FULL_TIME";

  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title,
    description,
    url: absoluteUrl(path),
    employmentType: type,
    ...(datePosted ? { datePosted } : {}),
    ...(validThrough ? { validThrough } : {}),
    hiringOrganization: { "@type": "Organization", name: SITE_NAME, sameAs: absoluteUrl("/") },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: location, addressCountry: "IN" },
    },
  };
}
