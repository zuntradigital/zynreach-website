import type { MetadataRoute } from "next";
import { site } from "@/lib/content/site";

/**
 * SRS Section 15: robots.txt, pointing crawlers at the sitemap.
 *
 * Only /api/ is disallowed here. /search used to be listed too, but that
 * was already a no-op — every real page lives under a locale prefix
 * (/en/search, /ar/search), so a bare "/search" prefix rule never matched
 * it. It's intentionally not "fixed" to `/*\/search` either: that page
 * already self-excludes via `robots: { index: false, follow: true }` in
 * its own metadata (see src/app/[locale]/search/page.tsx), which is the
 * correct mechanism — combining that with a robots.txt block is a known
 * anti-pattern (a disallowed page can never be crawled, so Google never
 * sees the noindex tag, and the URL can still surface in results as a
 * bare link with no snippet instead of being fully excluded).
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
