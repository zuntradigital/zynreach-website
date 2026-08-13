import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export interface CategoryOption {
  key: string;
  label: string;
}

interface CategoryFilterBarProps {
  categories: CategoryOption[];
  activeCategory?: string;
  basePath: string;
}

/**
 * SRS 7.16: "Category filter bar" — URL-driven so filtered views are
 * shareable/bookmarkable. `label` is resolved by the caller (translated
 * from a locale-stable code for the hardcoded fallback, or already
 * localized text from a live System B category) — this component only
 * renders it, it doesn't look up any translation itself, so it works
 * identically for both data sources.
 */
export async function CategoryFilterBar({ categories, activeCategory, basePath }: CategoryFilterBarProps) {
  const t = await getTranslations("blogPage");
  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={basePath}
        className={`rounded-full border px-4 py-2 text-sm font-medium ${
          !activeCategory
            ? "border-primary-600 bg-primary-600 text-white dark:text-neutral-50"
            : "border-neutral-300 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
        }`}
      >
        {t("allFilter")}
      </Link>
      {categories.map(({ key, label }) => (
        <Link
          key={key}
          href={`${basePath}?category=${encodeURIComponent(key)}`}
          className={`rounded-full border px-4 py-2 text-sm font-medium ${
            activeCategory === key
              ? "border-primary-600 bg-primary-600 text-white dark:text-neutral-50"
              : "border-neutral-300 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
