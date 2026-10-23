"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Layers, Play } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { LogoMarkGrid } from "@/components/home/PartnerLogos";
import DeviceShowcase from "@/components/work/DeviceShowcase";
import WorkDetailGallery from "@/components/work/WorkDetailGallery";
import PhoneCoverflowGallery from "@/components/work/PhoneCoverflowGallery";
import {
  ContentBlock,
  SECTION_META,
  SectionLabel,
  SERVICE_ICONS,
} from "@/components/work/WorkDetailShared";
import WorkDetailVideoSlider from "@/components/work/WorkDetailVideoSlider";
import WorkDetailVideoMockupSlider from "@/components/work/WorkDetailVideoMockupSlider";
import YouTubeVideoSlider from "@/components/work/YouTubeVideoSlider";
import {
  AMBASSADOR_HOTEL_PHONE_SCREENS,
  LAPTOP_SCREEN_INSET,
  MAHINDRA_MANULIFE_LIVE_URL,
  MAHINDRA_MANULIFE_SCREENS,
  MOBILE_SCREEN_INSET,
  ORPAT_ERP_LAPTOP_SCREENS,
  ORPAT_ERP_MOBILE_SCREENS,
} from "@/content/deviceShowcases";
import type { PartnerLogo } from "@/content/partners";
import type { WorkDetailModel, WorkDetailSectionId, WorkGalleryGroup } from "@/content/workDetail";
import {
  parseWorkMetricValue,
  workDetailHeadlines,
  workResultGridClass,
} from "@/content/workDetail";

const PLATFORM_LOGO_META: Record<string, { name: string; width: number; height: number }> = {
  "platforms-01.png": { name: "Google Ads", width: 350, height: 110 },
  "platforms-02.png": { name: "Facebook", width: 158, height: 158 },
  "platforms-03.png": { name: "Instagram", width: 154, height: 154 },
  "platforms-04.png": { name: "Moneycontrol", width: 434, height: 95 },
  "platforms-05.png": { name: "Quora", width: 384, height: 108 },
  "platforms-06.png": { name: "Disney+", width: 352, height: 102 },
  "platforms-07.png": { name: "Paytm", width: 347, height: 110 },
  "platforms-08.png": { name: "Amazon", width: 352, height: 107 },
  "platforms-09.png": { name: "YouTube", width: 464, height: 289 },
  "platforms-10.png": { name: "Magicbricks", width: 487, height: 87 },
  "platforms-11.png": { name: "Zirca", width: 311, height: 132 },
  "platforms-12.png": { name: "mCanvas", width: 322, height: 80 },
  "platforms-13.png": { name: "Pinterest", width: 768, height: 432 },
};

function ResultStatsGrid({ stats, className = "" }: { stats: WorkDetailModel["results"]; className?: string }) {
  return (
    <ul
      data-animate-stagger
      data-cols={
        stats.length === 4 ? "4" : stats.length === 3 ? "3" : stats.length === 2 ? "2" : stats.length > 4 ? "3" : "1"
      }
      className={`work-result-stats m-0 grid list-none p-0 ${workResultGridClass(stats.length)} ${className}`.trim()}
    >
      {stats.map((metric) => {
        const parsed = parseWorkMetricValue(metric.value);
        const spoken = `${metric.value} ${metric.label}`;

        return (
          <li key={`${metric.label}-${metric.value}`} className="work-result-stat min-w-0">
            <p
              className={`m-0 text-white ${parsed.isPhrase ? "text-stat-phrase" : "text-stat"}`}
              aria-label={spoken}
            >
              <span aria-hidden="true">
                <span>{parsed.figure}</span>
                {parsed.unit ? (
                  <span
                    className={
                      parsed.unit === "%" || parsed.unit === "x"
                        ? undefined
                        : "text-[0.55em] font-extrabold tracking-[0.02em]"
                    }
                  >
                    {parsed.unit}
                  </span>
                ) : null}
                {parsed.plus ? <span className="text-red">+</span> : null}
              </span>
            </p>
            <p className="mt-2.5 mb-0 text-[11px] font-bold tracking-[0.1em] text-white/75 uppercase sm:mt-3 sm:text-[13px] sm:tracking-[0.14em]">
              {metric.label}
            </p>
          </li>
        );
      })}
    </ul>
  );
}

