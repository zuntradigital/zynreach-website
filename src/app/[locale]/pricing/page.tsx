import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { PricingSection } from "@/components/sections/PricingSection";
import { RoiCalculator } from "@/components/sections/RoiCalculator";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { ComparisonTable } from "@/components/ui/ComparisonTable";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { pricingPlans, comparisonMatrix, pricingFaqs } from "@/lib/content/pricing";
import { getPublishedPricing } from "@/lib/services/pricing-content";
import { breadcrumbJsonLd, faqPageJsonLd, productOffersJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import type { ComparisonRow, FaqItem, PricingPlan } from "@/types/content";

// Pricing is admin-directly-editable with no publish step (see ZynReach
// Admin's PATCH /api/admin/pricing/plans/[id] docstring) — a Save must be
// visible on this page immediately, so unlike the other content types
// this route is always dynamically rendered rather than time-based ISR.
export const revalidate = 0;

/** Row order matches comparisonMatrix in src/lib/content/pricing.ts exactly — see pricingPage.comparisonRows in messages/*.json. */
const comparisonRowKeys = [
  "activityLogging",
  "aiDealScoring",
  "customPipelineStages",
  "automationWorkflows",
  "aiLeadScoring",
  "aiAssistants",
  "customAiGrounding",
  "ssoSaml",
  "auditLogs",
  "supportLevel",
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pricingPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/pricing"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/pricing") },
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("pricingPage");
  const tNav = await getTranslations("common.nav");
  const tCta = await getTranslations("common.cta");

  // Live source: System B's Pricing Management module (SRS §15) — FR-WEB-006
  // requires plan changes to reach this page "without a code deploy," which
  // only holds if this is a real fetch, not the old hardcoded pricing.ts.
  // Falls back to that same hardcoded content (§30: "a System B outage...
  // must never take the live public site down") — the exact previous
  // behavior, untouched, not a new code path invented for this fallback.
  const livePricing = await getPublishedPricing(locale);

  const plans: PricingPlan[] = livePricing
    ? livePricing.plans
    : pricingPlans.map((plan) => ({
        ...plan,
        name: t(`plans.${plan.id}.name`),
        description: t(`plans.${plan.id}.description`),
        priceSuffix: t(`plans.${plan.id}.priceSuffix`),
        featureList: t.raw(`plans.${plan.id}.featureList`) as string[],
        ctaLabel: plan.id === "enterprise" ? tCta("talkToSales") : tCta("startFreeTrial"),
      }));

  const rows: ComparisonRow[] = livePricing
    ? livePricing.comparisonMatrix
    : comparisonMatrix.map((row, index) => {
        const key = comparisonRowKeys[index];
        const values = typeof row.values[0] === "boolean" ? row.values : (t.raw(`comparisonRows.${key}.values`) as string[]);
        return {
          category: t(`comparisonRows.${key}.category`),
          feature: t(`comparisonRows.${key}.feature`),
          values,
        };
      });

  const faqs = t.raw("faqs") as FaqItem[];

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Pricing", href: "/pricing" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="faq-page-jsonld" data={faqPageJsonLd(pricingFaqs)} />
      <JsonLd id="product-offers-jsonld" data={productOffersJsonLd(plans)} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tNav("pricing")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: tNav("pricing"), href: "/pricing" }]} />}
          actions={
            <>
              <Button href="/trial" variant="primary" size="lg">
                {tCta("startFreeTrial")}
              </Button>
              <Button
                href="/enterprise"
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
              >
                {tCta("talkToSales")}
              </Button>
            </>
          }
        />

        <section className="bg-white dark:bg-neutral-100 py-12 sm:py-16 lg:py-20">
          <div className="container-content">
            <PricingSection plans={plans} />
          </div>
        </section>

        <section className="bg-neutral-50 py-12 sm:py-16 lg:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("comparison.eyebrow")} headline={t("comparison.headline")} align="center" className="mx-auto" />
            <div className="mt-8 sm:mt-10">
              <ComparisonTable plans={plans} rows={rows} />
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-12 sm:py-16 lg:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("roi.eyebrow")} headline={t("roi.headline")} align="center" className="mx-auto" />
            <div className="mt-8 sm:mt-10">
              <RoiCalculator />
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-12 sm:py-16 lg:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("faqSection.eyebrow")} headline={t("faqSection.headline")} align="center" className="mx-auto" />
            <div className="mx-auto mt-8 max-w-3xl sm:mt-10">
              <FaqAccordion items={faqs} />
            </div>
          </div>
        </section>

        <CtaBand
          headline={t("cta.headline")}
          body={t("cta.body")}
          ctaPrimary={{ label: tCta("talkToSales"), href: "/enterprise" }}
          ctaSecondary={{ label: tCta("startFreeTrial"), href: "/trial" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
