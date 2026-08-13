"use client";

import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { capabilityGrid } from "@/lib/content/home";
import { hrefToLinkKey } from "@/lib/nav-i18n";

const positions = [
  { x: 50, y: 8 },
  { x: 88, y: 30 },
  { x: 88, y: 70 },
  { x: 50, y: 92 },
  { x: 12, y: 70 },
  { x: 12, y: 30 },
];

/**
 * Unified data model diagram with hover states per module
 * (SRS Section 7.2: "Interactive architecture diagram with hover states
 * per module"). Built as an SVG hub-and-spoke rather than embedding
 * Mermaid.js, to keep the interior interactive without a runtime dependency.
 */
export function PlatformDiagram() {
  const [active, setActive] = useState<number | null>(null);
  const gradientId = useId();
  const t = useTranslations("capabilityGrid");
  const tDiagram = useTranslations("platformPage.dataModel");

  return (
    <div className="relative mx-auto aspect-square w-full max-w-xl">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {positions.map((pos, index) => (
          <line
            key={index}
            x1={50}
            y1={50}
            x2={pos.x}
            y2={pos.y}
            stroke={active === index ? `url(#${gradientId})` : "var(--color-neutral-200)"}
            strokeWidth={active === index ? 0.8 : 0.4}
            className="transition-all duration-200"
          />
        ))}
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary-600)" />
            <stop offset="100%" stopColor="var(--color-primary-400)" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-primary-200 bg-primary-50 text-center shadow-card">
        <span className="text-xs font-semibold text-primary-700">{tDiagram("unifiedLabel")}</span>
        <span className="text-xs font-semibold text-primary-700">{tDiagram("dataModelLabel")}</span>
      </div>

      <ul aria-label={tDiagram("diagramAriaLabel")} className="contents">
        {capabilityGrid.map((item, index) => {
          const pos = positions[index];
          const Icon = item.icon;
          const key = hrefToLinkKey[item.href ?? ""] ?? "";
          return (
            <li
              key={item.headline}
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
            >
              <Link
                href={item.href ?? "#"}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                className="flex flex-col items-center gap-1.5 rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100 px-3 py-2 shadow-card transition-transform duration-150 hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover"
              >
                <Icon className="h-5 w-5 text-primary-600" aria-hidden="true" strokeWidth={1.75} />
                <span className="max-w-[4.5rem] text-center text-xs font-medium text-neutral-700 sm:max-w-none sm:whitespace-nowrap">
                  {t(`${key}.headline`)}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