function galleryItemsToLogoMarks(group: WorkGalleryGroup): PartnerLogo[] {
  return group.items
    .filter((item): item is typeof item & { src: string } => Boolean(item.src))
    .map((item, i) => {
      const file = item.src.split("/").pop() ?? "";
      const meta = PLATFORM_LOGO_META[file];
      return {
        slug: meta?.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") ?? `platform-${i + 1}`,
        name: meta?.name ?? item.alt ?? item.label ?? `${group.title} ${i + 1}`,
        src: item.src,
        width: meta?.width ?? 360,
        height: meta?.height ?? 240,
        sourceMedia: item.src,
        sourceSlide: 21,
      };
    });
}

type WorkDetailStoryProps = {
  title: WorkDetailModel["title"];
  caseStudy: WorkDetailModel["caseStudy"];
  objective: WorkDetailModel["objective"];
  mandate: WorkDetailModel["mandate"];
  executionSummary: WorkDetailModel["executionSummary"];
  heroImage: WorkDetailModel["heroImage"];
  gallery: WorkDetailModel["gallery"];
  galleryGroups: WorkDetailModel["galleryGroups"];
  videos: WorkDetailModel["videos"];
  linkGroups: WorkDetailModel["linkGroups"];
  results: WorkDetailModel["results"];
  resultHighlights: WorkDetailModel["resultHighlights"];
  builtWith: WorkDetailModel["builtWith"];
  hasSection: (id: WorkDetailSectionId) => boolean;
  sectionNumber: (id: WorkDetailSectionId) => string;
  sectionScrollStyle: CSSProperties;
};

