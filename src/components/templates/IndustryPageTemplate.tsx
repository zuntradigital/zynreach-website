import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { WorkflowDiagram } from "@/components/sections/WorkflowDiagram";
import { CapabilityCallouts } from "@/components/sections/CapabilityCallouts";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import { SectionHeading } from "@/components/ui/SectionHeading";
import type { IndustryPageContent } from "@/types/content";

interface IndustryPageTemplateProps {
  content: IndustryPageContent;
}

/** Shared template for the 5 Industries sub-pages (SRS Section 7.10). */
export function IndustryPageTemplate({ content }: IndustryPageTemplateProps) {
  const t = useTranslations("industryTemplate");
  const tCta = useTranslations("common.cta");
  const tNav = useTranslations("common.nav");
  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          headline={content.hero.headline}
          subhead={content.hero.subhead}
          image={content.image}
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: tNav("industries"), href: "/industries" },
                { label: content.navLabel, href: `/industries/${content.slug}` },
              ]}
            />
          }
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

        <section className="bg-neutral-50 py-16">
          <div className="container-content">
            <SectionHeading eyebrow={t("workflow.eyebrow")} headline={t("workflow.headline")} align="center" className="mx-auto" />
            <div className="mt-10">
              <WorkflowDiagram steps={content.workflowSteps} />
            </div>
          </div>
        </section>

        <CapabilityCallouts items={content.capabilityCallouts} />

        <section className="border-y border-neutral-200 bg-white dark:bg-neutral-100 py-14">
          <div className="container-content max-w-3xl">
            <p className="text-sm text-neutral-500">{content.useCaseNote}</p>
          </div>
        </section>

        <section className="bg-neutral-50 py-14">
          <div className="container-content flex max-w-3xl items-start gap-3">
            <ShieldCheck aria-hidden="true" className="mt-0.5 h-6 w-6 flex-shrink-0 text-primary-600" />
            <p className="text-sm leading-normal text-neutral-700">{content.complianceNote}</p>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-14">
          <div className="container-content max-w-2xl">
            <LeadCaptureStrip source={`industries-${content.slug}`} />
          </div>
        </section>

        <CtaBand
          headline={`${t("ctaHeadlinePrefix")} ${content.navLabel}`}
          body={t("ctaBody")}
          ctaPrimary={{ label: tCta("bookDemo"), href: "/demo" }}
          ctaSecondary={{ label: tCta("startFreeTrial"), href: "/trial" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
