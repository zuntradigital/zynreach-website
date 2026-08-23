"use client";

import { useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { faqCategories } from "@/lib/content/faq";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import type { FaqItem } from "@/types/content";
import type { LiveFaqItem } from "@/lib/services/faq-content";

interface FaqTabsProps {
  /** CMS-backed FAQ items (already resolved to the current locale) — when
   * provided (and non-empty), these drive both the tab list and the
   * per-category content instead of the static messages/*.json fallback,
   * so an admin-added category shows up without a code change. Falls
   * back to the fixed Product/Pricing/Security/Support tabs + translated
   * copy exactly as before when the CMS is unreachable/empty. */
  liveFaqs?: LiveFaqItem[] | null;
}

/** SRS 7.19: FAQ "Category tabs (Product, Pricing, Security, Support) → Accordion list per category." */
export function FaqTabs({ liveFaqs }: FaqTabsProps) {
  const t = useTranslations("faqPage");
  const hasLive = Boolean(liveFaqs && liveFaqs.length > 0);

  const liveCategories = useMemo(() => {
    if (!liveFaqs) return [];
    return Array.from(new Set(liveFaqs.map((item) => item.category)));
  }, [liveFaqs]);

  const categories = hasLive ? liveCategories : [...faqCategories];
  const [active, setActive] = useState<string>(categories[0]);

  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const staticItemsByCategory = useMemo(
    () =>
      Object.fromEntries(
        faqCategories.map((category) => [category, t.raw(`items.${category}`) as FaqItem[]])
      ) as Record<(typeof faqCategories)[number], FaqItem[]>,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  function itemsFor(category: string): FaqItem[] {
    if (hasLive && liveFaqs) {
      return liveFaqs.filter((item) => item.category === category).map(({ question, answer }) => ({ question, answer }));
    }
    return staticItemsByCategory[category as (typeof faqCategories)[number]] ?? [];
  }

  function categoryLabel(category: string): string {
    if ((faqCategories as readonly string[]).includes(category)) {
      return t(`categories.${category}` as Parameters<typeof t>[0]);
    }
    return category;
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    let nextIndex = index;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % categories.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + categories.length) % categories.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = categories.length - 1;
    else return;

    event.preventDefault();
    const nextCategory = categories[nextIndex];
    setActive(nextCategory);
    tabRefs.current[nextCategory]?.focus();
  }

  return (
    <div>
      <div role="tablist" aria-label={t("tabsAriaLabel")} className="flex flex-wrap gap-2">
        {categories.map((category, index) => {
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
              {categoryLabel(category)}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id={`faq-panel-${active}`} aria-labelledby={`faq-tab-${active}`} tabIndex={0} className="mt-8">
        <FaqAccordion items={itemsFor(active)} />
      </div>
    </div>
  );
}
