import Image from "next/image";
import { awardsGallery, type AwardGalleryItem } from "@/content/awards";

function statSlug(src: string) {
  return src.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function AwardCard({ award }: { award: AwardGalleryItem }) {
  const titleId = `award-${statSlug(award.image.src || award.organization)}`;

  return (
    <article
      className="flex h-full flex-col overflow-hidden rounded-[20px] border border-line bg-white sm:rounded-[22px]"
      aria-labelledby={titleId}
    >
      <div className="relative aspect-[4/3] shrink-0 overflow-hidden bg-[#111]">
        {award.image.src ? (
          <Image
            src={award.image.src}
            alt={award.image.alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-contain transition duration-500"
          />
        ) : (
          <div
            className="flex h-full flex-col items-center justify-center border border-dashed border-white/20 px-4 text-center"
            role="img"
            aria-label={`${award.image.alt} (placeholder)`}
          >
            <span className="text-[10px] font-bold tracking-[0.2em] text-white/50 uppercase">Image</span>
            <span className="mt-1.5 text-xs leading-snug text-white/60">{award.image.label}</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col px-5 py-4 sm:px-6 sm:py-5">
        <h3
          id={titleId}
          className="m-0 font-display text-[1.05rem] leading-[1.12] font-bold tracking-[0.02em] text-ink uppercase sm:text-[1.15rem]"
        >
          {award.organization}
        </h3>
        <p className="mt-2 mb-0 text-[13px] leading-snug font-semibold text-ink">{award.tier}</p>
        <p className="mt-1 mb-0 text-[13px] leading-snug text-muted">{award.category}</p>
      </div>
    </article>
  );
}

type AwardsGalleryGridProps = {
  headingId: string;
};

export default function AwardsGalleryGrid({ headingId }: AwardsGalleryGridProps) {
  return (
    <ul
      data-animate-stagger
      className="m-0 grid list-none grid-cols-1 gap-5 p-0 xs:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4"
      aria-labelledby={headingId}
    >
      {awardsGallery.map((award) => (
        <li key={award.image.src || award.organization} className="min-w-0">
          <AwardCard award={award} />
        </li>
      ))}
    </ul>
  );
}
