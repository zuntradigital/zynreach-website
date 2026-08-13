import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { guides, getGuide } from "@/lib/content/resources";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedResources } from "@/lib/services/resources-content";

// Resources is admin-direct-edit with no publish step (see ZynReach
// Admin's PATCH /api/admin/resources/[id] docstring) — a content edit
// must be visible immediately, so unlike time-based ISR this route is
// always dynamically rendered.
export const revalidate = 0;

interface GuidePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: GuidePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const liveResources = await getPublishedResources(locale);
  const liveGuide = liveResources?.guides.find((g) => g.slug === slug);
  if (liveGuide) {
    const url = `/resources/guides/${slug}`;
    return {
      title: liveGuide.title,
      description: liveGuide.description,
      alternates: localizedAlternates(locale, url),
      openGraph: { ...openGraphDefaults(locale), title: liveGuide.title, description: liveGuide.description, url: localizedUrl(locale, url) },
    };
  }
  if (liveResources) return {};

  const raw = getGuide(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "resourcesLibraryPage.guides" });
  const title = t(`${raw.slug}.title` as Parameters<typeof t>[0]);
  const description = t(`${raw.slug}.description` as Parameters<typeof t>[0]);
  const url = `/resources/guides/${raw.slug}`;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, url) },
  };
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("resourcesLibraryPage");
  const tLinks = await getTranslations("common.links");

  const liveResources = await getPublishedResources(locale);
  const liveGuide = liveResources?.guides.find((g) => g.slug === slug);

  let guide: { slug: string; title: string; description: string; format: string };
  if (liveGuide) {
    guide = { ...liveGuide, format: t(`formats.${liveGuide.format}` as Parameters<typeof t>[0]) };
  } else if (liveResources) {
    // System B reachable and this slug genuinely isn't a published guide.
    notFound();
  } else {
    const raw = getGuide(slug);
    if (!raw) notFound();
    guide = {
      ...raw,
      title: t(`guides.${raw.slug}.title` as Parameters<typeof t>[0]),
      description: t(`guides.${raw.slug}.description` as Parameters<typeof t>[0]),
      format: t(`formats.${raw.format}` as Parameters<typeof t>[0]),
    };
  }

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Guides & Templates", href: "/resources/guides" },
    { label: guide.title, href: `/resources/guides/${guide.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content max-w-2xl py-16">
          <Breadcrumbs items={[{ label: tLinks("guidesTemplates"), href: "/resources/guides" }, { label: guide.title, href: `/resources/guides/${guide.slug}` }]} />
          <span className="mt-6 inline-block w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{guide.format}</span>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900">{guide.title}</h1>
          <p className="mt-3 text-base text-neutral-600">{guide.description}</p>

          <div className="mt-10 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">{t("getThisAsset", { format: guide.format.toLowerCase() })}</h2>
            <p className="mt-1 text-sm text-neutral-500">{t("guideAccessPrompt")}</p>
            <div className="mt-4">
              <LeadCaptureStrip headline={t("sendMeDownload")} source={`guide-${guide.slug}`} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
