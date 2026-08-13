import { useTranslations } from "next-intl";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { BeforeAfter } from "@/components/sections/BeforeAfter";
import { CapabilityCallouts } from "@/components/sections/CapabilityCallouts";
import { RelatedIntegrations } from "@/components/sections/RelatedIntegrations";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import type { SolutionPageContent } from "@/types/content";

interface SolutionPageTemplateProps {
  content: SolutionPageContent;
  /** Localized nav label with any leading "For " stripped, e.g. "Sales Teams" — the template itself doesn't know the site locale's grammar for stripping that prefix. */
  ctaAudienceLabel: string;
}

/** Shared template for the 5 Solutions sub-pages (SRS Section 7.8). */
export function SolutionPageTemplate({ content, ctaAudienceLabel }: SolutionPageTemplateProps) {
  const t = useTranslations("solutionTemplate");
  const tNav = useTranslations("common.nav");
  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          headline={content.hero.headline}
          subhead={content.hero.subhead}
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: tNav("solutions"), href: "/solutions" },
                { label: content.navLabel, href: `/solutions/${content.slug}` },
              ]}
            />
          }
          actions={
            <>
              <Button href={content.primaryCta.href} variant="primary" size="lg">
                {content.primaryCta.label}
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
              >
                {t("talkToSales")}
              </Button>
            </>
          }
        />
        <BeforeAfter before={content.before} after={content.after} />
        <CapabilityCallouts items={content.capabilityCallouts} />
        <RelatedIntegrations categories={content.relatedIntegrations} />

        <section className="border-y border-neutral-200 bg-white dark:bg-neutral-100 py-14">
          <div className="container-content">
            <p className="mb-4 text-sm text-neutral-500">{content.storyNote}</p>
            <LeadCaptureStrip source={`solutions-${content.slug}`} />
          </div>
        </section>

        <CtaBand
          headline={`${t("ctaHeadlinePrefix")} ${ctaAudienceLabel}`}
          body={t("ctaBody")}
          ctaPrimary={content.primaryCta}
          ctaSecondary={{ label: t("talkToSales"), href: "/contact" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
