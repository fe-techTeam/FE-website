import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CTASection from "@/components/CTASection";
import JsonLd from "@/components/JsonLd";
import WorkDetailPage from "@/components/work/WorkDetailPage";
import { caseStudies } from "@/content/caseStudies";
import { pageLastModified, videoUploadDates } from "@/content/contentDates";
import {
  buildWorkDetailModel,
  caseStudyVideos,
  enrichLinkGroupThumbnails,
  getCaseStudyBySlug,
  workDetailCta,
} from "@/content/workDetail";
import { workPhotos } from "@/content/workPhotos";
import { SITE_NAME, caseStudyJsonLd, videoObjectJsonLd } from "@/lib/seo";

/** Refresh Instagram OG thumbnails periodically (CDN signed URLs expire). */
export const revalidate = 86400;

/** 1200×630 JPEG (50–160 KB) generated from each campaign cover — the full covers are 0.6–2.9 MB, too heavy for link previews. */
function shareImage(slug: string) {
  return workPhotos[slug] ? `/images/og/cases/${slug}.jpg` : undefined;
}

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) return {};
  const cover = shareImage(caseStudy.slug);
  return {
    title: caseStudy.seoTitle ?? `${caseStudy.client} — ${caseStudy.campaign}`,
    description: caseStudy.seoDescription ?? caseStudy.hero,
    // Each case study shares its own campaign creative, not the generic logo card. Without a cover the root default applies.
    ...(cover
      ? {
          openGraph: {
            // A page-level openGraph replaces the root one wholesale, so the shared fields are repeated here.
            type: "website",
            siteName: SITE_NAME,
            locale: "en_IN",
            url: "./",
            images: [{ url: cover, width: 1200, height: 630, alt: `${caseStudy.client} — ${caseStudy.campaign}` }] },
          twitter: { card: "summary_large_image", images: [cover] },
        }
      : {}),
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const caseStudy = getCaseStudyBySlug(slug);
  if (!caseStudy) notFound();

  const model = buildWorkDetailModel(caseStudy);
  const linkGroups = await enrichLinkGroupThumbnails(model.linkGroups);

  // Only films we host (so the file date is known) and that have a poster qualify; de-duplicated by file.
  const seen = new Set<string>();
  const videoObjects = caseStudyVideos(caseStudy).flatMap((video) => {
    const uploadDate = video.src ? videoUploadDates[video.src] : undefined;
    if (!video.src || !video.poster || !uploadDate || seen.has(video.src)) return [];
    seen.add(video.src);
    return [
      {
        name: `${caseStudy.client} — ${video.title}`,
        description: video.description,
        thumbnail: video.poster,
        contentUrl: video.src,
        uploadDate,
        pagePath: `/work/${caseStudy.slug}`,
      },
    ];
  });

  const headline = caseStudy.campaign.toLowerCase().includes(caseStudy.client.toLowerCase())
    ? caseStudy.campaign
    : `${caseStudy.client} — ${caseStudy.campaign}`;

  return (
    <>
      <JsonLd
        data={caseStudyJsonLd({
          headline,
          description: caseStudy.seoDescription ?? caseStudy.hero,
          path: `/work/${caseStudy.slug}`,
          image: shareImage(caseStudy.slug),
          client: caseStudy.client,
          dateModified: pageLastModified[`/work/${caseStudy.slug}`],
        })}
      />
      {videoObjects.map((video) => (
        <JsonLd key={video.contentUrl} data={videoObjectJsonLd(video)} />
      ))}
      <WorkDetailPage model={{ ...model, linkGroups }} />
      <CTASection
        titleBefore={workDetailCta.titleBefore}
        titleAccent={workDetailCta.titleAccent}
        titleBreak
        primaryLabel={workDetailCta.button.label}
        primaryHref={workDetailCta.button.href}
        burstSrc={workDetailCta.burst}
        headingId="work-detail-cta-heading"
      />
    </>
  );
}
