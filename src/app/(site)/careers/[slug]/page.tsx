import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CareerDetailPage from "@/components/careers/CareerDetailPage";
import JsonLd from "@/components/JsonLd";
import {
  getCareerDetailTabs,
  getCareerRoleBySlug,
  getCareerRoleDetail,
  getCareerRoles,
  getFirstDetailSectionId,
  getRelatedCareerRoles,
} from "@/lib/careers";
import { jobPostingJsonLd } from "@/lib/seo";
import { getSiteUrl } from "@/lib/site-url";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  const roles = await getCareerRoles();
  return roles.map((role) => ({ slug: role.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const role = await getCareerRoleBySlug(slug);
  if (!role) return {};

  const experience = role.experience ? ` ${role.experience}.` : "";

  // Keep the rendered <title> (incl. " | First Economy") within ~60 chars: drop the " — Careers" tail for long role names.
  const fullTitle = `${role.title} — Careers`;
  const base = `Apply for the ${role.title} role at First Economy in ${role.location}. ${role.type} · ${role.department}.${experience}`;
  // Short role descriptions get a closing line; longer ones are left as they are (meta descriptions truncate near 160).
  const closing = " Join First Economy’s integrated growth team.";
  const description = base.length < 115 && base.length + closing.length <= 160 ? `${base}${closing}` : base;

  return {
    title: fullTitle.length > 44 ? role.title : fullTitle,
    description,
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [role, detail, relatedRoles, siteUrl] = await Promise.all([
    getCareerRoleBySlug(slug),
    getCareerRoleDetail(slug),
    getRelatedCareerRoles(slug),
    getSiteUrl(),
  ]);

  if (!role || !detail) notFound();

  const sectionTabs = getCareerDetailTabs(detail);
  const shareUrl = `${siteUrl}/careers/${slug}`;

  return (
    <>
      <JsonLd
        data={jobPostingJsonLd({
          title: role.title,
          description: detail.aboutRole || detail.summary,
          path: `/careers/${slug}`,
          location: role.location,
          employmentType: role.type,
          datePosted: role.datePosted,
          validThrough: role.validThrough,
        })}
      />
      <CareerDetailPage
        role={role}
        detail={detail}
        sectionTabs={sectionTabs}
        relatedRoles={relatedRoles}
        shareUrl={shareUrl}
      />
    </>
  );
}
