type RouteDetailLoadingProps = {
  label: string;
  variant: "work" | "careers" | "services";
};

function Pulse({ className }: { className?: string }) {
  return <div className={`animate-pulse bg-line/60 ${className ?? ""}`} aria-hidden />;
}

function HeroSkeleton({ withMedia = true }: { withMedia?: boolean }) {
  return (
    <section className="section-shell section-pad bg-paper" aria-hidden>
      <div className="section-inner">
        <div className="flex flex-wrap gap-2">
          <Pulse className="h-3 w-12" />
          <Pulse className="h-3 w-3 rounded-full" />
          <Pulse className="h-3 w-16" />
          <Pulse className="h-3 w-3 rounded-full" />
          <Pulse className="h-3 w-24" />
        </div>
        <div className={`mt-8 grid gap-8 ${withMedia ? "lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-0" : ""}`}>
          <div className="min-w-0 lg:pr-16 xl:pr-20">
            <Pulse className="h-3 w-28" />
            <Pulse className="mt-5 h-12 w-full max-w-2xl sm:h-14" />
            <Pulse className="mt-4 h-4 w-full max-w-xl" />
            <Pulse className="mt-2 h-4 w-full max-w-lg" />
            <div className="mt-6 flex flex-wrap gap-3">
              <Pulse className="h-10 w-28 rounded-full" />
              <Pulse className="h-10 w-32 rounded-full" />
              <Pulse className="h-10 w-24 rounded-full" />
            </div>
          </div>
          {withMedia ? (
            <div className="min-w-0">
              <Pulse className="aspect-[4/3] w-full sm:aspect-[16/10] lg:aspect-auto lg:min-h-[320px]" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function StickyNavSkeleton() {
  return (
    <div className="border-b border-line bg-white/95" aria-hidden>
      <div className="section-inner flex gap-4 overflow-hidden py-3">
        <Pulse className="h-4 w-20 shrink-0" />
        <Pulse className="h-4 w-24 shrink-0" />
        <Pulse className="h-4 w-28 shrink-0" />
        <Pulse className="h-4 w-20 shrink-0 max-sm:hidden" />
        <Pulse className="h-4 w-24 shrink-0 max-md:hidden" />
      </div>
    </div>
  );
}

function BodySkeleton({ aside = false }: { aside?: boolean }) {
  return (
    <section className="section-shell section-pad bg-paper" aria-hidden>
      <div className={`section-inner grid gap-10 ${aside ? "xl:grid-cols-[minmax(0,1fr)_minmax(18rem,22rem)] xl:items-start" : ""}`}>
        <div className="min-w-0 space-y-8">
          <div>
            <Pulse className="h-3 w-24" />
            <Pulse className="mt-4 h-8 w-full max-w-md" />
            <Pulse className="mt-4 h-4 w-full" />
            <Pulse className="mt-2 h-4 w-full" />
            <Pulse className="mt-2 h-4 w-5/6" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Pulse className="aspect-[4/3] w-full" />
            <Pulse className="aspect-[4/3] w-full max-sm:hidden" />
          </div>
          <div>
            <Pulse className="h-3 w-28" />
            <Pulse className="mt-4 h-4 w-full" />
            <Pulse className="mt-2 h-4 w-full" />
            <Pulse className="mt-2 h-4 w-4/5" />
          </div>
        </div>
        {aside ? (
          <aside className="space-y-4">
            <Pulse className="h-40 w-full border border-line/40 bg-mist/50" />
            <Pulse className="h-32 w-full border border-line/40 bg-mist/50" />
          </aside>
        ) : null}
      </div>
    </section>
  );
}

function ServiceSectionsSkeleton() {
  return (
    <>
      <section className="section-shell section-pad bg-mist" aria-hidden>
        <div className="section-inner">
          <Pulse className="h-3 w-24" />
          <Pulse className="mt-4 h-8 w-full max-w-sm" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Pulse className="min-h-[180px] w-full" />
            <Pulse className="min-h-[180px] w-full" />
            <Pulse className="min-h-[180px] w-full max-lg:hidden" />
          </div>
        </div>
      </section>
      <section className="section-shell section-pad bg-paper" aria-hidden>
        <div className="section-inner">
          <Pulse className="aspect-[16/10] w-full max-w-4xl" />
        </div>
      </section>
    </>
  );
}

export default function RouteDetailLoading({ label, variant }: RouteDetailLoadingProps) {
  return (
    <div aria-busy="true" aria-live="polite">
      <p className="sr-only">{label}</p>
      <HeroSkeleton />
      {variant === "work" || variant === "careers" ? (
        <StickyNavSkeleton />
      ) : null}
      {variant === "services" ? (
        <ServiceSectionsSkeleton />
      ) : (
        <BodySkeleton aside={variant === "careers"} />
      )}
      {variant === "work" ? (
        <section className="section-shell section-pad bg-mist" aria-hidden>
          <div className="section-inner grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Pulse className="aspect-[16/10] w-full" />
            <Pulse className="aspect-[16/10] w-full max-sm:hidden" />
            <Pulse className="aspect-[16/10] w-full max-lg:hidden" />
          </div>
        </section>
      ) : null}
    </div>
  );
}
