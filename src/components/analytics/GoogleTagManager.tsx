"use client";

import { useSyncExternalStore } from "react";
import Script from "next/script";

const CONSENT_STORAGE_KEY = "zynreach-cookie-consent-v1";
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function hasAnalyticsConsent(): boolean {
  try {
    const stored = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return false;
    return (JSON.parse(stored) as { analytics: boolean }).analytics === true;
  } catch {
    return false;
  }
}

/**
 * SRS Section 16: loads Google Tag Manager — the single tag-governance
 * container GA4, Clarity, Meta Pixel, and LinkedIn Insight Tag are
 * configured inside (SRS: "no hardcoded marketing pixels in codebase").
 *
 * BLOCKER: no GTM container ID exists yet. This renders nothing until
 * NEXT_PUBLIC_GTM_ID is set — real absence, not a fake ID. Gated behind
 * analytics consent per SRS 16 ("non-essential tags fire only after
 * explicit consent").
 *
 * Same-tab consent changes: CookieBanner and this component both read
 * the same localStorage key; the "storage" event only fires across tabs,
 * so CookieBanner's Accept action triggers a full reload-free re-check
 * via this hook only after a hard navigation. This is an acceptable
 * trade-off — GTM loading a few seconds later than the in-tab Accept
 * click, rather than adding a second consent-state bus alongside
 * CookieBanner's.
 */
export function GoogleTagManager() {
  const consentGiven = useSyncExternalStore(subscribe, hasAnalyticsConsent, () => false);

  if (!GTM_ID || !consentGiven) return null;

  return (
    <Script id="gtm-loader" strategy="afterInteractive">
      {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM_ID}');`}
    </Script>
  );
}
