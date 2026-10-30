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

/**
 * HOME_OFFICES_ENABLED shows the "Our offices / Where we operate" section on the home page. Hidden for now; set to
 * `true` to show it again. The offices are still listed on /contact and in the footer.
 */
export const HOME_OFFICES_ENABLED = false;

/**
 * HOME_STATS_DESCRIPTIONS_ENABLED shows the short sentence under each number in the home page stats band
 * (e.g. "A growing presence across cities."). Hidden for now; the copy stays in the stats data, so set this to
 * `true` to show it again.
 */
export const HOME_STATS_DESCRIPTIONS_ENABLED = false;

/**
 * SERVICES_CREATIVE_CARD_ENABLED shows the "Creative Solutions" card in the services grid (home page and /services).
 * Hidden for now; the service page, footer link and everything else are unchanged. Set to `true` to show the card.
 */
export const SERVICES_CREATIVE_CARD_ENABLED = false;

/**
 * AI_SOLUTIONS_ENABLED shows the AI Solutions service: its card in the services grid, footer, llms.txt and schema,
 * its contact-form option, its sitemap entry and the /services/ai-solutions page itself (a 404 while hidden), and its
 * link from case studies. Hidden for now; all copy is kept, so set this to `true` to bring it back.
 */
export const AI_SOLUTIONS_ENABLED = false;

