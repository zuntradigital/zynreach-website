import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { apiEndpoints } from "@/lib/content/api-reference";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apiReferencePage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/docs/api"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: t("headline"),
      description: t("subhead"),
      url: localizedUrl(locale, "/docs/api"),
    },
  };
}

const methodColor: Record<string, string> = {
  GET: "bg-info-bg text-info",
  POST: "bg-success-bg text-success",
  PUT: "bg-warning-bg text-warning",
  DELETE: "bg-error-bg text-error",
};

export default async function ApiReferencePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("apiReferencePage");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "API Reference", href: "/docs/api" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("eyebrow")} headline={t("headline")} subhead={t("subhead")} />

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content max-w-2xl">
            <ul className="divide-y divide-neutral-200 rounded-xl border border-neutral-200">
              {apiEndpoints.map((endpoint) => (
                <li key={endpoint.slug}>
                  <Link href={`/docs/api/${endpoint.slug}`} className="flex items-center gap-4 p-4 hover:bg-neutral-50">
                    <span className={`w-16 flex-shrink-0 rounded px-2 py-1 text-center text-xs font-bold ${methodColor[endpoint.method]}`}>
                      {endpoint.method}
                    </span>
                    <div>
                      <p className="font-mono text-sm text-neutral-900">{endpoint.path}</p>
                      <p className="text-sm text-neutral-500">{t(`endpoints.${endpoint.slug}.summary` as Parameters<typeof t>[0])}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
