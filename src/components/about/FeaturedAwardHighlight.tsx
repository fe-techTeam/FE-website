import Image from "next/image";
import Link from "next/link";
import { aboutFeaturedAchievement, featuredCampaignAward } from "@/content/about";

export default function FeaturedAwardHighlight() {
  const imageSrc = featuredCampaignAward.image.src;

  return (
    <Link
      href={aboutFeaturedAchievement.href}
      className="group relative block overflow-hidden rounded-[20px] border-2 border-red bg-ink sm:rounded-[22px]"
      aria-label={`${featuredCampaignAward.client}: ${aboutFeaturedAchievement.title}`}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-stretch">
        <div className="relative aspect-[16/10] min-h-[220px] overflow-hidden bg-[#111] sm:min-h-[260px] lg:aspect-auto lg:min-h-[320px]">
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={featuredCampaignAward.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-contain p-6 transition duration-500 group-hover:scale-[1.03] sm:p-8"
            />
          ) : null}
          <span className="absolute top-4 left-4 rounded-full bg-red px-3 py-1 text-[11px] font-bold tracking-[0.16em] text-white uppercase sm:top-5 sm:left-5 sm:px-3.5 sm:py-1.5">
            Guinness World Record
          </span>
        </div>

        <div className="flex flex-col justify-center px-5 py-6 sm:px-7 sm:py-8 lg:px-8 lg:py-10">
          <p className="text-eyebrow text-eyebrow-on-dark m-0">{aboutFeaturedAchievement.eyebrow}</p>
          <p className="mt-3 mb-0 font-display text-xl leading-[1.08] font-bold tracking-[0.03em] text-white uppercase sm:mt-4 sm:text-2xl">
            {featuredCampaignAward.client}
          </p>
          <h3 className="mt-3 mb-0 font-display text-lg leading-snug font-bold tracking-[0.02em] text-white/90 sm:mt-4 sm:text-xl">
            {aboutFeaturedAchievement.title}
          </h3>
          <p className="text-body-sm mt-4 mb-0 max-w-[32rem] text-muted-on-dark sm:mt-5">{aboutFeaturedAchievement.body}</p>
        </div>
      </div>
    </Link>
  );
}
