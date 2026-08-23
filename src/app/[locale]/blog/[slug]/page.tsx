import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { ArticleBody } from "@/components/sections/ArticleBody";
import { TableOfContents } from "@/components/sections/TableOfContents";
import { AuthorBioCard } from "@/components/ui/AuthorBioCard";
import { ShareButtons } from "@/components/ui/ShareButtons";
import { BlogCard, type BlogCardData } from "@/components/ui/BlogCard";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosts, getBlogPost, getReadingTimeMinutes } from "@/lib/content/blog";
import { getAuthor } from "@/lib/content/authors";
import { breadcrumbJsonLd, articleJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import type { ArticleBlock, BlogPost as HardcodedBlogPost } from "@/types/content";
import { getPublishedBlogPost } from "@/lib/services/blog-content";

// Blog is admin-direct-save with no publish step — see the blog list
// page's own `revalidate = 0` comment.
export const revalidate = 0;

interface BlogPostPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale, slug } = await params;

  const live = await getPublishedBlogPost(slug, locale);
  if (live === "not-found") return {};
  if (live) {
    const url = `/blog/${live.post.slug}`;
    const title = live.post.seoTitle ?? live.post.title;
    const description = live.post.seoDescription ?? live.post.excerpt;
    return {
      title,
      description,
      alternates: { ...localizedAlternates(locale, url), ...(live.post.canonicalUrl ? { canonical: live.post.canonicalUrl } : {}) },
      ...(live.post.noIndex ? { robots: { index: false, follow: true } } : {}),
      openGraph: {
        ...openGraphDefaults(locale, "article"),
        title,
        description,
        url: localizedUrl(locale, url),
        publishedTime: live.post.publishedDate,
        ...(live.post.image ? { images: [{ url: live.post.image }] } : {}),
      },
    };
  }

  const raw = getBlogPost(slug);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: "blogPage.posts" });
  const title = t(`${raw.slug}.title` as Parameters<typeof t>[0]);
  const excerpt = t(`${raw.slug}.excerpt` as Parameters<typeof t>[0]);
  const url = `/blog/${raw.slug}`;
  return {
    title,
    description: excerpt,
    alternates: localizedAlternates(locale, url),
    openGraph: {
      ...openGraphDefaults(locale, "article"),
      title,
      description: excerpt,
      url: localizedUrl(locale, url),
      publishedTime: raw.publishedDate,
    },
  };
}

