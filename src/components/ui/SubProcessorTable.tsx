import { useTranslations } from "next-intl";
import type { SubProcessor } from "@/lib/content/trust";

interface SubProcessorTableProps {
  items: SubProcessor[];
  lastUpdated: string;
}

/**
 * SRS 7.5/7.12: CMS-sourced sub-processor table, versioned with a "last
 * updated" date. Only ever rendered on Security and Compliance, so its own
 * chrome strings are read directly via useTranslations rather than props.
 */
export function SubProcessorTable({ items, lastUpdated }: SubProcessorTableProps) {
  const t = useTranslations("trustContent.table");
  return (
    <div>
      <div
        role="region"
        aria-label={t("ariaLabel")}
        tabIndex={0}
        className="overflow-x-auto rounded-xl border border-neutral-200"
      >
        <table className="w-full min-w-[520px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-neutral-200 bg-neutral-50">
              <th scope="col" className="px-5 py-3 text-start font-semibold text-neutral-900">
                {t("nameColumn")}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold text-neutral-900">
                {t("purposeColumn")}
              </th>
              <th scope="col" className="px-5 py-3 text-start font-semibold text-neutral-900">
                {t("locationColumn")}
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.name} className="border-b border-neutral-100 last:border-0">
                <th scope="row" className="px-5 py-3 text-start font-normal text-neutral-700">
                  {item.name}
                </th>
                <td className="px-5 py-3 text-neutral-700">{item.purpose}</td>
                <td className="px-5 py-3 text-neutral-700">{item.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-neutral-500">{t("lastUpdated", { date: lastUpdated })}</p>
    </div>
  );
}
