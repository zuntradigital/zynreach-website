import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustFeatures } from "@/components/sections/TrustFeatures";
import { LogoCloud } from "@/components/sections/LogoCloud";
import { StatsBanner } from "@/components/sections/StatsBanner";
import { SolutionsGrid } from "@/components/sections/SolutionsGrid";
import { IndustriesStrip } from "@/components/sections/IndustriesStrip";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { CtaBand } from "@/components/sections/CtaBand";
import { finalCta } from "@/lib/content/home";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return {
    title: t("homeTitle"),
    description: t("homeDescription"),
    alternates: localizedAlternates(locale, ""),
    openGraph: {
      ...openGraphDefaults(locale),
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: localizedUrl(locale, ""),
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home.finalCta");
  const tc = await getTranslations("common.cta");

  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <Hero />
        <TrustFeatures />
        <LogoCloud compact />
        <StatsBanner />
        <SolutionsGrid />
        <IndustriesStrip />
        <CaseStudies />
        <CtaBand
          headline={t("headline")}
          body={t("body")}
          ctaPrimary={{ label: tc("bookDemo"), href: finalCta.ctaPrimary.href }}
          ctaSecondary={{ label: tc("startFreeTrial"), href: finalCta.ctaSecondary.href }}
          analyticsLocation="home-final-cta"
          compact
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
