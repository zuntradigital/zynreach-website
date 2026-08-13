import { useTranslations } from "next-intl";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

export function IntegrationStrip() {
  const t = useTranslations("platformPage.integrations");
  const categories = t.raw("categories") as string[];
  return (
    <section className="bg-white dark:bg-neutral-100 py-20">
      <div className="container-content grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading eyebrow={t("eyebrow")} headline={t("headline")} body={t("body")} />
          <div className="mt-6">
            <Button href="/integrations" variant="secondary">
              {t("ctaLabel")}
            </Button>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-3">
          {categories.map((category) => (
            <li
              key={category}
              className="rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-4 text-center text-sm font-medium text-neutral-700"
            >
              {category}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
