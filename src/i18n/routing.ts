import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "ar"],
  defaultLocale: "ar",
  localePrefix: "always",
  // Root `/` must always redirect to the default locale — without this,
  // next-intl's proxy negotiates via the NEXT_LOCALE cookie and the
  // browser's Accept-Language header before falling back to defaultLocale,
  // so an English-preferring browser (or a returning visitor with an
  // existing locale cookie) could land on /en instead. Explicit /en/... and
  // /ar/... requests are unaffected either way — this only governs the
  // unprefixed-root case.
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];

export const localeDirection: Record<Locale, "ltr" | "rtl"> = {
  en: "ltr",
  ar: "rtl",
};
