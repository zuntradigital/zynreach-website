import type { MetadataRoute } from "next";
import { site } from "@/lib/content/site";
import { routing } from "@/i18n/routing";
import { capabilityPages } from "@/lib/content/capabilities";
import { solutionPages } from "@/lib/content/solutions";
import { industryPages } from "@/lib/content/industries";
import { legalPages } from "@/lib/content/legal";
import { jobListings } from "@/lib/content/careers";
import { blogPosts } from "@/lib/content/blog";
import { customerStories } from "@/lib/content/customer-stories";
import { docArticles } from "@/lib/content/docs";
import { apiEndpoints } from "@/lib/content/api-reference";
import { guides, webinars } from "@/lib/content/resources";
import { integrations } from "@/lib/content/integrations";
import { getPublishedBlog } from "@/lib/services/blog-content";
import { getPublishedResources } from "@/lib/services/resources-content";
import { getPublishedCareers } from "@/lib/services/careers-content";

/**
 * SRS Section 15: XML sitemap, covering every indexable route. Blog/
 * Resources slugs are locale-invariant, so a single `en` fetch to System B
 * is enough to enumerate them; graceful-degrades to the hardcoded arrays
 * if System B isn't reachable, same contract as every other System B read.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [liveBlog, liveResources, liveCareers] = await Promise.all([getPublishedBlog("en"), getPublishedResources("en"), getPublishedCareers("en")]);
  const blogSlugs = liveBlog ? liveBlog.posts.map((p) => p.slug) : blogPosts.map((p) => p.slug);
  const guideSlugs = liveResources ? liveResources.guides.map((g) => g.slug) : guides.map((g) => g.slug);
  const webinarSlugs = liveResources ? liveResources.webinars.map((w) => w.slug) : webinars.map((w) => w.slug);
  const jobIds = liveCareers ? liveCareers.jobListings.map((j) => j.id) : jobListings.map((j) => j.id);
  const staticRoutes = [
    "",
    "/platform",
    "/pricing",
    "/solutions",
    "/industries",
    "/enterprise",
    "/security",
    "/compliance",
    "/about",
    "/careers",
    "/contact",
    "/demo",
    "/trial",
    "/blog",
    "/customers",
    "/resources",
    "/resources/guides",
    "/resources/webinars",
    "/docs/api",
    "/faq",
    "/status",
    "/changelog",
    "/integrations",
    "/partners",
  ];

  const dynamicRoutes = [
    ...capabilityPages.map((page) => `/platform/${page.slug}`),
    ...solutionPages.map((page) => `/solutions/${page.slug}`),
    ...industryPages.map((page) => `/industries/${page.slug}`),
    ...legalPages.map((page) => `/legal/${page.slug}`),
    ...jobIds.map((id) => `/careers/${id}`),
    ...blogSlugs.map((slug) => `/blog/${slug}`),
    ...customerStories.map((story) => `/customers/${story.slug}`),
    ...docArticles.map((doc) => `/docs/${doc.slug}`),
    ...apiEndpoints.map((endpoint) => `/docs/api/${endpoint.slug}`),
    ...guideSlugs.map((slug) => `/resources/guides/${slug}`),
    ...webinarSlugs.map((slug) => `/resources/webinars/${slug}`),
    ...integrations.map((integration) => `/integrations/${integration.slug}`),
  ];

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  // Every route lives under a locale prefix (routing.localePrefix is
  // "always" — there is no unprefixed, independently-indexable version of
  // any page), so each entry here is per-locale, with an `alternates`
  // cross-link to its sibling so search engines see them as translated
  // equivalents rather than duplicate content.
  return allRoutes.flatMap((route) =>
    routing.locales.map((locale) => ({
      url: `${site.url}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: (route === "" ? "daily" : "weekly") as "daily" | "weekly",
      priority: route === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${site.url}/${l}${route}`])
        ),
      },
    }))
  );
}
