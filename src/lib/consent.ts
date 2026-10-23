/**
 * Cookie consent state, shared by the banner and the GTM bootstrap.
 *
 * The choice is kept in localStorage and mirrored to Google Consent Mode v2: every signal starts "denied"
 * (set by the inline script in GoogleTagManager before gtm.js loads) and is "updated" once the visitor chooses.
 * The same key is read by that inline script, so keep CONSENT_KEY in sync with it.
 */
export const CONSENT_KEY = "fe-consent";
export const OPEN_CONSENT_EVENT = "fe-open-consent";

export type ConsentChoice = {
  v: 1;
  analytics: boolean;
  marketing: boolean;
  ts: number;
};

type DataLayerWindow = Window & { dataLayer?: unknown[] };

export function readConsent(): ConsentChoice | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ConsentChoice>;
    if (parsed.v !== 1) return null;
    return { v: 1, analytics: !!parsed.analytics, marketing: !!parsed.marketing, ts: Number(parsed.ts) || 0 };
  } catch {
    return null;
  }
}

/** Consent Mode wants the `arguments` object itself on the dataLayer, not an array, so this can't be an arrow function. */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(..._args: unknown[]) {
  const w = window as DataLayerWindow;
  (w.dataLayer ??= []).push(arguments); // eslint-disable-line prefer-rest-params
}

export function applyConsent(choice: Pick<ConsentChoice, "analytics" | "marketing">) {
  const analytics = choice.analytics ? "granted" : "denied";
  const marketing = choice.marketing ? "granted" : "denied";
  gtag("consent", "update", {
    analytics_storage: analytics,
    ad_storage: marketing,
    ad_user_data: marketing,
    ad_personalization: marketing,
  });
}

export function saveConsent(choice: Pick<ConsentChoice, "analytics" | "marketing">) {
  const value: ConsentChoice = { v: 1, analytics: choice.analytics, marketing: choice.marketing, ts: Date.now() };
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify(value));
  } catch {
    /* storage unavailable: the choice still applies for this page view */
  }
  applyConsent(value);
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_CONSENT_EVENT));
}
