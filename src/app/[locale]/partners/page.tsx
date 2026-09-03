import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { PartnershipTypeSelector } from "@/components/sections/PartnershipTypeSelector";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqAccordion } from "@/components/ui/FaqAccordion";
import { Button } from "@/components/ui/Button";
import { PartnerApplicationForm } from "@/components/forms/PartnerApplicationForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import type { FaqItem } from "@/types/content";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnersPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/partners"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/partners") },
  };
}

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("partnersPage");
  const tLinks = await getTranslations("common.links");
  const tForm = await getTranslations("partnerForm");

  const trustItems = t.raw("trustStrip.items") as { label: string; description: string }[];
  const whyCards = t.raw("why.cards") as { title: string; description: string }[];
  const typeItems = t.raw("types.items") as {
    title: string;
    headline: string;
    description: string;
    audienceLabel: string;
    audience: string[];
    valueLabel: string;
    value: string[];
    cta: string;
  }[];
  const storySteps = t.raw("story.steps") as { label: string; description: string }[];
  const getCategories = t.raw("whatYouGet.categories") as { title: string; items: string[] }[];
  const revenueItems = t.raw("revenue.items") as { title: string; description: string }[];
  const journeySteps = t.raw("journey.steps") as { label: string; description: string }[];
  const whoForItems = t.raw("whoFor.items") as { title: string; description: string }[];
  const useCaseItems = t.raw("useCases.items") as { title: string; chain: string[] }[];
  const faqItems = t.raw("faq.items") as FaqItem[];

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Partners", href: "/partners" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="faq-page-jsonld" data={faqPageJsonLd(faqItems)} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tLinks("partners")}
          headline={t("headline")}
          subhead={t("subhead")}
          actions={
            <>
              <Button href="#apply" variant="primary" size="lg" analyticsId="partner-hero-cta" analyticsLocation="partners-hero">
                {t("heroCtaPrimary")}
              </Button>
              <Button
                href="#types"
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
                analyticsId="partner-explore-cta"
                analyticsLocation="partners-hero"
              >
                {t("heroCtaSecondary")}
              </Button>
            </>
          }
        />

        <section className="border-b border-neutral-200 bg-white dark:bg-neutral-100 py-14">
          <div className="container-content">
            <h2 className="text-center text-xl font-bold text-neutral-900 sm:text-2xl">{t("trustStrip.headline")}</h2>
            <ul className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4">
              {trustItems.map((item) => (
                <li key={item.label} className="text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide text-primary-600">{item.label}</p>
                  <p className="mt-1.5 text-sm text-neutral-600">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("why.eyebrow")} headline={t("why.headline")} body={t("why.body")} align="center" className="mx-auto max-w-2xl" />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {whyCards.map((card) => (
                <li key={card.title} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                  <h3 className="font-semibold text-neutral-900">{card.title}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{card.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="types" className="bg-white dark:bg-neutral-100 py-16 sm:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("types.eyebrow")} headline={t("types.headline")} body={t("types.intro")} align="center" className="mx-auto max-w-2xl" />
            <div className="mt-10">
              <PartnershipTypeSelector items={typeItems} />
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="container-content max-w-4xl">
            <SectionHeading eyebrow={t("story.eyebrow")} headline={t("story.headline")} align="center" className="mx-auto" />
            <ol className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {storySteps.map((step, i) => (
                <li key={step.label} className="relative rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white dark:text-neutral-50">
                    {i + 1}
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-neutral-900">{step.label}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{step.description}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-16 sm:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("whatYouGet.eyebrow")} headline={t("whatYouGet.headline")} body={t("whatYouGet.body")} align="center" className="mx-auto max-w-2xl" />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {getCategories.map((category) => (
                <li key={category.title} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="font-semibold text-neutral-900">{category.title}</h3>
                  <ul className="mt-3 space-y-1.5">
                    {category.items.map((item) => (
                      <li key={item} className="text-sm text-neutral-600">
                        {item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("revenue.eyebrow")} headline={t("revenue.headline")} align="center" className="mx-auto max-w-2xl" />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {revenueItems.map((item, i) => (
                <li key={item.title} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">{`0${i + 1}`}</span>
                  <h3 className="mt-2 font-semibold text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{item.description}</p>
                </li>
              ))}
            </ul>
            <p className="mx-auto mt-8 max-w-2xl text-center text-lg font-semibold text-neutral-900">{t("revenue.highlight")}</p>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-16 sm:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("journey.eyebrow")} headline={t("journey.headline")} align="center" className="mx-auto max-w-2xl" />
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-4">
              {journeySteps.map((step, i) => (
                <span key={step.label} className="flex items-center gap-2">
                  <span className="rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-700">
                    {step.label}
                  </span>
                  {i < journeySteps.length - 1 ? <ArrowRight aria-hidden="true" className="h-4 w-4 flex-shrink-0 text-neutral-400 rtl:rotate-180" /> : null}
                </span>
              ))}
            </div>
            <ul className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
              {journeySteps.map((step) => (
                <li key={step.label} className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
                  <p className="text-sm font-semibold text-neutral-900">{step.label}</p>
                  <p className="mt-1 text-sm text-neutral-600">{step.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("whoFor.eyebrow")} headline={t("whoFor.headline")} align="center" className="mx-auto max-w-2xl" />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {whoForItems.map((item) => (
                <li key={item.title} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                  <h3 className="font-semibold text-neutral-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{item.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-16 sm:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("useCases.eyebrow")} headline={t("useCases.headline")} align="center" className="mx-auto max-w-2xl" />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {useCaseItems.map((useCase) => (
                <li key={useCase.title} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="font-semibold text-neutral-900">{useCase.title}</h3>
                  <ul className="mt-4 space-y-2">
                    {useCase.chain.map((step, i) => (
                      <li key={step} className="flex items-center gap-2 text-sm text-neutral-700">
                        {i > 0 ? <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 flex-shrink-0 text-neutral-400 rtl:rotate-180" /> : null}
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-16 sm:py-20">
          <div className="container-content max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-neutral-900 sm:text-3xl">{t("partnerStories.headline")}</h2>
            <p className="mt-4 text-base leading-normal text-neutral-600">{t("partnerStories.body")}</p>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-16 sm:py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("faq.eyebrow")} headline={t("faq.headline")} align="center" className="mx-auto max-w-2xl" />
            <div className="mx-auto mt-10 max-w-3xl">
              <FaqAccordion items={faqItems} />
            </div>
          </div>
        </section>

        <section className="bg-footer py-20">
          <div className="container-content flex flex-col items-center text-center">
            <h2 className="max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">{t("finalCta.headline")}</h2>
            <p className="mt-4 max-w-xl text-base leading-normal text-white/70">{t("finalCta.body")}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button href="#apply" variant="primary" size="lg" analyticsId="partner-final-cta" analyticsLocation="partners-final-cta">
                {t("finalCta.ctaPrimary")}
              </Button>
              <Button
                href="/contact"
                variant="secondary"
                size="lg"
                className="border-white/30 bg-white/5 text-white hover:bg-white/15"
                analyticsId="partner-contact-cta"
                analyticsLocation="partners-final-cta"
              >
                {t("finalCta.ctaSecondary")}
              </Button>
            </div>
          </div>
        </section>

        <section id="apply" className="bg-neutral-50 py-16 sm:py-20">
          <div className="container-content max-w-xl">
            <SectionHeading headline={tForm("headline")} align="center" className="mx-auto" />
            <div className="mt-8 rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-8 shadow-sm">
              <PartnerApplicationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
