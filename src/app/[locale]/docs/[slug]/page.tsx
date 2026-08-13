import type { Metadata } from "next";
import { Link } from "@/i18n/navigation";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { DocsSidebar } from "@/components/sections/DocsSidebar";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { HelpfulWidget } from "@/components/ui/HelpfulWidget";
import { JsonLd } from "@/components/seo/JsonLd";
import { docArticles, getDocArticle } from "@/lib/content/docs";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import type { ArticleBlock } from "@/types/content";

interface DocPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return docArticles.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: DocPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const raw = getDocArticle(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "docsPage" });
  const title = t(`articles.${raw.slug}.title` as Parameters<typeof t>[0]);
  const description = t(`articles.${raw.slug}.description` as Parameters<typeof t>[0]);
  const url = `/docs/${raw.slug}`;
  return {
    title: `${title} — Documentation`,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title, description, url: localizedUrl(locale, url) },
  };
}

export default async function DocPage({ params }: DocPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const raw = getDocArticle(slug);
  if (!raw) notFound();

  const t = await getTranslations("docsPage");
  const tLinks = await getTranslations("common.links");

  const doc = {
    ...raw,
    title: t(`articles.${raw.slug}.title` as Parameters<typeof t>[0]),
    description: t(`articles.${raw.slug}.description` as Parameters<typeof t>[0]),
  };
  const body = t.raw(`articles.${raw.slug}.body`) as ArticleBlock[];

  const sortedDocs = [...docArticles].sort((a, b) => (a.category === b.category ? a.order - b.order : a.category.localeCompare(b.category)));
  const currentIndex = sortedDocs.findIndex((d) => d.slug === doc.slug);
  const rawPrevDoc = currentIndex > 0 ? sortedDocs[currentIndex - 1] : null;
  const rawNextDoc = currentIndex < sortedDocs.length - 1 ? sortedDocs[currentIndex + 1] : null;
  const prevDoc = rawPrevDoc ? { ...rawPrevDoc, title: t(`articles.${rawPrevDoc.slug}.title` as Parameters<typeof t>[0]) } : null;
  const nextDoc = rawNextDoc ? { ...rawNextDoc, title: t(`articles.${rawNextDoc.slug}.title` as Parameters<typeof t>[0]) } : null;

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Documentation", href: "/docs" },
    { label: doc.title, href: `/docs/${doc.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content py-12">
          <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
            <DocsSidebar activeSlug={doc.slug} />

            <div className="max-w-2xl">
              <Breadcrumbs items={[{ label: tLinks("documentation"), href: "/docs" }, { label: doc.title, href: `/docs/${doc.slug}` }]} />
              <h1 className="mt-4 text-3xl font-bold text-neutral-900">{doc.title}</h1>
              <p className="mt-2 text-base text-neutral-500">{doc.description}</p>

              <div className="mt-8">
                <ArticleBody blocks={body} />
              </div>

              <div className="mt-10 border-t border-neutral-200 pt-6">
                <HelpfulWidget docSlug={doc.slug} />
              </div>

              <nav aria-label={t("paginationAriaLabel")} className="mt-8 flex items-center justify-between border-t border-neutral-200 pt-6">
                {prevDoc ? (
                  <Link href={`/docs/${prevDoc.slug}`} className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-primary-600">
                    <ArrowLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
                    {prevDoc.title}
                  </Link>
                ) : (
                  <span />
                )}
                {nextDoc ? (
                  <Link href={`/docs/${nextDoc.slug}`} className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-primary-600">
                    {nextDoc.title}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
                  </Link>
                ) : (
                  <span />
                )}
              </nav>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
