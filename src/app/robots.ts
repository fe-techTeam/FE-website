import type { MetadataRoute } from "next";
import { SITE_URL, isNoIndex } from "@/lib/seo";

/**
 * AI crawler policy — a deliberate decision, not a default.
 *
 * First Economy wants to be found, cited and described correctly by AI tools, so every named AI crawler
 * is explicitly allowed. To opt a bot out later, move its name from `AI_BOTS_ALLOWED` to `AI_BOTS_BLOCKED`.
 *
 * - Search / answer retrieval (these fetch pages to answer a user's question and link back — keep allowed).
 * - Training (these collect content for model training; allowing them improves how well the brand is known).
 *   `Google-Extended` and `Applebot-Extended` only control AI-training use; they do not affect ranking or
 *   AI Overviews eligibility in search.
 *
 * A crawler that has its own group ignores the `*` group, so the private paths are repeated for it.
 * If Cloudflare's "block AI bots" / managed robots.txt setting is on, it can override this file — check it.
 */
const AI_BOTS_RETRIEVAL = ["OAI-SearchBot", "ChatGPT-User", "PerplexityBot", "Perplexity-User", "Claude-SearchBot", "Claude-User"];
const AI_BOTS_TRAINING = ["GPTBot", "ClaudeBot", "Google-Extended", "Applebot-Extended", "CCBot"];
const AI_BOTS_ALLOWED = [...AI_BOTS_RETRIEVAL, ...AI_BOTS_TRAINING];
const AI_BOTS_BLOCKED: string[] = [];

// /cdn-cgi/ hosts Cloudflare's email-protection links, which appear on every page.
// /proposal/ = legacy client proposal pages (static HTML in public/proposal/); the old site disallowed it too.
const PRIVATE_PATHS = ["/admin", "/api/", "/cdn-cgi/", "/proposal/"];

export default function robots(): MetadataRoute.Robots {
  // Staging/preview deploys (SITE_NOINDEX=true) block everything; production leaves the var unset.
  if (isNoIndex()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE_PATHS },
      { userAgent: AI_BOTS_ALLOWED, allow: "/", disallow: PRIVATE_PATHS },
      ...(AI_BOTS_BLOCKED.length ? [{ userAgent: AI_BOTS_BLOCKED, disallow: "/" }] : []),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
