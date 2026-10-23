import type { Metadata } from "next";
import RouteStatus from "@/components/RouteStatus";
import SiteLayout from "@/app/(site)/layout";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has moved.",
};

/**
 * Global 404 for URLs that match no route at all. It sits above the `(site)`
 * group, so it pulls the public chrome in explicitly. Pages inside `(site)`
 * that call `notFound()` use `(site)/not-found.tsx` instead.
 */
export default function NotFound() {
  return (
    <SiteLayout>
      <RouteStatus
        eyebrow="404"
        title="This page does not exist."
        body="The link may be outdated, or the page may have moved. Head home or browse our work instead."
        primaryLabel="Back to home"
        primaryHref="/"
        secondaryLabel="View our work"
        secondaryHref="/work"
      />
    </SiteLayout>
  );
}
