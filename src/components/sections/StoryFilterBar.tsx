"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { industryToLinkKey, productAreaToLinkKey } from "@/lib/nav-i18n";

interface StoryFilterBarProps {
  industries: string[];
  productAreas: string[];
  companySizes: string[];
}

const ALL = "";

interface FilterSelectProps {
  label: string;
  param: string;
  options: string[];
  value: string;
  allLabel: string;
  optionLabel: (option: string) => string;
  onChange: (param: string, value: string) => void;
}

function FilterSelect({ label, param, options, value, allLabel, optionLabel, onChange }: FilterSelectProps) {
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
          <option key={option} value={option}>
            {optionLabel(option)}
          </option>
        ))}
      </select>
    </div>
  );
}

/** SRS 7.18: filter combinations update the URL query string (shareable/bookmarkable). */
export function StoryFilterBar({ industries, productAreas, companySizes }: StoryFilterBarProps) {
  const t = useTranslations("customersPage.filters");
  const tLinks = useTranslations("common.links");
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
      <FilterSelect
        label={t("industry")}
        param="industry"
        options={industries}
        value={searchParams.get("industry") ?? ALL}
        allLabel={t("all")}
        optionLabel={(option) => (industryToLinkKey[option] ? tLinks(industryToLinkKey[option] as Parameters<typeof tLinks>[0]) : option)}
        onChange={updateParam}
      />
      <FilterSelect
        label={t("product")}
        param="product"
        options={productAreas}
        value={searchParams.get("product") ?? ALL}
        allLabel={t("all")}
        optionLabel={(option) => (productAreaToLinkKey[option] ? tLinks(productAreaToLinkKey[option] as Parameters<typeof tLinks>[0]) : option)}
        onChange={updateParam}
      />
      <FilterSelect
        label={t("size")}
        param="size"
        options={companySizes}
        value={searchParams.get("size") ?? ALL}
        allLabel={t("all")}
        optionLabel={(option) => option}
        onChange={updateParam}
      />
    </div>
  );
}
