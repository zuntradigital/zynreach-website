"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { PricingCard } from "@/components/ui/PricingCard";
import { pricingPlans as defaultPricingPlans } from "@/lib/content/pricing";
import { trackPricingToggle } from "@/lib/analytics";
import type { PricingPlan } from "@/types/content";

interface PricingSectionProps {
  /** Pre-translated plans built by the Pricing page; falls back to the raw (English) content if omitted. */
  plans?: PricingPlan[];
}

/**
 * SRS 7.4: real-time price recalculation on toggle change, client-side,
 * no reload; toggle-driven price change announced via aria-live="polite"
 * (SRS 11.1 Pricing Card accessibility requirement).
 */
/**
 * Grid columns keyed by live plan count rather than hardcoded to 3 — Tailwind
 * needs the literal class strings present in source to generate them, so
 * this is a lookup rather than a runtime-built class name. Pricing is a
 * real, admin-managed collection (not a fixed 3-plan constant), so the
 * layout has to hold for whatever count is currently published.
 */
const GRID_COLS_CLASS: Record<number, string> = {
  1: "sm:grid-cols-1",
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
  5: "sm:grid-cols-2 lg:grid-cols-5",
};

export function PricingSection({ plans = defaultPricingPlans }: PricingSectionProps) {
  const t = useTranslations("pricingPage.billing");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annual">("monthly");
  const gridColsClass = GRID_COLS_CLASS[plans.length] ?? "sm:grid-cols-3";

  const announcement = useMemo(
    () => (billingPeriod === "annual" ? t("announceAnnual") : t("announceMonthly")),
    [billingPeriod, t]
  );

  function selectBillingPeriod(period: "monthly" | "annual") {
    setBillingPeriod(period);
    trackPricingToggle(period);
  }

  return (
    <div>
      <div role="tablist" aria-label={t("ariaLabel")} className="mx-auto flex w-fit rounded-full border border-neutral-200 bg-neutral-50 p-1">
        <button
          type="button"
          role="tab"
          aria-selected={billingPeriod === "monthly"}
          onClick={() => selectBillingPeriod("monthly")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
            billingPeriod === "monthly" ? "bg-white dark:bg-neutral-100 text-neutral-900 shadow-sm" : "text-neutral-500"
          }`}
        >
          {t("monthly")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={billingPeriod === "annual"}
          onClick={() => selectBillingPeriod("annual")}
          className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm ${
            billingPeriod === "annual" ? "bg-white dark:bg-neutral-100 text-neutral-900 shadow-sm" : "text-neutral-500"
          }`}
        >
          {t("annual")} <span className="text-primary-600">{t("annualNote")}</span>
        </button>
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {announcement}
      </p>

      <div className={`mt-5 grid grid-cols-1 gap-3 sm:mt-8 sm:gap-5 ${gridColsClass}`}>
        {plans.map((plan) => (
          <PricingCard key={plan.id} plan={plan} billingPeriod={billingPeriod} />
        ))}
      </div>
    </div>
  );
}
