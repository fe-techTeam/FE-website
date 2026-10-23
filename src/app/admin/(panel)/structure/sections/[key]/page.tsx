import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { PageHeader } from "@/components/admin/ui";
import SectionTypeForm from "./SectionTypeForm";
import { requireArea } from "@/lib/admin/dal";
import { getContentTypes, getSectionType, getSectionTypes } from "@/lib/admin/structure";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ key: string }>;
}): Promise<Metadata> {
  const { key } = await params;
  if (key === "new") return { title: "New section" };
  return { title: (await getSectionType(key))?.label ?? "Section" };
}

export default async function SectionTypePage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  await requireArea("system");

  const isNew = key === "new";
  const section = isNew ? null : await getSectionType(key);
  if (!isNew && !section) notFound();

  const [contentTypes, sections] = await Promise.all([getContentTypes(), getSectionTypes()]);

  return (
    <>
      <PageHeader
        eyebrow={
          <Link href="/admin/structure" className="underline hover:text-ink">
            Structure
          </Link>
        }
        title={section ? section.label : "New section"}
        description={
          section
            ? "Editing these fields changes what editors fill in wherever this section is used."
            : "A section is a reusable block editors can stack on a page."
        }
      />

      <SectionTypeForm
        section={section}
        contentTypeKeys={contentTypes.map((type) => type.key)}
        groups={[...new Set(sections.map((item) => item.group))]}
      />
    </>
  );
}
