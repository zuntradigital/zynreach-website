import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { industryPages } from "@/lib/content/industries";
import { hrefToLinkKey } from "@/lib/nav-i18n";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

const slugToCardKey: Record<string, string> = {
  healthcare: "healthcare",
  education: "education",
  "real-estate": "realEstate",
  automotive: "automotive",
  manufacturing: "manufacturing",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "industriesPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/industries"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/industries") },
  };
}

export default async function IndustriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("industriesPage");
  const tNav = await getTranslations("common.nav");
  const tLinks = await getTranslations("common.links");
  const tCta = await getTranslations("common.cta");
  const tSolutions = await getTranslations("solutionsPage");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Industries", href: "/industries" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tNav("industries")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: tNav("industries"), href: "/industries" }]} />}
        />

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {industryPages.map((industry) => {
                const linkKey = hrefToLinkKey[`/industries/${industry.slug}`] ?? "";
                const cardKey = slugToCardKey[industry.slug] ?? "";
                return (
                  <li key={industry.slug}>
                    <Link
                      href={`/industries/${industry.slug}`}
                      className="flex h-full flex-col justify-between rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
                    >
                      <div>
                        <h2 className="text-lg font-semibold text-neutral-900">{tLinks(linkKey)}</h2>
                        <p className="mt-2 text-sm leading-normal text-neutral-600">{t(`cards.${cardKey}.subhead`)}</p>
                      </div>
                      <span className="mt-6 flex items-center gap-1 text-sm font-semibold text-primary-600">
                        {tSolutions("seeHowItWorks")}
                        <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <CtaBand
          headline={t("cta.headline")}
          body={t("cta.body")}
          ctaPrimary={{ label: tCta("bookDemo"), href: "/demo" }}
          ctaSecondary={{ label: tCta("startFreeTrial"), href: "/trial" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
