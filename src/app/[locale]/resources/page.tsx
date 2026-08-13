import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { BookOpen, Code2, FileText, Video, Newspaper, Users } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "resourcesPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/resources"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/resources") },
  };
}

const tiles = [
  { key: "blog", icon: Newspaper, linkKey: "blog", href: "/blog" },
  { key: "docs", icon: BookOpen, linkKey: "documentation", href: "/docs" },
  { key: "api", icon: Code2, linkKey: "apiReference", href: "/docs/api" },
  { key: "guides", icon: FileText, linkKey: "guidesTemplates", href: "/resources/guides" },
  { key: "webinars", icon: Video, linkKey: "webinars", href: "/resources/webinars" },
  { key: "customerStories", icon: Users, linkKey: "customerStories", href: "/customers" },
];

export default async function ResourcesHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("resourcesPage");
  const tNav = await getTranslations("common.nav");
  const tLinks = await getTranslations("common.links");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={tNav("resources")} headline={t("headline")} subhead={t("subhead")} />

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {tiles.map((tile) => (
                <li key={tile.href}>
                  <Link
                    href={tile.href}
                    className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-md"
                  >
                    <tile.icon aria-hidden="true" className="h-7 w-7 text-primary-600" strokeWidth={1.75} />
                    <h2 className="mt-4 text-lg font-semibold text-neutral-900">{tLinks(tile.linkKey)}</h2>
                    <p className="mt-2 text-sm text-neutral-600">{t(`tiles.${tile.key}.description`)}</p>
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
