"use client";

import { useEffect } from "react";
import RouteStatus from "@/components/RouteStatus";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <RouteStatus
      eyebrow="Error"
      title="Something went wrong."
      body="We hit an unexpected problem loading this page. Try again, or go back home while we sort it out."
      primaryLabel="Try again"
      primaryHref="/"
      onPrimaryClick={retry}
      secondaryLabel="Back to home"
      secondaryHref="/"
    />
  );
}
