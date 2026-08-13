"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Search } from "lucide-react";
import { integrations, integrationCategories } from "@/lib/content/integrations";
import { categoryToKey } from "@/lib/nav-i18n";

const ALL = "All";

/** SRS 7.5/Integrations Directory: categories, search, filtering. */
export function IntegrationsDirectory() {
  const t = useTranslations("integrationsPage");
  const tCategories = useTranslations("common.integrationCategories");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);

  const localizedIntegrations = useMemo(
    () =>
      integrations.map((integration) => ({
        ...integration,
        name: t(`items.${integration.slug}.name`),
        description: t(`items.${integration.slug}.description`),
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const filtered = useMemo(() => {
    return localizedIntegrations.filter((integration) => {
      const matchesCategory = category === ALL || integration.category === category;
      const matchesQuery =
        query.trim() === "" || integration.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesCategory && matchesQuery;
    });
  }, [query, category, localizedIntegrations]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white dark:bg-neutral-100 px-3 py-2 sm:w-72">
          <Search aria-hidden="true" className="h-4 w-4 text-neutral-500" />
          <label htmlFor="integration-search" className="sr-only">
            {t("searchLabel")}
          </label>
          <input
            id="integration-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-h-9 flex-1 text-sm focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {[ALL, ...integrationCategories].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              aria-pressed={category === cat}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                category === cat ? "border-primary-600 bg-primary-600 text-white dark:text-neutral-50" : "border-neutral-300 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
              }`}
            >
              {cat === ALL ? t("allFilter") : tCategories(categoryToKey[cat] as Parameters<typeof tCategories>[0])}
            </button>
          ))}
        </div>
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-sm text-neutral-500">
        {filtered.length} {filtered.length === 1 ? t("resultCountOne") : t("resultCountOther")}
      </p>

      <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integration) => (
          <li key={integration.slug}>
            <Link
              href={`/integrations/${integration.slug}`}
              className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-5 hover:border-primary-300 hover:shadow-card-hover"
            >
              <span className="w-fit rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                {tCategories(categoryToKey[integration.category] as Parameters<typeof tCategories>[0])}
              </span>
              <h3 className="mt-3 font-semibold text-neutral-900">{integration.name}</h3>
              <p className="mt-1 text-sm text-neutral-600">{integration.description}</p>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 ? <p className="mt-6 text-sm text-neutral-500">{t("noResults")}</p> : null}
    </div>
  );
}
