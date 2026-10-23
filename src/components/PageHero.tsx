import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import JsonLd from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export type PageBreadcrumbItem = {
  label: string;
  href?: string;
  title?: string;
  clamp?: boolean;
};

type PageBreadcrumbProps = {
  items: PageBreadcrumbItem[];
  tone?: "muted" | "accent";
  separator?: "/" | ">";
  currentClassName?: string;
};

const linkClassByTone = {
  muted:
    "tap-target-sm inline-flex items-center rounded-sm text-ink transition hover:text-red focus-visible:text-red focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red",
  accent:
    "rounded-sm text-red transition hover:text-ink focus-visible:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red",
} as const;

export function PageBreadcrumb({
  items,
  tone = "muted",
  separator = "/",
  currentClassName = "text-ink",
}: PageBreadcrumbProps) {
  const navClassName =
    tone === "accent" ? "text-body-sm text-red" : "text-body-sm text-muted";

  return (
    <nav aria-label="Breadcrumb" data-animate="hero-copy" className={navClassName}>
      <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
        {items.flatMap((item, index) => {
          const isLast = index === items.length - 1;
          const nodes: ReactNode[] = [];

          if (index > 0) {
            nodes.push(
              <li key={`sep-${index}`} aria-hidden className={tone === "accent" ? undefined : "text-line"}>
                {separator}
              </li>,
            );
          }

          nodes.push(
            <li
              key={`${item.label}-${index}`}
              className={isLast && !item.href ? `max-w-full min-w-0 ${currentClassName}` : undefined}
              aria-current={isLast && !item.href ? "page" : undefined}
            >
              {item.href ? (
                <Link href={item.href} className={linkClassByTone[tone]}>
                  {item.label}
                </Link>
              ) : (
                <span title={item.title} className={item.clamp ? "line-clamp-2 sm:line-clamp-none" : undefined}>
                  {item.label}
                </span>
              )}
            </li>,
          );

          return nodes;
        })}
      </ol>
    </nav>
  );
}

export type PageHeroSeam = {
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  arrowSrc: string;
  arrowSize?: number;
  className?: string;
};

type PageHeroProps = {
  headingId: string;
  breadcrumbs: PageBreadcrumbItem[];
  breadcrumbTone?: PageBreadcrumbProps["tone"];
  breadcrumbSeparator?: PageBreadcrumbProps["separator"];
  breadcrumbCurrentClassName?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  copyAfterBody?: ReactNode;
  media: ReactNode;
  showMediaRule?: boolean;
  burstSrc: string;
  burstClassName?: string;
  seam?: PageHeroSeam;
  gridClassName?: string;
  copyColumnClassName?: string;
  mediaColumnClassName?: string;
  bodyClassName?: string;
  titleClassName?: string;
  /** Stable accessible name for the H1 when its visible text animates (e.g. a rotating word). */
  titleAriaLabel?: string;
};

export const PAGE_HERO_SECTION_CLASS =
  "section-shell bg-paper pt-8 pb-10 sm:pt-10 sm:pb-12 lg:pt-12 lg:pb-16";

const DEFAULT_GRID_CLASS =
  "grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-0";

const DEFAULT_COPY_CLASS = "relative z-[1] min-w-0 lg:pr-20 xl:pr-24";

const DEFAULT_MEDIA_CLASS = "relative z-[1] min-w-0 overflow-hidden";

const DEFAULT_BURST_CLASS =
  "pointer-events-none absolute top-1/2 left-1/2 z-0 hidden size-[min(68%,20rem)] -translate-x-1/2 -translate-y-1/2 lg:block";

/** lg: 3.5rem (56px) → xl: 5rem (80px); image fills the hit target via size-full.
 *  Avoid transform-based vertical centering so ButtonMotion hover cannot shift position. */
