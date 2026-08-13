import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { solutionPages, getSolutionPage } from "@/lib/content/solutions";
import { SolutionPageTemplate } from "@/components/templates/SolutionPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { hrefToLinkKey } from "@/lib/nav-i18n";
import type { SolutionPageContent } from "@/types/content";

interface SolutionPageProps {
  params: Promise<{ locale: string; persona: string }>;
}

export function generateStaticParams() {
  return solutionPages.map((page) => ({ persona: page.slug }));
}

export async function generateMetadata({ params }: SolutionPageProps): Promise<Metadata> {
  const { locale, persona } = await params;
  const raw = getSolutionPage(persona);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "solutionsPage.detail" });
  const url = `/solutions/${raw.slug}`;
  const title = t(`${raw.slug}.hero.headline` as Parameters<typeof t>[0]);
  const description = t(`${raw.slug}.hero.subhead` as Parameters<typeof t>[0]);
  return {
    title,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, url) },
  };
}

export default async function SolutionPage({ params }: SolutionPageProps) {
  const { locale, persona } = await params;
  setRequestLocale(locale);

  const raw = getSolutionPage(persona);
  if (!raw) notFound();

  const t = await getTranslations("solutionsPage.detail");
  const tLinks = await getTranslations("common.links");
  const tCta = await getTranslations("common.cta");
  const tCap = await getTranslations("capabilityGrid");

  const linkKey = hrefToLinkKey[`/solutions/${raw.slug}`] ?? "";
  const navLabel = tLinks(linkKey);
  const ctaLabelKey = raw.primaryCta.href === "/demo" ? "bookDemo" : "startFreeTrial";
  const calloutLabels = raw.capabilityCallouts.map((c) => tCap(`${hrefToLinkKey[c.href] ?? ""}.headline`));

  const content: SolutionPageContent = {
    ...raw,
    navLabel,
    hero: { headline: t(`${raw.slug}.hero.headline`), subhead: t(`${raw.slug}.hero.subhead`) },
    primaryCta: { ...raw.primaryCta, label: tCta(ctaLabelKey) },
    before: { label: t("beforeLabel"), body: t(`${raw.slug}.before`) },
    after: { label: t("afterLabel"), body: t(`${raw.slug}.after`) },
    capabilityCallouts: raw.capabilityCallouts.map((c, i) => ({
      ...c,
      label: calloutLabels[i],
      description: t(`${raw.slug}.callouts.${i}`),
    })),
    storyNote: t("storyNote"),
  };

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Solutions", href: "/solutions" },
    { label: raw.navLabel, href: `/solutions/${raw.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <SolutionPageTemplate content={content} ctaAudienceLabel={t(`${raw.slug}.audienceLabel`)} />
    </>
  );
}
