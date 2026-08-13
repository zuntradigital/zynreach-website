import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Clock } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { BlogCard, type BlogCardData } from "@/components/ui/BlogCard";
import { CategoryFilterBar, type CategoryOption } from "@/components/ui/CategoryFilterBar";
import { Pagination } from "@/components/ui/Pagination";
import { LeadCaptureStrip } from "@/components/ui/LeadCaptureStrip";
import { JsonLd } from "@/components/seo/JsonLd";
import { blogPosts, blogCategories, getReadingTimeMinutes } from "@/lib/content/blog";
import { getAuthor } from "@/lib/content/authors";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedBlog } from "@/lib/services/blog-content";
import type { BlogPost as HardcodedBlogPost } from "@/types/content";

// Blog is admin-direct-save with no publish step (see ZynReach Admin's
// PATCH /api/admin/blog/posts/[id] docstring) — a Save's Draft/Published
// choice must be visible immediately, so unlike time-based ISR this route
// is always dynamically rendered.
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blogPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/blog"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/blog") },
  };
}

const PAGE_SIZE = 4;

interface ResolvedPost extends BlogCardData {
  category: string;
  publishedDate: string;
  featured?: boolean;
}

interface BlogIndexProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; page?: string }>;
}

export default async function BlogIndexPage({ params, searchParams }: BlogIndexProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("blogPage");
  const query = await searchParams;
  const activeCategory = query.category;
  const currentPage = Math.max(1, Number(query.page) || 1);

  const liveBlog = await getPublishedBlog(locale);

  // categoryOptions drives the filter bar's choices; live mode derives them
  // from whatever categories the live posts actually carry (a locale-
  // resolved label doubling as its own filter key — the tradeoff is the
  // active filter won't survive a language switch while live, unlike the
  // fallback path's locale-stable English category codes).
  let allPosts: ResolvedPost[];
  let categoryOptions: CategoryOption[];

  if (liveBlog) {
    const authorById = new Map(liveBlog.authors.map((a) => [a.id, a]));
    allPosts = liveBlog.posts.map((post) => {
      const author = authorById.get(post.authorId);
      return {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        categoryLabel: post.category,
        category: post.category,
        authorName: author?.name ?? null,
        readingTimeMinutes: getReadingTimeMinutes(post),
        minReadLabel: t("minRead", { count: getReadingTimeMinutes(post) }),
        publishedDate: post.publishedDate,
        featured: post.featured,
      };
    });
    categoryOptions = Array.from(new Set(allPosts.map((p) => p.category))).map((c) => ({ key: c, label: c }));
  } else {
    allPosts = blogPosts.map((post: HardcodedBlogPost) => {
      const author = getAuthor(post.authorId);
      const categoryLabel = t(`categories.${post.category}` as Parameters<typeof t>[0]);
      return {
        slug: post.slug,
        title: t(`posts.${post.slug}.title` as Parameters<typeof t>[0]),
        excerpt: t(`posts.${post.slug}.excerpt` as Parameters<typeof t>[0]),
        categoryLabel,
        category: post.category,
        authorName: author ? t(`authors.${author.id}.name` as Parameters<typeof t>[0]) : null,
        readingTimeMinutes: getReadingTimeMinutes(post),
        minReadLabel: t("minRead", { count: getReadingTimeMinutes(post) }),
        publishedDate: post.publishedDate,
        featured: post.featured,
      };
    });
    categoryOptions = blogCategories.map((c) => ({ key: c, label: t(`categories.${c}` as Parameters<typeof t>[0]) }));
  }

  const featured = allPosts.find((post) => post.featured);
  const filtered = allPosts
    .filter((post) => (activeCategory ? post.category === activeCategory : true))
    .sort((a, b) => (a.publishedDate > b.publishedDate ? -1 : 1));

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pagePosts = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
  ]);

  const basePath = "/blog";

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={t("eyebrow")} headline={t("headline")} subhead={t("subhead")} />

        {featured && !activeCategory && currentPage === 1 ? (
          <section className="border-b border-neutral-200 bg-white dark:bg-neutral-100 py-16">
            <div className="container-content">
              <Link
                href={`/blog/${featured.slug}`}
                className="grid gap-6 rounded-xl border border-neutral-200 p-8 hover:border-primary-300 hover:shadow-md lg:grid-cols-[2fr_1fr] lg:items-center"
              >
                <div>
                  <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">
                    {t("featuredPrefix")} &middot; {featured.categoryLabel}
                  </span>
                  <h2 className="mt-4 text-2xl font-bold text-neutral-900">{featured.title}</h2>
                  <p className="mt-3 text-base text-neutral-600">{featured.excerpt}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-neutral-500">
                    <span>{featured.authorName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="flex items-center gap-1">
                      <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                      {featured.minReadLabel}
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        ) : null}

        <section className="bg-neutral-50 py-16">
          <div className="container-content">
            <CategoryFilterBar categories={categoryOptions} activeCategory={activeCategory} basePath={basePath} />

            <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post) => (
                <li key={post.slug}>
                  <BlogCard post={post} />
                </li>
              ))}
            </ul>

            {pagePosts.length === 0 ? (
              <p className="mt-8 text-sm text-neutral-500">{t("noPosts")}</p>
            ) : null}

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={activeCategory ? `${basePath}?category=${encodeURIComponent(activeCategory)}` : basePath}
            />
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content max-w-2xl">
            <LeadCaptureStrip headline={t("subscribeHeadline")} source="blog-newsletter" />
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
