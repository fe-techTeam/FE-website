import type { Metadata } from "next";
import ContactPage from "@/components/contact/ContactPage";
import JsonLd from "@/components/JsonLd";
import { localBusinessJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Contact Our Marketing Agency in India",
  description:
    "Tell us about your challenge and First Economy’s experts will reply within 24 hours. Offices in Mumbai, Bengaluru, Chhatrapati Sambhaji Nagar and Pune.",
};

export default function Page() {
  return (
    <>
      <JsonLd data={localBusinessJsonLd()} />
      <ContactPage />
    </>
  );
}
