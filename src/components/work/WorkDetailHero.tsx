"use client";

import { useRef, useState, type RefObject } from "react";
import { Play } from "lucide-react";
import PageHero from "@/components/PageHero";
import { ImageSlot } from "@/components/media/AssetPlaceholder";
import DeviceShowcase from "@/components/work/DeviceShowcase";
import {
  LAPTOP_SCREEN_INSET,
  MAHINDRA_MANULIFE_LIVE_URL,
  MAHINDRA_MANULIFE_SCREENS,
} from "@/content/deviceShowcases";
import type { WorkDetailModel } from "@/content/workDetail";
import { workHero } from "@/content/workPage";
import { WORK_TAGS_ENABLED } from "@/content/features";

type WorkDetailHeroProps = {
  caseStudy: WorkDetailModel["caseStudy"];
  title: WorkDetailModel["title"];
  familyLabel: WorkDetailModel["familyLabel"];
  tags: WorkDetailModel["tags"];
  heroImage: WorkDetailModel["heroImage"];
  displayTitle: string;
  flipTargetRef: RefObject<HTMLDivElement | null>;
  flipEntrance: boolean;
  firstSectionId: string;
  scrollToElement: (elementId: string) => void;
};

export default function WorkDetailHero({
  caseStudy,
  title,
  familyLabel,
  tags,
  heroImage,
  displayTitle,
  flipTargetRef,
  flipEntrance,
  firstSectionId,
  scrollToElement,
}: WorkDetailHeroProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const heroClip =
    caseStudy.heroVideo
      ? caseStudy.videos?.[0] ?? caseStudy.video
      : undefined;

  const rotateDeg = heroClip?.rotate === "ccw" ? -90 : heroClip?.rotate === "cw" ? 90 : 0;

  const frameClassName = heroClip
    ? heroClip.rotate
      ? "aspect-video w-full bg-[#0a1f3d]"
      : heroClip.portrait
        ? "aspect-[9/16] mx-auto w-full max-w-[280px] sm:max-w-[320px] lg:max-w-[360px] bg-[#0a1f3d]"
        : "aspect-video w-full bg-[#0a1f3d]"
    : heroImage.fit === "contain"
      ? caseStudy.slug === "royale-touche-stay-curious"
        ? "aspect-video w-full bg-[#1a1410]"
        : caseStudy.slug === "fedex-csk"
          ? "aspect-[8/5] w-full bg-[#1c8ef0]"
          : caseStudy.slug === "amazon-samsung-great-indian-festival"
            ? "aspect-[8/5] w-full bg-[#e2e1e2]"
            : caseStudy.slug === "adani-airports-safar-ke-humsafar"
              ? "aspect-[8/5] w-full bg-[#c5eafc]"
              : "aspect-[8/5] w-full bg-[#004c8d]"
      : "aspect-[8/5] w-full lg:aspect-auto lg:h-full lg:min-h-[420px]";

  const playHeroVideo = () => {
    const el = videoRef.current;
    if (!el) return;
    void el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  };

  return (
    <PageHero
      headingId="work-detail-heading"
      breadcrumbs={[
        { label: "Home", href: "/" },
        { label: "Work", href: "/work" },
        { label: title, title, clamp: true },
      ]}
      breadcrumbTone="accent"
      breadcrumbCurrentClassName="text-ink"
      eyebrow={familyLabel}
      title={
        caseStudy.hashtag &&
        caseStudy.hashtag.toLowerCase() !== caseStudy.campaign.toLowerCase() ? (
          <>
            {caseStudy.campaign}{" "}
            <span className="text-red">{caseStudy.hashtag}</span>
          </>
        ) : (
          displayTitle
        )
      }
      body={caseStudy.hero}
      bodyClassName="text-body section-copy section-copy-on-light mt-5 mb-0 max-w-[32rem] sm:mt-6"
      copyAfterBody={
        WORK_TAGS_ENABLED ? (
          <ul
            data-animate="hero-copy"
            className="mt-6 mb-0 flex list-none flex-wrap gap-2 p-0"
            aria-label="Campaign tags"
          >
            {tags.map((tag) => (
              <li key={tag} className="insight-tag border border-line px-3 py-1 text-ink">
                {tag}
              </li>
            ))}
          </ul>
        ) : undefined
      }
      gridClassName={
        heroImage.fit === "contain" || heroClip
          ? "grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-0"
          : "grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-0"
      }
      copyColumnClassName="relative z-[1] flex min-w-0 flex-col justify-center lg:pr-20 xl:pr-24"
      mediaColumnClassName="relative z-[1] min-w-0 overflow-hidden"
      media={
        <div aria-busy={flipEntrance || undefined} className="h-full">
          <div
            ref={flipTargetRef}
            data-work-flip-target={caseStudy.slug}
            className="relative h-full min-h-0 overflow-hidden"
          >
            {heroClip?.src ? (
              <div className={`relative overflow-hidden ${frameClassName}`}>
                {rotateDeg ? (
                  <div
                    className="absolute top-1/2 left-1/2"
                    style={{
                      width: "56.25%",
                      height: "177.7778%",
                      transform: `translate(-50%, -50%) rotate(${rotateDeg}deg)`,
                    }}
                  >
                    <video
                      ref={videoRef}
                      className="absolute inset-0 h-full w-full object-cover"
                      playsInline
                      preload="metadata"
                      poster={heroClip.poster ?? heroImage.src}
                      controls={playing}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      onEnded={() => setPlaying(false)}
                      aria-label={heroClip.title}
                    >
                      <source src={heroClip.src} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <video
                    ref={videoRef}
                    className="absolute inset-0 h-full w-full object-cover"
                    playsInline
                    preload="metadata"
                    poster={heroClip.poster ?? heroImage.src}
                    controls={playing}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                    aria-label={heroClip.title}
                  >
                    <source src={heroClip.src} type="video/mp4" />
                  </video>
                )}

                {!playing ? (
                  <button
                    type="button"
                    onClick={playHeroVideo}
                    className="absolute inset-0 flex items-center justify-center bg-ink/25 transition hover:bg-ink/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-red"
                    aria-label={`Play ${heroClip.title}`}
                  >
                    <span className="grid size-14 place-items-center rounded-full bg-red text-white shadow-[0_10px_28px_rgba(210,37,37,0.4)] sm:size-16 lg:size-[4.5rem]">
                      <Play
                        size={28}
                        fill="currentColor"
                        className="translate-x-0.5 sm:size-8"
                        aria-hidden
                      />
                    </span>
                  </button>
                ) : null}
              </div>
            ) : caseStudy.slug === "mahindra-manulife" ? (
              <div className="flex h-full items-center justify-center py-4">
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
                  maxWidthClassName="max-w-[22rem] xs:max-w-[26rem] sm:max-w-[30rem] md:max-w-[34rem] lg:max-w-[40rem]"
                />
              </div>
            ) : (
              <ImageSlot
                asset={{
                  ...heroImage,
                  // Match frame to the banner so cover fills without cropping type/logos.
                  fit: heroImage.fit === "contain" ? "cover" : heroImage.fit,
                }}
                priority
                className={frameClassName}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      }
      burstSrc={workHero.burst}
      showMediaRule={false}
      seam={{
        onClick: () => scrollToElement(firstSectionId),
        ariaLabel: "Continue to case study",
        arrowSrc: workHero.arrow,
      }}
    />
  );
}
