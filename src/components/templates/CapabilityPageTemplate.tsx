import { getTranslations } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { PersonaStrip } from "@/components/sections/PersonaStrip";
import { FeatureBlocks } from "@/components/sections/FeatureBlocks";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { RelatedIntegrations } from "@/components/sections/RelatedIntegrations";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { ComparisonSection } from "@/components/sections/ComparisonSection";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import type { CapabilityPageContent } from "@/types/content";
import { hrefToLinkKey } from "@/lib/nav-i18n";

interface CapabilityPageTemplateProps {
  content: CapabilityPageContent;
}

/**
 * Shared template for all 6 capability pages (SRS Section 7.3): every
 * capability page renders through this one component with page-specific
 * content data, rather than being hand-built per page.
 */
export async function CapabilityPageTemplate({ content }: CapabilityPageTemplateProps) {
  const t = await getTranslations(`platformPage.detail.${content.slug}`);
  const tPlatform = await getTranslations("platformPage");
  const tSolutionsDetail = await getTranslations("solutionsPage.detail");
  const tNav = await getTranslations("common.nav");
  const tCta = await getTranslations("common.cta");
  const tLinks = await getTranslations("common.links");

  const navLabel = hrefToLinkKey[`/platform/${content.slug}`]
    ? tLinks(hrefToLinkKey[`/platform/${content.slug}`] as Parameters<typeof tLinks>[0])
    : content.navLabel;

  const whoItsFor = content.whoItsFor.map((item) => ({
    ...item,
    label: tSolutionsDetail(`${item.href.split("/").pop()}.audienceLabel` as Parameters<typeof tSolutionsDetail>[0]),
  }));
  const translatedFeatureBlocks = t.raw("featureBlocks") as {
    headline: string;
    description: string;
    proofLabel: string;
    proofStat?: string;
  }[];
  const featureBlocks = content.featureBlocks.map((block, index) => ({
    ...block,
    headline: translatedFeatureBlocks[index].headline,
    description: translatedFeatureBlocks[index].description,
    proof: {
      stat: translatedFeatureBlocks[index].proofStat ?? block.proof.stat,
      label: translatedFeatureBlocks[index].proofLabel,
    },
  }));
  const howItWorks = t.raw("howItWorks") as { headline: string; description: string }[];
  const testimonial = {
    quote: tPlatform("testimonial.quote"),
    authorName: tPlatform("testimonial.authorName"),
    authorTitle: tPlatform("testimonial.authorTitle"),
    company: tPlatform("testimonial.company"),
    metric: { value: tPlatform("testimonial.metricValue"), label: tPlatform("testimonial.metricLabel") },
  };

  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          headline={t("hero.headline")}
          subhead={t("hero.subhead")}
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: tNav("platform"), href: "/platform" },
                { label: navLabel, href: `/platform/${content.slug}` },
              ]}
            />
          }
          actions={
            <>
              <Button href="/trial" variant="primary" size="lg">
                {tCta("startFreeTrial")}
              </Button>
              <Button
                href="/demo"
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
              >
                {tCta("bookDemo")}
              </Button>
            </>
          }
        />
        <PersonaStrip items={whoItsFor} builtForLabel={tPlatform("builtForLabel")} />
        <FeatureBlocks items={featureBlocks} />
        <HowItWorks items={howItWorks} />
        <RelatedIntegrations categories={content.relatedIntegrations} />
        <TestimonialSection item={testimonial} />
        <ComparisonSection
          title={t("comparison.title")}
          statusQuo={t("comparison.statusQuo")}
          withZynReach={t("comparison.withZynReach")}
        />
        <CtaBand
          headline={tPlatform("seeOnYourData", { capability: navLabel })}
          body={tPlatform("ctaBandBody")}
          ctaPrimary={{ label: tCta("bookDemo"), href: "/demo" }}
          ctaSecondary={{ label: tCta("startFreeTrial"), href: "/trial" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
