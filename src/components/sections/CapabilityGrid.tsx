import { useTranslations } from "next-intl";
import { capabilityGrid } from "@/lib/content/home";
import { hrefToLinkKey } from "@/lib/nav-i18n";
import { FeatureCard } from "@/components/ui/FeatureCard";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function CapabilityGrid() {
  const t = useTranslations("common.nav");
  const tPage = useTranslations("platformPage.capabilities");
  const tCap = useTranslations("capabilityGrid");
  return (
    <section className="bg-neutral-50 py-20">
      <div className="container-content">
        <SectionHeading eyebrow={t("platform")} headline={tPage("headline")} body={tPage("body")} />
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {capabilityGrid.map((item) => {
            const key = hrefToLinkKey[item.href ?? ""] ?? "";
            return (
              <li key={item.headline}>
                <FeatureCard
                  icon={item.icon}
                  href={item.href}
                  headline={tCap(`${key}.headline`)}
                  description={tCap(`${key}.description`)}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
