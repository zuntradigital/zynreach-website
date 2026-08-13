import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ShieldCheck, Lock, KeyRound, AlertTriangle } from "lucide-react";
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
  const t = await getTranslations({ locale, namespace: "securityPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/security"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/security") },
  };
}

export default async function SecurityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("securityPage");
  const tTrust = await getTranslations("trustContent");
  const tLinks = await getTranslations("common.links");

  const certifications = tTrust.raw("certifications") as { name: string; description: string }[];
  const dataProtectionPoints = tTrust.raw("dataProtectionPoints") as { headline: string; description: string }[];
  const subProcessors = tTrust.raw("subProcessors") as { name: string; purpose: string; location: string }[];

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Security", href: "/security" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tLinks("security")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: tLinks("security"), href: "/security" }]} />}
          actions={
            <>
              <Button href="#whitepaper" variant="primary" size="lg">
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

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {certifications.map((cert) => (
                <li key={cert.name} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 text-center">
                  <ShieldCheck aria-hidden="true" className="mx-auto h-8 w-8 text-primary-600" />
                  <p className="mt-3 font-semibold text-neutral-900">{cert.name}</p>
                  <p className="mt-2 text-sm text-neutral-600">{cert.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("dataProtection.eyebrow")} headline={t("dataProtection.headline")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {dataProtectionPoints.map((point) => (
                <li key={point.headline} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                  <Lock aria-hidden="true" className="h-6 w-6 text-primary-600" />
                  <h3 className="mt-3 font-semibold text-neutral-900">{point.headline}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{point.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("infrastructure.eyebrow")} headline={t("infrastructure.headline")} />
            <div className="mt-8">
              <SubProcessorTable items={subProcessors} lastUpdated={subProcessorsLastUpdated} />
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content flex max-w-2xl flex-col items-start gap-3">
            <KeyRound aria-hidden="true" className="h-8 w-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-neutral-900">{t("accessControlHeading")}</h2>
            <p className="text-base leading-normal text-neutral-600">{tTrust("accessControl.description")}</p>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content flex max-w-2xl flex-col items-start gap-3">
            <AlertTriangle aria-hidden="true" className="h-8 w-8 text-primary-600" />
            <h2 className="text-2xl font-bold text-neutral-900">{t("incidentResponse.headline")}</h2>
            <p className="text-base leading-normal text-neutral-600">{tTrust("incidentResponseSummary")}</p>
            <Link href="/status" className="text-sm font-semibold text-primary-600 hover:text-primary-700">
              {t("incidentResponse.statusLink")}
            </Link>
          </div>
        </section>

        <section id="whitepaper" className="border-t border-neutral-200 bg-neutral-50 py-20">
          <div className="container-content max-w-2xl">
            <SectionHeading eyebrow={t("whitepaper.eyebrow")} headline={t("whitepaper.headline")} />
            <div className="mt-8">
              <LeadCaptureStrip headline={t("whitepaper.formHeadline")} source="security-whitepaper" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
