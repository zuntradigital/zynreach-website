import { Check } from "lucide-react";

interface SimpleComparisonTableProps {
  /** First column is the row label; the rest are the compared columns (e.g. "Separate Tools", "ZynReach"). */
  columns: string[];
  rows: { label: string; values: string[] }[];
  /** Visually-hidden table caption for screen readers — the section heading above the table already carries the visible context. */
  caption: string;
  /** Screen-reader text for a "✓" cell (e.g. "Included") — the icon itself is decorative/aria-hidden. */
  includedLabel: string;
}

/**
 * A lightweight N-column comparison table (label + string values per
 * column, "✓" rendered as a check icon) — used by the "Solutions by
 * Business Size" pages, which compare 2-3 plain columns rather than N
 * pricing plans. `ComparisonTable` (src/components/ui/ComparisonTable.tsx)
 * is shaped around `PricingPlan[]` columns and a hardcoded
 * `pricingPage.comparison` i18n namespace, so it doesn't fit here without
 * forcing pricing-specific data through it — this is the plain-column
 * equivalent, fully controlled by props.
 */
export function SimpleComparisonTable({ columns, rows, caption, includedLabel }: SimpleComparisonTableProps) {
  const [labelColumn, ...valueColumns] = columns;
  return (
    // `[contain:layout]`: without a new containment context here, this
    // element's wider-than-viewport table content leaks into how Chromium
    // sizes MobileStickyCta's `position: fixed; inset-x-0` box elsewhere on
    // the page, producing page-level horizontal overflow below Tablet even
    // though this wrapper's own box is correctly clipped/scrollable —
    // confirmed by reproducing and clearing it live in-browser. `contain`
    // gives this element its own layout containing block so that quirk
    // can't reach the fixed element.
    <div className="overflow-x-auto rounded-xl border border-neutral-200 [contain:layout]">
      <table className="w-full min-w-[520px] border-collapse text-start text-sm">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-neutral-200 bg-neutral-50">
            <th scope="col" className="sticky start-0 bg-neutral-50 px-5 py-3 text-start font-semibold text-neutral-900">
              {labelColumn}
            </th>
            {valueColumns.map((column) => (
              <th key={column} scope="col" className="px-5 py-3 text-start font-semibold text-neutral-900">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {rows.map((row) => (
            <tr key={row.label}>
              <th scope="row" className="sticky start-0 bg-white dark:bg-neutral-100 px-5 py-3 text-start font-medium text-neutral-900">
                {row.label}
              </th>
              {row.values.map((value, index) => (
                <td key={index} className="px-5 py-3 text-neutral-600">
                  {value === "✓" ? (
                    <>
                      <Check aria-hidden="true" className="h-4 w-4 text-primary-600" />
                      <span className="sr-only">{includedLabel}</span>
                    </>
                  ) : (
                    value
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
