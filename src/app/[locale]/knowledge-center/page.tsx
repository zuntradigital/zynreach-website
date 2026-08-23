import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { FileText, Newspaper, Quote, Video } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { InlineSearchForm } from "@/components/ui/InlineSearchForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedBlog } from "@/lib/services/blog-content";
import { getPublishedResources } from "@/lib/services/resources-content";
import { getPublishedCustomerStories } from "@/lib/services/customer-stories-content";
import { blogPosts } from "@/lib/content/blog";
import { customerStories } from "@/lib/content/customer-stories";
import { guides as hardcodedGuides, webinars as hardcodedWebinars } from "@/lib/content/resources";

// Same "admin edit must be visible immediately" contract as the four
// content-type pages this hub summarizes (Blog, Guides & Templates,
// Webinars, Customer Stories) — see each of their own revalidate comments.
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "knowledgeCenterPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/knowledge-center"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/knowledge-center") },
  };
}

const tiles = [
  { key: "blog", icon: Newspaper, linkKey: "blog", href: "/blog" },
  { key: "customerStories", icon: Quote, linkKey: "customerStories", href: "/customer-stories" },
  { key: "guidesTemplates", icon: FileText, linkKey: "guidesTemplates", href: "/guides-templates" },
  { key: "webinars", icon: Video, linkKey: "webinars", href: "/webinars" },
];

interface ContentCard {
  title: string;
  description: string;
  href: string;
  typeLabel: string;
}

export default async function KnowledgeCenterHubPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("knowledgeCenterPage");
  const tNav = await getTranslations("common.nav");
  const tLinks = await getTranslations("common.links");
  const tBlog = await getTranslations("blogPage");
  const tResources = await getTranslations("resourcesLibraryPage");
  const tCustomers = await getTranslations("customerStoriesPage.stories");

  const [liveBlog, liveResources, liveStories] = await Promise.all([
    getPublishedBlog(locale),
    getPublishedResources(locale),
    getPublishedCustomerStories(locale),
  ]);

  const blogItems: ContentCard[] = liveBlog
    ? liveBlog.posts.map((post) => ({ title: post.title, description: post.excerpt, href: `/blog/${post.slug}`, typeLabel: tLinks("blog") }))
    : blogPosts.map((post) => ({
        title: tBlog(`posts.${post.slug}.title` as Parameters<typeof tBlog>[0]),
        description: tBlog(`posts.${post.slug}.excerpt` as Parameters<typeof tBlog>[0]),
        href: `/blog/${post.slug}`,
        typeLabel: tLinks("blog"),
      }));

  const storyItems: ContentCard[] = liveStories
    ? liveStories.map((story) => ({ title: story.customerName, description: story.results, href: `/customer-stories/${story.slug}`, typeLabel: tLinks("customerStories") }))
    : customerStories.map((story) => ({
        title: tCustomers(`${story.slug}.customerName` as Parameters<typeof tCustomers>[0]),
        description: tCustomers(`${story.slug}.result` as Parameters<typeof tCustomers>[0]),
        href: `/customer-stories/${story.slug}`,
        typeLabel: tLinks("customerStories"),
      }));

  const guideItems: ContentCard[] = liveResources
    ? liveResources.guides.map((guide) => ({ title: guide.title, description: guide.description, href: `/guides-templates/${guide.slug}`, typeLabel: tLinks("guidesTemplates") }))
    : hardcodedGuides.map((guide) => ({
        title: tResources(`guides.${guide.slug}.title` as Parameters<typeof tResources>[0]),
        description: tResources(`guides.${guide.slug}.description` as Parameters<typeof tResources>[0]),
        href: `/guides-templates/${guide.slug}`,
        typeLabel: tLinks("guidesTemplates"),
      }));

  const webinarItems: ContentCard[] = liveResources
    ? liveResources.webinars.map((webinar) => ({ title: webinar.title, description: webinar.description, href: `/webinars/${webinar.slug}`, typeLabel: tLinks("webinars") }))
    : hardcodedWebinars.map((webinar) => ({
        title: tResources(`webinars.${webinar.slug}.title` as Parameters<typeof tResources>[0]),
        description: tResources(`webinars.${webinar.slug}.description` as Parameters<typeof tResources>[0]),
        href: `/webinars/${webinar.slug}`,
        typeLabel: tLinks("webinars"),
      }));

  const byIndex = (index: number): ContentCard[] =>
    [blogItems[index], storyItems[index], guideItems[index], webinarItems[index]].filter((item): item is ContentCard => Boolean(item));

  const featuredContent = byIndex(0);
  const latestContent = byIndex(1);
  const recommendedContent = byIndex(2);

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Knowledge Center", href: "/knowledge-center" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tNav("knowledgeCenter")}
          headline={t("headline")}
          subhead={t("subhead")}
          actions={
            <>
              <Link
                href="/blog"
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-5 text-sm font-semibold text-white hover:bg-primary-700"
              >
                {tLinks("blog")}
              </Link>
              <Link
                href="/guides-templates"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10"
              >
                {tLinks("guidesTemplates")}
              </Link>
              <Link
                href="/webinars"
                className="inline-flex min-h-11 items-center justify-center rounded-lg border border-white/30 px-5 text-sm font-semibold text-white hover:bg-white/10"
              >
                {tLinks("webinars")}
              </Link>
            </>
          }
        />

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content max-w-2xl">
            <InlineSearchForm placeholder={t("searchPlaceholder")} ariaLabel={t("searchLabel")} />
          </div>
        </section>

        <section className="bg-neutral-50 py-16">
          <div className="container-content">
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
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

        {[
          { heading: t("featuredHeading"), items: featuredContent },
          { heading: t("latestHeading"), items: latestContent },
          { heading: t("recommendedHeading"), items: recommendedContent },
        ]
          .filter((group) => group.items.length > 0)
          .map((group, index) => (
            <section key={group.heading} className={index % 2 === 0 ? "bg-white dark:bg-neutral-100 py-16" : "bg-neutral-50 py-16"}>
              <div className="container-content">
                <h2 className="text-xl font-bold text-neutral-900">{group.heading}</h2>
                <ul className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-5 hover:border-primary-300 hover:shadow-md"
                      >
                        <span className="w-fit rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-semibold text-primary-700">
                          {item.typeLabel}
                        </span>
                        <h3 className="mt-3 font-semibold text-neutral-900">{item.title}</h3>
                        <p className="mt-2 line-clamp-3 text-sm text-neutral-600">{item.description}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
