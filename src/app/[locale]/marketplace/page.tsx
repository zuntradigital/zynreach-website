import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { JsonLd } from "@/components/seo/JsonLd";
import { MarketplaceCatalog, type ResolvedMarketplaceTool } from "@/components/sections/MarketplaceCatalog";
import { marketplaceToolRefs } from "@/lib/content/marketplace";
import { getMarketplaceListings } from "@/lib/services/marketplace-content";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

// Admin-curated visibility/featured/plan-gating must be reflected
// immediately (same reasoning as every other live-CMS page in this repo).
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "marketplacePage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/marketplace"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/marketplace") },
  };
}

export default async function MarketplacePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("marketplacePage");
  const tCommon = await getTranslations("common");

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Marketplace", href: "/marketplace" },
  ]);

  const listings = await getMarketplaceListings();
  const listingBySlug = new Map((listings ?? []).map((listing) => [listing.toolSlug, listing]));

  // hero.subhead is the one existing localized description-length string
  // per capability (messages/{locale}.json platformPage.detail.<slug>) —
  // reused here rather than adding a second, catalog-specific copy field
  // that would drift out of sync with the capability page's own text.
  const tools: ResolvedMarketplaceTool[] = (
    await Promise.all(
      marketplaceToolRefs.map(async (ref) => {
        const listing = listings && !listingBySlug.get(ref.slug) ? null : listingBySlug.get(ref.slug);
        if (listings && !listing) return null;

        const tDetail = await getTranslations(`platformPage.detail.${ref.slug}`);
        return {
          slug: ref.slug,
          href: ref.href,
          name: tCommon(`links.${ref.navLabelKey}` as Parameters<typeof tCommon>[0]),
          description: tDetail("hero.subhead"),
          suite: tCommon(`megaMenu.${ref.suiteHeadingKey}` as Parameters<typeof tCommon>[0]),
          featured: listing?.featured ?? false,
          minPlanTier: listing?.minPlanTier ?? "STARTER",
          order: listing?.order ?? marketplaceToolRefs.indexOf(ref),
        } satisfies ResolvedMarketplaceTool;
      })
    )
  ).filter((tool): tool is ResolvedMarketplaceTool => tool !== null);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("eyebrow")} headline={t("headline")} subhead={t("subhead")} />
        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content">
            <MarketplaceCatalog tools={tools} />
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
