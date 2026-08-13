import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { legalPages, getLegalPage } from "@/lib/content/legal";
import { LegalPageTemplate } from "@/components/templates/LegalPageTemplate";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/content/site";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

interface LegalPageProps {
  params: Promise<{ locale: string; doc: string }>;
}

export function generateStaticParams() {
  return legalPages.map((page) => ({ doc: page.slug }));
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
  const { locale, doc } = await params;
  const raw = getLegalPage(doc);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "legalPage" });
  const title = t(`docs.${raw.slug}.title` as Parameters<typeof t>[0]);
  const effectiveVersion = t("effectiveVersion", { date: raw.effectiveDate, version: raw.version });
  const description = `${title} — ${site.name}, ${effectiveVersion}`;
  const url = `/legal/${raw.slug}`;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title: `${title} — ${site.name}`, description, url: localizedUrl(locale, url) },
  };
}

export default async function LegalPage({ params }: LegalPageProps) {
  const { locale, doc } = await params;
  setRequestLocale(locale);

  const content = getLegalPage(doc);
  if (!content) notFound();

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: content.navLabel, href: `/legal/${content.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <LegalPageTemplate content={content} />
    </>
  );
}
