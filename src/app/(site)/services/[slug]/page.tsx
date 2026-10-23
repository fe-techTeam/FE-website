import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { getServicePageContent, servicePageSlugs } from "@/content/servicePages";
import { faqPageJsonLd, serviceJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return servicePageSlugs
    .filter((slug) => slug !== "media-buying")
    .map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = getServicePageContent(slug);
  if (!content) return {};
  return { title: content.seoTitle ?? content.name, description: content.seoDescription ?? content.summary };
}

export default async function ServiceDetailRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (slug === "media-buying") notFound();

  const content = getServicePageContent(slug);
  if (!content) notFound();

  return (
    <>
      <JsonLd
        data={serviceJsonLd({
          name: content.name,
          description: content.summary,
          path: `/services/${content.slug}`,
        })}
      />
      {content.faq?.length ? <JsonLd data={faqPageJsonLd(content.faq)} /> : null}
      <ServiceDetailPage content={content} />
    </>
  );
}
