import type { Metadata } from "next";
import JsonLd from "@/components/JsonLd";
import MediaBuyingPage from "@/components/media-buying/MediaBuyingPage";
import { getServicePageContent } from "@/content/servicePages";
import { faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

const mediaBuyingPage = getServicePageContent("media-buying")!;

export const metadata: Metadata = {
  title: mediaBuyingPage.seoTitle ?? mediaBuyingPage.name,
  description: mediaBuyingPage.seoDescription ?? mediaBuyingPage.summary,
};

export default function Page() {
  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: mediaBuyingPage.name,
          description: mediaBuyingPage.summary,
          path: "/services/media-buying",
        })}
      />
      {mediaBuyingPage.faq?.length ? <JsonLd data={faqPageJsonLd(mediaBuyingPage.faq)} /> : null}
      <MediaBuyingPage />
    </>
  );
}
