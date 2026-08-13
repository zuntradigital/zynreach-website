"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { changelogEntries, getProductAreas } from "@/lib/content/changelog";

const ALL = "All";

/** SRS 7.19: Changelog, "filterable by product area." */
export function ChangelogList() {
  const t = useTranslations("changelogPage");
  const productAreas = [ALL, ...getProductAreas()];
  const [activeArea, setActiveArea] = useState(ALL);

  const localizedEntries = useMemo(() => {
    const translated = t.raw("entries") as { title: string; description: string }[];
    return changelogEntries.map((entry, index) => ({
      ...entry,
      title: translated[index].title,
      description: translated[index].description,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = localizedEntries.filter((entry) => activeArea === ALL || entry.productArea === activeArea);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {productAreas.map((area) => (
          <button
            key={area}
            type="button"
            onClick={() => setActiveArea(area)}
            aria-pressed={activeArea === area}
            className={`rounded-full border px-4 py-2 text-sm font-medium ${
              activeArea === area ? "border-primary-600 bg-primary-600 text-white dark:text-neutral-50" : "border-neutral-300 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
            }`}
          >
            {area === ALL ? t("allFilter") : t(`productAreas.${area}` as Parameters<typeof t>[0])}
          </button>
        ))}
      </div>

      <ol className="mt-8 space-y-8 border-s-2 border-neutral-200 ps-6">
        {filtered.map((entry) => (
          <li key={entry.version} className="relative">
            <span className="absolute -start-[31px] top-1 h-3 w-3 rounded-full bg-primary-600" />
            <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
              <span className="font-mono font-semibold text-neutral-700">{entry.version}</span>
              <span aria-hidden="true">·</span>
              <time dateTime={entry.date}>{entry.date}</time>
              <span aria-hidden="true">·</span>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5">{t(`productAreas.${entry.productArea}` as Parameters<typeof t>[0])}</span>
            </div>
            <h2 className="mt-2 font-semibold text-neutral-900">{entry.title}</h2>
            <p className="mt-1 text-sm text-neutral-600">{entry.description}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
