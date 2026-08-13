import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { capabilityGrid } from "@/lib/content/home";
import { hrefToLinkKey } from "@/lib/nav-i18n";
import { Button } from "@/components/ui/Button";

const featured = capabilityGrid.filter((item) =>
  ["Workflow Automation", "Analytics", "AI Assistants", "CRM"].includes(item.headline)
);

/** Left: heading/description/CTA. Right: 2×2 card grid, white cards, hover lift + icon animation. */
export function SolutionsGrid() {
  const t = useTranslations("home.solutionsGrid");
  const tCap = useTranslations("capabilityGrid");
  const tc = useTranslations("common.cta");
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container-content grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:items-center">
        <div>
          <p className="mb-3 text-sm font-semibold tracking-[0.15em] text-primary-600 uppercase">{t("eyebrow")}</p>
          <h2 className="text-4xl font-bold text-neutral-900 sm:text-5xl">
            {t("headlinePrefix")}
            <br />
            <span className="text-primary-600">{t("headlineHighlight")}</span>
          </h2>
          <p className="mt-5 max-w-md text-base text-neutral-600">{t("body")}</p>
          <div className="mt-8">
            <Button href="/platform" variant="primary" analyticsId="discover-solutions" analyticsLocation="home-solutions">
              {tc("discoverAllSolutions")}
            </Button>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {featured.map((item) => {
            const key = hrefToLinkKey[item.href ?? ""] ?? "";
            return (
              <li key={item.headline}>
                <Link
                  href={item.href ?? "#"}
                  className="group block h-full rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-transform duration-300 group-hover:rotate-6">
                    <item.icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-4 text-xl font-semibold text-neutral-900">{tCap(`${key}.headline`)}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{tCap(`${key}.description`)}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
