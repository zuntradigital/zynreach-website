"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Search, Star } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/Button";

export type MarketplacePlanTier = "STARTER" | "GROWTH" | "ENTERPRISE";

export interface ResolvedMarketplaceTool {
  slug: string;
  href: string;
  name: string;
  description: string;
  suite: string;
  featured: boolean;
  minPlanTier: MarketplacePlanTier;
  order: number;
}

interface MarketplaceCatalogProps {
  /** Already localized (name/description/suite) and merged with System
   * B's admin-curated visible/featured/minPlanTier/order — resolved
   * server-side in page.tsx, which has getTranslations access this
   * client component doesn't. */
  tools: ResolvedMarketplaceTool[];
}

const PLAN_ORDER: MarketplacePlanTier[] = ["STARTER", "GROWTH", "ENTERPRISE"];

const PLAN_BADGE_CLASSES: Record<MarketplacePlanTier, string> = {
  STARTER: "bg-neutral-100 text-neutral-700 dark:bg-neutral-200",
  GROWTH: "bg-primary-50 text-primary-700",
  ENTERPRISE: "bg-amber-50 text-amber-700",
};

/**
 * ZynReach Marketplace — Suite/Tool Catalog with real search, suite
 * filtering, and plan-entitlement filtering.
 *
 * "Install" is an honest CTA into the real trial/demo lead flow (this
 * site has no product backend to actually provision a tool into), tagged
 * with utm_content so the click is attributable per-tool in the same Lead
 * pipeline every other CTA on this site already feeds.
 */
export function MarketplaceCatalog({ tools }: MarketplaceCatalogProps) {
  const t = useTranslations("marketplacePage");
  const [query, setQuery] = useState("");
  const [suiteFilter, setSuiteFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<MarketplacePlanTier>("ENTERPRISE");

  const sortedTools = useMemo(() => [...tools].sort((a, b) => a.order - b.order || a.name.localeCompare(b.name)), [tools]);
  const suites = useMemo(() => Array.from(new Set(sortedTools.map((tool) => tool.suite))), [sortedTools]);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const maxPlanIndex = PLAN_ORDER.indexOf(planFilter);
    return sortedTools.filter((tool) => {
      if (suiteFilter !== "all" && tool.suite !== suiteFilter) return false;
      if (PLAN_ORDER.indexOf(tool.minPlanTier) > maxPlanIndex) return false;
      if (normalizedQuery && !`${tool.name} ${tool.description}`.toLowerCase().includes(normalizedQuery)) return false;
      return true;
    });
  }, [sortedTools, suiteFilter, planFilter, query]);

  function planLabel(tier: MarketplacePlanTier): string {
    return tier === "STARTER" ? t("planStarter") : tier === "GROWTH" ? t("planGrowth") : t("planEnterprise");
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search aria-hidden="true" className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("searchPlaceholder")}
            className="w-full rounded-md border border-neutral-300 bg-white dark:bg-neutral-100 py-2.5 ps-9 pe-3 text-sm text-neutral-900 focus-visible:border-primary-600 focus-visible:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="marketplace-plan-filter" className="text-sm font-medium text-neutral-600">
            {t("planFilterLabel")}
          </label>
          <select
            id="marketplace-plan-filter"
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value as MarketplacePlanTier)}
            className="rounded-md border border-neutral-300 bg-white dark:bg-neutral-100 px-3 py-2 text-sm text-neutral-900 focus-visible:border-primary-600 focus-visible:outline-none"
          >
            {PLAN_ORDER.map((tier) => (
              <option key={tier} value={tier}>
                {planLabel(tier)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div role="tablist" aria-label={t("suiteFilterLabel")} className="mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          role="tab"
          aria-selected={suiteFilter === "all"}
          onClick={() => setSuiteFilter("all")}
          className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
            suiteFilter === "all" ? "border-primary-600 bg-primary-600 text-white" : "border-neutral-300 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
          }`}
        >
          {t("allSuites")}
        </button>
        {suites.map((suite) => (
          <button
            key={suite}
            type="button"
            role="tab"
            aria-selected={suiteFilter === suite}
            onClick={() => setSuiteFilter(suite)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
              suiteFilter === suite ? "border-primary-600 bg-primary-600 text-white" : "border-neutral-300 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
            }`}
          >
            {suite}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-neutral-500">{t("resultCount", { count: filteredTools.length })}</p>

      {filteredTools.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">{t("emptyState")}</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool) => (
            <div key={tool.slug} className="flex flex-col rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100 p-5 shadow-card">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">{tool.suite}</span>
                {tool.featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                    <Star aria-hidden="true" className="h-3 w-3 fill-current" />
                    {t("featuredBadge")}
                  </span>
                ) : null}
              </div>
              <h3 className="mt-2 text-base font-semibold text-neutral-900">{tool.name}</h3>
              <p className="mt-1.5 flex-1 text-sm text-neutral-600">{tool.description}</p>
              <span className={`mt-3 inline-flex w-fit items-center rounded px-2 py-0.5 text-xs font-medium ${PLAN_BADGE_CLASSES[tool.minPlanTier]}`}>
                {t("planBadgePrefix")} {planLabel(tool.minPlanTier)}
              </span>
              <div className="mt-4 flex items-center gap-2">
                <Button
                  href={`/demo?utm_source=marketplace&utm_content=${encodeURIComponent(tool.slug)}`}
                  variant="primary"
                  className="flex-1"
                  analyticsId="marketplace-install"
                  analyticsLocation={`marketplace-${tool.slug}`}
                >
                  {t("installCta")}
                </Button>
                <Link
                  href={tool.href}
                  className="rounded-md border border-neutral-300 px-3 py-2.5 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:text-primary-600"
                >
                  {t("viewDetailsCta")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
