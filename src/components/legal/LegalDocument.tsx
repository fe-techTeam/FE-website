import JsonLd from "@/components/JsonLd";
import type { LegalDocumentContent } from "@/content/legal";
import { breadcrumbJsonLd } from "@/lib/seo";

type LegalDocumentProps = {
  document: LegalDocumentContent;
};

export default function LegalDocument({ document }: LegalDocumentProps) {
  return (
    <section className="section-shell section-pad bg-paper">
      <JsonLd data={breadcrumbJsonLd([{ label: "Home", href: "/" }, { label: document.title }])} />
      <div className="container-content max-w-3xl">
        <p className="text-eyebrow m-0 text-red">{document.eyebrow}</p>
        <h1 className="text-display-md mt-4 m-0">{document.title}</h1>
        <p className="text-body-sm mt-4 mb-0 text-muted">Last updated: {document.lastUpdated}</p>
        <p className="text-body mt-8 mb-0 text-muted">{document.intro}</p>

        <div className="mt-12 flex flex-col gap-10">
          {document.sections.map((section) => (
            <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
              <h2 id={`${section.id}-heading`} className="text-display-sm m-0">
                {section.title}
              </h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-body mt-4 mb-0 text-muted">
                  {paragraph}
                </p>
              ))}
              {section.bullets?.length ? (
                <ul className="text-body mt-4 mb-0 list-disc space-y-2 pl-5 text-muted">
                  {section.bullets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <p className="text-body mt-12 mb-0 border-t border-line pt-8 text-muted">{document.contactNote}</p>
      </div>
    </section>
  );
}
