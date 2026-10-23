import type { Metadata } from "next";
import RouteStatus from "@/components/RouteStatus";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist or has moved.",
};

export default function NotFound() {
  return (
    <RouteStatus
      eyebrow="404"
      title="This page does not exist."
      body="The link may be outdated, or the page may have moved. Head home or browse our work instead."
      primaryLabel="Back to home"
      primaryHref="/"
      secondaryLabel="View our work"
      secondaryHref="/work"
    />
  );
}
