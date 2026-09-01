import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  AlertTriangle,
  Fingerprint,
  Users,
  ScrollText,
  DatabaseBackup,
  Activity,
  Bug,
  ArrowRight,
  Eye,
  Settings2,
} from "lucide-react";
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

const featureCardIcons = [Lock, KeyRound, Fingerprint, Users, ScrollText, DatabaseBackup, Activity, Bug];
const layerIcons = [Fingerprint, KeyRound, Lock, Eye, DatabaseBackup];
const pillarIcons = [Fingerprint, KeyRound, Eye, Settings2];
const badgeIcons = [Lock, KeyRound, Eye];

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
  const subProcessors = tTrust.raw("subProcessors") as { name: string; purpose: string; location: string }[];

  const featureCards = t.raw("dataProtection.cards") as { title: string; englishLabel: string; description: string; tag: string }[];
  const protectionLayers = t.raw("protectionLayers.layers") as { step: string; title: string; englishLabel: string; description: string }[];
  const dataControlPillars = t.raw("dataControl.pillars") as { englishLabel: string; title: string; description: string }[];
  const securityByDesignPoints = t.raw("securityByDesign.points") as { label: string; description: string }[];
  const trustBadges = t.raw("trustReassurance.badges") as { title: string; description: string }[];
  const securityDocuments = t.raw("documentLibrary.documents") as { title: string; description: string; href: string }[];

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
          eyebrow={t("eyebrow")}
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
        <p className="border-b border-neutral-200 bg-white dark:bg-neutral-100 py-4 text-center text-sm font-medium text-neutral-500">
          {t("heroTagline")}
        </p>

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
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featureCards.map((card, index) => {
                const Icon = featureCardIcons[index] ?? Lock;
                return (
                  <li key={card.title} className="flex flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                    <Icon aria-hidden="true" className="h-6 w-6 text-primary-600" />
                    <h3 className="mt-3 font-semibold text-neutral-900">{card.title}</h3>
                    <p className="mt-2 text-sm leading-normal text-neutral-600">{card.description}</p>
                    <span className="mt-4 inline-block w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary-700">
                      {card.tag}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("protectionLayers.eyebrow")} headline={t("protectionLayers.headline")} body={t("protectionLayers.description")} />
            <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
              {protectionLayers.map((layer, index) => {
                const Icon = layerIcons[index] ?? Lock;
                return (
                  <li key={layer.title} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                    <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">{layer.step}</span>
                    <Icon aria-hidden="true" className="mt-3 h-6 w-6 text-primary-600" />
                    <h3 className="mt-3 font-semibold text-neutral-900">{layer.title}</h3>
                    <p className="mt-2 text-sm leading-normal text-neutral-600">{layer.description}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("dataControl.eyebrow")} headline={t("dataControl.headline")} body={t("dataControl.description")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {dataControlPillars.map((pillar, index) => {
                const Icon = pillarIcons[index] ?? Lock;
                return (
                  <li key={pillar.title} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                    <Icon aria-hidden="true" className="h-6 w-6 text-primary-600" />
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-primary-600">{pillar.englishLabel}</p>
                    <h3 className="mt-1 font-semibold text-neutral-900">{pillar.title}</h3>
                    <p className="mt-2 text-sm leading-normal text-neutral-600">{pillar.description}</p>
                  </li>
                );
              })}
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

        <section className="bg-neutral-50 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("securityByDesign.eyebrow")} headline={t("securityByDesign.headline")} body={t("securityByDesign.text")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {securityByDesignPoints.map((point) => (
                <li key={point.label} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                  <h3 className="font-semibold text-neutral-900">{point.label}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{point.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="documents" className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("documentLibrary.eyebrow")} headline={t("documentLibrary.headline")} body={t("documentLibrary.subhead")} />
            <ul className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {securityDocuments.map((doc) => (
                <li key={doc.href}>
                  <Link
                    href={doc.href}
                    className="group flex h-full flex-col justify-between rounded-xl border border-neutral-200 bg-neutral-50 p-6 transition-colors hover:border-primary-300 hover:bg-white"
                  >
                    <div>
                      <h3 className="font-semibold text-neutral-900">{doc.title}</h3>
                      <p className="mt-2 text-sm leading-normal text-neutral-600">{doc.description}</p>
                    </div>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-600">
                      {t("documentLibrary.cardLinkLabel")}
                      <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content">
            <SectionHeading align="center" headline={t("trustReassurance.headline")} body={t("trustReassurance.text")} className="mx-auto max-w-2xl" />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {trustBadges.map((badge, index) => {
                const Icon = badgeIcons[index] ?? Lock;
                return (
                  <li key={badge.title} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 text-center">
                    <Icon aria-hidden="true" className="mx-auto h-7 w-7 text-primary-600" />
                    <h3 className="mt-3 font-semibold text-neutral-900">{badge.title}</h3>
                    <p className="mt-2 text-sm leading-normal text-neutral-600">{badge.description}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="whitepaper" className="border-t border-neutral-200 bg-white dark:bg-neutral-100 py-20">
          <div className="container-content max-w-2xl">
            <SectionHeading eyebrow={t("whitepaper.eyebrow")} headline={t("whitepaper.headline")} />
            <div className="mt-8">
              <LeadCaptureStrip headline={t("whitepaper.formHeadline")} source="security-whitepaper" />
            </div>
          </div>
        </section>

        <section className="bg-footer py-20">
          <div className="container-content flex flex-col items-center text-center">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">{t("finalCta.headline")}</h2>
            <p className="mt-4 max-w-xl text-base leading-normal text-white/70">{t("finalCta.text")}</p>
            <Button href="/demo" variant="primary" size="lg" className="mt-8">
              {t("finalCta.button")}
            </Button>
            <p className="mt-4 text-sm text-white/50">{t("finalCta.caption")}</p>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
