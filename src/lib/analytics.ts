type DataLayerWindow = Window & { dataLayer?: Record<string, unknown>[] };

/**
 * Pushes a conversion event onto the GTM/GA4 dataLayer. A no-op when no tag manager is installed,
 * so forms can fire it unconditionally and marketing can wire GA4/Ads to `generate_lead` later.
 */
export function trackEvent(event: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as DataLayerWindow;
  (w.dataLayer ??= []).push({ event, ...params });
}
