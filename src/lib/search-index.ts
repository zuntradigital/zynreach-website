import { useMemo } from "react";
import { useTranslations } from "next-intl";
import { capabilityPages } from "@/lib/content/capabilities";
import { productExperiencePages } from "@/lib/content/product-pages";
import { solutionPages } from "@/lib/content/solutions";
import { industryPages } from "@/lib/content/industries";
import { pricingPlans } from "@/lib/content/pricing";
import { blogPosts } from "@/lib/content/blog";
import { customerStories } from "@/lib/content/customer-stories";

export interface SearchEntry {
  title: string;
  description: string;
  href: string;
  category: "Platform" | "Solutions" | "Industries" | "Pricing" | "Company" | "Blog" | "Customer Stories";
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

  // productExperiencePages (marketing-automation, lead-generation, sales-pipeline,
  // contact-360, crm, campaigns, business-data) are skeleton+content-split like
  // Contact 360 (see product-pages.ts) — no English fallback text lives on the TS
  // skeleton itself, so this non-locale-aware index (test-only; the live UI always
  // uses useLocalizedSearchIndex below) mirrors the "company" entries' pattern of a
  // literal EN string, sourced from messages/en.json's productPages.<slug>.hero.
  const productExperienceEntries: SearchEntry[] = [
    { title: "Turn every interaction into a smart step in the customer journey.", description: "Build automated marketing journeys that respond to real customer behavior, personalize content, score leads, and route qualified opportunities to sales — from a single data model.", href: "/platform/marketing-automation", category: "Platform" },
    { title: "Turn every spark of interest into a qualified, sales-ready lead.", description: "Capture prospective customers from every touchpoint, understand their intent, enrich their data, score their fit, and route them automatically to the right rep — all inside ZynReach's unified system.", href: "/platform/lead-generation", category: "Platform" },
    { title: "Every deal is clear. Every step is calculated. Every opportunity is closer to closing.", description: "Manage your deals from first opportunity to close through a live Pipeline that connects stages, activity, tasks, follow-ups, and forecasting in one place — with intelligence that tells your team what needs attention now.", href: "/platform/sales-pipeline", category: "Platform" },
    { title: "Everything you need to know about a customer. In one place.", description: "Bring a customer's data, history, interactions, deals, campaigns, tasks, and conversations together in one unified record that gives every team full context before any conversation or decision.", href: "/platform/contact-360", category: "Platform" },
    { title: "Every customer relationship. Every opportunity. Every next step — in one place.", description: "ZynReach CRM manages the full customer and revenue lifecycle — contacts, pipeline, activities, automation, and intelligence in one platform.", href: "/platform/crm", category: "Platform" },
    { title: "Build your campaigns, launch them across channels, and measure their impact on revenue.", description: "Create, launch, and manage multichannel campaigns from ZynReach, with a shared audience, live analytics, and measured impact on leads, pipeline, and revenue.", href: "/platform/campaigns", category: "Platform" },
    { title: "Turn market data into real sales opportunities.", description: "Discover the companies and people who match your target audience, verify their data, enrich your records, and build ready-to-work lists.", href: "/platform/business-data", category: "Platform" },
  ];

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
    href: `/customer-stories/${story.slug}`,
    category: "Customer Stories",
  }));

  return [...platform, ...productExperienceEntries, ...solutions, ...industries, ...pricing, ...company, ...customerStoriesEntries, ...blog];
}

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
  const tProductPages = useTranslations("productPages");
  const tSolutions = useTranslations("solutionsPage.detail");
  const tIndustries = useTranslations("industriesPage.detail");
  const tPricing = useTranslations("pricingPage.plans");
  const tBlog = useTranslations("blogPage.posts");
  const tCustomers = useTranslations("customerStoriesPage.stories");
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

  const productExperience: SearchEntry[] = productExperiencePages.map((page) => ({
    title: tProductPages(`${page.slug}.hero.headline` as Parameters<typeof tProductPages>[0]),
    description: tProductPages(`${page.slug}.hero.subhead` as Parameters<typeof tProductPages>[0]),
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
    href: `/customer-stories/${story.slug}`,
    category: "Customer Stories",
  }));

  const localized = [...platform, ...productExperience, ...solutions, ...industries, ...pricing, ...company, ...customerStoriesEntries, ...blog];

  return localized.map(
    (entry): LocalizedSearchEntry => ({
      ...entry,
      category: tCategories(entry.category as Parameters<typeof tCategories>[0]),
    })
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
