import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { capabilityPages } from "@/lib/content/capabilities";
import { solutionPages } from "@/lib/content/solutions";
import { industryPages } from "@/lib/content/industries";
import { pricingPlans } from "@/lib/content/pricing";
import { blogPosts } from "@/lib/content/blog";
import { customerStories } from "@/lib/content/customer-stories";
import { docArticles } from "@/lib/content/docs";
import { apiEndpoints } from "@/lib/content/api-reference";

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  category: "Platform" | "Solutions" | "Industries" | "Pricing" | "Company" | "Blog" | "Documentation" | "Customer Stories";
}

/** Same shape as SearchEntry, but `category` holds the locale-translated display label rather than the English literal. */
export interface LocalizedSearchEntry {
  title: string;
  description: string;
  href: string;
  category: string;
}

/** Sitewide search index (SRS Section 6/11.1 Search Component), covering every content type in the SRS's search scope. */
export function getSearchIndex(): SearchEntry[] {
  const platform: SearchEntry[] = capabilityPages.map((page) => ({
    title: page.meta.h1,
    description: page.meta.description,
    href: `/platform/${page.slug}`,
    category: "Platform",
  }));

  const solutions: SearchEntry[] = solutionPages.map((page) => ({
    title: page.meta.h1,
    description: page.meta.description,
    href: `/solutions/${page.slug}`,
    category: "Solutions",
  }));

  const industries: SearchEntry[] = industryPages.map((page) => ({
    title: page.meta.h1,
    description: page.meta.description,
    href: `/industries/${page.slug}`,
    category: "Industries",
  }));

  const pricing: SearchEntry[] = pricingPlans.map((plan) => ({
    title: `${plan.name} plan`,
    description: plan.description,
    href: "/pricing",
    category: "Pricing",
  }));

  const company: SearchEntry[] = [
    { title: "About ZynReach", description: "Learn about our mission, team, and story.", href: "/about", category: "Company" },
    { title: "Careers", description: "Explore open roles at ZynReach.", href: "/careers", category: "Company" },
    { title: "Security & Trust Center", description: "SOC 2, ISO 27001, and GDPR-aligned security.", href: "/security", category: "Company" },
    { title: "Enterprise", description: "Enterprise-grade security, SLAs, and dedicated support.", href: "/enterprise", category: "Company" },
    { title: "Contact", description: "Reach sales, support, partnerships, or press.", href: "/contact", category: "Company" },
  ];

  const blog: SearchEntry[] = blogPosts.map((post) => ({
    title: post.title,
    description: post.excerpt,
    href: `/blog/${post.slug}`,
    category: "Blog",
  }));

  const customerStoriesEntries: SearchEntry[] = customerStories.map((story) => ({
    title: `${story.customerName} customer story`,
    description: story.result,
    href: `/customers/${story.slug}`,
    category: "Customer Stories",
  }));

  const docs: SearchEntry[] = docArticles.map((doc) => ({
    title: doc.title,
    description: doc.description,
    href: `/docs/${doc.slug}`,
    category: "Documentation",
  }));

  const api: SearchEntry[] = apiEndpoints.map((endpoint) => ({
    title: `${endpoint.method} ${endpoint.path}`,
    description: endpoint.summary,
    href: `/docs/api/${endpoint.slug}`,
    category: "Documentation",
  }));

  return [...docs, ...api, ...platform, ...solutions, ...industries, ...pricing, ...company, ...customerStoriesEntries, ...blog];
}

/**
 * SRS 7.17: "Documentation and API Reference search results are weighted
 * above Blog results when the query matches a product/technical term."
 * Documentation/API entries are placed first in getSearchIndex(), and
 * filter() preserves that order, so technical results naturally rank
 * above Blog for any matching query.
 */
export function searchContent(query: string): SearchEntry[];
export function searchContent(query: string, index: LocalizedSearchEntry[]): LocalizedSearchEntry[];
export function searchContent(
  query: string,
  index: SearchEntry[] | LocalizedSearchEntry[] = getSearchIndex()
): SearchEntry[] | LocalizedSearchEntry[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return index.filter(
    (entry) =>
      entry.title.toLowerCase().includes(normalized) || entry.description.toLowerCase().includes(normalized)
  );
}

