export default function Loading() {
  return (
    // Decorative skeleton only: no announced text, so "Loading page" never lands in the page HTML.
    <section className="section-shell section-pad bg-paper" aria-hidden>
      <div className="section-inner">
        <div className="h-3 w-24 animate-pulse bg-line/70" />
        <div className="mt-6 h-12 w-full max-w-xl animate-pulse bg-line/70 sm:h-14" />
        <div className="mt-4 h-4 w-full max-w-lg animate-pulse bg-line/50" />
        <div className="mt-2 h-4 w-full max-w-md animate-pulse bg-line/50" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="aspect-[4/3] animate-pulse bg-line/40" />
          <div className="aspect-[4/3] animate-pulse bg-line/40 max-sm:hidden" />
          <div className="aspect-[4/3] animate-pulse bg-line/40 max-lg:hidden" />
        </div>
      </div>
    </section>
  );
}
