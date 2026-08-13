import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { HeartPulse, GraduationCap, Home, Car, Factory, ArrowRight, type LucideIcon } from "lucide-react";
import { industryPages } from "@/lib/content/industries";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const iconBySlug: Record<string, LucideIcon> = {
  healthcare: HeartPulse,
  education: GraduationCap,
  "real-estate": Home,
  automotive: Car,
  manufacturing: Factory,
};

const slugToLinkKey: Record<string, string> = {
  healthcare: "healthcare",
  education: "education",
  "real-estate": "realEstate",
  automotive: "automotive",
  manufacturing: "manufacturing",
};

/** Compact industry icon-cards: same white/bordered card + icon-badge + hover-lift language as SolutionsGrid. */
export function IndustriesStrip() {
  const t = useTranslations("home.industriesStrip");
  const tLinks = useTranslations("common.links");
  const tc = useTranslations("common.cta");
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container-content">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={t("eyebrow")} headline={t("headline")} />
          <Link href="/industries" className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">
            {tc("viewAllIndustries")}
            <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {industryPages.map((industry) => {
            const Icon = iconBySlug[industry.slug];
            return (
              <li key={industry.slug}>
                <Link
                  href={`/industries/${industry.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={industry.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-3 p-6 text-center">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-primary-50 text-primary-600 transition-transform duration-300 group-hover:rotate-6">
                      {Icon ? <Icon aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} /> : null}
                    </span>
                    <p className="text-sm font-semibold text-neutral-900">{tLinks(slugToLinkKey[industry.slug])}</p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 sm:hidden">
          <Button href="/industries" variant="secondary" className="w-full">
            {tc("viewAllIndustries")}
          </Button>
        </div>
      </div>
    </section>
  );
}
