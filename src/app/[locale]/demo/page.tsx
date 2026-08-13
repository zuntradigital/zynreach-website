import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { DemoForm } from "@/components/forms/DemoForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { logoCloud } from "@/lib/content/home";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/content/site";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "demo" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/demo"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: `${t("metaTitle")} — ${site.name}`,
      description: t("metaDescription"),
      url: localizedUrl(locale, "/demo"),
    },
  };
}

export default async function DemoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("demo");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: t("eyebrow"), href: "/demo" },
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
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: t("eyebrow"), href: "/demo" }]} />}
        />

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-8 shadow-sm">
              <DemoForm />
            </div>

            <aside className="space-y-8">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{t("trustedBy")}</p>
                <ul className="mt-4 grid grid-cols-2 gap-3">
                  {logoCloud.slice(0, 4).map((logo) => (
                    <li
                      key={logo.name}
                      className="rounded-md border border-neutral-100 bg-neutral-50 px-3 py-3 text-center text-xs font-semibold text-neutral-500"
                    >
                      {logo.name}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary-200 bg-primary-50 p-6 text-center">
                <p className="text-3xl font-bold text-primary-600">{t("statValue")}</p>
                <p className="mt-2 text-sm text-neutral-600">{t("statLabel")}</p>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
