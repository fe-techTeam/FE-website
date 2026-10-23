import type { FieldDef } from "@/lib/admin/fields";

/**
 * Starting structure, seeded into the database on first run.
 *
 * This file is only a *seed*. Once seeded, `ContentType` and `SectionType`
 * rows are the source of truth and are edited from Admin → Structure, so the
 * site can gain pages and sections without touching code.
 *
 * Client-safe.
 */

export type ContentTypeSeed = {
  key: string;
  label: string;
  singular: string;
  kind: "COLLECTION" | "SINGLETON";
  group: string;
  icon: string;
  description: string;
  detailPath?: string;
  revalidatePaths: string[];
  orderable?: boolean;
  usesSections?: boolean;
  allowedSectionKeys?: string[];
  fields: FieldDef[];
};

export type SectionTypeSeed = {
  key: string;
  label: string;
  description: string;
  icon: string;
  group: string;
  fields: FieldDef[];
};

// ---------------------------------------------------------------------------
// Reusable field fragments
// ---------------------------------------------------------------------------

const eyebrow: FieldDef = { key: "eyebrow", label: "Eyebrow", type: "text", width: "half" };
const heading: FieldDef = { key: "title", label: "Title", type: "text", required: true };
const body: FieldDef = { key: "body", label: "Body", type: "textarea" };

const button: FieldDef = {
  key: "button",
  label: "Button",
  type: "group",
  fields: [
    { key: "label", label: "Label", type: "text", width: "half" },
    { key: "href", label: "Link", type: "url", width: "half" },
  ],
};

const image = (key = "image", label = "Image"): FieldDef => ({
  key,
  label,
  type: "image",
  help: "Path under /public, plus alt text for screen readers.",
});

// ---------------------------------------------------------------------------
// Section library — mirrors the bands the site already renders
// ---------------------------------------------------------------------------

