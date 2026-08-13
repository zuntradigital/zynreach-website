import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { getCurrentStatus, getIncidentHistory } from "@/lib/services/status-provider";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "statusPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/status"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/status") },
  };
}

const statusIcons = { operational: CheckCircle2, degraded: AlertTriangle, outage: XCircle };
const statusColors = { operational: "text-success", degraded: "text-warning", outage: "text-error" };
const componentKeyByName: Record<string, string> = {
  Application: "application",
  API: "api",
  "Marketing website": "website",
  "Email delivery": "email",
};

export default async function StatusPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("statusPage");
  const tLinks = await getTranslations("common.links");
  const { components, overall } = await getCurrentStatus();
  const incidents = await getIncidentHistory();
  const OverallIcon = statusIcons[overall];
  const overallLabel = t(overall);

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Status", href: "/status" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={tLinks("status")} headline={t("headline")} subhead={t("subhead")} />

        <section className="bg-white dark:bg-neutral-100 py-12">
          <div className="container-content max-w-2xl">
            <div className={`flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-5 ${statusColors[overall]}`}>
              <OverallIcon aria-hidden="true" className="h-6 w-6" />
              <p className="font-semibold">
                {t("allSystemsPrefix")} {overallLabel.toLowerCase()}
              </p>
            </div>

            <ul className="mt-8 divide-y divide-neutral-200 rounded-xl border border-neutral-200">
              {components.map((component) => {
                const Icon = statusIcons[component.status];
                const key = componentKeyByName[component.name];
                return (
                  <li key={component.name} className="flex items-center justify-between p-4">
                    <span className="text-sm font-medium text-neutral-900">
                      {key ? t(`components.${key}`) : component.name}
                    </span>
                    <span className={`flex items-center gap-1.5 text-sm ${statusColors[component.status]}`}>
                      <Icon aria-hidden="true" className="h-4 w-4" />
                      {t(component.status)}
                    </span>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10">
              <h2 className="text-lg font-semibold text-neutral-900">{t("incidentHistory")}</h2>
              {incidents.length === 0 ? (
                <p className="mt-3 text-sm text-neutral-500">{t("noIncidents")}</p>
              ) : (
                <ul className="mt-4 space-y-4">
                  {incidents.map((incident) => {
                    const hasTranslation = incident.date === "2026-06-14";
                    return (
                      <li key={incident.date} className="rounded-xl border border-neutral-200 p-5">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-neutral-900">
                            {hasTranslation ? t(`incidents.${incident.date}.title`) : incident.title}
                          </p>
                          <span className="text-xs font-semibold uppercase text-neutral-500">
                            {t(`incidentStatus.${incident.status}`)}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-neutral-500">{incident.date}</p>
                        <p className="mt-2 text-sm text-neutral-600">
                          {hasTranslation ? t(`incidents.${incident.date}.summary`) : incident.summary}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <div className="mt-10 border-t border-neutral-200 pt-8">
              <h2 className="text-lg font-semibold text-neutral-900">{t("subscribeHeading")}</h2>
              <div className="mt-4">
                <LeadCaptureStrip headline={t("subscribeButton")} source="status-subscribe" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
