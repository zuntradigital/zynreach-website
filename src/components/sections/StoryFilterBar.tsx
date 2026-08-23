"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export interface FilterOption {
  value: string;
  label: string;
}

interface StoryFilterBarProps {
  industries: FilterOption[];
  productAreas: FilterOption[];
  companySizes: FilterOption[];
}

const ALL = "";

interface FilterSelectProps {
  label: string;
  param: string;
  options: FilterOption[];
  value: string;
  allLabel: string;
  onChange: (param: string, value: string) => void;
}

function FilterSelect({ label, param, options, value, allLabel, onChange }: FilterSelectProps) {
  return (
    <div>
      <label htmlFor={`filter-${param}`} className="block text-xs font-medium text-neutral-500">
        {label}
      </label>
      <select
        id={`filter-${param}`}
        value={value}
        onChange={(e) => onChange(param, e.target.value)}
        className="mt-1 min-h-11 rounded-md border border-neutral-300 bg-white dark:bg-neutral-100 px-3 text-sm"
      >
        <option value={ALL}>{allLabel}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

/** Knowledge Center §7.3: Industry/Product Area/Company Size filters, kept in the URL query string so results stay shareable/bookmarkable. Options arrive already display-resolved from the caller — this component does no translation lookups of its own, so it works identically for CMS-backed and static-fallback data. */
export function StoryFilterBar({ industries, productAreas, companySizes }: StoryFilterBarProps) {
  const t = useTranslations("customerStoriesPage.filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === ALL) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.push(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="flex flex-wrap gap-4">
      <FilterSelect label={t("industry")} param="industry" options={industries} value={searchParams.get("industry") ?? ALL} allLabel={t("all")} onChange={updateParam} />
      <FilterSelect label={t("product")} param="product" options={productAreas} value={searchParams.get("product") ?? ALL} allLabel={t("all")} onChange={updateParam} />
      <FilterSelect label={t("size")} param="size" options={companySizes} value={searchParams.get("size") ?? ALL} allLabel={t("all")} onChange={updateParam} />
    </div>
  );
}
