import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { integrations, getIntegration } from "@/lib/content/integrations";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { categoryToKey } from "@/lib/nav-i18n";

interface IntegrationPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return integrations.map((integration) => ({ slug: integration.slug }));
}

export async function generateMetadata({ params }: IntegrationPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = getIntegration(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "integrationsPage.items" });
  const name = t(`${raw.slug}.name` as Parameters<typeof t>[0]);
  const description = t(`${raw.slug}.description` as Parameters<typeof t>[0]);
  const url = `/integrations/${raw.slug}`;
  return {
    title: `${name} Integration`,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title: `${name} Integration — ZynReach`, description, url: localizedUrl(locale, url) },
  };
}

export default async function IntegrationDetailPage({ params }: IntegrationPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const raw = getIntegration(slug);
  if (!raw) notFound();

  const t = await getTranslations("integrationsPage");
  const tCategories = await getTranslations("common.integrationCategories");
  const tMegaMenu = await getTranslations("common.megaMenu");
  const tCta = await getTranslations("common.cta");

  const integration = {
    ...raw,
    name: t(`items.${raw.slug}.name`),
    description: t(`items.${raw.slug}.description`),
  };
  const related = integrations
    .filter((i) => i.category === raw.category && i.slug !== raw.slug)
    .map((i) => ({ ...i, name: t(`items.${i.slug}.name`) }));

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Integrations", href: "/integrations" },
    { label: integration.name, href: `/integrations/${integration.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content max-w-2xl py-16">
          <Breadcrumbs items={[{ label: tMegaMenu("integrations"), href: "/integrations" }, { label: integration.name, href: `/integrations/${integration.slug}` }]} />
          <span className="mt-6 inline-block w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            {tCategories(categoryToKey[integration.category] as Parameters<typeof tCategories>[0])}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900">{integration.name}</h1>
          <p className="mt-3 text-base text-neutral-600">{integration.description}</p>
          <div className="mt-6">
            <Button href="/trial" variant="primary">
              {tCta("startFreeTrial")}
            </Button>
          </div>

          {related.length > 0 ? (
            <div className="mt-12 border-t border-neutral-200 pt-8">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{t("relatedHeading")}</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/integrations/${r.slug}`}
                    className="rounded-full border border-neutral-200 bg-white dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:text-primary-600"
                  >
                    {r.name}
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
