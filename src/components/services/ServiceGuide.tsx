import type { ServiceGuide as ServiceGuideContent } from "@/content/servicePages/types";

/** Long-form, server-rendered explainer shown under the process grid on each service page. */
export default function ServiceGuide({ idPrefix, guide }: { idPrefix: string; guide: ServiceGuideContent }) {
  const headingId = `${idPrefix}-guide-heading`;

  return (
    <section
      id={`${idPrefix}-guide`}
      data-animate-section
      className="section-shell section-pad bg-paper scroll-mt-[5.5rem]"
      aria-labelledby={headingId}
    >
      <div className="section-inner">
        <p data-animate="fade-up" className="text-eyebrow m-0">
          In depth
        </p>
        <div className="section-intro">
          <h2 data-animate="fade-up" id={headingId} className="text-display-md m-0">
            {guide.title}
          </h2>
        </div>

        <div data-animate="fade-up" className="section-media mx-auto w-full max-w-3xl">
          <p className="text-body m-0 text-muted">{guide.intro}</p>
          <div className="mt-10 flex flex-col gap-10">
            {guide.sections.map((section) => (
              <div key={section.heading}>
                <h3 className="text-display-sm m-0">{section.heading}</h3>
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
