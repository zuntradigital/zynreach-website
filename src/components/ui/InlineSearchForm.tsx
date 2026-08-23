"use client";

import { useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { Search } from "lucide-react";

interface InlineSearchFormProps {
  placeholder: string;
  ariaLabel: string;
  className?: string;
}

/** Section-level search box that hands off to the sitewide /search results page — reuses the existing search index instead of building a parallel one. */
export function InlineSearchForm({ placeholder, ariaLabel, className }: InlineSearchFormProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = query.trim();
    if (trimmed) router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={`flex items-center gap-3 rounded-lg border border-neutral-300 bg-white dark:bg-neutral-100 px-4 py-3 ${className ?? ""}`}
    >
      <Search aria-hidden="true" className="h-5 w-5 flex-shrink-0 text-neutral-500" />
      <label htmlFor="inline-search-input" className="sr-only">
        {ariaLabel}
      </label>
      <input
        id="inline-search-input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="min-h-11 w-full flex-1 bg-transparent text-sm focus:outline-none"
      />
    </form>
  );
}
