import { getTranslations } from "next-intl/server";
import { site } from "@/lib/content/site";
import type { FaqItem, PricingPlan, BlogPost } from "@/types/content";
import type { JobListing } from "@/lib/content/careers";
import { localizedUrl } from "@/lib/seo";
import { getSiteSettings } from "@/lib/services/site-settings";

/**
 * Dashboard-managed contact/social values (SRS §22) override the hardcoded
 * defaults when set, same merge-with-fallback pattern as Footer.tsx and the
 * Contact page. Geo-coordinates, the maps URL, and the structured street
 * address have no equivalent field in the admin's Settings module yet, so
 * those stay hardcoded.
 */
async function resolvedContactAndSocial() {
  const remote = await getSiteSettings();
  return {
    email: remote?.settings.contact.supportEmail || site.contact.email,
    phone: remote?.settings.contact.phone || site.contact.phone,
    linkedin: remote?.settings.social.linkedinUrl || site.social.linkedin,
    x: remote?.settings.social.twitterUrl || site.social.x,
    youtube: remote?.settings.social.youtubeUrl || site.social.youtube,
  };
}

/** Single canonical postal address, shared by Organization and LocalBusiness schema below. */
function postalAddressJsonLd() {
  return {
    "@type": "PostalAddress",
    streetAddress: site.contact.addressParts.street,
    addressLocality: site.contact.addressParts.district,
    addressRegion: site.contact.addressParts.region,
    postalCode: site.contact.addressParts.postalCode,
    addressCountry: site.contact.addressParts.countryCode,
  };
}

export async function organizationJsonLd() {
  const { email, phone, linkedin, x, youtube } = await resolvedContactAndSocial();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: site.url,
    logo: `${site.url}/logo.png`,
    sameAs: [linkedin, x, youtube],
    address: postalAddressJsonLd(),
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email,
      telephone: phone,
      url: `${site.url}/contact`,
    },
  };
}

/**
 * LocalBusiness schema for the ZYNTRA DIGITAL headquarters — geo/hasMap use the
 * same verified coordinates and Maps URL as every clickable address and the
 * embedded map on the Contact page, so there is one canonical location sitewide.
 */
export async function localBusinessJsonLd() {
  const { email, phone } = await resolvedContactAndSocial();
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ZYNTRA DIGITAL",
    url: site.url,
    logo: `${site.url}/logo.png`,
    image: `${site.url}/logo.png`,
    email,
    telephone: phone,
    address: postalAddressJsonLd(),
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.contact.geo.lat,
      longitude: site.contact.geo.lng,
    },
    hasMap: site.contact.mapsUrl,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: site.name,
    url: site.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${site.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface BreadcrumbEntry {
  label: string;
  href: string;
}

/**
 * Callers pass the same static English section names ("Platform", "Home",
 * "Blog", ...) every visible <Breadcrumbs> trail already renders — this
 * maps each one to the exact translation key that component resolves it
 * through (see Breadcrumbs.tsx's `item.label === "Home" ? t("links.home")
 * : item.label`, and each page's own `tNav("platform")` / `tLinks("blog")`
 * calls), so the JSON-LD trail can never drift from what's on the page.
 * Labels not in this map (a story/job/article title, `content.navLabel`,
 * etc.) are already resolved by the caller and pass through unchanged.
 */
const STATIC_BREADCRUMB_LABEL_KEYS: Record<string, string> = {
  Home: "links.home",
  Product: "nav.platform",
  Solutions: "nav.solutions",
  Industries: "nav.industries",
  Pricing: "nav.pricing",
  "Knowledge Center": "nav.knowledgeCenter",
  Company: "nav.company",
  Integrations: "megaMenu.integrations",
  Blog: "links.blog",
  "Customer Stories": "links.customerStories",
  "Guides & Templates": "links.guidesTemplates",
  Webinars: "links.webinars",
  FAQ: "links.faq",
  Changelog: "links.changelog",
  Status: "links.status",
  About: "links.about",
  Careers: "links.careers",
  Security: "links.security",
  Compliance: "links.compliance",
  Partners: "links.partners",
  Enterprise: "links.enterprise",
};

export async function breadcrumbJsonLd(locale: string, items: BreadcrumbEntry[]) {
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => {
      const translationKey = STATIC_BREADCRUMB_LABEL_KEYS[item.label];
      return {
        "@type": "ListItem",
        position: index + 1,
        name: translationKey ? t(translationKey as Parameters<typeof t>[0]) : item.label,
        item: localizedUrl(locale, item.href === "/" ? "" : item.href),
      };
    }),
  };
}

interface SoftwareApplicationInput {
  name: string;
  description: string;
  url: string;
}

export function softwareApplicationJsonLd({ name, description, url }: SoftwareApplicationInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url: `${site.url}${url}`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      url: `${site.url}/pricing`,
    },
  };
}

export function faqPageJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function jobPostingJsonLd(job: JobListing) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    datePosted: job.datePosted,
    employmentType: job.employmentType.toUpperCase().replace("-", "_"),
    hiringOrganization: {
      "@type": "Organization",
      name: site.name,
      sameAs: site.url,
    },
    jobLocation: {
      "@type": "Place",
      address: { "@type": "PostalAddress", addressLocality: job.location },
    },
  };
}

/**
 * `authorName` is resolved by the caller (either from a live System B
 * author or the hardcoded authors.ts + next-intl translation) rather than
 * looked up here — this function has no data-source dependency of its
 * own, so it works identically whether `post` came from System B or the
 * hardcoded fallback.
 */
export function articleJsonLd(post: Pick<BlogPost, "title" | "excerpt" | "publishedDate" | "updatedDate" | "slug" | "image">, authorName?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate ?? post.publishedDate,
    author: { "@type": "Organization", name: authorName ?? site.name },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    url: `${site.url}/blog/${post.slug}`,
    ...(post.image ? { image: post.image } : {}),
  };
}

export function productOffersJsonLd(plans: PricingPlan[]) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${site.name} subscription plans`,
    description: site.description,
    offers: plans
      .filter((plan) => plan.monthlyPrice !== null)
      .map((plan) => ({
        "@type": "Offer",
        name: plan.name,
        price: plan.monthlyPrice,
        priceCurrency: plan.currency ?? "USD",
        url: `${site.url}/pricing`,
      })),
  };
}
