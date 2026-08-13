import { useTranslations } from "next-intl";
import { trustFeatures } from "@/lib/content/home";

const keys = ["aiPowered", "scalable", "secure", "measurable"] as const;

/** Four equally sized trust/value columns: outline gold icon, title, description, thin divider. */
export function TrustFeatures() {
  const t = useTranslations("home.trustFeatures");
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container-content">
        <ul className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {trustFeatures.map((feature, index) => (
            <li
              key={feature.headline}
              className={`px-2 ${index > 0 ? "sm:border-s sm:border-neutral-200 sm:ps-8" : ""}`}
            >
              <feature.icon aria-hidden="true" className="h-8 w-8 text-primary-600" strokeWidth={1.75} />
              <h3 className="mt-4 text-lg font-semibold text-neutral-900">{t(`${keys[index]}.headline`)}</h3>
              <p className="mt-2 text-sm leading-normal text-neutral-600">{t(`${keys[index]}.description`)}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
