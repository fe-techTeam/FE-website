"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import HorizontalCarousel from "@/components/HorizontalCarousel";
import { ImageSlot } from "@/components/media/AssetPlaceholder";
import type { CapabilityCaseStudy } from "@/content/capabilities";
import type { MediaSlot } from "@/content/about";
import { workPhotos } from "@/content/workPhotos";

function resolveCardImage(item: CapabilityCaseStudy): MediaSlot {
  const fromWork = workPhotos[item.slug];
  if (fromWork) {
    return {
      src: fromWork,
      alt: item.image.alt || `${item.client} case study`,
      label: item.client,
      fit: "cover",
    };
  }
  return item.image;
}

export default function CapabilitiesWorkCarousel({ cases }: { cases: CapabilityCaseStudy[] }) {
  return (
    <HorizontalCarousel
      itemCount={cases.length}
      ariaLabel="Capabilities case studies"
      slidesGroupLabel="Case study slides"
      getSlideLabel={(index) => cases[index]?.client ?? ""}
      controls="light"
      arrowPosition="upper"
      prevLabel="Previous case study"
      nextLabel="Next case study"
      showDots={false}
    >
      {cases.map((item, index) => {
        const href = item.href ?? `/work/${item.slug}`;
        const titleId = `cap-case-${item.slug}-${index}`;
        const image = resolveCardImage(item);

        return (
          <Link
            key={`${item.slug}-${index}`}
            href={href}
            aria-labelledby={titleId}
            className="group flex h-full min-h-[360px] flex-col overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_10px_36px_rgba(0,0,0,0.08)] transition duration-200 hover:border-red/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:min-h-[380px]"
          >
            <div className="relative aspect-[16/10] shrink-0 overflow-hidden bg-[#111]">
              <ImageSlot
                asset={image}
                className="absolute inset-0 size-full border-0 bg-transparent transition duration-500 group-hover:[&_img]:scale-[1.04]"
                sizes="(max-width: 640px) 86vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            </div>

            <div className="flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6">
              <p className="text-eyebrow m-0">{item.client}</p>
              <h3
                id={titleId}
                className="mt-2 mb-0 font-display text-[1.35rem] leading-[1.08] tracking-[0.02em] uppercase sm:text-[1.5rem] lg:text-[1.65rem]"
              >
                {item.title}
              </h3>
              <p className="text-body-sm mt-2.5 mb-0 line-clamp-3 text-muted">{item.body}</p>

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
