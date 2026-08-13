import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Clock } from "lucide-react";
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
    return {
      title: live.post.title,
      description: live.post.excerpt,
      alternates: localizedAlternates(locale, url),
      openGraph: {
        ...openGraphDefaults(locale, "article"),
        title: live.post.title,
        description: live.post.excerpt,
        url: localizedUrl(locale, url),
        publishedTime: live.post.publishedDate,
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

function toCardData(post: { slug: string; title: string; excerpt: string; category: string; authorName: string | null; body: ArticleBlock[] }, minReadLabel: (n: number) => string): BlogCardData {
  const readingTimeMinutes = getReadingTimeMinutes({ body: post.body } as HardcodedBlogPost);
  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    categoryLabel: post.category,
    authorName: post.authorName,
    readingTimeMinutes,
    minReadLabel: minReadLabel(readingTimeMinutes),
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const tPage = await getTranslations("blogPage");
  const tLinks = await getTranslations("common.links");
  const minReadLabel = (n: number) => tPage("minRead", { count: n });

  const live = await getPublishedBlogPost(slug, locale);
  if (live === "not-found") notFound();

  let post: { slug: string; title: string; excerpt: string; category: string; publishedDate: string; updatedDate?: string; body: ArticleBlock[] };
  let author: { id: string; name: string; role: string; bio: string } | undefined;
  let relatedCards: BlogCardData[];

  if (live) {
    post = live.post;
    author = live.author ?? undefined;
    relatedCards = live.relatedPosts.map((r) => toCardData({ slug: r.slug, title: r.title, excerpt: r.excerpt, category: r.category, authorName: null, body: r.body }, minReadLabel));
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
          <div className="mt-4 flex items-center gap-3 text-sm text-neutral-500">
            <span>{author?.name}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.publishedDate}>{post.publishedDate}</time>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Clock aria-hidden="true" className="h-3.5 w-3.5" />
              {minReadLabel(readingTimeMinutes)}
            </span>
          </div>

          <div className="mt-4">
            <ShareButtons url={url} title={post.title} />
          </div>

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_260px]">
            <ArticleBody blocks={post.body} />

            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <TableOfContents blocks={post.body} />
              {author ? <AuthorBioCard author={author} /> : null}
            </aside>
          </div>

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
