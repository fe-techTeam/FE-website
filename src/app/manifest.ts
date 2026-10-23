import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Growth Systems`,
    short_name: SITE_NAME,
    description:
      "An integrated growth partner combining media, creative, technology, SEO, social, influencer marketing and AI.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f2",
    theme_color: "#080808",
    lang: "en-IN",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
