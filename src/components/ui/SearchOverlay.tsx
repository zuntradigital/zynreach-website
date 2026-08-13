"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { Search, X } from "lucide-react";
import { searchContent, useLocalizedSearchIndex, type LocalizedSearchEntry } from "@/lib/search-index";
import { trackSearch } from "@/lib/analytics";

const DEBOUNCE_MS = 250;

interface SearchOverlayProps {
  onClose: () => void;
}

/**
 * SRS 11.1 Search Component: debounced instant search, results grouped by
 * category, role="listbox"/"option" pattern, Arrow keys move selection,
 * Enter navigates, Esc closes. Mounted only while open (see NavigationBar),
 * so each open is a fresh instance — no reset-on-close effect needed.
 */
export function SearchOverlay({ onClose }: SearchOverlayProps) {
  const t = useTranslations("common.search");
  const localizedIndex = useLocalizedSearchIndex();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocalizedSearchEntry[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      const nextResults = searchContent(query, localizedIndex);
      setResults(nextResults);
      setActiveIndex(-1);
      if (query.trim()) trackSearch(query.trim(), nextResults.length);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, localizedIndex]);

  function navigateTo(href: string) {
    onClose();
    router.push(href);
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Escape") {
      onClose();
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (event.key === "Enter" && activeIndex >= 0 && results[activeIndex]) {
      event.preventDefault();
      navigateTo(results[activeIndex].href);
    }
  }

  const showEmpty = query.trim().length === 0;
  const showNoResults = !showEmpty && results.length === 0;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-footer/50 px-4 pt-[calc(var(--nav-height)+1rem)]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={t("siteSearch")}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl rounded-xl bg-white dark:bg-neutral-100 shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3">
          <Search aria-hidden="true" className="h-5 w-5 text-neutral-500" />
          <input
            ref={inputRef}
            type="text"
            role="combobox"
            aria-expanded={results.length > 0}
            aria-controls="search-results-listbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("placeholder")}
            className="min-h-11 flex-1 text-sm focus:outline-none"
          />
          <button type="button" onClick={onClose} aria-label={t("closeSearch")} className="text-neutral-500 hover:text-neutral-700">
            <X aria-hidden="true" className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {showEmpty ? (
            <p className="p-4 text-sm text-neutral-500">{t("searchAcross")}</p>
          ) : showNoResults ? (
            <div className="p-4">
              <p className="text-sm text-neutral-500">{t("noResults", { query })}</p>
              <p className="mt-2 text-xs text-neutral-500">{t("noResultsHint")}</p>
            </div>
          ) : (
            <ul id="search-results-listbox" role="listbox" aria-label={t("searchResults")}>
              {results.map((entry, index) => (
                <li key={entry.href + entry.title} role="option" aria-selected={index === activeIndex}>
                  <button
                    type="button"
                    onClick={() => navigateTo(entry.href)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`block w-full rounded-lg px-3 py-2.5 text-start ${
                      index === activeIndex ? "bg-primary-50" : "hover:bg-neutral-50"
                    }`}
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-primary-600">{entry.category}</p>
                    <p className="text-sm font-medium text-neutral-900">{entry.title}</p>
                    <p className="truncate text-xs text-neutral-500">{entry.description}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
