"use client";

import { useId, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { trackCalculatorUsage } from "@/lib/analytics";
import { pricingPlans } from "@/lib/content/pricing";

const HOURS_SAVED_PER_SEAT_PER_WEEK = 5;
const TRACK_DEBOUNCE_MS = 500;
// Illustrative only (see disclaimer below) — modeled on the Professional
// plan's included-users + additional-user-price structure (Pricing spec
// §11-§13), not a flat per-seat rate. Falls back to Professional's
// hardcoded defaults only if that plan is ever missing from the fallback
// content array, which real content never removes.
const professionalPlan = pricingPlans.find((plan) => plan.id === "professional");
const BASE_PRICE = professionalPlan?.monthlyPrice ?? 3990;
const INCLUDED_USERS = professionalPlan?.includedUsers ?? 10;
const ADDITIONAL_USER_PRICE = professionalPlan?.additionalUserPrice ?? 400;
const CURRENCY = professionalPlan?.currency ?? "EGP";

/** SRS 7.4 "ROI calculator module supporting the Pricing page." */
export function RoiCalculator() {
  // Passed explicitly to toLocaleString() below rather than left to each
  // runtime's own default: Number.prototype.toLocaleString() with no
  // locale argument resolves the *environment's* default locale, which
  // differs between the server (Node's ICU default) and the browser —
  // producing genuinely different digit formatting (Western vs.
  // Arabic-Indic numerals) for the same number, and therefore a real
  // hydration mismatch, not just a cosmetic inconsistency.
  const locale = useLocale();
  const t = useTranslations("pricingPage.roi");
  const [seats, setSeats] = useState(10);
  const inputId = useId();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const additionalUsers = Math.max(0, seats - INCLUDED_USERS);
  const monthlyCost = BASE_PRICE + additionalUsers * ADDITIONAL_USER_PRICE;
  const hoursSavedPerWeek = seats * HOURS_SAVED_PER_SEAT_PER_WEEK;

  function handleSeatsChange(value: number) {
    setSeats(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => trackCalculatorUsage("roi-seats", value), TRACK_DEBOUNCE_MS);
  }

  return (
    <div className="mx-auto max-w-2xl rounded-xl border border-neutral-200 bg-neutral-50 p-5 sm:p-8">
      <label htmlFor={inputId} className="block text-sm font-semibold text-neutral-900">
        {t("seatsLabel")}
      </label>
      <input
        id={inputId}
        type="range"
        min={1}
        max={200}
        value={seats}
        onChange={(e) => handleSeatsChange(Number(e.target.value))}
        className="mt-3 w-full accent-primary-600"
      />
      <p className="mt-2 text-sm text-neutral-600">
        {seats} {t("seatsUnit")}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:mt-6 sm:gap-4">
        <div className="rounded-lg bg-white dark:bg-neutral-100 p-3 text-center shadow-card sm:p-4">
          <p className="text-xl font-bold leading-tight text-primary-600 sm:text-2xl">
            {monthlyCost.toLocaleString(locale)} {CURRENCY}
          </p>
          <p className="mt-1 text-xs text-neutral-500">{t("monthlyCostLabel")}</p>
        </div>
        <div className="rounded-lg bg-white dark:bg-neutral-100 p-3 text-center shadow-card sm:p-4">
          <p className="text-xl font-bold leading-tight text-primary-600 sm:text-2xl">
            {hoursSavedPerWeek.toLocaleString(locale)} {t("hoursUnit")}
          </p>
          <p className="mt-1 text-xs text-neutral-500">{t("hoursSavedLabel")}</p>
        </div>
      </div>
      <p className="mt-4 text-xs text-neutral-500">{t("disclaimer")}</p>
    </div>
  );
}
