import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompanySizeSolutionPageTemplate } from "@/components/templates/CompanySizeSolutionPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, faqPageJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { companySizeSolutionPages } from "@/lib/content/company-size-solutions";
import { hrefToLinkKey } from "@/lib/nav-i18n";
import type { CompanySizeSolutionPageContent, CompanySizeSectionContent, FaqItem } from "@/types/content";

const raw = companySizeSolutionPages.find((page) => page.slug === "enterprise")!;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "companySizeSolutions.enterprise" });
  const url = "/solutions/enterprise";
  const title = t("meta.title");
  const description = t("meta.description");
  return {
    title,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, url) },
  };
}

export default async function EnterpriseSolutionPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("companySizeSolutions.enterprise");
  const tLinks = await getTranslations("common.links");
  const tCta = await getTranslations("common.cta");

  const sectionContents = t.raw("sections") as CompanySizeSectionContent[];
  const content: CompanySizeSolutionPageContent = {
    slug: raw.slug,
    navLabel: tLinks(hrefToLinkKey["/solutions/enterprise"] ?? ""),
    meta: { h1: t("meta.h1"), title: t("meta.title"), description: t("meta.description") },
    hero: {
      headline: t("hero.headline"),
      subhead: t("hero.subhead"),
      supportingStatement: t("hero.supportingStatement"),
      microCopy: t.raw("hero.microCopy") as string[],
    },
    primaryCta: { label: tCta("bookDemo"), href: raw.primaryCtaHref },
    secondaryCta: { label: tCta("talkToSales"), href: raw.secondaryCtaHref },
    sections: raw.sections.map((skeleton, index) => ({ ...skeleton, ...sectionContents[index] })),
    finalCta: {
      heading: t("finalCta.heading"),
      body: t("finalCta.body"),
      primaryCta: { label: tCta("bookDemo"), href: raw.primaryCtaHref },
      secondaryCta: { label: tCta("talkToSales"), href: raw.secondaryCtaHref },
      supportingText: t("finalCta.supportingText"),
    },
    brandClosing: {
      heading: t("brandClosing.heading"),
      body: t("brandClosing.body"),
      tagline: t("brandClosing.tagline"),
    },
  };

  const faqSection = sectionContents.find((section) => Array.isArray(section.faqItems));
  const faqs = (faqSection?.faqItems ?? []) as FaqItem[];

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: content.navLabel, href: "/solutions/enterprise" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      {faqs.length ? <JsonLd id="faq-page-jsonld" data={faqPageJsonLd(faqs)} /> : null}
      <CompanySizeSolutionPageTemplate content={content} />
    </>
  );
}
