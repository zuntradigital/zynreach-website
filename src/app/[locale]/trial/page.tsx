import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { TrialForm } from "@/components/forms/TrialForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/content/site";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "trial" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/trial"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: `${t("metaTitle")} — ${site.name}`,
      description: t("metaDescription"),
      url: localizedUrl(locale, "/trial"),
    },
  };
}

export default async function TrialPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("trial");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: t("eyebrow"), href: "/trial" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={t("eyebrow")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: t("eyebrow"), href: "/trial" }]} />}
        />

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content mx-auto max-w-lg rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-8 shadow-sm">
            <TrialForm />
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
