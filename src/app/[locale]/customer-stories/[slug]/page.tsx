import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Quote } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { customerStories, getCustomerStory } from "@/lib/content/customer-stories";
import { getPublishedCustomerStory, getPublishedCustomerStories } from "@/lib/services/customer-stories-content";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { industryToLinkKey, productAreaToLinkKey, hrefToLinkKey } from "@/lib/nav-i18n";
import { capabilityPages } from "@/lib/content/capabilities";

export const revalidate = 0;

interface StoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return customerStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const liveStory = await getPublishedCustomerStory(locale, slug);
  const url = `/customer-stories/${slug}`;

  if (liveStory) {
    return {
      title: liveStory.seoTitle || liveStory.customerName,
      description: liveStory.seoDescription || liveStory.results,
      alternates: localizedAlternates(locale, url),
      openGraph: { ...openGraphDefaults(locale), title: `${liveStory.customerName} + ZynReach`, description: liveStory.seoDescription || liveStory.results, url: localizedUrl(locale, url) },
    };
  }

  const raw = getCustomerStory(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "customerStoriesPage.stories" });
  const customerName = t(`${raw.slug}.customerName` as Parameters<typeof t>[0]);
  const result = t(`${raw.slug}.result` as Parameters<typeof t>[0]);
  return {
    // No "+ ZynReach" here — the root layout's title template already
    // appends " — ZynReach" to every <title>; adding it here too produced
    // "Northwind Traders + ZynReach — ZynReach" in the rendered tab/SERP.
    title: customerName,
    description: result,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title: `${customerName} + ZynReach`, description: result, url: localizedUrl(locale, url) },
  };
}

