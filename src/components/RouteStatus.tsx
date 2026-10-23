import GrowthCta from "@/components/GrowthCta";

type RouteStatusProps = {
  eyebrow: string;
  title: string;
  body: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  onPrimaryClick?: () => void;
  headingId?: string;
};

export default function RouteStatus({
  eyebrow,
  title,
  body,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  onPrimaryClick,
  headingId = "route-status-heading",
}: RouteStatusProps) {
  return (
    <section
      className="section-shell section-pad flex min-h-[65vh] items-center bg-paper"
      aria-labelledby={headingId}
    >
      <div className="section-inner mx-auto max-w-2xl text-center">
        <p className="text-eyebrow m-0 text-red">{eyebrow}</p>
        <h1 id={headingId} className="text-display-md mt-4 m-0 text-balance">
          {title}
        </h1>
        <p className="text-body mx-auto mt-5 m-0 max-w-lg text-muted">{body}</p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
          {onPrimaryClick ? (
            <GrowthCta
              type="button"
              variant="accent"
              block
              className="sm:w-auto"
              onClick={onPrimaryClick}
            >
              {primaryLabel}
            </GrowthCta>
          ) : (
            <GrowthCta href={primaryHref} variant="accent" block className="sm:w-auto">
              {primaryLabel}
            </GrowthCta>
          )}
          {secondaryLabel && secondaryHref ? (
            <GrowthCta href={secondaryHref} variant="secondary" block className="sm:w-auto">
              {secondaryLabel}
            </GrowthCta>
          ) : null}
        </div>
      </div>
    </section>
  );
}
