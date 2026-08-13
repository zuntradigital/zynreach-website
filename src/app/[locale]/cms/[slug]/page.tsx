import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { Footer } from "@/components/layout/Footer";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { getPublishedCmsPage, type CmsContentBlock, type CmsMediaMap } from "@/lib/services/cms-content";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

/**
 * System B ↔ System A integration point: renders any Page an admin has
 * authored and Published through System B's Content Management module
 * (SRS §16), at /{locale}/cms/{slug}. Deliberately its own namespace
 * rather than a catch-all over the whole site — the 30+ pages this repo
 * already ships are hand-built and stay that way; this is additive for
 * genuinely CMS-authored pages, not a replacement path for existing
 * routes. A slug that isn't Published (or doesn't exist) 404s exactly
 * like any other unknown route.
 */

// Pages is admin-direct-save with no publish step (see ZynReach Admin's
// PATCH /api/admin/pages/[id] docstring) — a Save's Draft/Published/
// Archived choice must be visible immediately, so unlike time-based ISR
// this route is always dynamically rendered.
export const revalidate = 0;

interface CmsPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: CmsPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const page = await getPublishedCmsPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    alternates: localizedAlternates(locale, `/cms/${slug}`),
    openGraph: {
      ...openGraphDefaults(locale),
      title: page.title,
      url: localizedUrl(locale, `/cms/${slug}`),
    },
  };
}

export default async function CmsPage({ params }: CmsPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const page = await getPublishedCmsPage(slug);
  if (!page) notFound();

  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <div className="container-content py-16">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-900">{page.title}</h1>
          <div className="mt-10 space-y-16">
            {page.componentBlocks
              .slice()
              .sort((a, b) => a.order - b.order)
              .map((block) => (
                <CmsBlock key={block.id} block={block} media={page.media} />
              ))}
          </div>
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}

function CmsBlock({ block, media }: { block: CmsContentBlock; media: CmsMediaMap }) {
  if (block.type === "hero") {
    const image = block.props.imageMediaAssetId ? media[block.props.imageMediaAssetId] : undefined;
    return (
      <section className="rounded-2xl bg-neutral-50 dark:bg-neutral-100 px-8 py-14 text-center">
        {image ? (
          <div className="relative mx-auto mb-8 aspect-[16/9] max-w-2xl overflow-hidden rounded-xl">
            <Image src={image.url} alt={image.altText} fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
          </div>
        ) : null}
        {block.props.title ? <h2 className="text-3xl font-bold text-neutral-900">{block.props.title}</h2> : null}
        {block.props.subtitle ? <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600">{block.props.subtitle}</p> : null}
        {block.props.ctaLabel && block.props.ctaHref ? (
          <a
            href={block.props.ctaHref}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-primary-500 px-6 py-3 text-sm font-semibold text-white hover:bg-primary-600"
          >
            {block.props.ctaLabel}
          </a>
        ) : null}
      </section>
    );
  }

  if (block.type === "richText") {
    return (
      <section className="mx-auto max-w-3xl">
        <p className="whitespace-pre-line text-base leading-relaxed text-neutral-700">{block.props.body}</p>
      </section>
    );
  }

  if (block.type === "ctaBand") {
    return (
      <section className="rounded-2xl bg-primary-500 px-8 py-12 text-center text-white">
        {block.props.title ? <h2 className="text-2xl font-bold">{block.props.title}</h2> : null}
        {block.props.ctaLabel && block.props.ctaHref ? (
          <a
            href={block.props.ctaHref}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary-700 hover:bg-neutral-100"
          >
            {block.props.ctaLabel}
          </a>
        ) : null}
      </section>
    );
  }

  return null;
}
