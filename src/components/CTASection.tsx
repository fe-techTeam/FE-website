import Image from "next/image";
import GrowthCta from "@/components/GrowthCta";
import type { ReactNode } from "react";

const CTA_WAVE_SRC = "/images/cta/wave.webp";

export type CTASectionProps = {
  /** Full headline when titleBefore/titleAccent aren't used */
  headline?: string;
  titleBefore?: string;
  titleAccent?: string;
  /** Insert a line break between titleBefore and titleAccent */
  titleBreak?: boolean;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  tertiaryLabel?: string;
  tertiaryHref?: string;
  headingId?: string;
  /** Ink on dark (default) or mist with ink/red controls */
  tone?: "ink" | "mist";
  /** Decorative burst watermark (desktop) */
  burstSrc?: string;
  /** Full-bleed wave behind ink bands. Default on ink sections; pass null to disable. */
  backgroundSrc?: string | null;
  /** Custom middle column (e.g. careers contact details) */
  aside?: ReactNode;
  /** Adds data-animate-section + fade-up hooks for page reveal */
  animate?: boolean;
  /** Full-width section (default) or compact block for footer sidebar */
  layout?: "section" | "embedded";
  headlineClassName?: string;
  className?: string;
};

export default function CTASection({
  headline = "What are you trying to grow?",
  titleBefore,
  titleAccent,
  titleBreak = false,
  body,
  primaryLabel = "Let’s talk",
  primaryHref = "/contact",
  secondaryLabel,
  secondaryHref,
  tertiaryLabel,
  tertiaryHref,
  headingId = "page-cta-heading",
  tone = "ink",
  burstSrc,
  backgroundSrc,
  aside,
  animate = false,
  layout = "section",
  headlineClassName,
  className = "",
}: CTASectionProps) {
  const hasSplitTitle = Boolean(titleBefore?.trim() || titleAccent?.trim());
  const hasSecondary = Boolean(secondaryLabel && secondaryHref);
  const hasTertiary = Boolean(tertiaryLabel && tertiaryHref);
  const isMist = tone === "mist";
  const hasAside = Boolean(aside);
  const waveSrc =
    backgroundSrc === null
      ? undefined
      : backgroundSrc ?? (!isMist && layout === "section" ? CTA_WAVE_SRC : undefined);

  const sectionTone = isMist ? "bg-mist text-ink" : "bg-ink text-white";

  const accentClass = isMist ? "text-red" : "text-eyebrow-on-dark";
  const bodyClass = isMist ? "text-muted" : "text-muted-on-dark";
  const ctaTone = isMist ? "light" : "dark";
  const primaryVariant = isMist ? "primary" : "accent";
  const secondaryVariant = isMist ? "accent" : "primary";

  const gridClass = hasAside
    ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:items-center xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)_auto] xl:gap-12"
    : body
      ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16"
      : "lg:grid-cols-[minmax(0,1.15fr)_auto] lg:items-center lg:gap-12";

  const animateAttr = animate ? { "data-animate-section": true } : undefined;
  const fadeUp = animate ? { "data-animate": "fade-up" as const } : undefined;

  const headingContent = hasSplitTitle ? (
    <>
      {titleBefore}
      {titleBreak ? <br /> : " "}
      {titleAccent ? <span className={accentClass}>{titleAccent}</span> : null}
    </>
  ) : (
    headline
  );

  const isPair = hasSecondary && !hasTertiary;

  const actions = (
    <div
      className={`flex ${isPair ? "cta-actions--pair flex-row flex-wrap" : "flex-col"} items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center${
        body && !hasAside && layout === "section" ? " mt-6 sm:mt-7" : ""
      }${layout === "embedded" ? " mt-6 sm:mt-8" : ""}`}
    >
      <GrowthCta href={primaryHref} variant={primaryVariant} tone={ctaTone}>
        {primaryLabel}
      </GrowthCta>
      {hasSecondary ? (
        <GrowthCta href={secondaryHref!} variant={secondaryVariant} tone={ctaTone}>
          {secondaryLabel}
        </GrowthCta>
      ) : null}
      {hasTertiary ? (
        <GrowthCta href={tertiaryHref!} variant={secondaryVariant} tone={ctaTone}>
          {tertiaryLabel}
        </GrowthCta>
      ) : null}
    </div>
  );

  if (layout === "embedded") {
    return (
      <div
        className={`min-w-0 max-w-none sm:max-w-[320px]${className ? ` ${className}` : ""}`}
        aria-labelledby={headingId}
      >
        <h2
          id={headingId}
          className={headlineClassName ?? "text-display-md m-0 min-w-0 text-balance"}
        >
          {headingContent}
        </h2>
        {actions}
      </div>
    );
  }

  return (
    <section
      {...animateAttr}
      className={`section-shell section-pad relative overflow-hidden ${sectionTone}${className ? ` ${className}` : ""}`}
      aria-labelledby={headingId}
    >
      {waveSrc ? (
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${waveSrc})` }}
          aria-hidden
        >
          <div
            className={
              isMist
                ? "absolute inset-0 bg-gradient-to-r from-mist/90 via-mist/55 to-mist/20"
                : "absolute inset-0 bg-gradient-to-r from-ink/80 via-ink/40 to-ink/10"
            }
          />
        </div>
      ) : null}

      {burstSrc && !waveSrc ? (
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <div
            className={`absolute top-1/2 right-0 hidden size-[min(38vw,20rem)] translate-x-[18%] -translate-y-1/2 lg:block xl:size-[22rem] ${
              isMist ? "opacity-40" : "opacity-35"
            }`}
          >
            <Image src={burstSrc} alt="" fill sizes="352px" unoptimized className="object-contain" />
          </div>
        </div>
      ) : null}

      <div
        className={`section-inner relative z-[1] grid grid-cols-1 items-start gap-8 sm:gap-10 ${gridClass}`}
      >
        <h2
          {...fadeUp}
          id={headingId}
          className={headlineClassName ?? "text-display-md m-0 min-w-0 text-balance"}
        >
          {headingContent}
        </h2>

        {hasAside ? <div className="min-w-0">{aside}</div> : null}

        <div
          {...fadeUp}
          className={`min-w-0${hasAside ? " lg:col-span-2 xl:col-span-1" : ""}`}
        >
          {body && !hasAside ? (
            <p className={`text-body m-0 max-w-md ${bodyClass}`}>{body}</p>
          ) : null}
          {actions}
        </div>
      </div>
    </section>
  );
}
