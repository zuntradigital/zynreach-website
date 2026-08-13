import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { StoryFilterBar } from "@/components/sections/StoryFilterBar";
import { StoryCard } from "@/components/ui/StoryCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { customerStories } from "@/lib/content/customer-stories";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "customersPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/customers"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/customers") },
  };
}

interface CustomerStoriesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ industry?: string; product?: string; size?: string }>;
}

export default async function CustomerStoriesPage({ params, searchParams }: CustomerStoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("customersPage");
  const tCta = await getTranslations("common.cta");
  const query = await searchParams;

  const industries = Array.from(new Set(customerStories.map((s) => s.industry)));
  const productAreas = Array.from(new Set(customerStories.map((s) => s.productArea)));
  const companySizes = Array.from(new Set(customerStories.map((s) => s.companySize)));

  const filtered = customerStories.filter(
    (story) =>
      (!query.industry || story.industry === query.industry) &&
      (!query.product || story.productArea === query.product) &&
      (!query.size || story.companySize === query.size)
  );

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Customer Stories", href: "/customers" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("eyebrow")} headline={t("headline")} subhead={t("subhead")} />

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content">
            <Suspense fallback={<div className="h-16" />}>
              <StoryFilterBar industries={industries} productAreas={productAreas} companySizes={companySizes} />
            </Suspense>

            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((story) => (
                <li key={story.slug}>
                  <StoryCard story={story} />
                </li>
              ))}
            </ul>

            {filtered.length === 0 ? (
              <p className="mt-8 text-sm text-neutral-500">{t("noStories")}</p>
            ) : null}
          </div>
        </section>

        <CtaBand
          headline={t("ctaBand.headline")}
          body={t("ctaBand.body")}
          ctaPrimary={{ label: tCta("bookDemo"), href: "/demo" }}
          ctaSecondary={{ label: tCta("startFreeTrial"), href: "/trial" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
