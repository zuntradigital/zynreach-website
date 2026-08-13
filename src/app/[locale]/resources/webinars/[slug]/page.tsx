import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { webinars, getWebinar } from "@/lib/content/resources";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedResources } from "@/lib/services/resources-content";

// Resources is admin-direct-edit with no publish step (see ZynReach
// Admin's PATCH /api/admin/resources/[id] docstring) — a content edit
// must be visible immediately, so unlike time-based ISR this route is
// always dynamically rendered.
export const revalidate = 0;

interface WebinarPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return webinars.map((webinar) => ({ slug: webinar.slug }));
}

export async function generateMetadata({ params }: WebinarPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const liveResources = await getPublishedResources(locale);
  const liveWebinar = liveResources?.webinars.find((w) => w.slug === slug);
  if (liveWebinar) {
    const url = `/resources/webinars/${slug}`;
    return {
      title: liveWebinar.title,
      description: liveWebinar.description,
      alternates: localizedAlternates(locale, url),
      openGraph: { ...openGraphDefaults(locale), title: liveWebinar.title, description: liveWebinar.description, url: localizedUrl(locale, url) },
    };
  }
  if (liveResources) return {};

  const raw = getWebinar(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "resourcesLibraryPage.webinars" });
  const title = t(`${raw.slug}.title` as Parameters<typeof t>[0]);
  const description = t(`${raw.slug}.description` as Parameters<typeof t>[0]);
  const url = `/resources/webinars/${raw.slug}`;
  return {
    title,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, url) },
  };
}

export default async function WebinarDetailPage({ params }: WebinarPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("resourcesLibraryPage");
  const tLinks = await getTranslations("common.links");

  const liveResources = await getPublishedResources(locale);
  const liveWebinar = liveResources?.webinars.find((w) => w.slug === slug);

  let webinar: { slug: string; title: string; description: string; date: string; speaker: string };
  if (liveWebinar) {
    webinar = liveWebinar;
  } else if (liveResources) {
    notFound();
  } else {
    const raw = getWebinar(slug);
    if (!raw) notFound();
    webinar = {
      ...raw,
      title: t(`webinars.${raw.slug}.title` as Parameters<typeof t>[0]),
      description: t(`webinars.${raw.slug}.description` as Parameters<typeof t>[0]),
      speaker: t(`webinars.${raw.slug}.speaker` as Parameters<typeof t>[0]),
    };
  }

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Webinars", href: "/resources/webinars" },
    { label: webinar.title, href: `/resources/webinars/${webinar.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content max-w-2xl py-16">
          <Breadcrumbs items={[{ label: tLinks("webinars"), href: "/resources/webinars" }, { label: webinar.title, href: `/resources/webinars/${webinar.slug}` }]} />
          <h1 className="mt-6 text-3xl font-bold text-neutral-900">{webinar.title}</h1>
          <p className="mt-3 flex items-center gap-1.5 text-sm text-neutral-500">
            <Calendar aria-hidden="true" className="h-4 w-4" />
            {webinar.date} &middot; {webinar.speaker}
          </p>
          <p className="mt-4 text-base text-neutral-600">{webinar.description}</p>

          <div className="mt-10 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">{t("watchOnDemand")}</h2>
            <p className="mt-1 text-sm text-neutral-500">{t("webinarAccessPrompt")}</p>
            <div className="mt-4">
              <LeadCaptureStrip headline={t("sendMeRecording")} source={`webinar-${webinar.slug}`} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
