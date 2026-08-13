import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { categoryToKey } from "@/lib/nav-i18n";

interface RelatedIntegrationsProps {
  categories: string[];
}

/** "Related integrations module" (SRS 7.3). */
export function RelatedIntegrations({ categories }: RelatedIntegrationsProps) {
  const t = useTranslations("relatedIntegrations");
  const tCategories = useTranslations("common.integrationCategories");
  return (
    <section className="border-y border-neutral-200 bg-neutral-50 py-14">
      <div className="container-content flex flex-col items-center gap-6 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">{t("headline")}</h2>
        <ul className="flex flex-wrap justify-center gap-3">
          {categories.map((category) => (
            <li
              key={category}
              className="rounded-full border border-neutral-200 bg-white dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700"
            >
              {categoryToKey[category] ? tCategories(categoryToKey[category]) : category}
            </li>
          ))}
        </ul>
        <Link href="/integrations" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
          {t("viewAll")}
        </Link>
      </div>
    </section>
  );
}