export default async function CustomerStoryPage({ params }: StoryPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tPage = await getTranslations("customerStoriesPage");
  const tLinks = await getTranslations("common.links");
  const tCta = await getTranslations("common.cta");

  const liveStory = await getPublishedCustomerStory(locale, slug);

  const capabilityLabel = (capSlug: string) => {
    const key = hrefToLinkKey[`/platform/${capSlug}`];
    if (key) return tLinks(key as Parameters<typeof tLinks>[0]);
    return capabilityPages.find((p) => p.slug === capSlug)?.meta.h1 ?? capSlug;
  };

  let story: {
    slug: string;
    customerName: string;
    headlineMetric: { value: string; label: string } | null;
    industryLabel: string;
    productAreaLabels: string[];
    companySize: string | null;
    country: string | null;
    challenge: string;
    solution: string;
    result: string;
    metrics: { label: string; value: string }[];
    quote: { text: string; authorName: string; authorTitle: string } | null;
    relatedCapabilities: { label: string; href: string }[];
    logoUrl: string | null;
    photoUrl: string | null;
    staticImage: string | null;
  };

  if (liveStory) {
    story = {
      slug: liveStory.slug,
      customerName: liveStory.customerName,
      headlineMetric: liveStory.metrics[0] ? { value: liveStory.metrics[0].value, label: liveStory.metrics[0].label } : null,
      industryLabel: industryToLinkKey[liveStory.industry] ? tLinks(industryToLinkKey[liveStory.industry] as Parameters<typeof tLinks>[0]) : liveStory.industry,
      productAreaLabels: liveStory.relatedCapabilitySlugs.map(capabilityLabel),
      companySize: liveStory.companySize,
      country: liveStory.country,
      challenge: liveStory.challenge,
      solution: liveStory.solution,
      result: liveStory.results,
      metrics: liveStory.metrics,
      quote: liveStory.testimonialQuote
        ? { text: liveStory.testimonialQuote, authorName: liveStory.testimonialName ?? liveStory.customerName, authorTitle: liveStory.testimonialTitle ?? "" }
        : null,
      relatedCapabilities: liveStory.relatedCapabilitySlugs.map((capSlug) => ({ label: capabilityLabel(capSlug), href: `/platform/${capSlug}` })),
      logoUrl: liveStory.customerLogo?.url ?? null,
      photoUrl: liveStory.testimonialPhoto?.url ?? null,
      staticImage: null,
    };
  } else {
    const liveStories = await getPublishedCustomerStories(locale);
    if (liveStories) {
      // System B reachable and this slug genuinely isn't a published story.
      notFound();
    }
    const raw = getCustomerStory(slug);
    if (!raw) notFound();

    const t = await getTranslations(`customerStoriesPage.stories.${raw.slug}`);
    story = {
      slug: raw.slug,
      customerName: `${t("customerName")} ${tPage("illustrativeSuffix")}`,
      headlineMetric: { ...raw.headlineMetric, label: t("headlineMetricLabel") },
      industryLabel: industryToLinkKey[raw.industry] ? tLinks(industryToLinkKey[raw.industry] as Parameters<typeof tLinks>[0]) : raw.industry,
      productAreaLabels: [productAreaToLinkKey[raw.productArea] ? tLinks(productAreaToLinkKey[raw.productArea] as Parameters<typeof tLinks>[0]) : raw.productArea],
      companySize: raw.companySize,
      country: null,
      challenge: t("challenge"),
      solution: t("solution"),
      result: t("result"),
      metrics: [],
      quote: { text: t("quoteText"), authorName: t("authorName"), authorTitle: t("authorTitle") },
      relatedCapabilities: raw.relatedCapabilities.map((cap) => ({ label: hrefToLinkKey[cap.href] ? tLinks(hrefToLinkKey[cap.href] as Parameters<typeof tLinks>[0]) : cap.label, href: cap.href })),
      logoUrl: null,
      photoUrl: null,
      staticImage: raw.image,
    };
  }

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Customer Stories", href: "/customer-stories" },
    { label: story.customerName, href: `/customer-stories/${story.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden bg-footer py-20">
          {story.staticImage ? (
            <>
              <Image src={story.staticImage} alt="" fill priority sizes="100vw" className="absolute inset-0 object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-footer/75" />
            </>
          ) : null}
          <div className="container-content relative">
            <Breadcrumbs
              items={[
                { label: tLinks("customerStories"), href: "/customer-stories" },
                { label: story.customerName, href: `/customer-stories/${story.slug}` },
              ]}
              className="text-white/60"
            />
            <div className="mt-6 flex items-center gap-3">
              {story.logoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={story.logoUrl} alt="" className="h-10 w-10 rounded bg-white object-contain p-1" />
              ) : null}
              <p className="text-lg font-medium text-white/80">{story.customerName}</p>
            </div>
            {story.headlineMetric ? (
              <>
                <p className="mt-2 text-5xl font-bold text-white">{story.headlineMetric.value}</p>
                <p className="mt-1 text-lg text-primary-300 dark:text-primary-600">{story.headlineMetric.label}</p>
              </>
            ) : null}
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-white/60">
              <span>{story.industryLabel}</span>
              {story.productAreaLabels.map((label) => (
                <span key={label} className="flex items-center gap-3">
                  <span aria-hidden="true">·</span>
                  {label}
                </span>
              ))}
              {story.companySize ? (
                <span className="flex items-center gap-3">
                  <span aria-hidden="true">·</span>
                  {story.companySize}
                </span>
              ) : null}
              {story.country ? (
                <span className="flex items-center gap-3">
                  <span aria-hidden="true">·</span>
                  {story.country}
                </span>
              ) : null}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content max-w-2xl space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{tPage("detail.challenge")}</h2>
              <p className="mt-3 text-base leading-normal text-neutral-700">{story.challenge}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{tPage("detail.solution")}</h2>
              <p className="mt-3 text-base leading-normal text-neutral-700">{story.solution}</p>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900">{tPage("detail.result")}</h2>
              <p className="mt-3 text-base leading-normal text-neutral-700">{story.result}</p>
            </div>

            {story.metrics.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{tPage("detail.metrics")}</h2>
                <dl className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-3">
                  {story.metrics.map((metric) => (
                    <div key={metric.label} className="rounded-lg border border-neutral-200 p-4">
                      <dd className="text-2xl font-bold text-primary-600">{metric.value}</dd>
                      <dt className="mt-1 text-sm text-neutral-600">{metric.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            ) : null}

            {story.quote ? (
              <blockquote className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                <Quote aria-hidden="true" className="h-6 w-6 text-primary-300" />
                <p className="mt-3 text-lg font-medium text-neutral-900">&ldquo;{story.quote.text}&rdquo;</p>
                <div className="mt-3 flex items-center gap-3">
                  {story.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={story.photoUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
                  ) : null}
                  <p className="text-sm text-neutral-500">
                    {story.quote.authorTitle} &middot; {story.customerName}
                  </p>
                </div>
              </blockquote>
            ) : null}

            {story.relatedCapabilities.length > 0 ? (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{tPage("detail.relatedCapabilities")}</h2>
                <div className="mt-3 flex flex-wrap gap-3">
                  {story.relatedCapabilities.map((cap) => (
                    <Link
                      key={cap.href}
                      href={cap.href}
                      className="rounded-full border border-neutral-200 bg-white dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:text-primary-600"
                    >
                      {cap.label}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <CtaBand
          headline={tPage("detailCtaBand.headline")}
          body={tPage("detailCtaBand.body")}
          ctaPrimary={{ label: tCta("bookDemo"), href: "/demo" }}
          ctaSecondary={{ label: tCta("startFreeTrial"), href: "/trial" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
