import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { JsonLd } from "@/components/seo/JsonLd";
import { apiEndpoints, getApiEndpoint } from "@/lib/content/api-reference";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

interface ApiEndpointPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return apiEndpoints.map((endpoint) => ({ slug: endpoint.slug }));
}

export async function generateMetadata({ params }: ApiEndpointPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = getApiEndpoint(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "apiReferencePage.endpoints" });
  const summary = t(`${raw.slug}.summary` as Parameters<typeof t>[0]);
  const url = `/docs/api/${raw.slug}`;
  return {
    title: `${raw.method} ${raw.path} — API Reference`,
    description: summary,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title: `${raw.method} ${raw.path}`, description: summary, url: localizedUrl(locale, url) },
  };
}

export default async function ApiEndpointPage({ params }: ApiEndpointPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const raw = getApiEndpoint(slug);
  if (!raw) notFound();

  const t = await getTranslations("apiReferencePage");
  const tEndpoint = await getTranslations(`apiReferencePage.endpoints.${raw.slug}`);

  const endpoint = { ...raw, summary: tEndpoint("summary") };

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "API Reference", href: "/docs/api" },
    { label: endpoint.path, href: `/docs/api/${endpoint.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content max-w-2xl py-16">
          <Breadcrumbs items={[{ label: t("eyebrow"), href: "/docs/api" }, { label: endpoint.path, href: `/docs/api/${endpoint.slug}` }]} />
          <div className="mt-6 flex items-center gap-3">
            <span className="rounded bg-primary-600 px-2.5 py-1 text-xs font-bold text-white dark:text-neutral-50">{endpoint.method}</span>
            <h1 className="font-mono text-xl font-bold text-neutral-900">{endpoint.path}</h1>
          </div>
          <p className="mt-3 text-base text-neutral-600">{endpoint.summary}</p>
          <p className="mt-2 text-sm text-neutral-500">
            {endpoint.authRequired ? t("authRequired") : t("noAuthRequired")}
          </p>

          {endpoint.parameters.length > 0 ? (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900">{t("parametersHeading")}</h2>
              <div
                role="region"
                aria-label={t("parametersTableAriaLabel")}
                tabIndex={0}
                className="mt-3 overflow-x-auto rounded-xl border border-neutral-200"
              >
                <table className="w-full min-w-[420px] border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th scope="col" className="px-4 py-2 text-start font-semibold text-neutral-900">{t("table.name")}</th>
                      <th scope="col" className="px-4 py-2 text-start font-semibold text-neutral-900">{t("table.type")}</th>
                      <th scope="col" className="px-4 py-2 text-start font-semibold text-neutral-900">{t("table.required")}</th>
                      <th scope="col" className="px-4 py-2 text-start font-semibold text-neutral-900">{t("table.description")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {endpoint.parameters.map((param) => (
                      <tr key={param.name} className="border-b border-neutral-100 last:border-0">
                        <th scope="row" className="px-4 py-2 text-start font-mono font-normal text-neutral-700">{param.name}</th>
                        <td className="px-4 py-2 text-neutral-500">{param.type}</td>
                        <td className="px-4 py-2 text-neutral-500">{param.required ? t("table.yes") : t("table.no")}</td>
                        <td className="px-4 py-2 text-neutral-600">{tEndpoint(`parameters.${param.name}` as Parameters<typeof tEndpoint>[0])}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          {endpoint.requestExample ? (
            <section className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900">{t("requestExampleHeading")}</h2>
              <div className="mt-3">
                <CodeBlock code={endpoint.requestExample} language="json" />
              </div>
            </section>
          ) : null}

          <section className="mt-8">
            <h2 className="text-lg font-semibold text-neutral-900">{t("responseExampleHeading")}</h2>
            <div className="mt-3">
              <CodeBlock code={endpoint.responseExample} language="json" />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