/** Client-safe hook building a locale-aware search index by translating each entry's title/description. */
export function useLocalizedSearchIndex(): LocalizedSearchEntry[] {
  const tPlatform = useTranslations("platformPage.detail");
  const tSolutions = useTranslations("solutionsPage.detail");
  const tIndustries = useTranslations("industriesPage.detail");
  const tPricing = useTranslations("pricingPage.plans");
  const tBlog = useTranslations("blogPage.posts");
  const tCustomers = useTranslations("customersPage.stories");
  const tDocs = useTranslations("docsPage.articles");
  const tApi = useTranslations("apiReferencePage.endpoints");
  const tCategories = useTranslations("searchPage.categories");
  const tCompany = useTranslations("searchPage.company");
  const tSearch = useTranslations("searchPage");

  return useMemo(() => {
  const platform: SearchEntry[] = capabilityPages.map((page) => ({
    title: tPlatform(`${page.slug}.hero.headline` as Parameters<typeof tPlatform>[0]),
    description: tPlatform(`${page.slug}.hero.subhead` as Parameters<typeof tPlatform>[0]),
    href: `/platform/${page.slug}`,
    category: "Platform",
  }));

  const solutions: SearchEntry[] = solutionPages.map((page) => ({
    title: tSolutions(`${page.slug}.hero.headline` as Parameters<typeof tSolutions>[0]),
    description: tSolutions(`${page.slug}.hero.subhead` as Parameters<typeof tSolutions>[0]),
    href: `/solutions/${page.slug}`,
    category: "Solutions",
  }));

  const industries: SearchEntry[] = industryPages.map((page) => ({
    title: tIndustries(`${page.slug}.hero.headline` as Parameters<typeof tIndustries>[0]),
    description: tIndustries(`${page.slug}.hero.subhead` as Parameters<typeof tIndustries>[0]),
    href: `/industries/${page.slug}`,
    category: "Industries",
  }));

  const pricing: SearchEntry[] = pricingPlans.map((plan) => ({
    title: tPricing(`${plan.id}.name` as Parameters<typeof tPricing>[0]),
    description: tPricing(`${plan.id}.description` as Parameters<typeof tPricing>[0]),
    href: "/pricing",
    category: "Pricing",
  }));

  const company: SearchEntry[] = [
    { title: tCompany("about.title"), description: tCompany("about.description"), href: "/about", category: "Company" },
    { title: tCompany("careers.title"), description: tCompany("careers.description"), href: "/careers", category: "Company" },
    { title: tCompany("security.title"), description: tCompany("security.description"), href: "/security", category: "Company" },
    { title: tCompany("enterprise.title"), description: tCompany("enterprise.description"), href: "/enterprise", category: "Company" },
    { title: tCompany("contact.title"), description: tCompany("contact.description"), href: "/contact", category: "Company" },
  ];

  const blog: SearchEntry[] = blogPosts.map((post) => ({
    title: tBlog(`${post.slug}.title` as Parameters<typeof tBlog>[0]),
    description: tBlog(`${post.slug}.excerpt` as Parameters<typeof tBlog>[0]),
    href: `/blog/${post.slug}`,
    category: "Blog",
  }));

  const customerStoriesEntries: SearchEntry[] = customerStories.map((story) => ({
    title: `${tCustomers(`${story.slug}.customerName` as Parameters<typeof tCustomers>[0])} ${tSearch("customerStorySuffix")}`,
    description: tCustomers(`${story.slug}.result` as Parameters<typeof tCustomers>[0]),
    href: `/customers/${story.slug}`,
    category: "Customer Stories",
  }));

  const docs: SearchEntry[] = docArticles.map((doc) => ({
    title: tDocs(`${doc.slug}.title` as Parameters<typeof tDocs>[0]),
    description: tDocs(`${doc.slug}.description` as Parameters<typeof tDocs>[0]),
    href: `/docs/${doc.slug}`,
    category: "Documentation",
  }));

  const api: SearchEntry[] = apiEndpoints.map((endpoint) => ({
    title: `${endpoint.method} ${endpoint.path}`,
    description: tApi(`${endpoint.slug}.summary` as Parameters<typeof tApi>[0]),
    href: `/docs/api/${endpoint.slug}`,
    category: "Documentation",
  }));

  const localized = [...docs, ...api, ...platform, ...solutions, ...industries, ...pricing, ...company, ...customerStoriesEntries, ...blog];

  return localized.map(
    (entry): LocalizedSearchEntry => ({
      ...entry,
      category: tCategories(entry.category as Parameters<typeof tCategories>[0]),
    })
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
