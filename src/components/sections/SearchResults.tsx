"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { searchContent, useLocalizedSearchIndex } from "@/lib/search-index";

/** SRS Section 27.5: deep-linkable search results page (?q=). */
export function SearchResults() {
  const t = useTranslations("searchPage");
  const tNav = useTranslations("common.nav");
  const tLinks = useTranslations("common.links");
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const localizedIndex = useLocalizedSearchIndex();
  const results = searchContent(query, localizedIndex);

  return (
    <div>
      <label htmlFor="search-page-input" className="sr-only">
        {t("inputLabel")}
      </label>
      <div className="flex items-center gap-3 rounded-lg border border-neutral-300 bg-white dark:bg-neutral-100 px-4 py-3">
        <Search aria-hidden="true" className="h-5 w-5 text-neutral-500" />
        <input
          id="search-page-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="min-h-11 flex-1 text-base focus:outline-none"
        />
      </div>

      <p role="status" aria-live="polite" className="mt-4 text-sm text-neutral-500">
        {query.trim()
          ? `${results.length} ${results.length === 1 ? t("resultCountOne") : t("resultCountOther")} ${t("forQuery", { query })}`
          : t("startTyping")}
      </p>

      {query.trim() && results.length === 0 ? (
        <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
          <p className="text-sm text-neutral-600">{t("noResults", { query })}</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            <li>
              <Link href="/platform" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                {tNav("platform")}
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                {tNav("pricing")}
              </Link>
            </li>
            <li>
              <Link href="/enterprise" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
                {tLinks("enterprise")}
              </Link>
            </li>
          </ul>
        </div>
      ) : (
        <ul className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100">
          {results.map((entry) => (
            <li key={entry.href + entry.title}>
              <Link href={entry.href} className="block p-4 hover:bg-neutral-50">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{entry.category}</p>
                <p className="mt-1 font-medium text-neutral-900">{entry.title}</p>
                <p className="mt-1 text-sm text-neutral-500">{entry.description}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
