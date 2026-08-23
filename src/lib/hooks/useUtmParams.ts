"use client";

import { useSyncExternalStore } from "react";

export interface UtmParams {
  utm_source?: string;
  utm_campaign?: string;
  utm_medium?: string;
  utm_term?: string;
  utm_content?: string;
  landing_page?: string;
  referrer?: string;
  device?: string;
}

const EMPTY: UtmParams = {};
const STORAGE_KEY = "zr_attribution";

/**
 * Reads first-touch attribution (SRS §20.2/§28.2: "Source, Campaign,
 * Landing Page, UTM, Referrer, Device... captured from the submitted
 * form"). Every lead-generating form on this site calls this once and
 * spreads the result into its own POST body, so a visitor who lands on
 * e.g. /demo?utm_source=linkedin&utm_campaign=q3-launch and converts —
 * possibly after browsing to a different page first — has that
 * attribution carried all the way to the admin Lead record.
 *
 * "First touch" is captured into sessionStorage on the first call in a
 * given browser session and reused by every later call/page in that same
 * session, since utm_* params and the true external referrer only exist
 * on the entry page — a visitor who arrives on /pricing?utm_source=x and
 * then clicks through to /contact must not lose that attribution just
 * because /contact's own URL/document.referrer no longer carry it.
 *
 * Deliberately reads window.location.search via useSyncExternalStore
 * rather than next/navigation's useSearchParams() — see the original
 * comment this hook always had: that hook forces every statically-
 * prerendered page that renders a lead-capture form into a
 * Suspense-wrapped, dynamic-bailout render just to read a query param
 * that's only ever needed at submit time, well after hydration.
 * useSyncExternalStore's server snapshot (EMPTY) matches the SSR output
 * exactly, so there's no hydration mismatch.
 */
function detectDevice(): string {
  const ua = navigator.userAgent || "";
  if (/tablet|ipad/i.test(ua)) return "tablet";
  if (/mobi|android|iphone/i.test(ua)) return "mobile";
  return "desktop";
}

function readStoredSnapshot(): UtmParams | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as UtmParams;
  } catch {
    return null;
  }
}

function captureSnapshot(): UtmParams {
  const search = new URLSearchParams(window.location.search);
  const get = (key: string) => search.get(key) ?? undefined;

  const snapshot: UtmParams = {
    ...(get("utm_source") ? { utm_source: get("utm_source") } : {}),
    ...(get("utm_campaign") ? { utm_campaign: get("utm_campaign") } : {}),
    ...(get("utm_medium") ? { utm_medium: get("utm_medium") } : {}),
    ...(get("utm_term") ? { utm_term: get("utm_term") } : {}),
    ...(get("utm_content") ? { utm_content: get("utm_content") } : {}),
    landing_page: window.location.pathname + window.location.search,
    ...(document.referrer ? { referrer: document.referrer } : {}),
    device: detectDevice(),
  };

  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Private-mode/storage-disabled browsers: degrade to in-memory only for this page view.
  }

  return snapshot;
}

let cachedSnapshot: UtmParams | undefined;

function getSnapshot(): UtmParams {
  if (cachedSnapshot !== undefined) return cachedSnapshot;
  cachedSnapshot = readStoredSnapshot() ?? captureSnapshot();
  return cachedSnapshot;
}

function getServerSnapshot(): UtmParams {
  return EMPTY;
}

function subscribe() {
  return () => {};
}

export function useUtmParams(): UtmParams {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
