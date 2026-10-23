import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ButtonMotion from "@/components/ButtonMotion";
import Preloader from "@/components/Preloader";
import WorkCaseTransition from "@/components/work/WorkCaseTransition";
import PreviewBanner from "@/components/admin/PreviewBanner";
import JsonLd from "@/components/JsonLd";
import GoogleTagManager from "@/components/GoogleTagManager";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";

/**
 * Public site chrome. Split out of the root layout so `/admin` renders without
 * the marketing header, footer and page-reveal animations.
 */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <JsonLd data={websiteJsonLd()} />
      <GoogleTagManager />
      <PreviewBanner />
      <Preloader />
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <Header />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <ButtonMotion />
      <WorkCaseTransition />
    </>
  );
}
