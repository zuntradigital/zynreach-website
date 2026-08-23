import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Calendar, Clock } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { Link } from "@/i18n/navigation";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import { WebinarVideoPlayer } from "@/components/ui/WebinarVideoPlayer";
import { CountdownTimer } from "@/components/ui/CountdownTimer";
import { JsonLd } from "@/components/seo/JsonLd";
import { guides, webinars, getWebinar } from "@/lib/content/resources";
import { getPublishedResources } from "@/lib/services/resources-content";
import { getPublishedWebinarDetail } from "@/lib/services/webinars-content";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

// Webinars is admin-direct-edit with no publish step (see ZynReach
// Admin's PATCH /api/admin/webinars/[id] docstring) — a content edit
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
  const liveDetail = await getPublishedWebinarDetail(locale, slug);
  const url = `/webinars/${slug}`;

  if (liveDetail) {
    return {
      title: liveDetail.seoTitle || liveDetail.title,
      description: liveDetail.seoDescription || liveDetail.description,
      alternates: localizedAlternates(locale, url),
      openGraph: { ...openGraphDefaults(locale), title: liveDetail.title, description: liveDetail.description, url: localizedUrl(locale, url) },
    };
  }

  const raw = getWebinar(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "resourcesLibraryPage.webinars" });
  const title = t(`${raw.slug}.title` as Parameters<typeof t>[0]);
  const description = t(`${raw.slug}.description` as Parameters<typeof t>[0]);
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
  const tWebinar = await getTranslations("resourcesLibraryPage.webinarDetail");
  const tLinks = await getTranslations("common.links");

  const [liveDetail, liveResources] = await Promise.all([getPublishedWebinarDetail(locale, slug), getPublishedResources(locale)]);

  let webinar: {
    slug: string;
    title: string;
    description: string;
    gated: boolean;
    scheduledDate: string | null;
    durationMinutes: number | null;
    isOnDemand: boolean;
    videoUrl: string | null;
    speakerName: string;
    speakerTitle: string | null;
    speakerCompany: string | null;
    speakerPhotoUrl: string | null;
    agenda: string | null;
    whatYouWillLearn: string | null;
    keyTakeaways: string | null;
    category?: string;
  };

  if (liveDetail) {
    webinar = {
      slug: liveDetail.slug,
      title: liveDetail.title,
      description: liveDetail.description,
      gated: liveDetail.gated,
      scheduledDate: liveDetail.scheduledAt,
      durationMinutes: liveDetail.durationMinutes,
      isOnDemand: liveDetail.isOnDemand,
      videoUrl: liveDetail.videoUrl,
      speakerName: liveDetail.speakerName,
      speakerTitle: liveDetail.speakerTitle || null,
      speakerCompany: liveDetail.speakerCompany || null,
      speakerPhotoUrl: liveDetail.speakerPhoto?.url ?? null,
      agenda: liveDetail.agenda ?? null,
      whatYouWillLearn: liveDetail.whatYouWillLearn ?? null,
      keyTakeaways: liveDetail.keyTakeaways ?? null,
      category: liveDetail.category,
    };
  } else {
    const liveWebinar = liveResources?.webinars.find((w) => w.slug === slug);
    if (liveWebinar) {
      // Full detail endpoint didn't resolve (e.g. transient failure) but
      // the list endpoint did — fall back to that simpler shape rather
      // than a false 404.
      webinar = {
        slug: liveWebinar.slug,
        title: liveWebinar.title,
        description: liveWebinar.description,
        gated: liveWebinar.gated,
        scheduledDate: liveWebinar.date,
        durationMinutes: null,
        isOnDemand: true,
        videoUrl: null,
        speakerName: liveWebinar.speaker,
        speakerTitle: null,
        speakerCompany: null,
        speakerPhotoUrl: null,
        agenda: null,
        whatYouWillLearn: null,
        keyTakeaways: null,
        category: liveWebinar.category,
      };
    } else if (liveResources) {
      notFound();
    } else {
      const raw = getWebinar(slug);
      if (!raw) notFound();
      webinar = {
        slug: raw.slug,
        title: t(`webinars.${raw.slug}.title` as Parameters<typeof t>[0]),
        description: t(`webinars.${raw.slug}.description` as Parameters<typeof t>[0]),
        gated: raw.gated,
        scheduledDate: raw.date,
        durationMinutes: null,
        isOnDemand: true,
        videoUrl: null,
        speakerName: t(`webinars.${raw.slug}.speaker` as Parameters<typeof t>[0]),
        speakerTitle: null,
        speakerCompany: null,
        speakerPhotoUrl: null,
        agenda: null,
        whatYouWillLearn: null,
        keyTakeaways: null,
        category: raw.category,
      };
    }
  }

  const availableGuides = liveResources
    ? liveResources.guides
    : guides.map((g) => ({ ...g, title: t(`guides.${g.slug}.title` as Parameters<typeof t>[0]), description: t(`guides.${g.slug}.description` as Parameters<typeof t>[0]) }));
  const relatedGuides = webinar.category ? availableGuides.filter((g) => g.category === webinar.category).slice(0, 3) : [];
  const isUpcoming = !webinar.isOnDemand && webinar.scheduledDate;

  const speakerLine = [webinar.speakerName, webinar.speakerTitle, webinar.speakerCompany].filter(Boolean).join(" · ");
  const scheduledDateDisplay = webinar.scheduledDate ? new Date(webinar.scheduledDate).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US") : null;
  const scheduledTimeDisplay = webinar.scheduledDate
    ? new Date(webinar.scheduledDate).toLocaleTimeString(locale === "ar" ? "ar-EG" : "en-US", { hour: "2-digit", minute: "2-digit" })
    : null;

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Webinars", href: "/webinars" },
    { label: webinar.title, href: `/webinars/${webinar.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content max-w-2xl py-16">
          <Breadcrumbs items={[{ label: tLinks("webinars"), href: "/webinars" }, { label: webinar.title, href: `/webinars/${webinar.slug}` }]} />
          <span className="mt-6 inline-block w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
            {webinar.isOnDemand ? tWebinar("onDemandBadge") : tWebinar("upcomingBadge")}
          </span>
          <h1 className="mt-4 text-3xl font-bold text-neutral-900">{webinar.title}</h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-neutral-500">
            {scheduledDateDisplay ? (
              <span className="flex items-center gap-1.5">
                <Calendar aria-hidden="true" className="h-4 w-4" />
                {scheduledDateDisplay}
                {scheduledTimeDisplay ? ` · ${scheduledTimeDisplay}` : ""}
              </span>
            ) : null}
            {webinar.durationMinutes ? (
              <span className="flex items-center gap-1.5">
                <Clock aria-hidden="true" className="h-4 w-4" />
                {tWebinar("durationMinutes", { minutes: webinar.durationMinutes })}
              </span>
            ) : null}
          </div>

          {isUpcoming ? <CountdownTimer targetDate={webinar.scheduledDate as string} /> : null}

          <p className="mt-4 text-base text-neutral-600">{webinar.description}</p>

          {speakerLine ? (
            <div className="mt-6 flex items-center gap-3 rounded-lg border border-neutral-200 p-4">
              {webinar.speakerPhotoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={webinar.speakerPhotoUrl} alt="" className="h-12 w-12 rounded-full object-cover" />
              ) : null}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{tWebinar("speakerLabel")}</p>
                <p className="text-sm font-medium text-neutral-800">{speakerLine}</p>
              </div>
            </div>
          ) : null}

          {webinar.agenda ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900">{tWebinar("agendaHeading")}</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">{webinar.agenda}</p>
            </div>
          ) : null}

          {webinar.whatYouWillLearn ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900">{tWebinar("whatYouWillLearnHeading")}</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">{webinar.whatYouWillLearn}</p>
            </div>
          ) : null}

          {webinar.isOnDemand && webinar.keyTakeaways ? (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-neutral-900">{tWebinar("keyTakeawaysHeading")}</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-neutral-600">{webinar.keyTakeaways}</p>
            </div>
          ) : null}

          <div className="mt-10 rounded-xl border border-neutral-200 bg-neutral-50 p-6">
            <h2 className="text-lg font-semibold text-neutral-900">{webinar.isOnDemand ? t("watchOnDemand") : tWebinar("registerHeading")}</h2>
            {webinar.gated ? (
              <>
                <p className="mt-1 text-sm text-neutral-500">{webinar.isOnDemand ? t("webinarAccessPrompt") : tWebinar("registerPrompt")}</p>
                <div className="mt-4">
                  <LeadCaptureStrip headline={webinar.isOnDemand ? t("sendMeRecording") : tWebinar("registerCta")} source={`webinar-${webinar.slug}`} collectBusinessDetails />
                </div>
              </>
            ) : webinar.isOnDemand && webinar.videoUrl ? (
              <div className="mt-4">
                <WebinarVideoPlayer videoUrl={webinar.videoUrl} webinarSlug={webinar.slug} />
              </div>
            ) : (
              // Knowledge Center §8.6/§9.7: gating is admin-controlled per
              // asset — an explicitly ungated webinar needs no lead-capture
              // form; open access is confirmed here without a barrier.
              <p className="mt-1 text-sm text-neutral-500">{t("webinarOpenAccess")}</p>
            )}
          </div>

          {relatedGuides.length > 0 ? (
            <section className="mt-16 border-t border-neutral-200 pt-10">
              <h2 className="text-lg font-semibold text-neutral-900">{tWebinar("relatedResourcesHeading")}</h2>
              <ul className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {relatedGuides.map((g) => (
                  <li key={g.slug}>
                    <Link
                      href={`/guides-templates/${g.slug}`}
                      className="block h-full rounded-lg border border-neutral-200 p-4 hover:border-primary-300 hover:shadow-md"
                    >
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary-600">{g.format}</span>
                      <p className="mt-1 text-sm font-medium text-neutral-900">{g.title}</p>
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
