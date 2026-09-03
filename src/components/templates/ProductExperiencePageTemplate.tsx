import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { CtaBand } from "@/components/sections/CtaBand";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SimpleComparisonTable } from "@/components/ui/SimpleComparisonTable";
import type { ProductExperiencePageContent, ProductPageSectionContent, ProductPageSectionSkeleton } from "@/types/content";

interface ProductExperiencePageTemplateProps {
  content: ProductExperiencePageContent;
}

type Section = ProductPageSectionSkeleton & ProductPageSectionContent;

/**
 * Shared template for the 4 rich "Product Experience" platform pages
 * (Marketing Automation, Lead Generation, Sales Pipeline, Contact 360).
 * Structurally the sibling of `CompanySizeSolutionPageTemplate` — same
 * index-matched skeleton/content split, same section-kind switch — with
 * one addition (`kpiGrid`) to cover the stat dashboards, data tables, and
 * AI-insight callouts these product pages use in place of Solutions'
 * FAQ sections. See `ProductPageSectionContent` in src/types/content.ts
 * for the per-kind field contract.
 */
export function ProductExperiencePageTemplate({ content }: ProductExperiencePageTemplateProps) {
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
                { label: tNav("platform"), href: "/platform" },
                { label: content.navLabel, href: `/platform/${content.slug}` },
              ]}
            />
          }
          actions={
            <>
              <Button
                href={content.primaryCta.href}
                variant="primary"
                size="lg"
                analyticsId={`platform-${content.slug}-hero-primary`}
                analyticsLocation={`platform-${content.slug}-hero`}
              >
                {content.primaryCta.label}
              </Button>
              <Button
                href={content.secondaryCta.href}
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
                analyticsId={`platform-${content.slug}-hero-secondary`}
                analyticsLocation={`platform-${content.slug}-hero`}
              >
                {content.secondaryCta.label}
              </Button>
            </>
          }
        />

        {content.hero.tags?.length ? (
          <section className="border-b border-neutral-200 bg-white dark:bg-neutral-100 py-6">
            <ul className="container-content flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-center">
              {content.hero.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-neutral-600"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {content.sections.map((section, index) => (
          <ProductPageSection key={section.id} section={section} tone={index % 2 === 0 ? "white" : "neutral"} includedLabel={t("included")} />
        ))}

        <CtaBand
          headline={content.finalCta.heading}
          body={content.finalCta.body}
          ctaPrimary={content.primaryCta}
          ctaSecondary={content.secondaryCta}
          analyticsLocation={`platform-${content.slug}-final-cta`}
        />

        <section className="bg-footer py-16">
          <div className="container-content max-w-3xl text-center">
            <p className="text-sm font-semibold tracking-wide text-primary-400 uppercase">{content.closingStatement}</p>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}

function ProductPageSection({ section, tone, includedLabel }: { section: Section; tone: "white" | "neutral"; includedLabel: string }) {
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
                {section.list.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
                    <Check aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      );

    case "beforeAfter":
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content">
            <SectionHeading headline={section.heading} align="center" className="mx-auto" />
            {section.body?.map((paragraph, i) => (
              <p key={i} className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">
                {paragraph}
              </p>
            ))}
            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                <p className="text-sm font-semibold text-neutral-500">{section.beforeLabel}</p>
                <ul className="mt-4 space-y-2.5">
                  {section.beforeItems?.map((item, i) => (
                    <li key={i} className="text-sm text-neutral-600">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary-200 bg-primary-50/40 p-6">
                <p className="text-sm font-semibold text-primary-700">{section.afterLabel}</p>
                <ul className="mt-4 space-y-2.5">
                  {section.afterItems?.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-neutral-800">
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
      const count = section.cards?.length ?? 0;
      const cols = count >= 4 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2";
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
              {section.cards?.map((card, i) => (
                <div key={i} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-5">
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
                <span key={i} className="flex items-center gap-2">
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
            <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {section.steps?.map((step, i) => (
                <li key={i} className="relative rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-5">
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

    case "kpiGrid":
      return (
        <section className={`${bg} py-14 sm:py-16`}>
          <div className="container-content">
            <SectionHeading headline={section.heading} align="center" className="mx-auto" />
            {section.body?.map((paragraph, i) => (
              <p key={i} className="mx-auto mt-4 max-w-2xl text-center text-neutral-600">
                {paragraph}
              </p>
            ))}
            {section.kpis?.length ? (
              <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {section.kpis.map((kpi, i) => (
                  <div key={i} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-5 text-center">
                    <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">{kpi.label}</dt>
                    <dd className="mt-1.5 text-2xl font-bold tabular-nums text-neutral-900">{kpi.value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}
            {section.columns?.length && section.rows?.length ? (
              <div className={section.kpis?.length ? "mt-8" : "mt-10"}>
                <SimpleComparisonTable columns={section.columns} rows={section.rows} caption={section.heading} includedLabel={includedLabel} />
              </div>
            ) : null}
            {section.note ? (
              <div className="mx-auto mt-8 max-w-2xl rounded-xl border border-primary-200 bg-primary-50/40 p-5">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-700">
                  <Sparkles aria-hidden="true" className="h-4 w-4" />
                  {section.note.label}
                </p>
                <p className="mt-2 text-sm leading-normal text-neutral-700">{section.note.body}</p>
              </div>
            ) : null}
          </div>
        </section>
      );

    default:
      return null;
  }
}
