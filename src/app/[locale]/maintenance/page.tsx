import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Logo } from "@/components/layout/Logo";
import { site } from "@/lib/content/site";
import { getSiteSettings } from "@/lib/services/site-settings";

/**
 * Rendered by proxy.ts (SRS §22 Maintenance Mode) whenever the Dashboard's
 * Maintenance Mode toggle is on — every other route is rewritten here.
 * Not intended to be reached by direct navigation in normal operation, so
 * it's excluded from the sitemap and marked noindex.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "maintenancePage" });
  return {
    title: t("metaTitle"),
    robots: { index: false, follow: false },
  };
}

export default async function MaintenancePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("maintenancePage");
  const remote = await getSiteSettings();
  const body = remote?.settings.maintenanceMode.reason || t("defaultBody");
  const email = remote?.settings.contact.supportEmail || site.contact.email;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white dark:bg-neutral-50 px-6 py-20 text-center">
      <Logo />
      <h1 className="text-2xl font-semibold text-neutral-900">{t("headline")}</h1>
      <p className="max-w-md text-sm text-neutral-600">{body}</p>
      <p className="text-xs text-neutral-500">
        {t("contactPrompt", { email })}
      </p>
    </main>
  );
}
