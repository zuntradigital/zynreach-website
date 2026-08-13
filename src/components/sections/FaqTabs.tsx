"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { faqCategories } from "@/lib/content/faq";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import type { FaqItem } from "@/types/content";

/** SRS 7.19: FAQ "Category tabs (Product, Pricing, Security, Support) → Accordion list per category." */
export function FaqTabs() {
  const t = useTranslations("faqPage");
  const [active, setActive] = useState<(typeof faqCategories)[number]>(faqCategories[0]);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const itemsByCategory = useMemo(
    () =>
      Object.fromEntries(
        faqCategories.map((category) => [category, t.raw(`items.${category}`) as FaqItem[]])
      ) as Record<(typeof faqCategories)[number], FaqItem[]>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % faqCategories.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + faqCategories.length) % faqCategories.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = faqCategories.length - 1;
    else return;

    event.preventDefault();
    const nextCategory = faqCategories[nextIndex];
    setActive(nextCategory);
    tabRefs.current[nextCategory]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={t("tabsAriaLabel")} className="flex flex-wrap gap-2">
        {faqCategories.map((category, index) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              ref={(el) => {
                tabRefs.current[category] = el;
              }}
              role="tab"
              id={`faq-tab-${category}`}
              aria-selected={isActive}
              aria-controls={`faq-panel-${category}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActive(category)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={`rounded-full border px-4 py-2 text-sm font-medium ${
                isActive ? "border-primary-600 bg-primary-600 text-white dark:text-neutral-50" : "border-neutral-300 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
              }`}
            >
              {t(`categories.${category}`)}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`faq-panel-${active}`} aria-labelledby={`faq-tab-${active}`} tabIndex={0} className="mt-8">
        <FaqAccordion items={itemsByCategory[active]} />
      </div>
    </div>
  );
}