export const SECTION_TYPE_SEEDS: SectionTypeSeed[] = [
  {
    key: "hero",
    label: "Hero",
    description: "Page opener — eyebrow, split headline, body, visual and a call to action.",
    icon: "Sparkles",
    group: "Openers",
    fields: [
      eyebrow,
      { key: "headlineBefore", label: "Headline (before accent)", type: "text" },
      { key: "headlineAccent", label: "Headline (accent)", type: "text" },
      { key: "headlineAfter", label: "Headline (after accent)", type: "text" },
      body,
      image("image", "Hero image"),
      button,
    ],
  },
  {
    key: "rich-text",
    label: "Rich text",
    description: "A block of formatted copy.",
    icon: "Type",
    group: "Content",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text", width: "half" },
      { key: "title", label: "Title", type: "text" },
      { key: "content", label: "Content", type: "richtext", required: true },
    ],
  },
  {
    key: "stats-band",
    label: "Stats band",
    description: "Row of oversized numbers with labels.",
    icon: "ChartNoAxesCombined",
    group: "Proof",
    fields: [
      eyebrow,
      { key: "title", label: "Title", type: "text" },
      {
        key: "stats",
        label: "Stats",
        type: "list",
        itemLabel: "Add stat",
        fields: [
          { key: "value", label: "Value", type: "text", required: true, width: "half" },
          { key: "suffix", label: "Suffix", type: "text", width: "half" },
          { key: "label", label: "Label", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "card-grid",
    label: "Card grid",
    description: "Grid of cards with an icon, title, body and optional link.",
    icon: "LayoutGrid",
    group: "Content",
    fields: [
      eyebrow,
      { key: "title", label: "Title", type: "text" },
      body,
      {
        key: "cards",
        label: "Cards",
        type: "list",
        itemLabel: "Add card",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "body", label: "Body", type: "textarea" },
          image("icon", "Icon"),
          { key: "href", label: "Link", type: "url" },
        ],
      },
    ],
  },
  {
    key: "process-steps",
    label: "Process steps",
    description: "Numbered steps, as used on the services and careers pages.",
    icon: "ListOrdered",
    group: "Content",
    fields: [
      eyebrow,
      { key: "title", label: "Title", type: "text" },
      body,
      {
        key: "steps",
        label: "Steps",
        type: "list",
        itemLabel: "Add step",
        fields: [
          { key: "number", label: "Number", type: "text", width: "half" },
          { key: "title", label: "Title", type: "text", required: true, width: "half" },
          { key: "body", label: "Body", type: "textarea" },
          image("icon", "Icon"),
        ],
      },
    ],
  },
  {
    key: "feature-split",
    label: "Image + copy",
    description: "Two-column band: visual on one side, copy and a link on the other.",
    icon: "Columns2",
    group: "Content",
    fields: [
      eyebrow,
      heading,
      body,
      image(),
      {
        key: "imagePosition",
        label: "Image position",
        type: "select",
        width: "half",
        options: [
          { label: "Left", value: "left" },
          { label: "Right", value: "right" },
        ],
      },
      { key: "bullets", label: "Bullets", type: "list", itemType: "text", itemLabel: "Add bullet" },
      button,
    ],
  },
  {
    key: "logo-wall",
    label: "Logo wall",
    description: "Client or partner logos pulled from a collection.",
    icon: "Handshake",
    group: "Proof",
    fields: [
      eyebrow,
      { key: "title", label: "Title", type: "text" },
      {
        key: "source",
        label: "Logos",
        type: "reference",
        referenceType: "clients",
        multiple: true,
        help: "Leave empty to show every logo in the collection.",
      },
    ],
  },
  {
    key: "gallery",
    label: "Gallery",
    description: "Grouped image gallery, as on case study pages.",
    icon: "Images",
    group: "Media",
    fields: [
      { key: "title", label: "Title", type: "text" },
      {
        key: "groups",
        label: "Groups",
        type: "list",
        itemLabel: "Add group",
        fields: [
          { key: "title", label: "Group title", type: "text", required: true },
          { key: "images", label: "Images", type: "list", itemType: "image", itemLabel: "Add image" },
        ],
      },
    ],
  },
  {
    key: "video",
    label: "Video",
    description: "One or more films with a poster frame.",
    icon: "Video",
    group: "Media",
    fields: [
      { key: "title", label: "Title", type: "text" },
      {
        key: "videos",
        label: "Videos",
        type: "list",
        itemLabel: "Add video",
        fields: [
          { key: "title", label: "Title", type: "text", required: true },
          { key: "description", label: "Description", type: "textarea" },
          { key: "src", label: "Video", type: "video" },
          image("poster", "Poster frame"),
        ],
      },
    ],
  },
  {
    key: "timeline",
    label: "Timeline",
    description: "Milestones across a horizontal or vertical rule.",
    icon: "GitCommitHorizontal",
    group: "Content",
    fields: [
      eyebrow,
      { key: "title", label: "Title", type: "text" },
      {
        key: "milestones",
        label: "Milestones",
        type: "list",
        itemLabel: "Add milestone",
        fields: [
          { key: "year", label: "Year", type: "text", width: "half" },
          { key: "title", label: "Title", type: "text", required: true, width: "half" },
          { key: "body", label: "Body", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "accordion",
    label: "Accordion / FAQ",
    description: "Expandable question-and-answer rows.",
    icon: "ChevronsUpDown",
    group: "Content",
    fields: [
      eyebrow,
      { key: "title", label: "Title", type: "text" },
      {
        key: "items",
        label: "Items",
        type: "list",
        itemLabel: "Add item",
        fields: [
          { key: "title", label: "Question", type: "text", required: true },
          { key: "body", label: "Answer", type: "richtext" },
        ],
      },
    ],
  },
  {
    key: "quote",
    label: "Quote",
    description: "Pull quote with attribution.",
    icon: "Quote",
    group: "Proof",
    fields: [
      { key: "quote", label: "Quote", type: "textarea", required: true },
      { key: "author", label: "Author", type: "text", width: "half" },
      { key: "role", label: "Role", type: "text", width: "half" },
      image("avatar", "Photo"),
    ],
  },
  {
    key: "content-carousel",
    label: "Content carousel",
    description: "Horizontal carousel of entries from a collection.",
    icon: "GalleryHorizontal",
    group: "Content",
    fields: [
      eyebrow,
      { key: "title", label: "Title", type: "text" },
      body,
      {
        key: "entries",
        label: "Entries",
        type: "reference",
        referenceType: "case-studies",
        multiple: true,
        help: "Leave empty to show the most recent entries automatically.",
      },
      { key: "limit", label: "How many to show", type: "number", width: "half" },
      {
        key: "exploreLink",
        label: "Explore link",
        type: "group",
        fields: [
          { key: "label", label: "Label", type: "text", width: "half" },
          { key: "href", label: "Link", type: "url", width: "half" },
        ],
      },
    ],
  },
  {
    key: "link-group",
    label: "Link group",
    description: "External proof links — articles, Instagram posts, live URLs.",
    icon: "Link",
    group: "Proof",
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      {
        key: "links",
        label: "Links",
        type: "list",
        itemLabel: "Add link",
        fields: [
          { key: "label", label: "Label", type: "text", required: true },
          { key: "href", label: "URL", type: "url", required: true },
          { key: "description", label: "Description", type: "text" },
          image("thumbnail", "Thumbnail"),
        ],
      },
    ],
  },
  {
    key: "cta-band",
    label: "CTA band",
    description: "Closing call to action.",
    icon: "Megaphone",
    group: "Openers",
    fields: [
      { key: "titleBefore", label: "Title (before accent)", type: "text" },
      { key: "titleAccent", label: "Title (accent)", type: "text" },
      body,
      button,
      {
        key: "secondary",
        label: "Secondary button",
        type: "group",
        fields: [
          { key: "label", label: "Label", type: "text", width: "half" },
          { key: "href", label: "Link", type: "url", width: "half" },
        ],
      },
    ],
  },
  {
    key: "embed",
    label: "Embed",
    description: "Third-party embed by URL — map, form, player.",
    icon: "Code",
    group: "Media",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "url", label: "Embed URL", type: "url", required: true },
      { key: "height", label: "Height (px)", type: "number", width: "half" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Content types
// ---------------------------------------------------------------------------

/** Every page-style type may use any section. */
const PAGE_SECTIONS: string[] = [];

const seoFields: FieldDef[] = [
  { key: "metaTitle", label: "Meta title", type: "text", width: "half" },
  { key: "metaDescription", label: "Meta description", type: "textarea" },
  image("ogImage", "Social share image"),
];

function page(
  key: string,
  label: string,
  icon: string,
  description: string,
  revalidatePaths: string[],
): ContentTypeSeed {
  return {
    key,
    label,
    singular: `${label} page`,
    kind: "SINGLETON",
    group: "Pages",
    icon,
    description,
    revalidatePaths,
    usesSections: true,
    allowedSectionKeys: PAGE_SECTIONS,
    fields: [{ key: "title", label: "Page title", type: "text", required: true }, ...seoFields],
  };
}

export const CONTENT_TYPE_SEEDS: ContentTypeSeed[] = [
  // ------------------------------------------------------------- Collections
  {
    key: "case-studies",
    label: "Case Studies",
    singular: "Case study",
    kind: "COLLECTION",
    group: "Content",
    icon: "Briefcase",
    description: "Client work — challenge, execution, results, galleries and films.",
    orderable: true,
    detailPath: "/work/[slug]",
    revalidatePaths: ["/", "/work", "/work/[slug]"],
    usesSections: true,
    allowedSectionKeys: PAGE_SECTIONS,
    fields: [
      { key: "client", label: "Client", type: "text", required: true, width: "half" },
      { key: "campaign", label: "Campaign", type: "text", required: true, width: "half" },
      { key: "industry", label: "Industry", type: "text", width: "half" },
      { key: "year", label: "Year", type: "number", width: "half" },
      { key: "hero", label: "Hero line", type: "textarea" },
      { key: "tags", label: "Tags", type: "list", itemType: "text", itemLabel: "Add tag" },
      image("clientLogo", "Client logo"),
      { key: "featured", label: "Featured", type: "boolean", width: "half" },
      { key: "flagship", label: "Flagship", type: "boolean", width: "half" },
      ...seoFields,
    ],
  },
  {
    key: "careers",
    label: "Open Roles",
    singular: "Role",
    kind: "COLLECTION",
    group: "Content",
    icon: "UserPlus",
    description: "Job openings and their detail pages.",
    detailPath: "/careers/[slug]",
    revalidatePaths: ["/", "/careers", "/careers/[slug]"],
    usesSections: true,
    allowedSectionKeys: PAGE_SECTIONS,
    fields: [
      { key: "title", label: "Role title", type: "text", required: true },
      { key: "department", label: "Department", type: "text", width: "half" },
      { key: "location", label: "Location", type: "text", width: "half" },
      { key: "type", label: "Employment type", type: "text", width: "half" },
      { key: "experience", label: "Experience", type: "text", width: "half" },
      { key: "summary", label: "Summary", type: "textarea" },
      ...seoFields,
    ],
  },
  {
    key: "service-pages",
    label: "Service Pages",
    singular: "Service page",
    kind: "COLLECTION",
    group: "Content",
    icon: "Layers",
    description: "The full detail page for each service offering.",
    detailPath: "/services/[slug]",
    revalidatePaths: ["/services", "/services/[slug]"],
    usesSections: true,
    allowedSectionKeys: PAGE_SECTIONS,
    fields: [
      { key: "name", label: "Service name", type: "text", required: true },
      { key: "summary", label: "Summary", type: "textarea" },
      ...seoFields,
    ],
  },
  {
    key: "services",
    label: "Service Taxonomy",
    singular: "Service",
    kind: "COLLECTION",
    group: "Content",
    icon: "Tags",
    description: "Service definitions that link capabilities to case studies.",
    revalidatePaths: ["/services", "/work"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, width: "half" },
      { key: "shortName", label: "Short name", type: "text", width: "half" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "family", label: "Family", type: "text", width: "half" },
      {
        key: "capabilities",
        label: "Capabilities",
        type: "list",
        itemType: "text",
        itemLabel: "Add capability",
      },
      {
        key: "caseStudies",
        label: "Case studies",
        type: "reference",
        referenceType: "case-studies",
        multiple: true,
      },
    ],
  },
  {
    key: "service-offerings",
    label: "Service Offerings",
    singular: "Offering",
    kind: "COLLECTION",
    group: "Content",
    icon: "Grid3x3",
    description: "Cards shown on the services landing grid.",
    orderable: true,
    revalidatePaths: ["/", "/services"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "href", label: "Link", type: "url", width: "half" },
      image("icon", "Icon"),
    ],
  },
  {
    key: "industries",
    label: "Industries",
    singular: "Industry",
    kind: "COLLECTION",
    group: "Content",
    icon: "Building2",
    description: "Industry groupings and their tone, used to filter work.",
    revalidatePaths: ["/work"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      { key: "overview", label: "Overview", type: "textarea" },
      { key: "tone", label: "Tone", type: "text", width: "half" },
      { key: "clients", label: "Clients", type: "list", itemType: "text", itemLabel: "Add client" },
    ],
  },

  // ------------------------------------------------------------------- Pages
  page("home-page", "Home", "House", "The homepage.", ["/"]),
  page("about-page", "About", "Info", "Story, timeline, values and achievements.", ["/about"]),
  page("work-page", "Work Landing", "LayoutGrid", "The work index.", ["/work"]),
  page("services-page", "Services Landing", "ListTree", "The services index.", ["/services"]),
  page("careers-page", "Careers Landing", "HeartHandshake", "The careers index.", ["/careers"]),
  page("contact-page", "Contact", "Mail", "The contact page.", ["/contact"]),
  {
    key: "legal",
    label: "Legal",
    singular: "Legal document",
    kind: "COLLECTION",
    group: "Pages",
    icon: "Scale",
    description: "Privacy Policy and any future legal document.",
    revalidatePaths: ["/privacy-policy"],
    usesSections: true,
    allowedSectionKeys: ["rich-text"],
    fields: [
      { key: "title", label: "Title", type: "text", required: true },
      { key: "updatedAt", label: "Last updated", type: "date", width: "half" },
      { key: "intro", label: "Intro", type: "textarea" },
      ...seoFields,
    ],
  },

  // --------------------------------------------------------- People & proof
  {
    key: "team",
    label: "Leadership",
    singular: "Team member",
    kind: "COLLECTION",
    group: "People & Proof",
    icon: "Users",
    description: "Leadership carousel on the About page.",
    orderable: true,
    revalidatePaths: ["/about"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true, width: "half" },
      { key: "title", label: "Job title", type: "text", width: "half" },
      { key: "linkedin", label: "LinkedIn", type: "url" },
      image("image", "Photo"),
    ],
  },
  {
    key: "awards",
    label: "Awards",
    singular: "Award",
    kind: "COLLECTION",
    group: "People & Proof",
    icon: "Trophy",
    description: "Campaign awards shown in the gallery and on About.",
    orderable: true,
    revalidatePaths: ["/awards", "/about"],
    fields: [
      { key: "client", label: "Client", type: "text", required: true, width: "half" },
      { key: "organization", label: "Awarded by", type: "text", width: "half" },
      { key: "accolade", label: "Accolade", type: "text", required: true },
      { key: "category", label: "Category", type: "text", width: "half" },
      image("image", "Award image"),
    ],
  },
  {
    key: "clients",
    label: "Client Logos",
    singular: "Client",
    kind: "COLLECTION",
    group: "People & Proof",
    icon: "Handshake",
    description: "Trusted-by logo wall.",
    orderable: true,
    revalidatePaths: ["/", "/about"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      image("src", "Logo"),
    ],
  },
  {
    key: "partners",
    label: "Platform Partners",
    singular: "Partner",
    kind: "COLLECTION",
    group: "People & Proof",
    icon: "Plug",
    description: "Media platform partners and data tools.",
    orderable: true,
    revalidatePaths: ["/", "/services"],
    fields: [
      { key: "name", label: "Name", type: "text", required: true },
      image("src", "Logo"),
    ],
  },
  {
    key: "stats",
    label: "Network Stats",
    singular: "Stat",
    kind: "COLLECTION",
    group: "People & Proof",
    icon: "ChartNoAxesCombined",
    description: "Headline numbers reused across home, about and awards.",
    orderable: true,
    revalidatePaths: ["/", "/about", "/awards"],
    fields: [
      { key: "label", label: "Label", type: "text", required: true, width: "half" },
      { key: "value", label: "Value", type: "text", required: true, width: "half" },
      { key: "suffix", label: "Suffix", type: "text", width: "half" },
      { key: "showPlus", label: "Show a trailing +", type: "boolean", width: "half" },
      { key: "description", label: "Description", type: "textarea" },
    ],
  },

  // -------------------------------------------------------------------- Site
  {
    key: "offices",
    label: "Offices",
    singular: "Office",
    kind: "COLLECTION",
    group: "Site",
    icon: "MapPin",
    description: "City locations, addresses and local contact details.",
    orderable: true,
    revalidatePaths: ["/", "/contact"],
    fields: [
      { key: "city", label: "City", type: "text", required: true, width: "half" },
      { key: "isHq", label: "Head office", type: "boolean", width: "half" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "address", label: "Address", type: "textarea" },
      {
        key: "contact",
        label: "Local contact",
        type: "group",
        fields: [
          { key: "name", label: "Name", type: "text", width: "half" },
          { key: "email", label: "Email", type: "email", width: "half" },
          { key: "phone", label: "Phone", type: "text", width: "half" },
        ],
      },
      image("image", "Photo"),
    ],
  },
  {
    key: "site-settings",
    label: "Site Settings",
    singular: "Site settings",
    kind: "SINGLETON",
    group: "Site",
    icon: "Settings",
    description: "Contact details, social profiles, footer CTA and navigation.",
    revalidatePaths: ["/"],
    fields: [
      {
        key: "contact",
        label: "Contact",
        type: "group",
        fields: [
          { key: "email", label: "Email", type: "email", width: "half" },
          { key: "phone", label: "Phone", type: "text", width: "half" },
        ],
      },
      {
        key: "socialLinks",
        label: "Social profiles",
        type: "list",
        itemLabel: "Add profile",
        fields: [
          { key: "label", label: "Network", type: "text", required: true, width: "half" },
          { key: "href", label: "URL", type: "url", required: true, width: "half" },
        ],
      },
      {
        key: "footerCta",
        label: "Footer CTA",
        type: "group",
        fields: [
          { key: "headline", label: "Headline", type: "text" },
          { key: "primaryLabel", label: "Button label", type: "text", width: "half" },
          { key: "primaryHref", label: "Button link", type: "url", width: "half" },
        ],
      },
      {
        key: "navigation",
        label: "Header navigation",
        type: "list",
        itemLabel: "Add link",
        fields: [
          { key: "label", label: "Label", type: "text", required: true, width: "half" },
          { key: "href", label: "Link", type: "url", required: true, width: "half" },
        ],
      },
    ],
  },
];

export const CONTENT_GROUPS = ["Content", "Pages", "People & Proof", "Site"] as const;
export type ContentGroup = (typeof CONTENT_GROUPS)[number];