export default function WorkDetailStory({
  title,
  caseStudy,
  objective,
  mandate,
  executionSummary,
  heroImage,
  gallery,
  galleryGroups,
  videos,
  linkGroups,
  results,
  resultHighlights,
  builtWith,
  hasSection,
  sectionNumber,
  sectionScrollStyle,
}: WorkDetailStoryProps) {
  return (
    <section
      data-animate-section
      className="section-shell section-pad bg-white"
      aria-label="Case study details"
    >
      <div className="section-inner">
        {/* Objective — full-width editorial block */}
        {hasSection("objective") ? (
        <ContentBlock
          id="objective"
          style={sectionScrollStyle}
          labelledBy="work-objective-heading"
        >
          <div data-animate="fade-up" className="flex flex-col gap-4 sm:gap-5">
            <SectionLabel
              id="objective"
              number={sectionNumber("objective")}
              headingId="work-objective-heading"
              asHeading
            />
            <p className="text-body section-copy-on-light m-0 max-w-none">
              {objective}
            </p>
          </div>
        </ContentBlock>
        ) : null}

        {/* Mandate — full-width section, checklist uses available columns */}
        {hasSection("mandate") ? (
        <ContentBlock
          id="mandate"
          className="mt-12 sm:mt-16"
          style={sectionScrollStyle}
          labelledBy="work-mandate-heading"
        >
          <div data-animate="fade-up">
            <SectionLabel
              id="mandate"
              number={sectionNumber("mandate")}
              headingId="work-mandate-heading"
              asHeading
            />
            <ul
              data-animate-stagger
              className="m-0 mt-8 grid list-none grid-cols-1 gap-x-8 gap-y-5 p-0 sm:mt-10 sm:grid-cols-2 lg:gap-x-10 xl:grid-cols-4"
            >
              {mandate.map((item) => (
                <li key={item} className="flex gap-3.5">
                  <span
                    className="mt-0.5 grid size-6 flex-none place-items-center border border-red/50 text-red"
                    aria-hidden
                  >
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <p className="text-body section-copy-on-light m-0 min-w-0 text-pretty">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        </ContentBlock>
        ) : null}

        {/* Digital Platforms — logo grid as its own numbered section */}
        {hasSection("platforms") ? (
          <ContentBlock
            id="platforms"
            className="mt-12 sm:mt-16"
            style={sectionScrollStyle}
            labelledBy="work-platforms-heading"
          >
            <div data-animate="fade-up" className="flex flex-col gap-4 sm:gap-5">
              <SectionLabel
                id="platforms"
                number={sectionNumber("platforms")}
                headingId="work-platforms-heading"
                asHeading
              />
              {galleryGroups
                .filter((group) => group.density === "compact")
                .map((group) => (
                  <div key={group.title} className="min-w-0">
                    {group.description ? (
                      <p className="text-body section-copy-on-light mb-6 max-w-[42rem]">
                        {group.description}
                      </p>
                    ) : null}
                    <div aria-label={`${title} — ${group.title}`}>
                      <LogoMarkGrid logos={galleryItemsToLogoMarks(group)} />
                    </div>
                  </div>
                ))}
            </div>
          </ContentBlock>
        ) : null}

        {/* Execution */}
        {hasSection("execution") ? (
        <ContentBlock
          id="execution"
          className="mt-12 sm:mt-16"
          style={sectionScrollStyle}
          labelledBy="work-execution-heading"
        >
          <div data-animate="fade-up" className="flex flex-col gap-4 sm:gap-5">
            <SectionLabel
              id="execution"
              number={sectionNumber("execution")}
              headingId="work-execution-heading"
              asHeading
            />
            {executionSummary ? (
              <p className="text-body section-copy-on-light m-0 max-w-none">
                {executionSummary}
              </p>
            ) : null}
          </div>

          {caseStudy.slug === "adani-airports-safar-ke-humsafar" ||
          caseStudy.slug === "ambassador-hotel" ? (
            <ul
              data-animate-stagger
              className="m-0 mt-8 grid list-none grid-cols-1 gap-x-8 gap-y-5 p-0 sm:mt-10 sm:grid-cols-2"
            >
              {caseStudy.execution.map((item) => (
                <li key={item} className="flex gap-3.5">
                  <span
                    className="mt-0.5 grid size-6 flex-none place-items-center border border-red/50 text-red"
                    aria-hidden
                  >
                    <Check size={14} strokeWidth={2.5} />
                  </span>
                  <p className="text-body section-copy-on-light m-0 min-w-0 text-pretty">{item}</p>
                </li>
              ))}
            </ul>
          ) : null}

          {caseStudy.slug === "mahindra-manulife" ? (
            <div
              data-animate="fade-up"
              className="mt-12 flex flex-wrap items-end justify-center gap-6 sm:mt-16 sm:gap-8"
            >
              <DeviceShowcase
                frameSrc="/images/work/laptop-mockup.png"
                frameWidth={1536}
                frameHeight={1024}
                screenInset={LAPTOP_SCREEN_INSET}
                screenRadius="1%"
                contentAboveFrame={false}
                viewport={{ width: 1440, height: 884 }}
                liveUrl={MAHINDRA_MANULIFE_LIVE_URL}
                images={MAHINDRA_MANULIFE_SCREENS}
                maxWidthClassName="max-w-[19rem] xs:max-w-[23rem] sm:max-w-[26rem] md:max-w-[30rem] lg:max-w-[35rem]"
                className="flex-none !mx-0"
              />
              <DeviceShowcase
                frameSrc="/images/work/mobile-mockup.png"
                frameWidth={941}
                frameHeight={1672}
                screenInset={MOBILE_SCREEN_INSET}
                screenRadius="9.12% / 4.48%"
                contentAboveFrame
                viewport={{ width: 390, height: 826 }}
                liveUrl={MAHINDRA_MANULIFE_LIVE_URL}
                images={MAHINDRA_MANULIFE_SCREENS}
                maxWidthClassName="max-w-[7rem] xs:max-w-[8.5rem] sm:max-w-[10rem] md:max-w-[11.5rem] lg:max-w-[13rem]"
                className="flex-none !mx-0"
              />
            </div>
          ) : null}

          {caseStudy.slug === "orpat-erp" ? (
            <div
              data-animate="fade-up"
              className="mt-12 flex flex-wrap items-end justify-center gap-6 sm:mt-16 sm:gap-8"
            >
              <DeviceShowcase
                frameSrc="/images/work/laptop-mockup.png"
                frameWidth={1536}
                frameHeight={1024}
                screenInset={LAPTOP_SCREEN_INSET}
                screenRadius="1%"
                contentAboveFrame={false}
                viewport={{ width: 1440, height: 884 }}
                images={ORPAT_ERP_LAPTOP_SCREENS}
                maxWidthClassName="max-w-[19rem] xs:max-w-[23rem] sm:max-w-[26rem] md:max-w-[30rem] lg:max-w-[35rem]"
                className="flex-none !mx-0"
              />
              <DeviceShowcase
                frameSrc="/images/work/mobile-mockup.png"
                frameWidth={941}
                frameHeight={1672}
                screenInset={MOBILE_SCREEN_INSET}
                screenRadius="9.12% / 4.48%"
                contentAboveFrame
                viewport={{ width: 390, height: 826 }}
                images={ORPAT_ERP_MOBILE_SCREENS}
                maxWidthClassName="max-w-[7rem] xs:max-w-[8.5rem] sm:max-w-[10rem] md:max-w-[11.5rem] lg:max-w-[13rem]"
                className="flex-none !mx-0"
              />
            </div>
          ) : null}

          {caseStudy.slug === "ambassador-hotel" ? (
            <div data-animate="fade-up" className="mt-12 sm:mt-16">
              <PhoneCoverflowGallery images={AMBASSADOR_HOTEL_PHONE_SCREENS} title={title} />
            </div>
          ) : null}

          {caseStudy.slug === "amazon-samsung-great-indian-festival" ? (
            <div data-animate="fade-up" className="mt-12 sm:mt-16">
              <YouTubeVideoSlider
                videoIds={["ASsnHpbWNZ4", "Ryl-xiVfTWk", "C-PAyRM-1I8", "ontMrJSCOUo", "cMd1T50cAvQ"]}
                title={caseStudy.campaign}
              />
            </div>
          ) : null}

          {/* Creative proof — gallery + film in deck order, under Execution */}
          {(() => {
            const executionGroups = galleryGroups.filter((group) => group.density !== "compact");
            const showExecutionVideo = videos.length > 0 && !caseStudy.heroVideo;
            const hasExecutionGallery =
              caseStudy.slug !== "waaree" &&
              (executionGroups.length > 0 ||
                (galleryGroups.length === 0 && gallery.length > 0) ||
                showExecutionVideo);
            if (!hasExecutionGallery) return null;

            return (
            <div
              id="gallery"
              data-animate="fade-up"
              className="mt-12 space-y-10 sm:mt-16 sm:space-y-12"
            >
              {(() => {
                const videoBlock =
                  showExecutionVideo ? (
                    <div
                      key="execution-video"
                      id="video"
                      className="min-w-0 overflow-x-clip"
                    >
                      <p className="text-eyebrow m-0 mb-4">
                        {caseStudy.videoLabel ?? SECTION_META.video.label}
                      </p>
                      {caseStudy.videoIntro ? (
                        <p className="text-body section-copy-on-light mb-6 max-w-none sm:mb-8">
                          {caseStudy.videoIntro}
                        </p>
                      ) : null}
                      {caseStudy.slug === "godrej-blue" ? (
                        <WorkDetailVideoMockupSlider
                          videos={videos}
                          campaign={caseStudy.campaign}
                          fallbackPoster={heroImage.src}
                        />
                      ) : (
                        <WorkDetailVideoSlider
                          videos={videos}
                          campaign={caseStudy.campaign}
                          fallbackPoster={heroImage.src}
                        />
                      )}
                    </div>
                  ) : null;

                const afterTitle = caseStudy.videoAfterGalleryTitle;
                const blocks: ReactNode[] = [];
                let videoPlaced = false;

                const groups =
                  executionGroups.length > 0
                    ? executionGroups
                    : gallery.length > 0
                      ? [{ title: "Campaign Creatives", items: gallery, description: undefined }]
                      : [];

                const showGroupTitles = groups.length + (videoBlock ? 1 : 0) > 1;

                // Royale Touché reads better as text-only proof points — drop the
                // creative screenshots and let each group stand as a title + paragraph.
                const textOnlyGallery = caseStudy.slug === "royale-touche-stay-curious";

                const renderGalleryGroup = (
                  group: (typeof groups)[number],
                  { alignTitle }: { alignTitle?: boolean } = {},
                ) =>
                  textOnlyGallery ? (
                    <div
                      key={group.title}
                      className="flex h-full min-w-0 flex-col border border-line bg-mist/40 p-6 sm:p-7"
                    >
                      <p className={`text-eyebrow m-0 ${alignTitle ? "min-h-[2.75rem]" : ""}`}>
                        {group.title}
                      </p>
                      {group.description ? (
                        <p className="text-body section-copy-on-light mt-3 mb-0 max-w-none">
                          {group.description}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div key={group.title} className="flex h-full min-w-0 flex-col">
                      {showGroupTitles ? (
                        <p
                          className={`text-eyebrow m-0 mb-4 ${
                            alignTitle ? "min-h-[2.75rem]" : ""
                          }`}
                        >
                          {group.title}
                        </p>
                      ) : null}
                      <WorkDetailGallery
                        items={group.items}
                        title={`${title} — ${group.title}`}
                        density={group.density === "solo" ? "solo" : "default"}
                      />
                      {group.description ? (
                        <p className="text-body section-copy-on-light mt-4 mb-0 max-w-none">
                          {group.description}
                        </p>
                      ) : null}
                    </div>
                  );

                let i = 0;
                while (i < groups.length) {
                  const group = groups[i]!;
                  const rowKey = group.pairRow;
                  if (rowKey) {
                    const rowGroups = [group];
                    let j = i + 1;
                    while (j < groups.length && groups[j]?.pairRow === rowKey) {
                      rowGroups.push(groups[j]!);
                      j += 1;
                    }
                    const rowHeading =
                      rowGroups.find((g) => g.pairRowHeading)?.pairRowHeading ?? null;
                    blocks.push(
                      <div key={`row-${rowKey}-${group.title}`} className="min-w-0">
                        {rowHeading ? (
                          <p className="m-0 mb-6 font-display text-lg font-bold tracking-[0.04em] text-ink uppercase sm:mb-7 sm:text-xl">
                            {rowHeading}
                          </p>
                        ) : null}
                        <div
                          className={`grid grid-cols-1 items-stretch gap-8 sm:grid-cols-2 lg:gap-8 ${
                            rowGroups.length >= 4
                              ? "xl:grid-cols-4"
                              : rowGroups.length >= 3
                                ? "lg:grid-cols-3"
                                : "lg:grid-cols-2 lg:gap-10"
                          }`}
                        >
                          {rowGroups.map((rowGroup) =>
                            renderGalleryGroup(rowGroup, { alignTitle: true }),
                          )}
                        </div>
                      </div>,
                    );
                    for (const rowGroup of rowGroups) {
                      if (videoBlock && afterTitle && rowGroup.title === afterTitle) {
                        blocks.push(videoBlock);
                        videoPlaced = true;
                      }
                    }
                    i = j;
                    continue;
                  }

                  blocks.push(renderGalleryGroup(group));
                  if (videoBlock && afterTitle && group.title === afterTitle) {
                    blocks.push(videoBlock);
                    videoPlaced = true;
                  }
                  i += 1;
                }

                if (videoBlock && !videoPlaced) {
                  blocks.push(videoBlock);
                }

                return blocks;
              })()}
            </div>
            );
          })()}
        </ContentBlock>
        ) : null}

        {/* Creatives — dedicated numbered section for case studies with distinct creative workstreams */}
        {hasSection("creatives") ? (
        <ContentBlock
          id="creatives"
          className="mt-12 sm:mt-16"
          style={sectionScrollStyle}
          labelledBy="work-creatives-heading"
        >
          <div data-animate="fade-up" className="flex flex-col gap-4 sm:gap-5">
            <SectionLabel
              id="creatives"
              number={sectionNumber("creatives")}
              headingId="work-creatives-heading"
              asHeading
            />
          </div>

          <div className="mt-10 space-y-10 sm:mt-12 sm:space-y-12">
            {galleryGroups.map((group) => (
              <div key={group.title} data-animate="fade-up" className="min-w-0">
                <p className="text-eyebrow m-0 mb-4">{group.title}</p>
                <WorkDetailGallery
                  items={group.items}
                  title={`${title} — ${group.title}`}
                  density={group.density === "solo" ? "solo" : "default"}
                />
              </div>
            ))}
          </div>
        </ContentBlock>
        ) : null}

        {/* Live activations / proof links — CMS-driven, only when linkGroups exist */}
        {hasSection("activations") ? (
          <ContentBlock
            id="activations"
            className="mt-12 sm:mt-16"
            style={sectionScrollStyle}
            labelledBy="work-activations-heading"
          >
            <SectionLabel
              id="activations"
              number={sectionNumber("activations")}
              headingId="work-activations-label"
            />
            <div className="section-intro">
              <h2
                data-animate="fade-up"
                id="work-activations-heading"
                className="text-display-md m-0 text-balance"
              >
                {workDetailHeadlines.activations}
              </h2>
            </div>

            <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
              {linkGroups.map((group) => (
                <div key={group.title} data-animate="fade-up" className="min-w-0">
                  <p className="text-eyebrow m-0">{group.title}</p>
                  {group.description ? (
                    <p className="text-body section-copy-on-light mt-3 mb-0 max-w-[42rem]">
                      {group.description}
                    </p>
                  ) : null}
                  <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-4 p-0 xs:grid-cols-2 lg:grid-cols-3 lg:gap-5">
                    {group.links.map((link) => {
                      const isReel =
                        /instagram\.com\/(?:[\w.]+\/)?reel\//i.test(link.href) ||
                        /live reel/i.test(link.description ?? "");

                      return (
                        <li key={`${link.href}-${link.label}`}>
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex h-full flex-col overflow-hidden border border-line bg-white transition hover:border-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red"
                          >
                            <span className="relative block aspect-[4/5] w-full overflow-hidden bg-mist">
                              {link.thumbnail ? (
                                <Image
                                  src={link.thumbnail}
                                  alt=""
                                  fill
                                  sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  className="object-cover"
                                  unoptimized
                                />
                              ) : (
                                <span
                                  className="absolute inset-0 flex items-center justify-center bg-ink/[0.04]"
                                  aria-hidden
                                >
                                  <span className="grid size-12 place-items-center rounded-full border border-line bg-white text-ink">
                                    <ArrowUpRight size={20} strokeWidth={2} />
                                  </span>
                                </span>
                              )}
                              {isReel ? (
                                <span
                                  className="pointer-events-none absolute inset-0 flex items-center justify-center bg-ink/15 opacity-100 transition group-hover:bg-ink/25"
                                  aria-hidden
                                >
                                  <span className="grid size-11 place-items-center rounded-full border border-white/70 bg-ink/55 text-white backdrop-blur-[2px] sm:size-12">
                                    <Play size={18} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                                  </span>
                                </span>
                              ) : null}
                            </span>
                            <span className="flex flex-1 items-start justify-between gap-3 px-4 py-3.5">
                              <span className="min-w-0">
                                <span className="block text-[15px] font-semibold text-ink transition group-hover:text-red">
                                  {link.label}
                                </span>
                                {link.description ? (
                                  <span className="mt-1 block text-[13px] leading-snug text-muted">
                                    {link.description}
                                  </span>
                                ) : null}
                              </span>
                              <ArrowUpRight
                                size={18}
                                strokeWidth={2}
                                className="mt-0.5 flex-none text-red"
                                aria-hidden
                              />
                            </span>
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </ContentBlock>
        ) : null}

        {/* Result — stats band matching Work / Home */}
        {hasSection("result") ? (
        <ContentBlock
          id="result"
          className="mt-12 sm:mt-16"
          style={sectionScrollStyle}
          labelledBy="work-result-heading"
        >
          <div
            data-animate="fade-up"
            className="bg-ink px-5 pt-10 pb-12 text-white sm:px-8 sm:pt-12 sm:pb-16 lg:px-10 lg:pt-14 lg:pb-20"
          >
            <SectionLabel
              id="result"
              number={sectionNumber("result")}
              headingId="work-result-heading"
              asHeading
              onDark
            />

            {caseStudy.resultGroups?.length ? (
              <div className="mt-8 space-y-10 sm:mt-10 sm:space-y-12">
                {caseStudy.resultGroups.map((group) => (
                  <div key={group.heading} data-animate="fade-up">
                    <h3 className="text-display-sm m-0 text-balance text-white">
                      {group.heading}
                    </h3>

                    {group.highlights?.length ? (
                      <ul
                        data-animate-stagger
                        className="m-0 mt-5 grid list-none grid-cols-1 gap-3 p-0 sm:grid-cols-2"
                      >
                        {group.highlights.map((line) => (
                          <li
                            key={line}
                            className="flex gap-3 border border-white/15 bg-white/[0.04] px-4 py-3.5"
                          >
                            <span
                              className="mt-0.5 grid size-5 flex-none place-items-center text-red"
                              aria-hidden
                            >
                              <Check size={14} strokeWidth={2.5} />
                            </span>
                            <p className="text-body m-0 min-w-0 text-pretty text-white/85">
                              {line}
                            </p>
                          </li>
                        ))}
                      </ul>
                    ) : null}

                    {group.stats.length > 0 ? (
                      <ResultStatsGrid stats={group.stats} className="mt-6 sm:mt-8" />
                    ) : null}
                  </div>
                ))}
              </div>
            ) : (
              <>
                {resultHighlights.length > 0 ? (
                  <ul
                    data-animate-stagger
                    className="m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:mt-10 sm:grid-cols-2"
                  >
                    {resultHighlights.map((line) => (
                      <li
                        key={line}
                        className="flex gap-3 border border-white/15 bg-white/[0.04] px-4 py-3.5"
                      >
                        <span
                          className="mt-0.5 grid size-5 flex-none place-items-center text-red"
                          aria-hidden
                        >
                          <Check size={14} strokeWidth={2.5} />
                        </span>
                        <p className="text-body m-0 min-w-0 text-pretty text-white/85">{line}</p>
                      </li>
                    ))}
                  </ul>
                ) : null}

                {results.length > 0 ? (
                  <ResultStatsGrid stats={results} className="mt-10 sm:mt-12" />
                ) : null}

                {caseStudy.slug === "adani-airports-safar-ke-humsafar" ? (
                  <div className="mt-10 opacity-75 sm:mt-12">
                    <WorkDetailGallery
                      title="Engagement Outcomes"
                      items={["06", "07", "08", "09", "10"].map((n, i) => ({
                        src: `/images/work/gallery/adani-airports-safar-ke-humsafar/${n}.png`,
                        alt: `${caseStudy.client} — Engagement Outcomes ${i + 1}`,
                        label: "Engagement Outcomes",
                        grayscale: false,
                        fit: "contain",
                      }))}
                    />
                  </div>
                ) : null}
              </>
            )}
          </div>
        </ContentBlock>
        ) : null}

        {/* Built With — service cards like home / capabilities */}
        {hasSection("built-with") ? (
          <ContentBlock
            id="built-with"
            className="mt-12 sm:mt-16"
            style={sectionScrollStyle}
            labelledBy="work-built-heading"
          >
            <SectionLabel
              id="built-with"
              number={sectionNumber("built-with")}
              headingId="work-built-label"
            />
            <div className="section-intro">
              <h2
                data-animate="fade-up"
                id="work-built-heading"
                className="text-display-md m-0 text-balance"
              >
                {workDetailHeadlines.built}
              </h2>
            </div>

            <ul
              data-animate-stagger
              className={`m-0 mt-8 grid list-none grid-cols-1 gap-3 p-0 sm:mt-10 ${
                builtWith.length === 1
                  ? "max-w-md"
                  : builtWith.length === 2
                    ? "xs:grid-cols-2"
                    : builtWith.length === 3
                      ? "xs:grid-cols-2 lg:grid-cols-3"
                      : "xs:grid-cols-2 lg:grid-cols-4"
              }`}
            >
              {builtWith.map((service) => {
                const Icon = SERVICE_ICONS[service.slug] ?? Layers;
                const titleId = `built-with-${service.slug}`;

                return (
                  <li key={service.slug} className="min-w-0">
                    <Link
                      href={`/services/${service.slug}`}
                      aria-labelledby={titleId}
                      className="group relative flex h-full min-h-[220px] flex-col overflow-hidden rounded-[20px] border border-[#e6e6e6] bg-white p-4 shadow-[0_10px_28px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-0.5 hover:border-red/35 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] focus-visible:border-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red sm:min-h-[248px] sm:rounded-[22px] sm:p-5 md:p-6"
                    >
                      <svg
                        className="pointer-events-none absolute -bottom-6 -left-8 h-[140px] w-[140px] text-red/[0.12]"
                        viewBox="0 0 140 140"
                        fill="none"
                        aria-hidden
                      >
                        <path
                          d="M12 128C12 64 64 12 128 12"
                          stroke="currentColor"
                          strokeWidth="1.25"
                        />
                      </svg>

                      <div className="relative flex items-start gap-3">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-red text-white shadow-[0_8px_20px_rgba(210,37,37,0.3)] sm:h-14 sm:w-14">
                          <Icon size={26} aria-hidden className="h-6 w-6 text-white sm:h-7 sm:w-7" />
                        </span>
                      </div>

                      <div className="relative mt-6 flex flex-1 flex-col sm:mt-7">
                        <h3
                          id={titleId}
                          className="m-0 w-full font-display text-[1.05rem] leading-[1.15] font-bold tracking-[0.02em] text-ink uppercase sm:text-[1.125rem]"
                        >
                          {service.shortName}
                        </h3>
                        <span className="mt-3 block h-[3px] w-8 rounded-full bg-red" aria-hidden />
                        <p className="mt-3.5 mb-0 line-clamp-3 text-[13px] leading-snug text-muted sm:text-sm">
                          {service.summary}
                        </p>
                      </div>

                      <div className="relative mt-5 flex min-h-11 items-center justify-between gap-3 sm:mt-6">
                        <span className="text-cta text-ink transition group-hover:text-red">
                          Learn more
                        </span>
                        <span
                          className="grid h-11 w-11 flex-none place-items-center rounded-full border border-red bg-white text-red transition duration-200 group-hover:bg-red group-hover:text-white"
                          aria-hidden
                        >
                          <ArrowRight size={15} strokeWidth={2.25} />
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </ContentBlock>
        ) : null}
      </div>
    </section>
  );
}
