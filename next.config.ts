import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first, WebP fallback — roughly halves the PNG/JPG weight of case-study and team imagery.
    formats: ["image/avif", "image/webp"],
    // Capped at 1920: layouts never render wider than ~1360px content, so the default
    // 2048/3840 candidates only inflate the fallback `src` and the srcset.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    qualities: [75, 100],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.cdninstagram.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "**.fbcdn.net",
        pathname: "/**",
      },
    ],
  },
  // Staging/preview deploys set SITE_NOINDEX=true so nothing on them can be indexed;
  // production leaves it unset and never inherits the header.
  async headers() {
    const noindex = [{ key: "X-Robots-Tag", value: "noindex, nofollow" }];
    return [
      // /proposal/ holds the legacy site's client proposal pages (plain HTML in public/proposal/, served as they are).
      // They are private: the old robots.txt disallowed them, so keep them out of search.
      { source: "/proposal/:path*", headers: noindex },
      // Staging: nothing on a non-production deploy may be indexed. Production leaves SITE_NOINDEX unset.
      ...(process.env.SITE_NOINDEX === "true" ? [{ source: "/:path*", headers: noindex }] : []),
    ];
  },
  async redirects() {
    return [
      // Legacy firsteconomy.com (PHP site) URLs — one-hop permanent redirects to their closest new page.
      { source: "/our-work.php", destination: "/work", permanent: true },
      { source: "/career.php", destination: "/careers", permanent: true },
      { source: "/contact-us.php", destination: "/contact", permanent: true },
      { source: "/about-us.php", destination: "/about", permanent: true },
      { source: "/paid-media.php", destination: "/services/media-buying", permanent: true },
      { source: "/social-network.php", destination: "/services/social-media", permanent: true },
      { source: "/branding.php", destination: "/services/branding", permanent: true },
      { source: "/videography.php", destination: "/services/video-production", permanent: true },
      { source: "/technology.php", destination: "/services/technology", permanent: true },
      // Best-fit mappings — no 1:1 equivalent on the new site.
      { source: "/online-store.php", destination: "/services/marketplace-management", permanent: true },
      { source: "/business-solution.php", destination: "/services", permanent: true },
      // The live nav links to the plural; the old sitemap lists the singular (which 404s there). Keep both.
      { source: "/business-solutions.php", destination: "/services", permanent: true },
      // The old site itself 301s these, so inbound links still reach them.
      { source: "/index.php", destination: "/", permanent: true },
      { source: "/works.php", destination: "/work", permanent: true },
      {
        source: "/our-advantage",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/capabilities",
        destination: "/services",
        permanent: true,
      },
      {
        source: "/terms",
        destination: "/privacy-policy",
        permanent: true,
      },
      {
        source: "/insights",
        destination: "/",
        permanent: true,
      },
      {
        source: "/insights/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/clients",
        destination: "/about#trusted-by",
        permanent: true,
      },
      {
        source: "/leadership",
        destination: "/about#team",
        permanent: true,
      },
      {
        source: "/locations/:slug",
        destination: "/contact#offices",
        permanent: true,
      },
      {
        source: "/industries",
        destination: "/work",
        permanent: true,
      },
      {
        source: "/industries/:slug",
        destination: "/work",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
