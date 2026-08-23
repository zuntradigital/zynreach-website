import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { ShieldCheck, Clock, UserCheck, Settings, KeyRound, Lock, FileClock, Building2, Fingerprint, Globe2, Webhook, BarChart3, Gauge } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { EnterpriseInquiryForm } from "@/components/forms/EnterpriseInquiryForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, organizationJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "enterprisePage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/enterprise"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: t("headline"),
      description: t("subhead"),
      url: localizedUrl(locale, "/enterprise"),
    },
  };
}

const pillarIcons = [ShieldCheck, Clock, UserCheck, Settings];
const featureIcons = [KeyRound, Lock, FileClock, Building2, Fingerprint, Globe2, Webhook, BarChart3, Gauge];

export default async function EnterprisePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("enterprisePage");
  const tLinks = await getTranslations("common.links");

  const pillars = (t.raw("pillars") as { label: string; description: string }[]).map((p, i) => ({ ...p, icon: pillarIcons[i] }));
  const enterpriseFeatures = (t.raw("enterpriseFeatures") as { label: string; description: string }[]).map((f, i) => ({
    ...f,
    icon: featureIcons[i],
  }));
  const enterpriseStory = {
    quote: t("story.quote"),
    authorName: t("story.authorName"),
    authorTitle: t("story.authorTitle"),
    company: t("story.company"),
    metric: { value: t("story.metricValue"), label: t("story.metricLabel") },
  };

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Enterprise", href: "/enterprise" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="organization-jsonld" data={await organizationJsonLd()} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tLinks("enterprise")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: tLinks("enterprise"), href: "/enterprise" }]} />}
        />

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("scale.eyebrow")} headline={t("scale.headline")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((pillar) => (
                <li key={pillar.label} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                  <pillar.icon aria-hidden="true" className="h-7 w-7 text-primary-600" strokeWidth={1.75} />
                  <h3 className="mt-3 font-semibold text-neutral-900">{pillar.label}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{pillar.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-footer py-20">
          <div className="container-content">
            <SectionHeading
              eyebrow={t("onlyFeatures.eyebrow")}
              headline={t("onlyFeatures.headline")}
              className="[&_h2]:text-white [&_p]:text-primary-300 dark:[&_p]:text-primary-600"
            />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {enterpriseFeatures.map((feature) => (
                <li key={feature.label} className="rounded-xl border border-white/10 bg-white/5 p-6">
                  <feature.icon aria-hidden="true" className="h-7 w-7 text-primary-400" strokeWidth={1.75} />
                  <h3 className="mt-3 font-semibold text-white">{feature.label}</h3>
                  <p className="mt-2 text-sm text-neutral-300 dark:text-white/60">{feature.description}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-6 text-sm">
              <Link href="/security" className="font-semibold text-primary-300 hover:text-primary-200 dark:text-primary-600 dark:hover:text-primary-700">
                {t("securityLink")}
              </Link>
              <Link href="/compliance" className="font-semibold text-primary-300 hover:text-primary-200 dark:text-primary-600 dark:hover:text-primary-700">
                {t("complianceLink")}
              </Link>
            </div>
          </div>
        </section>

        <TestimonialSection item={enterpriseStory} />

        <section className="bg-neutral-50 py-20">
          <div className="container-content grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-start">
            <div>
              <SectionHeading eyebrow={t("talkToSales.eyebrow")} headline={t("talkToSales.headline")} body={t("talkToSales.body")} />
            </div>
            <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-8 shadow-sm">
              <EnterpriseInquiryForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