function toCardData(
  post: { slug: string; title: string; excerpt: string; category: string; authorName: string | null; body: ArticleBlock[]; image?: string; imageAlt?: string },
  minReadLabel: (n: number) => string
): BlogCardData {
  const readingTimeMinutes = getReadingTimeMinutes({ body: post.body } as HardcodedBlogPost);
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    categoryLabel: post.category,
    authorName: post.authorName,
    readingTimeMinutes,
    minReadLabel: minReadLabel(readingTimeMinutes),
    imageUrl: post.image,
    imageAlt: post.imageAlt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tPage = await getTranslations("blogPage");
  const tLinks = await getTranslations("common.links");
  const tCta = await getTranslations("common.cta");
  const minReadLabel = (n: number) => tPage("minRead", { count: n });

  const live = await getPublishedBlogPost(slug, locale);
  if (live === "not-found") notFound();

  let post: {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    publishedDate: string;
    updatedDate?: string;
    tags: string[];
    body: ArticleBlock[];
    image?: string;
    imageAlt?: string;
  };
  let author: { id: string; name: string; role: string; bio: string } | undefined;
  let relatedCards: BlogCardData[];

  if (live) {
    post = live.post;
    author = live.author ?? undefined;
    relatedCards = live.relatedPosts.map((r) =>
      toCardData({ slug: r.slug, title: r.title, excerpt: r.excerpt, category: r.category, authorName: null, body: r.body, image: r.image, imageAlt: r.imageAlt }, minReadLabel)
    );
  } else {
    const raw = getBlogPost(slug);
    if (!raw) notFound();

    const t = await getTranslations(`blogPage.posts.${raw.slug}`);
    post = {
      slug: raw.slug,
      title: t("title"),
      excerpt: t("excerpt"),
      category: tPage(`categories.${raw.category}` as Parameters<typeof tPage>[0]),
      publishedDate: raw.publishedDate,
      updatedDate: raw.updatedDate,
      tags: raw.tags,
      body: t.raw("body") as ArticleBlock[],
    };
    const rawAuthor = getAuthor(raw.authorId);
    author = rawAuthor
      ? {
          id: rawAuthor.id,
          name: tPage(`authors.${rawAuthor.id}.name` as Parameters<typeof tPage>[0]),
          role: tPage(`authors.${rawAuthor.id}.role` as Parameters<typeof tPage>[0]),
          bio: tPage(`authors.${rawAuthor.id}.bio` as Parameters<typeof tPage>[0]),
        }
      : undefined;
    relatedCards = raw.relatedSlugs
      .map((s) => getBlogPost(s))
      .filter((p): p is NonNullable<typeof p> => Boolean(p))
      .map((r) =>
        toCardData(
          {
            slug: r.slug,
            title: tPage(`posts.${r.slug}.title` as Parameters<typeof tPage>[0]),
            excerpt: tPage(`posts.${r.slug}.excerpt` as Parameters<typeof tPage>[0]),
            category: tPage(`categories.${r.category}` as Parameters<typeof tPage>[0]),
            authorName: (() => {
              const a = getAuthor(r.authorId);
              return a ? tPage(`authors.${a.id}.name` as Parameters<typeof tPage>[0]) : null;
            })(),
            body: r.body,
          },
          minReadLabel,
        ),
      );
  }

  const readingTimeMinutes = getReadingTimeMinutes({ body: post.body } as HardcodedBlogPost);
  const url = localizedUrl(locale, `/blog/${post.slug}`);

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: post.title, href: `/blog/${post.slug}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="article-jsonld" data={articleJsonLd(post, author?.name)} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-white dark:bg-neutral-100">
        <div className="container-content py-16">
          <Breadcrumbs
            items={[
              { label: tLinks("blog"), href: "/blog" },
              { label: post.title, href: `/blog/${post.slug}` },
            ]}
          />
          <span className="mt-6 inline-block w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{post.category}</span>
          <h1 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">{post.title}</h1>
          <p className="mt-3 max-w-2xl text-lg text-neutral-600">{post.excerpt}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <span>{author?.name}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedDate}>{post.publishedDate}</time>
            {post.updatedDate && post.updatedDate !== post.publishedDate ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{tPage("lastUpdated", { date: post.updatedDate })}</span>
              </>
            ) : null}
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {minReadLabel(readingTimeMinutes)}
            </span>
          </div>

          {post.tags.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2" aria-label={tPage("tagsLabel")}>
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-4">
            <ShareButtons url={url} title={post.title} />
          </div>

          {post.image ? (
            <div className="relative mt-8 aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-2xl">
              <Image src={post.image} alt={post.imageAlt ?? ""} fill sizes="(min-width: 1024px) 48rem, 100vw" className="object-cover" priority />
            </div>
          ) : null}

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_260px]">
            <ArticleBody blocks={post.body} />

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <TableOfContents blocks={post.body} />
              {author ? <AuthorBioCard author={author} /> : null}
            </aside>
          </div>

          <section className="mt-16 rounded-xl bg-footer px-8 py-10 sm:px-10">
            <h2 className="max-w-xl text-2xl font-bold text-white">{tPage("productCtaHeadline")}</h2>
            <p className="mt-2 max-w-lg text-neutral-400 dark:text-white/60">{tPage("productCtaBody")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/demo"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                {tCta("bookDemo")}
              </Link>
              <Link
                href="/trial"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10"
              >
                {tCta("startFreeTrial")}
              </Link>
            </div>
          </section>

          {relatedCards.length > 0 ? (
            <section className="mt-16 border-t border-neutral-200 pt-12">
              <h2 className="text-xl font-semibold text-neutral-900">{tPage("relatedPostsHeading")}</h2>
              <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {relatedCards.map((related) => (
                  <li key={related.slug}>
                    <BlogCard post={related} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <section className="mt-16 max-w-2xl border-t border-neutral-200 pt-12">
            <LeadCaptureStrip headline={tPage("subscribeHeadline")} source={`blog-article-${post.slug}`} />
          </section>
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
