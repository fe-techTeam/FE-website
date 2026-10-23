import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/ui";
import ContentTypeForm from "./ContentTypeForm";
import { requireArea } from "@/lib/admin/dal";
import { getContentType, getContentTypes, getSectionTypes } from "@/lib/admin/structure";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  if (key === "new") return { title: "New content type" };
  return { title: (await getContentType(key))?.label ?? "Content type" };
}

export default async function ContentTypePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  await requireArea("system");

  const isNew = key === "new";
  const type = isNew ? null : await getContentType(key);
  if (!isNew && !type) notFound();

  const [allTypes, sectionTypes] = await Promise.all([getContentTypes(), getSectionTypes()]);

  return (
    <>
      <PageHeader
        eyebrow={
          <Link href="/admin/structure" className="underline hover:text-ink">
            Structure
          </Link>
        }
        title={type ? type.label : "New content type"}
        description={
          type
            ? "Changing fields here changes what editors see. Existing entries keep any data whose key still matches."
            : "A content type is one item in the sidebar — a collection of entries, or a single page."
        }
      />

      <ContentTypeForm
        type={type}
        sectionTypes={sectionTypes.map((section) => ({
          key: section.key,
          label: section.label,
          group: section.group,
        }))}
        contentTypeKeys={allTypes.map((item) => item.key)}
        groups={[...new Set(allTypes.map((item) => item.group))]}
      />
    </>
  );
}
