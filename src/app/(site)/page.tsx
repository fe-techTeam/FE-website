import JsonLd from "@/components/JsonLd";
import HomePage from "@/components/home/HomePage";
import { FAQS_ENABLED } from "@/content/features";
import { homeFaqs } from "@/content/siteFaqs";
import { faqPageJsonLd } from "@/lib/seo";

export default function Home() {
  return (
    <>
      {FAQS_ENABLED ? <JsonLd data={faqPageJsonLd(homeFaqs)} /> : null}
      <HomePage />
    </>
  );
}
