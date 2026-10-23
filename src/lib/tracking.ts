import { isNoIndex } from "@/lib/seo";

/**
 * Tracking carried over from the live firsteconomy.com site (read from its public HTML, 7 Oct 2026):
 * one Google Tag Manager container on every page, and the Google Search Console ownership tag on the home page.
 * Everything else (GA4, ads, pixels) is configured inside that container, not in the page code.
 *
 * Both IDs are public identifiers. Override the container with NEXT_PUBLIC_GTM_ID; set it to an empty string to
 * switch tracking off.
 */
export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID ?? "GTM-THFF9GV";

/** Search Console "HTML tag" ownership token already verified for the live domain. */
export const GOOGLE_SITE_VERIFICATION = "tslZa_I43OrTQqlmimoyxs8CsAQwbCeMiYcUFG_j_do";

/**
 * The live domain. Tracking switches on when the page is served from one of these hostnames and nowhere else —
 * not localhost, not preview/staging URLs, and not whatever NEXT_PUBLIC_SITE_URL happens to be set to.
 * If the production domain ever changes, update this list.
 */
export const LIVE_HOSTNAMES = ["www.firsteconomy.com", "firsteconomy.com"];

/** Build-time gate: only production builds meant to be indexed include the tag manager. Staging/preview (SITE_NOINDEX) never do. */
export const trackingEnabled = () => process.env.NODE_ENV === "production" && !isNoIndex() && GTM_ID.length > 0;
