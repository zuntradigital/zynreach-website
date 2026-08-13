import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Script from "next/script";
import { Inter, Playfair_Display, Noto_Sans_Arabic, Amiri } from "next/font/google";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing, localeDirection, type Locale } from "@/i18n/routing";
import { SkipLink } from "@/components/layout/SkipLink";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { FloatingContactActions } from "@/components/layout/FloatingContactActions";
import { WelcomePopup } from "@/components/layout/WelcomePopup";
import { TawkChat } from "@/components/chat/TawkChat";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { GoogleTagManager } from "@/components/analytics/GoogleTagManager";
import { JsonLd } from "@/components/seo/JsonLd";
import { site } from "@/lib/content/site";
import { organizationJsonLd, websiteJsonLd } from "@/lib/structured-data";
import { localizedAlternates, openGraphDefaults } from "@/lib/seo";
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

  return {
    metadataBase: new URL(site.url),
    title: {
      default: t("homeTitle"),
      template: `%s — ${site.name}`,
    },
    description: t("homeDescription"),
    // Every page overrides this with its own path-specific alternates via
    // localizedAlternates() — this is only the fallback for the rare route
    // that doesn't (there are none left, but a wrong default is worse than
    // a redundant correct one).
    alternates: localizedAlternates(locale, ""),
    openGraph: {
      ...openGraphDefaults(locale),
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
        <JsonLd id="organization-jsonld" data={organizationJsonLd()} />
        <JsonLd id="website-jsonld" data={websiteJsonLd()} />
        <GoogleTagManager />
        <NextIntlClientProvider locale={locale}>
          <ThemeProvider>
            <SkipLink />
            {children}
            <FloatingContactActions />
            <WelcomePopup />
            <TawkChat />
            <CookieBanner />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
