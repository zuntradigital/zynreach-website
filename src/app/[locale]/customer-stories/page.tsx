import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { StoryFilterBar, type FilterOption } from "@/components/sections/StoryFilterBar";
import { StoryCard, type ResolvedStoryCard } from "@/components/ui/StoryCard";
import { CtaBand } from "@/components/sections/CtaBand";
import { InlineSearchForm } from "@/components/ui/InlineSearchForm";
import { Pagination } from "@/components/ui/Pagination";
import { JsonLd } from "@/components/seo/JsonLd";
import { customerStories } from "@/lib/content/customer-stories";
import { getPublishedCustomerStories } from "@/lib/services/customer-stories-content";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { hrefToLinkKey, industryToLinkKey, productAreaToLinkKey } from "@/lib/nav-i18n";
import { capabilityPages } from "@/lib/content/capabilities";

// Customer Stories is CMS-backed and direct-save (see the admin PATCH
// handler's docstring) — a content edit must be visible immediately.
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "customerStoriesPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/customer-stories"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/customer-stories") },
  };
}

const PAGE_SIZE = 9;

interface CustomerStoriesPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ industry?: string; product?: string; size?: string; page?: string }>;
}

export default async function CustomerStoriesPage({ params, searchParams }: CustomerStoriesPageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("customerStoriesPage");
  const tCta = await getTranslations("common.cta");
  const tLinks = await getTranslations("common.links");
  const query = await searchParams;

  const liveStories = await getPublishedCustomerStories(locale);

  let cards: (ResolvedStoryCard & { industryValue: string; productAreaValues: string[]; companySizeValue: string })[];

  if (liveStories) {
    const capabilityLabel = (slug: string) => {
      const key = hrefToLinkKey[`/platform/${slug}`];
      if (key) return tLinks(key as Parameters<typeof tLinks>[0]);
      return capabilityPages.find((p) => p.slug === slug)?.meta.h1 ?? slug;
    };
    cards = liveStories.map((story) => ({
      slug: story.slug,
      customerName: story.customerName,
      metricValue: story.metrics[0]?.value ?? "",
      metricLabel: story.metrics[0]?.label ?? "",
      industryLabel: industryToLinkKey[story.industry] ? tLinks(industryToLinkKey[story.industry] as Parameters<typeof tLinks>[0]) : story.industry,
      productAreaLabels: story.relatedCapabilitySlugs.map(capabilityLabel),
      industryValue: story.industry,
      productAreaValues: story.relatedCapabilitySlugs,
      companySizeValue: story.companySize ?? "",
    }));
  } else {
    cards = customerStories.map((story) => ({
      slug: story.slug,
      customerName: story.customerName,
      metricValue: story.headlineMetric.value,
      metricLabel: story.headlineMetric.label,
      industryLabel: industryToLinkKey[story.industry] ? tLinks(industryToLinkKey[story.industry] as Parameters<typeof tLinks>[0]) : story.industry,
      productAreaLabels: [productAreaToLinkKey[story.productArea] ? tLinks(productAreaToLinkKey[story.productArea] as Parameters<typeof tLinks>[0]) : story.productArea],
      industryValue: story.industry,
      productAreaValues: [story.productArea],
      companySizeValue: story.companySize,
    }));
  }

  const industries: FilterOption[] = Array.from(new Map(cards.map((c) => [c.industryValue, c.industryLabel])).entries())
    .filter(([value]) => value)
    .map(([value, label]) => ({ value, label }));
  const productAreaMap = new Map<string, string>();
  for (const card of cards) {
    card.productAreaValues.forEach((value, i) => productAreaMap.set(value, card.productAreaLabels[i] ?? value));
  }
  const productAreas: FilterOption[] = Array.from(productAreaMap.entries())
    .filter(([value]) => value)
    .map(([value, label]) => ({ value, label }));
  const companySizes: FilterOption[] = Array.from(new Set(cards.map((c) => c.companySizeValue)))
    .filter(Boolean)
    .map((value) => ({ value, label: value }));

  const filtered = cards.filter(
    (card) =>
      (!query.industry || card.industryValue === query.industry) &&
      (!query.product || card.productAreaValues.includes(query.product)) &&
      (!query.size || card.companySizeValue === query.size)
  );

  const currentPage = Math.max(1, Number(query.page) || 1);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageCards = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const paginationBasePath = (() => {
    const params = new URLSearchParams();
    if (query.industry) params.set("industry", query.industry);
    if (query.product) params.set("product", query.product);
    if (query.size) params.set("size", query.size);
    const qs = params.toString();
    return qs ? `/customer-stories?${qs}` : "/customer-stories";
  })();

  const proofStats = cards.slice(0, 3).filter((card) => card.metricValue);

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Customer Stories", href: "/customer-stories" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("eyebrow")} headline={t("headline")} subhead={t("subhead")} />

        {proofStats.length > 0 ? (
          <section className="border-b border-neutral-200 bg-neutral-50 py-12">
            <div className="container-content">
              <ul className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                {proofStats.map((stat) => (
                  <li key={stat.slug} className="text-center">
                    <p className="text-3xl font-bold text-primary-600">{stat.metricValue}</p>
                    <p className="mt-1 text-sm text-neutral-600">{stat.metricLabel}</p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content">
            <div className="max-w-xl">
              <InlineSearchForm placeholder={t("searchPlaceholder")} ariaLabel={t("searchLabel")} />
            </div>

            <div className="mt-6">
              <Suspense fallback={<div className="h-16" />}>
                <StoryFilterBar industries={industries} productAreas={productAreas} companySizes={companySizes} />
              </Suspense>
            </div>

            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pageCards.map((card) => (
                <li key={card.slug}>
                  <StoryCard story={card} />
                </li>
              ))}
            </ul>

            {filtered.length === 0 ? (
              <p className="mt-8 text-sm text-neutral-500">{t("noStories")}</p>
            ) : (
              <Pagination currentPage={currentPage} totalPages={totalPages} basePath={paginationBasePath} />
            )}
          </div>
        </section>

        <CtaBand
          headline={t("ctaBand.headline")}
          body={t("ctaBand.body")}
          ctaPrimary={{ label: tCta("bookDemo"), href: "/demo" }}
          ctaSecondary={{ label: tCta("startFreeTrial"), href: "/trial" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
