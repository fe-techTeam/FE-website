"use client";

import type { CSSProperties } from "react";
import GrowthCta from "@/components/GrowthCta";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import WorkCaseCard from "@/components/work/WorkCaseCard";
import { SectionLabel } from "@/components/work/WorkDetailShared";
import { workCardTitle } from "@/content/workPage";
import type { WorkDetailModel, WorkDetailSectionId } from "@/content/workDetail";

type WorkDetailRelatedProps = {
  related: WorkDetailModel["related"];
  sectionNumber: (id: WorkDetailSectionId) => string;
  sectionScrollStyle: CSSProperties;
};

export default function WorkDetailRelated({
  related,
  sectionNumber,
  sectionScrollStyle,
}: WorkDetailRelatedProps) {
  return (
    <section
      id="related"
      data-animate-section
      className="section-shell section-pad bg-mist"
      style={sectionScrollStyle}
      aria-labelledby="work-related-heading"
    >
      <div className="section-inner">
        <div className="section-intro">
          <SectionLabel
            id="related"
            number={sectionNumber("related")}
            headingId="work-related-heading"
            asHeading
          />
          <div data-animate="fade-up" className="min-w-0 pt-0 md:pt-1 md:justify-self-end md:self-end">
            <GrowthCta href="/work" variant="secondary">
              View all case studies
            </GrowthCta>
          </div>
        </div>

        <div className="section-media sm:hidden">
          <HorizontalCarousel
            itemCount={Math.min(related.length, 3)}
            ariaLabel="Related case studies"
            slidesGroupLabel="Case study slides"
            getSlideLabel={(index) => workCardTitle(related[index]!)}
            controls="light"
            arrowPosition="upper"
            prevLabel="Previous case study"
            nextLabel="Next case study"
          >
            {related.slice(0, 3).map((item) => (
              <WorkCaseCard key={item.slug} caseStudy={item} />
            ))}
          </HorizontalCarousel>
        </div>

        <ul
          data-animate-stagger
          className="section-media m-0 hidden list-none gap-5 p-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:grid-cols-3"
        >
          {related.slice(0, 3).map((item) => (
            <li key={item.slug}>
              <WorkCaseCard caseStudy={item} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
