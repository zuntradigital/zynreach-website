import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { NotificationsUnsubscribeStatus } from "@/components/sections/NotificationsUnsubscribeStatus";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "notificationsUnsubscribePage" });
  return {
    title: t("headline"),
    description: t("headline"),
    alternates: localizedAlternates(locale, "/notifications/unsubscribe"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), url: localizedUrl(locale, "/notifications/unsubscribe") },
  };
}

/** Notifications Center — target of the unsubscribe link every
 * notification email includes (System B's src/lib/notifications/
 * dispatch.ts buildUnsubscribeUrl). */
export default async function NotificationsUnsubscribePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("notificationsUnsubscribePage");

  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("eyebrow")} headline={t("headline")} />
        <NotificationsUnsubscribeStatus
          messages={{
            loading: t("loading"),
            success: t("success"),
            error: t("error"),
            "missing-token": t("missingToken"),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
