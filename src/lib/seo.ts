import { site } from "@/lib/content/site";
import { routing, type Locale } from "@/i18n/routing";

/** Every page.tsx types its route param as plain `string` (Next.js doesn't narrow dynamic segments to a union) — accepting that directly here avoids an `as Locale` cast at every call site. */
type LocaleParam = string;

/**
 * Canonical + hreflang alternates for a localized page.
 *
 * `path` is the locale-less path exactly as every page already builds it
 * for its own OpenGraph `url` (e.g. "/pricing", "/blog/my-post", or ""
 * for the home page) — this only adds the locale segment consistently.
 *
 * Every page on this site lives under a locale prefix (routing.localePrefix
 * is "always"), so a canonical without one — the pattern most pages used
 * before this fix — pointed at a URL that doesn't actually serve that
 * page's content; it 307s to the locale-prefixed version instead.
 */
export function localizedAlternates(locale: LocaleParam, path: string) {
  const languages = Object.fromEntries(
    routing.locales.map((l) => [l, `${site.url}/${l}${path}`])
  ) as Record<Locale, string>;

  return {
    canonical: `${site.url}/${locale}${path}`,
    languages: {
      ...languages,
      // Matches this site's actual configured behavior: routing.defaultLocale
      // is "ar" with locale detection disabled, so an unprefixed "/" always
      // resolves to the Arabic version — x-default should point at the same
      // page a browser lands on with no locale preference, not an assumption.
      "x-default": languages[routing.defaultLocale],
    },
  };
}

/** Absolute, locale-prefixed URL for a page — for OpenGraph `url` and JSON-LD. */
export function localizedUrl(locale: LocaleParam, path: string): string {
  return `${site.url}/${locale}${path}`;
}

export type OpenGraphType = "website" | "article";

/**
 * `openGraph` is one of the metadata fields Next.js resolves per-segment
 * as a whole object, not a deep merge — a page that returns its own
 * `openGraph: { title, description, url }` entirely replaces the root
 * layout's `openGraph` (including `siteName`/`locale`/the auto-detected
 * `opengraph-image.tsx`), rather than layering on top of it. Spreading
 * this first in every page's `openGraph` object restores those fields
 * consistently instead of relying on inheritance that doesn't apply here.
 *
 * `images` points at the site-wide opengraph-image.tsx route by its
 * relative path — resolved into an absolute URL via the `metadataBase`
 * already set in `[locale]/layout.tsx`, which is in scope for every page
 * under that layout (unlike the root-level route metadata files, which
 * sit outside it — see ForMe.txt / the audit report for that distinction).
 */
export function openGraphDefaults(locale: LocaleParam, type: OpenGraphType = "website") {
  return {
    type,
    siteName: site.name,
    locale: locale === "ar" ? "ar_EG" : "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  };
}
