import { useTranslations } from "next-intl";
import { Check, Minus } from "lucide-react";
import type { ComparisonRow, PricingPlan } from "@/types/content";

interface ComparisonTableProps {
  plans: PricingPlan[];
  rows: ComparisonRow[];
}

/**
 * SRS 11.1 Comparison Table: sticky first column, proper th scoping.
 * Wrapped in overflow-x-auto so it stays usable below Tablet rather than
 * breaking layout (SRS 22 responsive requirement for the feature matrix).
 * Only ever rendered on the Pricing page, so it's safe to read its own
 * chrome strings (column header, aria labels) directly via useTranslations
 * rather than threading them through as props.
 */
export function ComparisonTable({ plans, rows }: ComparisonTableProps) {
  const t = useTranslations("pricingPage.comparison");
  const categories = Array.from(new Set(rows.map((row) => row.category)));

  return (
    <div role="region" aria-label={t("ariaLabel")} tabIndex={0} className="overflow-x-auto rounded-xl border border-neutral-200">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th
              scope="col"
              className="sticky start-0 z-10 bg-neutral-50 px-4 py-2.5 text-start font-semibold text-neutral-900"
            >
              {t("featureColumn")}
            </th>
            {plans.map((plan) => (
              <th key={plan.id} scope="col" className="px-4 py-2.5 text-start font-semibold text-neutral-900">
                {plan.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <SectionGroup
              key={category}
              category={category}
              rows={rows.filter((r) => r.category === category)}
              includedLabel={t("included")}
              notIncludedLabel={t("notIncluded")}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SectionGroup({
  category,
  rows,
  includedLabel,
  notIncludedLabel,
}: {
  category: string;
  rows: ComparisonRow[];
  includedLabel: string;
  notIncludedLabel: string;
}) {
  return (
    <>
      <tr>
        <th
          scope="colgroup"
          colSpan={rows[0].values.length + 1}
          className="sticky start-0 bg-neutral-100 px-4 py-1.5 text-start text-xs font-semibold uppercase tracking-wide text-neutral-600"
        >
          {category}
        </th>
      </tr>
      {rows.map((row) => (
        <tr key={row.feature} className="border-b border-neutral-100 last:border-0">
          <th scope="row" className="sticky start-0 z-10 bg-white dark:bg-neutral-100 px-4 py-2.5 text-start font-normal text-neutral-700">
            {row.feature}
          </th>
          {row.values.map((value, index) => (
            <td key={index} className="px-4 py-2.5 text-neutral-700">
              {typeof value === "boolean" ? (
                value ? (
                  <Check aria-label={includedLabel} className="h-4 w-4 text-primary-600" />
                ) : (
                  <Minus aria-label={notIncludedLabel} className="h-4 w-4 text-neutral-300" />
                )
              ) : (
                value
              )}
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}
