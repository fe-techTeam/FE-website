"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import { caseStudies } from "@/content/caseStudies/index";
import {
  caseStudyIndustryName,
  homeFeaturedEyebrow,
  workCardImage,
  workCardTitle,
} from "@/content/workPage";

const featuredCases = caseStudies;

export default function FeaturedWorkCarousel() {
  return (
    <HorizontalCarousel
      itemCount={featuredCases.length}
      ariaLabel="Featured case studies"
      slidesGroupLabel="Case study slides"
      getSlideLabel={(index) => workCardTitle(featuredCases[index]!)}
      controls="dark"
      arrowPosition="upper"
      prevLabel="Previous case study"
      nextLabel="Next case study"
      autoPlayInterval={3000}
      showDots={false}
    >
      {featuredCases.map((caseStudy) => {
        const title = workCardTitle(caseStudy);
        const image = workCardImage(caseStudy);
        const titleId = `featured-work-${caseStudy.slug}`;
        const src = image.src ?? "/images/work/cases/godrej-blue.png";

        return (
          <Link
            key={caseStudy.slug}
            href={`/work/${caseStudy.slug}`}
            aria-labelledby={titleId}
            className="work-card group flex h-full min-h-[360px] flex-col overflow-hidden rounded-[20px] border border-white/15 bg-white shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition duration-200 hover:border-red/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:min-h-[380px] sm:rounded-[22px]"
          >
            <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-ink">
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 640px) 86vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover object-center transition duration-500 group-hover:scale-[1.04]"
              />
            </div>

            <div className="flex flex-1 flex-col border-t border-line px-5 py-5 sm:px-6 sm:py-6">
              <p className="text-eyebrow m-0">{homeFeaturedEyebrow(caseStudy)}</p>
              <h3
                id={titleId}
                className="mt-2 mb-0 font-display text-[1.25rem] leading-[1.08] font-bold tracking-[0.02em] uppercase text-ink sm:text-[1.4rem] lg:text-[1.5rem]"
              >
                {title}
              </h3>
              <p className="text-body-sm mt-2 mb-0 text-muted">{caseStudyIndustryName(caseStudy)}</p>

              <span className="text-cta mt-auto inline-flex min-h-11 items-center gap-2.5 pt-4 text-ink transition group-hover:text-red sm:pt-5">
                View case study
                <span
                  className="grid size-7 flex-none place-items-center rounded-full border border-current transition duration-200 group-hover:border-red group-hover:bg-red group-hover:text-white sm:size-8"
                  aria-hidden
                >
                  <ArrowRight size={13} strokeWidth={2.25} />
                </span>
              </span>
            </div>
          </Link>
        );
      })}
    </HorizontalCarousel>
  );
}