export const PAGE_HERO_SEAM_CLASS =
  "absolute top-0 bottom-0 left-1/2 z-20 my-auto grid size-14 -translate-x-1/2 place-items-center rounded-full transition hover:opacity-80 focus-visible:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red max-lg:hidden xl:size-20";

const SEAM_ARROW_INTRINSIC = 80;

export default function PageHero({
  headingId,
  breadcrumbs,
  breadcrumbTone = "muted",
  breadcrumbSeparator = "/",
  breadcrumbCurrentClassName,
  eyebrow,
  title,
  body,
  copyAfterBody,
  media,
  showMediaRule = false,
  burstSrc,
  burstClassName = DEFAULT_BURST_CLASS,
  seam,
  gridClassName = DEFAULT_GRID_CLASS,
  copyColumnClassName = DEFAULT_COPY_CLASS,
  mediaColumnClassName = DEFAULT_MEDIA_CLASS,
  bodyClassName = "text-body section-copy section-copy-on-light mt-5 mb-0 max-w-[28rem] sm:mt-6",
  titleClassName = "text-display-xl mt-4 mb-0 text-balance",
  titleAriaLabel,
}: PageHeroProps) {
  return (
    <section className={PAGE_HERO_SECTION_CLASS} aria-labelledby={headingId}>
      <JsonLd data={breadcrumbJsonLd(breadcrumbs)} />
      <div className="section-inner">
        <PageBreadcrumb
          items={breadcrumbs}
          tone={breadcrumbTone}
          separator={breadcrumbSeparator}
          currentClassName={breadcrumbCurrentClassName}
        />

        <div className="relative mt-8 lg:mt-10">
          <div className={gridClassName}>
            <div className={copyColumnClassName}>
              {eyebrow ? (
                <p data-animate="hero-copy" className="text-eyebrow m-0">
                  {eyebrow}
                </p>
              ) : null}
              <h1 id={headingId} data-animate="hero-copy" className={titleClassName} aria-label={titleAriaLabel}>
                {title}
              </h1>
              {body ? (
                <p data-animate="hero-copy" className={bodyClassName}>
                  {body}
                </p>
              ) : null}
              {copyAfterBody}
            </div>

            <div data-animate="hero-visual" className={mediaColumnClassName}>
              {media}
              {showMediaRule ? (
                <div
                  className="pointer-events-none absolute top-1/2 right-0 left-0 z-[2] hidden h-px -translate-y-1/2 bg-red lg:block"
                  aria-hidden
                />
              ) : null}
            </div>
          </div>

          <div data-animate="hero-seam" className={burstClassName} aria-hidden>
            <Image src={burstSrc} alt="" fill sizes="320px" unoptimized className="object-contain opacity-45" />
          </div>

          {seam ? (
            seam.href ? (
              <Link
                href={seam.href}
                data-animate="hero-seam"
                data-no-btn-motion
                aria-label={seam.ariaLabel}
                className={seam.className ?? PAGE_HERO_SEAM_CLASS}
              >
                <Image
                  src={seam.arrowSrc}
                  alt=""
                  aria-hidden
                  width={seam.arrowSize ?? SEAM_ARROW_INTRINSIC}
                  height={seam.arrowSize ?? SEAM_ARROW_INTRINSIC}
                  unoptimized
                  className="size-full max-h-full max-w-full object-contain"
                />
              </Link>
            ) : (
              <button
                type="button"
                data-no-btn-motion
                onClick={seam.onClick}
                data-animate="hero-seam"
                aria-label={seam.ariaLabel}
                className={seam.className ?? PAGE_HERO_SEAM_CLASS}
              >
                <Image
                  src={seam.arrowSrc}
                  alt=""
                  aria-hidden
                  width={seam.arrowSize ?? SEAM_ARROW_INTRINSIC}
                  height={seam.arrowSize ?? SEAM_ARROW_INTRINSIC}
                  unoptimized
                  className="size-full max-h-full max-w-full object-contain"
                />
              </button>
            )
          ) : null}
        </div>
      </div>
    </section>
  );
}
