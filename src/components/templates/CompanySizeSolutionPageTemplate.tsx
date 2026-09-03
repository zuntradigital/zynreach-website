import { ArrowRight, Check } from "lucide-react";
import { useTranslations } from "next-intl";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { SimpleComparisonTable } from "@/components/ui/SimpleComparisonTable";
import type { CompanySizeSolutionPageContent, CompanySizeSectionContent, CompanySizeSectionSkeleton } from "@/types/content";

interface CompanySizeSolutionPageTemplateProps {
  content: CompanySizeSolutionPageContent;
}

type Section = CompanySizeSectionSkeleton & CompanySizeSectionContent;

/**
 * Shared template for the 4 "Solutions by Business Size" pages
 * (`/solutions/{smb,growing-business,mid-market,enterprise}`). Each
 * page's `content.sections` array is a sequence of section "kinds"
 * (prose / beforeAfter / cardGrid / arrowChain / timeline /
 * comparisonTable / faq) — see the doc comment on
 * `CompanySizeSolutionPageContent` in src/types/content.ts for the exact
 * per-kind field contract. Alternates section backgrounds (white/neutral)
 * purely by array index for visual rhythm, matching how /pricing
 * alternates its own hand-composed sections.
 */
export function CompanySizeSolutionPageTemplate({ content }: CompanySizeSolutionPageTemplateProps) {
  const t = useTranslations("companySizeSolutionsChrome");
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
              <Button href={content.primaryCta.href} variant="primary" size="lg" analyticsId={`solutions-${content.slug}-hero-primary`} analyticsLocation={`solutions-${content.slug}-hero`}>
                {content.primaryCta.label}
              </Button>
              <Button
                href={content.secondaryCta.href}
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
                analyticsId={`solutions-${content.slug}-hero-secondary`}
                analyticsLocation={`solutions-${content.slug}-hero`}
              >
                {content.secondaryCta.label}
              </Button>
            </>
          }
        />

        {content.hero.supportingStatement || content.hero.microCopy?.length ? (
          <section className="bg-white dark:bg-neutral-100 py-10">
            <div className="container-content max-w-3xl text-center">
              {content.hero.supportingStatement ? (
                <p className="text-lg text-neutral-700">{content.hero.supportingStatement}</p>
              ) : null}
              {content.hero.microCopy?.length ? (
                <ul className="mt-4 flex flex-col items-center gap-1 text-sm text-neutral-500">
                  {content.hero.microCopy.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          </section>
        ) : null}

        {content.sections.map((section, index) => (
          <CompanySizeSection key={section.id} section={section} tone={index % 2 === 0 ? "white" : "neutral"} includedLabel={t("included")} />
        ))}

        <CtaBand
          headline={content.finalCta.heading}
          body={content.finalCta.body}
          ctaPrimary={content.primaryCta}
          ctaSecondary={content.secondaryCta}
          analyticsLocation={`solutions-${content.slug}-final-cta`}
        />
        {content.finalCta.supportingText ? (
          <section className="bg-neutral-50 pb-16">
            <div className="container-content max-w-2xl text-center">
              <p className="text-sm text-neutral-500">{content.finalCta.supportingText}</p>
            </div>
          </section>
        ) : null}

        <section className="bg-footer py-16">
          <div className="container-content max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">{content.brandClosing.heading}</h2>
            {content.brandClosing.body ? <p className="mt-4 text-white/70">{content.brandClosing.body}</p> : null}
            <p className="mt-6 text-sm font-semibold tracking-wide text-primary-400 uppercase">{content.brandClosing.tagline}</p>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}

function CompanySizeSection({ section, tone, includedLabel }: { section: Section; tone: "white" | "neutral"; includedLabel: string }) {
  const bg = tone === "white" ? "bg-white dark:bg-neutral-100" : "bg-neutral-50";

  switch (section.kind) {
    case "prose":
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content max-w-3xl">
            <SectionHeading headline={section.heading} />
            {section.body?.map((paragraph, i) => (
              <p key={i} className="mt-4 text-neutral-600 leading-normal">
                {paragraph}
              </p>
            ))}
            {section.list?.length ? (
              <ul className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {section.list.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-neutral-700">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
            {section.outro?.map((paragraph, i) => (
              <p key={`outro-${i}`} className="mt-4 text-neutral-600 leading-normal">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      );

    case "beforeAfter":
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content">
            <SectionHeading headline={section.heading} align="center" className="mx-auto" />
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                <p className="text-sm font-semibold text-neutral-500">{section.beforeLabel}</p>
                <ul className="mt-4 space-y-2.5">
                  {section.beforeItems?.map((item) => (
                    <li key={item} className="text-sm text-neutral-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary-200 bg-primary-50/40 p-6">
                <p className="text-sm font-semibold text-primary-700">{section.afterLabel}</p>
                <ul className="mt-4 space-y-2.5">
                  {section.afterItems?.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-neutral-800">
                      <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {section.message ? <p className="mx-auto mt-8 max-w-2xl text-center text-lg font-semibold text-neutral-900">{section.message}</p> : null}
          </div>
        </section>
      );

    case "cardGrid": {
      const cols = (section.cards?.length ?? 0) >= 6 ? "sm:grid-cols-2 lg:grid-cols-3" : (section.cards?.length ?? 0) >= 4 ? "sm:grid-cols-2" : "sm:grid-cols-2 lg:grid-cols-3";
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content">
            <SectionHeading headline={section.heading} align="center" className="mx-auto" />
            {section.body?.map((paragraph, i) => (
              <p key={i} className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">
                {paragraph}
              </p>
            ))}
            <div className={`mt-10 grid grid-cols-1 gap-5 ${cols}`}>
              {section.cards?.map((card) => (
                <div key={card.title} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-5">
                  <h3 className="text-base font-semibold text-neutral-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{card.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case "arrowChain":
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content max-w-4xl">
            <SectionHeading headline={section.heading} align="center" className="mx-auto" />
            {section.body?.map((paragraph, i) => (
              <p key={i} className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">
                {paragraph}
              </p>
            ))}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-3">
              {section.items?.map((item, i) => (
                <span key={item} className="flex items-center gap-2">
                  <span className="rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700">
                    {item}
                  </span>
                  {i < (section.items?.length ?? 0) - 1 ? (
                    <ArrowRight aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-neutral-400 rtl:rotate-180" />
                  ) : null}
                </span>
              ))}
            </div>
            {section.outro?.map((paragraph, i) => (
              <p key={`outro-${i}`} className="mt-4 text-center text-neutral-600 leading-normal">
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      );

    case "timeline":
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content">
            <SectionHeading headline={section.heading} align="center" className="mx-auto" />
            {section.body?.map((paragraph, i) => (
              <p key={i} className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">
                {paragraph}
              </p>
            ))}
            <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {section.steps?.map((step, i) => (
                <li key={step.label} className="relative rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white dark:text-neutral-50">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-neutral-900">{step.label}</h3>
                  {step.body ? <p className="mt-2 text-sm leading-normal text-neutral-600">{step.body}</p> : null}
                </li>
              ))}
            </ol>
          </div>
        </section>
      );

    case "comparisonTable":
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content">
            <SectionHeading headline={section.heading} align="center" className="mx-auto" />
            <div className="mt-10">
              <SimpleComparisonTable columns={section.columns ?? []} rows={section.rows ?? []} caption={section.heading} includedLabel={includedLabel} />
            </div>
            {section.message ? <p className="mx-auto mt-8 max-w-2xl text-center text-lg font-semibold text-neutral-900">{section.message}</p> : null}
          </div>
        </section>
      );

    case "faq":
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content">
            <SectionHeading headline={section.heading} align="center" className="mx-auto" />
            <div className="mx-auto mt-10 max-w-3xl">
              <FaqAccordion items={section.faqItems ?? []} />
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
