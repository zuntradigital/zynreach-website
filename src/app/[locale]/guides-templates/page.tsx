import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FileText } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { guides as hardcodedGuides } from "@/lib/content/resources";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedResources } from "@/lib/services/resources-content";
import type { Guide } from "@/types/content";

// Resources is admin-direct-edit with no publish step (see ZynReach
// Admin's PATCH /api/admin/resources/[id] docstring) — a content edit
// must be visible immediately, so unlike time-based ISR this route is
// always dynamically rendered.
export const revalidate = 0;

const CONTENT_TYPE_ORDER = ["Guide", "Template", "Checklist", "Playbook"] as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resourcesLibraryPage" });
  return {
    title: t("guidesHeadline"),
    description: t("guidesSubhead"),
    alternates: localizedAlternates(locale, "/guides-templates"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: t("guidesHeadline"),
      description: t("guidesSubhead"),
      url: localizedUrl(locale, "/guides-templates"),
    },
  };
}

export default async function GuidesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("resourcesLibraryPage");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Knowledge Center", href: "/knowledge-center" },
    { label: "Guides & Templates", href: "/guides-templates" },
  ]);

  const liveResources = await getPublishedResources(locale);
  const guides: Guide[] = liveResources
    ? liveResources.guides
    : hardcodedGuides.map((g) => ({
        ...g,
        title: t(`guides.${g.slug}.title` as Parameters<typeof t>[0]),
        description: t(`guides.${g.slug}.description` as Parameters<typeof t>[0]),
      }));

  const sections = CONTENT_TYPE_ORDER.map((type) => ({
    type,
    items: guides.filter((g) => g.format === type),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("guidesEyebrow")} headline={t("guidesHeadline")} subhead={t("guidesSubhead")} />
        {sections.map((section, index) => (
          <section key={section.type} className={index % 2 === 0 ? "bg-white dark:bg-neutral-100 py-16" : "bg-neutral-50 py-16"}>
            <div className="container-content">
              <h2 className="text-xl font-bold text-neutral-900">{t(`sectionHeadings.${section.type}` as Parameters<typeof t>[0])}</h2>
              <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {section.items.map((guide) => (
                  <li key={guide.slug}>
                    <Link
                      href={`/guides-templates/${guide.slug}`}
                      className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 hover:border-primary-300 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                          {t(`formats.${guide.format}` as Parameters<typeof t>[0])}
                        </span>
                        {guide.category ? (
                          <span className="w-fit rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">{guide.category}</span>
                        ) : null}
                      </div>
                      <div className="mt-3 flex items-start gap-3">
                        <FileText aria-hidden="true" className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary-600" />
                        <div>
                          <h3 className="font-semibold text-neutral-900">{guide.title}</h3>
                          <p className="mt-1 text-sm text-neutral-600">{guide.description}</p>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
