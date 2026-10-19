/**
 * Feature switches for content that is written but not yet shown.
 *
 * FAQS_ENABLED gates BOTH the visible FAQ sections (service pages, home, about) and their FAQPage JSON-LD together.
 * They must never be split: FAQPage markup for text that is not visible on the page breaks Google's structured-data
 * rules. The copy stays in `servicePages/faqs.ts` and `siteFaqs.ts`; set this to `true` to publish it.
 */
export const FAQS_ENABLED = false;

/**
 * SERVICE_GUIDES_ENABLED shows the long-form "In depth" section on each service page (copy in `servicePages/guides.ts`).
 * Hidden for now; set to `true` to publish it.
 */
export const SERVICE_GUIDES_ENABLED = false;

/**
 * WORK_TAGS_ENABLED shows the small tag chips (e.g. Branding, OOH, Influencer, Print) under the hero text of each
 * case-study page. Hidden for now; set to `true` to show them again.
 */
export const WORK_TAGS_ENABLED = false;
