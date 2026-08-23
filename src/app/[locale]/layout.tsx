import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Inter, Playfair_Display, Noto_Sans_Arabic, Amiri } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import { SkipLink } from "@/components/layout/SkipLink";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { NavVisibilityProvider } from "@/components/layout/NavVisibilityProvider";
import { FloatingContactActions } from "@/components/layout/FloatingContactActions";
import { WelcomePopup } from "@/components/layout/WelcomePopup";
import { TawkChat } from "@/components/chat/TawkChat";
import { SalesChatWidget } from "@/components/chat/SalesChatWidget";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/content/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { localizedAlternates, openGraphDefaults } from "@/lib/seo";
import { getSiteSettings } from "@/lib/services/site-settings";
import "../globals.css";

const THEME_STORAGE_KEY = "zynreach-theme";

// Runs before hydration so the correct theme applies on first paint — no
// flash of the wrong theme. Kept as a plain string (not a module import)
// since it must execute as an inline script, outside the React tree.
const themeInitScript = `
(function () {
  try {
    var stored = localStorage.getItem("${THEME_STORAGE_KEY}");
    var theme = stored === "light" || stored === "dark" ? stored : null;
    if (!theme) {
      theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["600", "700"],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: "--font-noto-arabic",
  subsets: ["arabic"],
  display: "swap",
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "700"],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale, namespace: "metadata" });

  // Dashboard-managed values (SRS §22 SEO Defaults / Site Identity) override
  // the hardcoded defaults when set. Only siteName and defaultOgImageUrl are
  // wired here — both are language-invariant (a brand name, an image URL) —
  // titleSuffix and defaultMetaDescription are deliberately left untouched:
  // the admin's Settings module stores one flat string per field with no
  // per-locale variant, so substituting it in for t("homeTitle")/
  // t("homeDescription") would silently overwrite whichever locale's
  // properly-translated copy doesn't match that single string, breaking
  // EN/AR parity. See final audit report for this as a known structural gap.
  const remote = await getSiteSettings();
  const siteName = remote?.settings.identity.siteName || site.name;
  const ogImage = remote?.settings.seo.defaultOgImageUrl || "/opengraph-image";

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("homeTitle"),
      template: `%s — ${siteName}`,
    },
    description: t("homeDescription"),
    // Every page overrides this with its own path-specific alternates via
    // localizedAlternates() — this is only the fallback for the rare route
    // that doesn't (there are none left, but a wrong default is worse than
    // a redundant correct one).
    alternates: localizedAlternates(locale, ""),
    openGraph: {
      ...openGraphDefaults(locale),
      siteName,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      url: `${site.url}/${locale}`,
    },
    twitter: {
      card: "summary_large_image",
    },
  };
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  // Enables static rendering for this locale — see next-intl docs on
  // setRequestLocale for the App Router "static rendering" recipe.
  setRequestLocale(locale);

  const dir = localeDirection[locale as Locale];

  // Dashboard-managed values (SRS §22 Analytics / Cookie Consent) — both
  // are language-invariant (a container ID, a boolean default), so unlike
  // the SEO title/description above these are safe to override outright.
  // bannerCopy is deliberately NOT wired here: it's a single flat string
  // meant to replace CookieBanner's several distinct, separately-
  // translated strings (short/long text, per-category labels, three
  // button labels), so there's no correct single place to substitute it
  // without guessing — same structural gap as the SEO fields above.
  const remote = await getSiteSettings();
  const gtmContainerId = remote?.settings.analytics.gtmContainerId || undefined;
  const analyticsDefault = remote?.settings.consent.analyticsDefault ?? true;
  const banners = remote?.banners ?? [];
  const navigationSettings = remote?.settings.navigation ?? {};

  return (
    <html
      lang={locale}
      dir={dir}
      suppressHydrationWarning
      className={`${inter.variable} ${playfair.variable} ${notoSansArabic.variable} ${amiri.variable} h-full antialiased`}
    >
      <head>
        <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <JsonLd id="organization-jsonld" data={await organizationJsonLd()} />
        <JsonLd id="website-jsonld" data={websiteJsonLd()} />
        <GoogleTagManager containerId={gtmContainerId} />
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider>
            <SkipLink />
            <AnnouncementBanner banners={banners} />
            <NavVisibilityProvider settings={navigationSettings}>{children}</NavVisibilityProvider>
            <FloatingContactActions />
            <WelcomePopup />
            <TawkChat />
            <SalesChatWidget />
            <CookieBanner defaultAnalyticsEnabled={analyticsDefault} />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
