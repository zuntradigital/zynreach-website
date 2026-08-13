import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FileCheck2 } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SubProcessorTable } from "@/components/ui/SubProcessorTable";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { subProcessorsLastUpdated } from "@/lib/content/trust";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "compliancePage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/compliance"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/compliance") },
  };
}

export default async function CompliancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("compliancePage");
  const tTrust = await getTranslations("trustContent");
  const tLinks = await getTranslations("common.links");

  const complianceFrameworks = tTrust.raw("complianceFrameworks") as { name: string; scope: string }[];
  const subProcessors = tTrust.raw("subProcessors") as { name: string; purpose: string; location: string }[];

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Compliance", href: "/compliance" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tLinks("compliance")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: tLinks("compliance"), href: "/compliance" }]} />}
          actions={
            <>
              <Button href="#documentation" variant="primary" size="lg">
                {t("ctaRequestDocs")}
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
              >
                {t("ctaContactTeam")}
              </Button>
            </>
          }
        />

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("frameworks.eyebrow")} headline={t("frameworks.headline")} />
            <div
              role="region"
              aria-label={t("frameworks.tableAriaLabel")}
              tabIndex={0}
              className="mt-8 overflow-x-auto rounded-xl border border-neutral-200"
            >
              <table className="w-full min-w-[520px] border-collapse text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th scope="col" className="px-5 py-3 text-start font-semibold text-neutral-900">
                      {t("frameworks.frameworkColumn")}
                    </th>
                    <th scope="col" className="px-5 py-3 text-start font-semibold text-neutral-900">
                      {t("frameworks.scopeColumn")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {complianceFrameworks.map((framework) => (
                    <tr key={framework.name} className="border-b border-neutral-100 last:border-0">
                      <th scope="row" className="flex items-center gap-2 px-5 py-3 text-start font-normal text-neutral-700">
                        <FileCheck2 aria-hidden="true" className="h-4 w-4 text-primary-600" />
                        {framework.name}
                      </th>
                      <td className="px-5 py-3 text-neutral-700">{framework.scope}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="documentation" className="bg-neutral-50 py-20">
          <div className="container-content max-w-2xl">
            <SectionHeading eyebrow={t("documentation.eyebrow")} headline={t("documentation.headline")} />
            <div className="mt-8">
              <LeadCaptureStrip headline={t("documentation.formHeadline")} source="compliance-documentation" />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("subprocessors.eyebrow")} headline={t("subprocessors.headline")} />
            <div className="mt-8">
              <SubProcessorTable items={subProcessors} lastUpdated={subProcessorsLastUpdated} />
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content max-w-2xl">
            <SectionHeading eyebrow={t("dataResidencySection.eyebrow")} headline={t("dataResidencySection.headline")} />
            <p className="mt-4 text-base leading-normal text-neutral-600">{tTrust("dataResidency")}</p>
            <Link href="/legal/dpa" className="mt-4 inline-block text-sm font-semibold text-primary-600 hover:text-primary-700">
              {t("dataResidencySection.dpaLink")}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
