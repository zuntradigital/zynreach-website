import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Video, Calendar } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { webinars as hardcodedWebinars } from "@/lib/content/resources";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedResources } from "@/lib/services/resources-content";

// Resources is admin-direct-edit with no publish step (see ZynReach
// Admin's PATCH /api/admin/resources/[id] docstring) — a content edit
// must be visible immediately, so unlike time-based ISR this route is
// always dynamically rendered.
export const revalidate = 0;

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
    alternates: localizedAlternates(locale, "/resources/webinars"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: t("webinarsHeadline"),
      description: t("webinarsSubhead"),
      url: localizedUrl(locale, "/resources/webinars"),
    },
  };
}

export default async function WebinarsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("resourcesLibraryPage");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Webinars", href: "/resources/webinars" },
  ]);

  const liveResources = await getPublishedResources(locale);
  const webinars = liveResources
    ? liveResources.webinars
    : hardcodedWebinars.map((w) => ({
        slug: w.slug,
        title: t(`webinars.${w.slug}.title` as Parameters<typeof t>[0]),
        description: t(`webinars.${w.slug}.description` as Parameters<typeof t>[0]),
        date: w.date,
        speaker: t(`webinars.${w.slug}.speaker` as Parameters<typeof t>[0]),
        gated: w.gated,
      }));

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("webinarsEyebrow")} headline={t("webinarsHeadline")} subhead={t("webinarsSubhead")} />
        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {webinars.map((webinar) => (
                <li key={webinar.slug}>
                  <Link
                    href={`/resources/webinars/${webinar.slug}`}
                    className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 hover:border-primary-300 hover:shadow-md"
                  >
                    <Video aria-hidden="true" className="h-7 w-7 text-primary-600" strokeWidth={1.75} />
                    <h2 className="mt-3 font-semibold text-neutral-900">{webinar.title}</h2>
                    <p className="mt-2 text-sm text-neutral-600">{webinar.description}</p>
                    <p className="mt-4 flex items-center gap-1.5 text-xs text-neutral-500">
                      <Calendar aria-hidden="true" className="h-3.5 w-3.5" />
                      {webinar.date} &middot; {webinar.speaker}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
