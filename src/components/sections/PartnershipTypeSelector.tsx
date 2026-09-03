"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PartnershipTypeItem {
  title: string;
  headline: string;
  description: string;
  audienceLabel: string;
  audience: string[];
  valueLabel: string;
  value: string[];
  cta: string;
}

interface PartnershipTypeSelectorProps {
  items: PartnershipTypeItem[];
}

/**
 * Interactive tabbed selector for the 4 partnership types (spec §8: tabs
 * on desktop, single-column stack on mobile — a plain vertical stack
 * already reads fine as a mobile "accordion" without extra collapse
 * logic, so this one component serves both breakpoints).
 */
export function PartnershipTypeSelector({ items }: PartnershipTypeSelectorProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = items[activeIndex];

  return (
    <div>
      <div role="tablist" aria-label="Partnership types" className="flex flex-wrap gap-2 sm:justify-center">
        {items.map((item, index) => (
          <button
            key={item.title}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            onClick={() => setActiveIndex(index)}
            className={`min-h-11 rounded-full border px-4 text-sm font-semibold transition-colors ${
              index === activeIndex
                ? "border-primary-600 bg-primary-600 text-white dark:text-neutral-50"
                : "border-neutral-200 bg-white dark:bg-neutral-100 text-neutral-700 hover:border-primary-300"
            }`}
          >
            {item.title}
          </button>
        ))}
      </div>

      <div role="tabpanel" className="mt-8 rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 sm:p-8">
        <h3 className="text-xl font-bold text-neutral-900 text-balance sm:text-2xl">{active.headline}</h3>
        <p className="mt-3 text-base leading-normal text-neutral-600">{active.description}</p>

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{active.audienceLabel}</p>
            <ul className="mt-3 space-y-2">
              {active.audience.map((item) => (
                <li key={item} className="text-sm text-neutral-700">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{active.valueLabel}</p>
            <ul className="mt-3 space-y-2">
              {active.value.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-800">
                  <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button
          href="#apply"
          variant="primary"
          size="lg"
          className="mt-8"
          analyticsId={`partner-${active.title.toLowerCase().replace(/\s+/g, "-")}-selected`}
          analyticsLocation="partners-types"
        >
          {active.cta}
        </Button>
      </div>
    </div>
  );
}
