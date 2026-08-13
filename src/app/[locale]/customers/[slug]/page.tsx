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
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { industryToLinkKey, productAreaToLinkKey, hrefToLinkKey } from "@/lib/nav-i18n";

interface StoryPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return customerStories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = getCustomerStory(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "customersPage.stories" });
  const customerName = t(`${raw.slug}.customerName` as Parameters<typeof t>[0]);
  const result = t(`${raw.slug}.result` as Parameters<typeof t>[0]);
  const url = `/customers/${raw.slug}`;
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

  const raw = getCustomerStory(slug);
  if (!raw) notFound();

  const t = await getTranslations(`customersPage.stories.${raw.slug}`);
  const tPage = await getTranslations("customersPage");
  const tLinks = await getTranslations("common.links");
  const tCta = await getTranslations("common.cta");

  const story = {
    ...raw,
    customerName: `${t("customerName")} ${tPage("illustrativeSuffix")}`,
    headlineMetric: { ...raw.headlineMetric, label: t("headlineMetricLabel") },
    challenge: t("challenge"),
    solution: t("solution"),
    result: t("result"),
    quote: { text: t("quoteText"), authorName: t("authorName"), authorTitle: t("authorTitle") },
  };

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Customer Stories", href: "/customers" },
    { label: story.customerName, href: `/customers/${story.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <section className="relative overflow-hidden bg-footer py-20">
          <Image src={raw.image} alt="" fill priority sizes="100vw" className="absolute inset-0 object-cover" />
          <div aria-hidden="true" className="absolute inset-0 bg-footer/75" />
          <div className="container-content relative">
            <Breadcrumbs
              items={[
                { label: tLinks("customerStories"), href: "/customers" },
                { label: story.customerName, href: `/customers/${story.slug}` },
              ]}
              className="text-white/60"
            />
            <p className="mt-6 text-lg font-medium text-white/80">{story.customerName}</p>
            <p className="mt-2 text-5xl font-bold text-white">{story.headlineMetric.value}</p>
            <p className="mt-1 text-lg text-primary-300 dark:text-primary-600">{story.headlineMetric.label}</p>
            <div className="mt-4 flex gap-3 text-sm text-white/60">
              <span>{industryToLinkKey[story.industry] ? tLinks(industryToLinkKey[story.industry] as Parameters<typeof tLinks>[0]) : story.industry}</span>
              <span aria-hidden="true">·</span>
              <span>{productAreaToLinkKey[story.productArea] ? tLinks(productAreaToLinkKey[story.productArea] as Parameters<typeof tLinks>[0]) : story.productArea}</span>
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

            <blockquote className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
              <Quote aria-hidden="true" className="h-6 w-6 text-primary-300" />
              <p className="mt-3 text-lg font-medium text-neutral-900">&ldquo;{story.quote.text}&rdquo;</p>
              <p className="mt-3 text-sm text-neutral-500">
                {story.quote.authorTitle} &middot; {story.customerName}
              </p>
            </blockquote>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">{tPage("detail.relatedCapabilities")}</h2>
              <div className="mt-3 flex flex-wrap gap-3">
                {story.relatedCapabilities.map((cap) => (
                  <Link
                    key={cap.href}
                    href={cap.href}
                    className="rounded-full border border-neutral-200 bg-white dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 hover:border-primary-300 hover:text-primary-600"
                  >
                    {hrefToLinkKey[cap.href] ? tLinks(hrefToLinkKey[cap.href] as Parameters<typeof tLinks>[0]) : cap.label}
                  </Link>
                ))}
              </div>
            </div>
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
