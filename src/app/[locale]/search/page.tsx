import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { SearchResults } from "@/components/sections/SearchResults";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

export default async function SearchPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("searchPage");

  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("eyebrow")} headline={t("headline")} />
        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content max-w-2xl">
            <Suspense fallback={<p className="text-sm text-neutral-500">{t("loading")}</p>}>
              <SearchResults />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
