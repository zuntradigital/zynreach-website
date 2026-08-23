import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Link } from "@/i18n/navigation";
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
    const url = `/guides-templates/${slug}`;
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
  const url = `/guides-templates/${raw.slug}`;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, url) },
  };
}

interface ResolvedGuide {
  slug: string;
  title: string;
  description: string;
  format: string;
  gated?: boolean;
  downloadUrl?: string;
  category?: string;
  targetAudience?: string;
  difficultyLevel?: "Beginner" | "Intermediate" | "Advanced";
  relatedSlugs?: string[];
}

export default async function GuideDetailPage({ params }: GuidePageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("resourcesLibraryPage");
  const tLinks = await getTranslations("common.links");
  const tCta = await getTranslations("common.cta");

  const liveResources = await getPublishedResources(locale);
  const liveGuide = liveResources?.guides.find((g) => g.slug === slug);

  let guide: ResolvedGuide;
  let allGuides: ResolvedGuide[];

  if (liveGuide) {
    guide = { ...liveGuide, format: t(`formats.${liveGuide.format}` as Parameters<typeof t>[0]) };
    allGuides = (liveResources?.guides ?? []).map((g) => ({ ...g, format: t(`formats.${g.format}` as Parameters<typeof t>[0]) }));
  } else if (liveResources) {
    // System B reachable and this slug genuinely isn't a published guide.
    notFound();
  } else {
    const raw = getGuide(slug);
    if (!raw) notFound();
    const resolve = (g: (typeof guides)[number]): ResolvedGuide => ({
      ...g,
      title: t(`guides.${g.slug}.title` as Parameters<typeof t>[0]),
      description: t(`guides.${g.slug}.description` as Parameters<typeof t>[0]),
      format: t(`formats.${g.format}` as Parameters<typeof t>[0]),
    });
    guide = resolve(raw);
    allGuides = guides.map(resolve);
  }

  const related = (
    guide.relatedSlugs && guide.relatedSlugs.length > 0
      ? guide.relatedSlugs.map((s) => allGuides.find((g) => g.slug === s)).filter((g): g is ResolvedGuide => Boolean(g))
      : allGuides.filter((g) => g.slug !== guide.slug && g.category && g.category === guide.category)
  ).slice(0, 3);

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Guides & Templates", href: "/guides-templates" },
    { label: guide.title, href: `/guides-templates/${guide.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content max-w-2xl py-16">
          <Breadcrumbs items={[{ label: tLinks("guidesTemplates"), href: "/guides-templates" }, { label: guide.title, href: `/guides-templates/${guide.slug}` }]} />

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="inline-block w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{guide.format}</span>
            {guide.category ? (
              <span className="inline-block w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">{guide.category}</span>
            ) : null}
            {guide.difficultyLevel ? (
              <span className="inline-block w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
                {t(`difficulty.${guide.difficultyLevel}` as Parameters<typeof t>[0])}
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-3xl font-bold text-neutral-900">{guide.title}</h1>
          <p className="mt-3 text-base text-neutral-600">{guide.description}</p>
          {guide.targetAudience ? (
            <p className="mt-3 text-sm text-neutral-500">
              <span className="font-semibold text-neutral-700">{t("targetAudienceLabel")}:</span> {guide.targetAudience}
            </p>
          ) : null}

          {guide.downloadUrl ? (
            <div className="mt-10 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <h2 className="text-lg font-semibold text-neutral-900">{t("getThisAsset", { format: guide.format.toLowerCase() })}</h2>
              {guide.gated === false ? (
                // Knowledge Center §8.6: gating is admin-controlled per asset
                // — an explicitly ungated Resource with a file attached
                // downloads directly, no lead-capture form.
                <a
                  href={guide.downloadUrl}
                  download
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  {t("downloadNow")}
                </a>
              ) : (
                <>
                  <p className="mt-1 text-sm text-neutral-500">{t("guideAccessPrompt")}</p>
                  <div className="mt-4">
                    <LeadCaptureStrip headline={t("sendMeDownload")} source={`guide-${guide.slug}`} collectBusinessDetails />
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="mt-10 rounded-xl border border-neutral-200 p-6">
              <h2 className="text-lg font-semibold text-neutral-900">{t("mainContentHeading")}</h2>
              <p className="mt-2 text-sm leading-normal text-neutral-600">{guide.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/demo"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700"
                >
                  {tCta("bookDemo")}
                </Link>
                <Link
                  href="/trial"
                  className="inline-flex min-h-11 items-center justify-center rounded-lg border border-neutral-300 px-5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
                >
                  {tCta("startFreeTrial")}
                </Link>
              </div>
            </div>
          )}

          {related.length > 0 ? (
            <section className="mt-16 border-t border-neutral-200 pt-10">
              <h2 className="text-lg font-semibold text-neutral-900">{t("relatedContentHeading")}</h2>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/guides-templates/${r.slug}`}
                      className="block h-full rounded-lg border border-neutral-200 p-4 hover:border-primary-300 hover:shadow-md"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">{r.format}</span>
                      <p className="mt-1 text-sm font-medium text-neutral-900">{r.title}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
