import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import AboutPage from "@/components/about/AboutPage";
import { FAQS_ENABLED } from "@/content/features";
import { aboutFaqs } from "@/content/siteFaqs";
import { faqPageJsonLd } from "@/lib/seo";
import { companyOfficeScale } from "@/content/stats";

export const metadata: Metadata = {
  title: "About Us — Integrated Marketing Agency",
  description: `First Economy is an integrated marketing agency with ${companyOfficeScale.people.value} specialists across Mumbai, Bengaluru, Chhatrapati Sambhaji Nagar and Pune, building growth systems.`,
};

export default function Page() {
  return (
    <>
      {FAQS_ENABLED ? <JsonLd data={faqPageJsonLd(aboutFaqs)} /> : null}
      <AboutPage />
    </>
  );
}
