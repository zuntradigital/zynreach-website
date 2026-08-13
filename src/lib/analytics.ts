/**
 * Consent-aware analytics abstraction (SRS Section 16). All events push to
 * the GTM dataLayer — per SRS: "Google Tag Manager: Central tag
 * governance, no hardcoded marketing pixels in codebase." GA4, Clarity,
 * Meta Pixel, and LinkedIn Insight Tag are configured *inside* the GTM
 * container (not here), triggered off these dataLayer events.
 *
 * Every call is gated behind consent (SRS: "non-essential tags fire only
 * after explicit consent, per category") via the same consent record
 * CookieBanner writes to localStorage — one source of truth, no drift.
 */

const CONSENT_STORAGE_KEY = "zynreach-cookie-consent-v1";

export type ConsentCategory = "analytics" | "advertising" | "functional";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return false;
    const parsed = JSON.parse(stored) as { choice: string; analytics: boolean };
    return parsed.analytics === true;
  } catch {
    return false;
  }
}

function pushToDataLayer(payload: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(payload);
}

/** SRS 16 "Event Tracking": generic named event with arbitrary params. */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  pushToDataLayer({ event: name, ...params });
}

export type ConversionType = "demo_booked" | "trial_started" | "content_downloaded" | "newsletter_signup";

/** SRS 16 "Conversion Tracking": Demo booked, Trial started, Content downloaded, Newsletter signup. */
export function trackConversion(type: ConversionType, params: Record<string, unknown> = {}) {
  trackEvent("conversion", { conversion_type: type, ...params });
}

/** SRS 16 "Event Tracking": CTA clicks. */
export function trackCtaClick(ctaId: string, location: string) {
  trackEvent("cta_click", { cta_id: ctaId, location });
}

/** SRS 16 "Custom Events": search queries. */
export function trackSearch(query: string, resultCount: number) {
  trackEvent("search", { search_query: query, result_count: resultCount });
}

/** SRS 16 "Custom Events": persona-selector interactions. */
export function trackPersonaSelect(personaId: string) {
  trackEvent("persona_select", { persona_id: personaId });
}

/** SRS 16 "Event Tracking": pricing toggle interactions. */
export function trackPricingToggle(billingPeriod: "monthly" | "annual") {
  trackEvent("pricing_toggle", { billing_period: billingPeriod });
}

/** SRS 16 "Custom Events": calculator usage. */
export function trackCalculatorUsage(calculator: string, value: number) {
  trackEvent("calculator_usage", { calculator, value });
}
