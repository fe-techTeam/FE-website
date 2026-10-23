"use client";

import ServiceDetailPage from "@/components/services/ServiceDetailPage";
import { getServicePageContent } from "@/content/servicePages";

/** Thin wrapper so /services/media-buying keeps its dedicated route. */
export default function MediaBuyingPage() {
  return <ServiceDetailPage content={getServicePageContent("media-buying")!} />;
}
