"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/navigation";
import type { NavMegaItem, NavDropdownItem } from "@/types/content";
import { hrefToLinkKey, headingToKey, promoToKey } from "@/lib/nav-i18n";

const columnGridClass: Record<number, string> = {
  1: "grid gap-8 sm:grid-cols-1",
};

interface MegaMenuPanelProps {
  item: NavMegaItem | NavDropdownItem;
  id: string;
  onLinkClick: () => void;
}

export function MegaMenuPanel({ item, id, onLinkClick }: MegaMenuPanelProps) {
  const t = useTranslations("common");
  const label = item.label === "Industries" ? t("nav.industries") : item.label;

  if (item.type === "dropdown") {
    return (
      // pt-2 (not mt-2) so this box's own hoverable area starts flush against
      // the trigger with zero gap — the 8px visual offset moves to the inner
      // card instead. Paired with the close-delay in NavigationBar, this
      // removes the "dead zone" a diagonal mouse move used to cross,
      // which was closing the menu before the cursor reached it.
      <div id={id} role="menu" aria-label={label} className="absolute top-full start-0 pt-2">
        <div className="min-w-[220px] rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100 p-2 shadow-card-hover">
          {item.links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              role="menuitem"
              onClick={onLinkClick}
              className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
            >
              {t(`links.${hrefToLinkKey[link.href]}`)}
            </Link>
          ))}
        </div>
      </div>
    );
  }

  const promoKeys = item.promo ? promoToKey[item.promo.eyebrow] : undefined;
  // Items with more than one heading-grouped column (Product's 6 pillars,
  // Solutions' 3 groupings) render as a collapsible nested list instead of
  // a wide multi-column grid — see NestedColumnList below.
  const nested = item.columns.length > 1;

  return (
    // Centered within the nearest positioned ancestor (the <nav>, not this
    // item's own trigger <li> — see the `relative` placement in
    // NavigationBar) using inset-x-0 + mx-auto rather than left-1/2 +
    // -translate-x-1/2: percentage-centering on the trigger's own position
    // pushed this panel past the viewport edge for triggers that aren't
    // themselves centered (e.g. "Platform", the leftmost item). Centering
    // within the full nav width instead keeps it inside the page's content
    // column — and therefore inside the viewport — regardless of which
    // trigger opened it or which edge of the nav that trigger sits near.
    // The calc() clamp is a second, independent safety net so it can never
    // exceed the viewport even on the narrowest width the desktop nav shows
    // at (the 1024px lg breakpoint).
    <div
      id={id}
      role="menu"
      aria-label={label}
      className={`absolute inset-x-0 top-full mx-auto w-full pt-2 ${
        nested
          ? item.promo
            ? "max-w-[min(40rem,calc(100vw-2rem))]"
            : "max-w-[min(22rem,calc(100vw-2rem))]"
          : "max-w-[min(48rem,calc(100vw-2rem))]"
      }`}
    >
      <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 shadow-card-hover">
        <div className={`grid gap-8 ${item.promo ? "grid-cols-1 lg:grid-cols-[2fr_1fr]" : "grid-cols-1"}`}>
          {nested ? (
            <NestedColumnList item={item} onLinkClick={onLinkClick} />
          ) : (
            <div className={columnGridClass[item.columns.length] ?? columnGridClass[1]}>
              {item.columns.map((column) => (
                <div key={column.heading}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    {t(`megaMenu.${headingToKey[column.heading]}`)}
                  </p>
                  <ul className="space-y-1">
                    {column.links.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          role="menuitem"
                          onClick={onLinkClick}
                          className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                        >
                          {t(`links.${hrefToLinkKey[link.href]}`)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {item.promo && promoKeys ? (
            <Link
              href={item.promo.href}
              onClick={onLinkClick}
              className="group relative flex flex-col justify-end overflow-hidden rounded-lg p-4"
            >
              <Image
                src={item.promo.image}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, 40vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-footer/85 via-footer/45 to-footer/10" />
              <p className="relative text-xs font-semibold uppercase tracking-wide text-primary-300 dark:text-primary-600">
                {t(`megaMenu.${promoKeys.eyebrow}`)}
              </p>
              <p className="relative mt-1 text-sm font-semibold text-white">{t(`megaMenu.${promoKeys.headline}`)}</p>
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Multi-column mega items (Product's 6 pillars, Solutions' 3 groupings) used
 * to render every column's links side by side — ~40 links visible at once
 * for Product. Instead each column heading is its own collapsible section;
 * only one is expanded at a time, and the first opens by default so the
 * panel never looks empty on open.
 */
function NestedColumnList({ item, onLinkClick }: { item: NavMegaItem; onLinkClick: () => void }) {
  const t = useTranslations("common");
  const [openHeading, setOpenHeading] = useState<string | null>(item.columns[0]?.heading ?? null);

  return (
    <div className="divide-y divide-neutral-100">
      {item.columns.map((column) => {
        const isOpen = openHeading === column.heading;
        const panelId = `submenu-${item.label}-${column.heading}`.replace(/\s+/g, "-").toLowerCase();
        return (
          <div key={column.heading}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenHeading(isOpen ? null : column.heading)}
              className="flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-start text-sm font-semibold text-neutral-800 hover:bg-neutral-50 hover:text-primary-600"
            >
              {t(`megaMenu.${headingToKey[column.heading]}`)}
              <ChevronDown
                aria-hidden="true"
                className={`h-4 w-4 flex-shrink-0 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            {isOpen ? (
              <ul id={panelId} className="space-y-1 ps-3 pb-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      role="menuitem"
                      onClick={onLinkClick}
                      className="block rounded-md px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                    >
                      {t(`links.${hrefToLinkKey[link.href]}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
