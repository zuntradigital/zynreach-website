import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { PricingPlan } from "@/types/content";

interface PricingCardProps {
  plan: PricingPlan;
  billingPeriod: "monthly" | "annual";
}

/**
 * SRS 11.1 Pricing Card: price updates via shared billing-toggle state, no
 * reload. Only ever rendered on the Pricing page, so its "Most popular"
 * badge is read directly via useTranslations rather than a prop — all
 * other display text (name, description, features) already arrives
 * pre-translated in `plan`, built by the Pricing page from pricingPage.plans.
 */
export function PricingCard({ plan, billingPeriod }: PricingCardProps) {
  const t = useTranslations("pricingPage");
  const price = billingPeriod === "monthly" ? plan.monthlyPrice : plan.annualPrice;

  return (
    <div
      className={cn(
        "flex flex-col rounded-xl border p-4 sm:p-5",
        plan.isFeatured
          ? "border-primary-600 bg-white dark:bg-neutral-100 shadow-card-hover ring-1 ring-primary-600"
          : "border-neutral-200 bg-white dark:bg-neutral-100"
      )}
    >
      {plan.isFeatured ? (
        <span className="mb-2 inline-block w-fit rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-semibold text-white dark:text-neutral-50">
          {t("mostPopular")}
        </span>
      ) : null}
      <h3 className="text-sm font-semibold leading-snug text-neutral-900 sm:text-base">{plan.name}</h3>
      <p className="mt-1 text-xs leading-snug text-neutral-500 sm:text-sm">{plan.description}</p>

      <div className="mt-4 sm:mt-5">
        {price !== null ? (
          <p className="flex items-baseline gap-1">
            <span className="text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl">${price}</span>
            <span className="text-xs text-neutral-500 sm:text-sm">{plan.priceSuffix}</span>
          </p>
        ) : (
          <p className="text-2xl font-bold leading-tight text-neutral-900 sm:text-3xl">{plan.priceSuffix}</p>
        )}
      </div>

      <Button
        href={plan.ctaHref}
        variant={plan.isFeatured ? "primary" : "secondary"}
        size="lg"
        className="mt-4 w-full sm:mt-5"
      >
        {plan.ctaLabel}
      </Button>

      <ul className="mt-4 space-y-2 border-t border-neutral-100 pt-4 sm:mt-5 sm:space-y-2.5 sm:pt-5">
        {plan.featureList.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-xs leading-snug text-neutral-700 sm:text-sm">
            <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}
