import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { docArticles, getDocCategories } from "@/lib/content/docs";

interface DocsSidebarProps {
  activeSlug: string;
}

/** SRS 7.17: Documentation left-nav — proper <nav> landmark, aria-current="page" on the active item. */
export async function DocsSidebar({ activeSlug }: DocsSidebarProps) {
  const categories = getDocCategories();
  const t = await getTranslations("docsPage");

  return (
    <nav aria-label={t("sidebarAriaLabel")} className="space-y-6">
      {categories.map((category) => (
        <div key={category}>
          <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
            {t(`categories.${category}` as Parameters<typeof t>[0])}
          </p>
          <ul className="mt-2 space-y-1">
            {docArticles
              .filter((doc) => doc.category === category)
              .sort((a, b) => a.order - b.order)
              .map((doc) => (
                <li key={doc.slug}>
                  <Link
                    href={`/docs/${doc.slug}`}
                    aria-current={doc.slug === activeSlug ? "page" : undefined}
                    className={`block rounded-md px-3 py-1.5 text-sm ${
                      doc.slug === activeSlug
                        ? "bg-primary-50 font-medium text-primary-700"
                        : "text-neutral-600 hover:bg-neutral-50"
                    }`}
                  >
                    {t(`articles.${doc.slug}.title` as Parameters<typeof t>[0])}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
