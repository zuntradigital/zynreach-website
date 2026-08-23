import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { industryPages, getIndustryPage } from "@/lib/content/industries";
import { IndustryPageTemplate } from "@/components/templates/IndustryPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { hrefToLinkKey } from "@/lib/nav-i18n";
import type { IndustryPageContent } from "@/types/content";

const slugToCardKey: Record<string, string> = {
  healthcare: "healthcare",
  education: "education",
  "real-estate": "realEstate",
  automotive: "automotive",
  manufacturing: "manufacturing",
};

interface IndustryPageProps {
  params: Promise<{ locale: string; industry: string }>;
}

export function generateStaticParams() {
  return industryPages.map((page) => ({ industry: page.slug }));
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { locale, industry } = await params;
  const raw = getIndustryPage(industry);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "industriesPage.detail" });
  const title = t(`${raw.slug}.hero.headline` as Parameters<typeof t>[0]);
  const description = t(`${raw.slug}.hero.subhead` as Parameters<typeof t>[0]);
  const url = `/industries/${raw.slug}`;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, url) },
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { locale, industry } = await params;
  setRequestLocale(locale);

  const raw = getIndustryPage(industry);
  if (!raw) notFound();

  const t = await getTranslations("industriesPage.detail");
  const tLinks = await getTranslations("common.links");

  const cardKey = slugToCardKey[raw.slug] ?? "";
  const navLabel = tLinks(cardKey);
  const workflowSteps = t.raw(`${raw.slug}.workflowSteps`) as string[];
  const calloutLabels = raw.capabilityCallouts.map((c) => tLinks(hrefToLinkKey[c.href] ?? ""));

  const content: IndustryPageContent = {
    ...raw,
    navLabel,
    hero: { headline: t(`${raw.slug}.hero.headline`), subhead: t(`${raw.slug}.hero.subhead`) },
    workflowSteps,
    capabilityCallouts: raw.capabilityCallouts.map((c, i) => ({
      ...c,
      label: calloutLabels[i],
      description: t(`${raw.slug}.callouts.${i}`),
    })),
    useCaseNote: t(`${raw.slug}.useCaseNote`),
    complianceNote: t(`${raw.slug}.complianceNote`),
  };

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Industries", href: "/industries" },
    { label: raw.navLabel, href: `/industries/${raw.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <IndustryPageTemplate content={content} />
    </>
  );
}
