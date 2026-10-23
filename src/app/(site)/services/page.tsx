import type { Metadata } from "next";
import ServicesPage from "@/components/services/ServicesPage";

export const metadata: Metadata = {
  title: "Integrated Marketing Services in India",
  description:
    "Media buying, video, branding, influencer marketing, marketplaces, technology, creative, social, SEO/AEO/GEO and AI, run as one integrated growth system.",
};

export default function Page() {
  return <ServicesPage />;
}
