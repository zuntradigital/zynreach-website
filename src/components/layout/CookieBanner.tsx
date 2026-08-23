"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

const CONSENT_STORAGE_KEY = "zynreach-cookie-consent-v1";

type ConsentChoice = "accepted" | "rejected" | "customized";

function subscribeToStorage(onChange: () => void) {
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

function hasStoredConsent() {
  return window.localStorage.getItem(CONSENT_STORAGE_KEY) !== null;
}

interface CookieBannerProps {
  /** Dashboard-managed override (SRS §22 consent.analyticsDefault) for the customize panel's initial toggle state. */
  defaultAnalyticsEnabled?: boolean;
}

export function CookieBanner({ defaultAnalyticsEnabled = true }: CookieBannerProps) {
  const t = useTranslations("common.cookieBanner");
  const hasConsent = useSyncExternalStore(
    subscribeToStorage,
    hasStoredConsent,
    () => true // server snapshot: assume consent exists, avoids a hydration flash
  );
  const [dismissed, setDismissed] = useState(false);
  const [customizing, setCustomizing] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(defaultAnalyticsEnabled);
  const bannerRef = useRef<HTMLDivElement>(null);
  const visible = !hasConsent && !dismissed;

  useEffect(() => {
    if (visible) bannerRef.current?.focus();
  }, [visible]);

  function saveConsent(choice: ConsentChoice) {
    window.localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({ choice, analytics: choice === "rejected" ? false : analyticsEnabled, date: new Date().toISOString() })
    );
    setDismissed(true);
  }

  if (!visible) return null;

  return (
    <div
      ref={bannerRef}
      tabIndex={-1}
      role="region"
      aria-label={t("ariaLabel")}
      className="fixed inset-x-0 bottom-0 z-[60] max-h-[40vh] overflow-y-auto border-t border-neutral-200 bg-white dark:bg-neutral-100 px-3 pt-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgba(0,0,0,0.08)] outline-none sm:px-4 sm:pt-4 sm:pb-[calc(0.8rem+env(safe-area-inset-bottom))]"
    >
      <div className="container-content flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="max-w-2xl text-sm text-neutral-600">
          <span className="sm:hidden">
            {t("shortText")}{" "}
            <Link href="/legal/cookies" className="font-medium text-primary-600 underline">
              {t("cookiePolicy")}
            </Link>
          </span>
          <span className="hidden sm:inline">
            {t("longText")}{" "}
            <Link href="/legal/cookies" className="font-medium text-primary-600 underline">
              {t("cookiePolicy")}
            </Link>
            .
          </span>
        </p>

        {customizing ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input type="checkbox" checked disabled className="h-4 w-4" />
              {t("essential")}
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={analyticsEnabled}
                onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                className="h-4 w-4"
              />
              {t("analytics")}
            </label>
            <Button variant="primary" size="md" onClick={() => saveConsent("customized")}>
              {t("savePreferences")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-shrink-0 flex-wrap gap-2 sm:gap-3">
            <Button variant="ghost" size="md" onClick={() => setCustomizing(true)}>
              {t("customize")}
            </Button>
            <Button variant="secondary" size="md" onClick={() => saveConsent("rejected")}>
              {t("reject")}
            </Button>
            <Button variant="primary" size="md" onClick={() => saveConsent("accepted")}>
              {t("accept")}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
