import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { capabilityPages, getCapabilityPage } from "@/lib/content/capabilities";
import { CapabilityPageTemplate } from "@/components/templates/CapabilityPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, softwareApplicationJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

interface CapabilityPageProps {
  params: Promise<{ locale: string; capability: string }>;
}

export function generateStaticParams() {
  return capabilityPages.map((page) => ({ capability: page.slug }));
}

export async function generateMetadata({ params }: CapabilityPageProps): Promise<Metadata> {
  const { locale, capability } = await params;
  const content = getCapabilityPage(capability);
  if (!content) return {};

  const t = await getTranslations({ locale, namespace: `platformPage.detail.${content.slug}` as "platformPage.detail" });
  const title = t("hero.headline");
  const description = t("hero.subhead");
  const url = `/platform/${content.slug}`;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, url) },
  };
}

export default async function CapabilityPage({ params }: CapabilityPageProps) {
  const { locale, capability } = await params;
  setRequestLocale(locale);

  const content = getCapabilityPage(capability);
  if (!content) notFound();

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Platform", href: "/platform" },
    { label: content.navLabel, href: `/platform/${content.slug}` },
  ]);

  const softwareApp = softwareApplicationJsonLd({
    name: content.meta.title,
    description: content.meta.description,
    url: `/platform/${content.slug}`,
  });

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="software-application-jsonld" data={softwareApp} />
      <CapabilityPageTemplate content={content} />
    </>
  );
}
