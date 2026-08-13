import { useTranslations } from "next-intl";
import { companyStats } from "@/lib/content/home";
import { CountUpStat } from "./CountUpStat";

const keys = ["years", "projects", "satisfaction", "industries", "presence"] as const;

/** Dark charcoal stats banner: five equal columns, large gold numbers, white labels, soft inner glow. */
export function StatsBanner() {
  const t = useTranslations("home.stats");
  return (
    <section className="bg-neutral-50 py-12">
      <div className="container-content">
        <div className="relative overflow-hidden rounded-xl bg-footer px-8 py-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:px-12">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_-10%,rgba(230,198,122,0.15),transparent_50%)]"
          />
          <ul className="relative grid grid-cols-2 gap-6 sm:grid-cols-5">
            {companyStats.map((stat, index) => (
              <li key={stat.label} className="flex flex-col items-center text-center">
                <stat.icon aria-hidden="true" className="mb-1.5 h-5 w-5 text-primary-400" strokeWidth={1.75} />
                <p className="font-serif text-2xl font-bold text-primary-400">
                  <CountUpStat value={stat.value === "Global" ? t("global") : stat.value} />
                </p>
                <p className="mt-1 text-sm text-white">{t(keys[index])}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
