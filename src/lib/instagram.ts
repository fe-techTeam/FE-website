/**
 * Instagram link helpers — resolve post/reel thumbnails via Open Graph.
 * Profile URLs (no shortcode) cannot yield a post thumbnail without Graph API.
 */

export type InstagramLinkKind = "reel" | "post" | "profile" | "other";

export type ParsedInstagramUrl = {
  kind: InstagramLinkKind;
  shortcode?: string;
  /** Canonical post/reel page used for OG scrape */
  mediaUrl?: string;
};

const IG_HOST = /^(?:www\.)?instagram\.com$/i;

export function parseInstagramUrl(href: string): ParsedInstagramUrl | null {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return null;
  }
  if (!IG_HOST.test(url.hostname)) return null;

  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length === 0) return { kind: "other" };

  const [a, b, c] = parts;

  if (a === "reel" && b) {
    return {
      kind: "reel",
      shortcode: b,
      mediaUrl: `https://www.instagram.com/reel/${b}/`,
    };
  }

  if (a === "p" && b) {
    return {
      kind: "post",
      shortcode: b,
      mediaUrl: `https://www.instagram.com/p/${b}/`,
    };
  }

  // /{username}/p/{code}/ or /{username}/reel/{code}/
  if (b === "p" && c) {
    return {
      kind: "post",
      shortcode: c,
      mediaUrl: `https://www.instagram.com/p/${c}/`,
    };
  }
  if (b === "reel" && c) {
    return {
      kind: "reel",
      shortcode: c,
      mediaUrl: `https://www.instagram.com/reel/${c}/`,
    };
  }

  // Bare profile /{username}/
  if (parts.length === 1 && a && !["p", "reel", "stories", "tv", "explore"].includes(a)) {
    return { kind: "profile" };
  }

  return { kind: "other" };
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

function extractOgImage(html: string): string | null {
  const patterns = [
    /property=["']og:image["']\s+content=["']([^"']+)["']/i,
    /content=["']([^"']+)["']\s+property=["']og:image["']/i,
    /property=["']og:image:secure_url["']\s+content=["']([^"']+)["']/i,
  ];
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeHtmlEntities(match[1]);
  }
  return null;
}

const thumbnailCache = new Map<string, string | null>();

/**
 * Fetch Instagram post/reel OG image. Returns null for profiles or on failure.
 * In-memory cache avoids repeat scrapes within the same server process / build.
 */
export async function fetchInstagramThumbnail(href: string): Promise<string | null> {
  const parsed = parseInstagramUrl(href);
  if (!parsed?.mediaUrl) return null;

  const cacheKey = parsed.mediaUrl;
  if (thumbnailCache.has(cacheKey)) return thumbnailCache.get(cacheKey) ?? null;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(parsed.mediaUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; FirstEconomyBot/1.0; +https://www.firsteconomy.com)",
        Accept: "text/html,application/xhtml+xml",
      },
      next: { revalidate: 86400 },
    });
    clearTimeout(timer);

    if (!res.ok) {
      thumbnailCache.set(cacheKey, null);
      return null;
    }

    const html = await res.text();
    const image = extractOgImage(html);
    thumbnailCache.set(cacheKey, image);
    return image;
  } catch {
    thumbnailCache.set(cacheKey, null);
    return null;
  }
}
