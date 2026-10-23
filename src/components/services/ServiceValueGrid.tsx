import { IconSlot } from "@/components/media/AssetPlaceholder";
import type { ServicePageValueCard } from "@/content/servicePages/types";

type ServiceValueGridProps = {
  cards: ServicePageValueCard[];
  /** Grid column classes — defaults to a 2-column cap for the paired `why` layout. */
  gridClassName?: string;
};

export default function ServiceValueGrid({
  cards,
  gridClassName = "grid-cols-1 xs:grid-cols-2",
}: ServiceValueGridProps) {
  return (
    <ul
      data-animate-stagger
      className={`m-0 grid list-none gap-4 p-0 xs:gap-5 ${gridClassName}`.trim()}
    >
      {cards.map((card) => {
        return (
          <li key={card.id} className="min-w-0">
            <article className="relative flex h-full min-h-[200px] flex-col overflow-hidden rounded-[20px] border border-[#e6e6e6] bg-white p-4 shadow-[0_10px_28px_rgba(0,0,0,0.05)] sm:min-h-[220px] sm:rounded-[22px] sm:p-5 md:p-6">
              <div className="relative flex items-start gap-3">
                <IconSlot
                  asset={card.icon}
                  size={48}
                  tone="accent"
                  className="h-10 w-10 sm:h-12 sm:w-12"
                />
              </div>

              <div className="relative mt-5 flex flex-1 flex-col sm:mt-6">
                <h3 className="m-0 font-display text-[1.05rem] leading-[1.2] font-bold tracking-[0.02em] text-ink uppercase sm:text-[1.125rem]">
                  {card.title}
                </h3>
                <span className="mt-3 block h-[3px] w-8 rounded-full bg-red" aria-hidden />
                <p className="text-body-sm mt-3.5 mb-0 text-muted">{card.body}</p>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
