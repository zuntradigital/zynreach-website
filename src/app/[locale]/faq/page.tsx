import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { FaqTabs } from "@/components/sections/FaqTabs";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqCategories } from "@/lib/content/faq";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import type { FaqItem } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faqPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/faq"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/faq") },
  };
}

export default async function FaqPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("faqPage");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "FAQ", href: "/faq" },
  ]);

  const allFaqs = faqCategories.flatMap(
    (category) => t.raw(`items.${category}`) as FaqItem[]
  );

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="faq-page-jsonld" data={faqPageJsonLd(allFaqs)} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("eyebrow")} headline={t("headline")} subhead={t("subhead")} />
        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content max-w-3xl">
            <FaqTabs />
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
