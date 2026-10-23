import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CareersTeaser() {
  return (
    <section
      id="careers"
      data-animate-section
      className="section-shell section-pad bg-mist"
      aria-labelledby="careers-heading"
    >
      <div className="section-inner">
        <p data-animate="fade-up" className="text-eyebrow m-0">
          Careers
        </p>
        <div className="section-intro">
          <h2 data-animate="fade-up" id="careers-heading" className="text-display-md m-0">
            Got ideas? Good.
            <br />
            We have a place for you.
          </h2>
          <div data-animate="fade-up" className="min-w-0 pt-0 md:pt-1 md:justify-self-end md:self-end">
            <Link href="/careers" className="text-cta link-cta text-ink">
              Explore careers
              <ArrowRight size={16} aria-hidden />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
