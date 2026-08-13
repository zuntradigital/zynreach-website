import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { PlatformDiagram } from "@/components/sections/PlatformDiagram";
import { CapabilityGrid } from "@/components/sections/CapabilityGrid";
import { AIModule } from "@/components/sections/AIModule";
import { IntegrationStrip } from "@/components/sections/IntegrationStrip";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, organizationJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "platformPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/platform"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/platform") },
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("platformPage");
  const tNav = await getTranslations("common.nav");
  const tCta = await getTranslations("common.cta");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Platform", href: "/platform" },
  ]);

  const testimonial = {
    quote: t("testimonial.quote"),
    authorName: t("testimonial.authorName"),
    authorTitle: t("testimonial.authorTitle"),
    company: t("testimonial.company"),
    metric: { value: t("testimonial.metricValue"), label: t("testimonial.metricLabel") },
  };

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="organization-jsonld" data={organizationJsonLd()} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tNav("platform")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: tNav("platform"), href: "/platform" }]} />}
          actions={
            <>
              <Button href="/demo" variant="primary" size="lg">
                {tCta("bookDemo")}
              </Button>
              <Button
                href="/trial"
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
              >
                {tCta("startFreeTrial")}
              </Button>
            </>
          }
        />

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading
              eyebrow={t("dataModel.eyebrow")}
              headline={t("dataModel.headline")}
              body={t("dataModel.body")}
              align="center"
              className="mx-auto"
            />
            <div className="mt-12">
              <PlatformDiagram />
            </div>
          </div>
        </section>

        <CapabilityGrid />
        <AIModule />
        <IntegrationStrip />
        <TestimonialSection item={testimonial} />
        <CtaBand
          headline={t("cta.headline")}
          body={t("cta.body")}
          ctaPrimary={{ label: tCta("bookDemo"), href: "/demo" }}
          ctaSecondary={{ label: tCta("startFreeTrial"), href: "/trial" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
