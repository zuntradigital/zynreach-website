"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import type { FaqItem } from "@/types/content";

interface FaqAccordionProps {
  items: FaqItem[];
  allowMultiple?: boolean;
}

/** SRS 11.1 FAQ Accordion: single-open or multi-open, button triggers with aria-expanded/aria-controls. */
export function FaqAccordion({ items, allowMultiple = false }: FaqAccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set());
  const baseId = useId();

  function toggle(index: number) {
    setOpenItems((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <div className="divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100">
      {items.map((item, index) => {
        const isOpen = openItems.has(index);
        const triggerId = `${baseId}-trigger-${index}`;
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question}>
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-start text-base font-medium text-neutral-900 hover:bg-neutral-50"
              >
                {item.question}
                <ChevronDown
                  aria-hidden="true"
                  className={`h-5 w-5 flex-shrink-0 text-neutral-500 transition-transform duration-200 ease-out-default ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              hidden={!isOpen}
              className="px-5 pb-4 text-sm leading-normal text-neutral-600"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
