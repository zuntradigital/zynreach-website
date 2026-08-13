import { getTranslations, getLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { Footer } from "@/components/layout/Footer";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

/**
 * SRS 7.20: Next.js automatically returns a true HTTP 404 status for this
 * file (never a soft-404 200), satisfying the SEO requirement.
 */
export default async function NotFound() {
  const t = await getTranslations("common");
  const locale = await getLocale();

  return (
    <>
      <NavigationBar />
      <main id="main-content" className="flex flex-1 items-center justify-center bg-neutral-50 py-24">
        <div className="container-content max-w-lg text-center">
          <p className="text-sm font-semibold text-primary-600">{t("notFound.eyebrow")}</p>
          <SectionHeading
            headline={t("notFound.heading")}
            body={t("notFound.body")}
            align="center"
            className="mx-auto"
          />
          <form action={`/${locale}/search`} className="mt-8 flex gap-2">
            <label htmlFor="404-search" className="sr-only">
              {t("nav.search")}
            </label>
            <input
              id="404-search"
              name="q"
              type="text"
              placeholder={t("notFound.searchPlaceholder")}
              className="min-h-11 flex-1 rounded-md border border-neutral-300 px-3 text-sm"
            />
            <Button type="submit" variant="primary">
              {t("notFound.searchButton")}
            </Button>
          </form>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/" variant="secondary">
              {t("notFound.home")}
            </Button>
            <Button href="/platform" variant="secondary">
              {t("nav.platform")}
            </Button>
            <Button href="/pricing" variant="secondary">
              {t("nav.pricing")}
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
