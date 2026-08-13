"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";

interface FooterAccordionLink {
  href: string;
  label: string;
}

interface FooterAccordionGroupProps {
  heading: string;
  links: FooterAccordionLink[];
}

/**
 * Mobile-only footer nav group, collapsed by default. Follows the same
 * aria-expanded/aria-controls/chevron-rotate pattern as FaqAccordion so
 * the interaction is consistent with the rest of the design system —
 * collapsing 6 groups down to their headers is what actually shortens
 * the mobile footer, not just tighter spacing.
 */
export function FooterAccordionGroup({ heading, links }: FooterAccordionGroupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="border-b border-white/10">
      <h3>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex w-full items-center justify-between gap-4 py-4 text-start text-sm font-semibold uppercase tracking-wide text-primary-400"
        >
          {heading}
          <ChevronDown
            aria-hidden="true"
            className={`h-4 w-4 flex-shrink-0 text-neutral-400 transition-transform duration-200 ease-out-default dark:text-white/55 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
      </h3>
      <div id={panelId} hidden={!isOpen} className="pb-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="inline-block py-1.5 text-sm text-neutral-400 hover:text-white dark:text-white/55">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
