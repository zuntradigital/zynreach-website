import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProductExperiencePageTemplate } from "@/components/templates/ProductExperiencePageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, softwareApplicationJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { productExperiencePages } from "@/lib/content/product-pages";
import { hrefToLinkKey } from "@/lib/nav-i18n";
import type { ProductExperiencePageContent, ProductPageSectionContent } from "@/types/content";

const raw = productExperiencePages.find((page) => page.slug === "contact-360")!;
const routePath = "/platform/contact-360";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "productPages.contact-360" });
  const title = t("meta.title");
  const description = t("meta.description");
  return {
    title,
    description,
    alternates: localizedAlternates(locale, routePath),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, routePath) },
  };
}

export default async function Contact360Page({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("productPages.contact-360");
  const tLinks = await getTranslations("common.links");
  const tCta = await getTranslations("common.cta");

  const sectionContents = t.raw("sections") as ProductPageSectionContent[];
  const content: ProductExperiencePageContent = {
    slug: raw.slug,
    navLabel: tLinks(hrefToLinkKey[routePath] ?? ""),
    meta: { h1: t("meta.h1"), title: t("meta.title"), description: t("meta.description") },
    hero: {
      headline: t("hero.headline"),
      subhead: t("hero.subhead"),
      tags: t.raw("hero.tags") as string[],
    },
    primaryCta: { label: tCta("startFreeTrial"), href: raw.primaryCtaHref },
    secondaryCta: { label: tCta("bookDemo"), href: raw.secondaryCtaHref },
    sections: raw.sections.map((skeleton, index) => ({ ...skeleton, ...sectionContents[index] })),
    finalCta: {
      heading: t("finalCta.heading"),
      body: t("finalCta.body"),
      primaryCta: { label: tCta("startFreeTrial"), href: raw.primaryCtaHref },
      secondaryCta: { label: tCta("bookDemo"), href: raw.secondaryCtaHref },
    },
    closingStatement: t("closingStatement"),
  };

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Product", href: "/platform" },
    { label: content.navLabel, href: routePath },
  ]);

  const softwareApp = softwareApplicationJsonLd({ name: content.meta.title, description: content.meta.description, url: routePath });

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="software-application-jsonld" data={softwareApp} />
      <ProductExperiencePageTemplate content={content} />
    </>
  );
}
