import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Video, Calendar } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { InlineSearchForm } from "@/components/ui/InlineSearchForm";
import { CategoryFilterBar, type CategoryOption } from "@/components/ui/CategoryFilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { JsonLd } from "@/components/seo/JsonLd";
import { webinars as hardcodedWebinars } from "@/lib/content/resources";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedResources } from "@/lib/services/resources-content";
import type { Webinar } from "@/types/content";

// Resources is admin-direct-edit with no publish step (see ZynReach
// Admin's PATCH /api/admin/resources/[id] docstring) — a content edit
// must be visible immediately, so unlike time-based ISR this route is
// always dynamically rendered.
export const revalidate = 0;

const PAGE_SIZE = 6;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resourcesLibraryPage" });
  return {
    title: t("webinarsHeadline"),
    description: t("webinarsSubhead"),
    alternates: localizedAlternates(locale, "/webinars"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: t("webinarsHeadline"),
      description: t("webinarsSubhead"),
      url: localizedUrl(locale, "/webinars"),
    },
  };
}

interface WebinarsPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function WebinarsPage({ params, searchParams }: WebinarsPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("resourcesLibraryPage");
  const query = await searchParams;
  const activeCategory = query.category;
  const currentPage = Math.max(1, Number(query.page) || 1);

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Knowledge Center", href: "/knowledge-center" },
    { label: "Webinars", href: "/webinars" },
  ]);

  const liveResources = await getPublishedResources(locale);
  const webinars: Webinar[] = liveResources
    ? liveResources.webinars
    : hardcodedWebinars.map((w) => ({
        ...w,
        title: t(`webinars.${w.slug}.title` as Parameters<typeof t>[0]),
        description: t(`webinars.${w.slug}.description` as Parameters<typeof t>[0]),
        speaker: t(`webinars.${w.slug}.speaker` as Parameters<typeof t>[0]),
      }));

  const featured = webinars.find((w) => w.featured);
  const filterable = webinars.filter((w) => (activeCategory ? w.category === activeCategory : true));
  const upcoming = filterable.filter((w) => !w.isOnDemand);
  const onDemand = filterable.filter((w) => w.isOnDemand);

  const categoryOptions: CategoryOption[] = Array.from(new Set(webinars.map((w) => w.category).filter((c): c is string => Boolean(c)))).map((c) => ({
    key: c,
    label: c,
  }));

  const totalPages = Math.max(1, Math.ceil(onDemand.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagedOnDemand = onDemand.slice(pageStart, pageStart + PAGE_SIZE);

  const basePath = "/webinars";
  const paginationBasePath = activeCategory ? `${basePath}?category=${encodeURIComponent(activeCategory)}` : basePath;

  function WebinarCard({ webinar }: { webinar: Webinar }) {
    return (
      <Link
        href={`/webinars/${webinar.slug}`}
        className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 hover:border-primary-300 hover:shadow-md"
      >
        <Video aria-hidden="true" className="h-7 w-7 text-primary-600" strokeWidth={1.75} />
        <h3 className="mt-3 font-semibold text-neutral-900">{webinar.title}</h3>
        <p className="mt-2 text-sm text-neutral-600">{webinar.description}</p>
        <p className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
          <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
          {webinar.date} &middot; {webinar.speaker}
        </p>
      </Link>
    );
  }

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("webinarsEyebrow")} headline={t("webinarsHeadline")} subhead={t("webinarsSubhead")} />

        {featured && !activeCategory && currentPage === 1 ? (
          <section className="border-b border-neutral-200 bg-white dark:bg-neutral-100 py-16">
            <div className="container-content">
              <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{t("featuredWebinarLabel")}</span>
              <Link
                href={`/webinars/${featured.slug}`}
                className="mt-4 grid gap-6 rounded-xl border border-neutral-200 p-8 hover:border-primary-300 hover:shadow-md lg:grid-cols-[2fr_1fr] lg:items-center"
              >
                <div>
                  <h2 className="text-2xl font-bold text-neutral-900">{featured.title}</h2>
                  <p className="mt-3 text-base text-neutral-600">{featured.description}</p>
                  <p className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
                    <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                    {featured.date} &middot; {featured.speaker}
                  </p>
                </div>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="bg-white dark:bg-neutral-100 py-10">
          <div className="container-content max-w-2xl">
            <InlineSearchForm placeholder={t("searchWebinarsPlaceholder")} ariaLabel={t("searchWebinarsPlaceholder")} />
          </div>
        </section>

        {categoryOptions.length > 0 ? (
          <section className="bg-neutral-50 py-6">
            <div className="container-content">
              <CategoryFilterBar categories={categoryOptions} activeCategory={activeCategory} basePath={basePath} />
            </div>
          </section>
        ) : null}

        {upcoming.length > 0 ? (
          <section className="bg-neutral-50 py-16">
            <div className="container-content">
              <h2 className="text-xl font-bold text-neutral-900">{t("upcomingWebinarsHeading")}</h2>
              <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcoming.map((webinar) => (
                  <li key={webinar.slug}>
                    <WebinarCard webinar={webinar} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content">
            <h2 className="text-xl font-bold text-neutral-900">{t("onDemandWebinarsHeading")}</h2>
            {pagedOnDemand.length > 0 ? (
              <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pagedOnDemand.map((webinar) => (
                  <li key={webinar.slug}>
                    <WebinarCard webinar={webinar} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-sm text-neutral-500">{t("noWebinars")}</p>
            )}
            <Pagination currentPage={currentPage} totalPages={totalPages} basePath={paginationBasePath} />
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
