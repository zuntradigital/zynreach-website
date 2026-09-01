import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

interface LegalCenterCard {
  title: string;
  description: string;
  href: string;
}

interface LegalCenterCategory {
  heading: string;
  cards: LegalCenterCard[];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "legalCenterPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/legal"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/legal") },
  };
}

/**
 * Legal Center hub — a card grid of every legal/compliance document,
 * grouped by category, plus a promo banner into the Security & Trust
 * Center (the deeper security/compliance document library lives there,
 * not on this page — see /security). Full-bleed dark treatment (bg-footer)
 * matching the source brief's mockup, reusing the same dark-section
 * tokens PageHero/Footer already use elsewhere on the site rather than
 * introducing a new palette.
 */
export default async function LegalCenterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("legalCenterPage");
  const categories = t.raw("categories") as LegalCenterCategory[];

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: t("eyebrow"), href: "/legal" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1 bg-footer">
        <div className="container-content py-16 sm:py-20">
          <div className="text-white/60">
            <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: t("eyebrow"), href: "/legal" }]} />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-primary-400">{t("eyebrow")}</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl text-balance">{t("headline")}</h1>
          <p className="mt-4 max-w-2xl text-base leading-normal text-white/70">{t("subhead")}</p>

          <div className="mt-14 space-y-12">
            {categories.map((category) => (
              <section key={category.heading}>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-white/50">{category.heading}</h2>
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {category.cards.map((card) => (
                    <Link
                      key={card.href}
                      href={card.href}
                      className="group flex flex-col justify-between rounded-xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-primary-400/40 hover:bg-white/[0.06]"
                    >
                      <div>
                        <h3 className="font-semibold text-white">{card.title}</h3>
                        <p className="mt-2 text-sm leading-normal text-white/60">{card.description}</p>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-400">
                        {t("cardLinkLabel")}
                        <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start justify-between gap-6 rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary-400/30 bg-primary-400/10">
                <ShieldCheck aria-hidden="true" className="h-6 w-6 text-primary-400" />
              </span>
              <div>
                <h2 className="font-semibold text-white">{t("securityCta.title")}</h2>
                <p className="mt-1.5 max-w-lg text-sm leading-normal text-white/60">{t("securityCta.description")}</p>
              </div>
            </div>
            <Link
              href="/security"
              className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-medium text-white hover:bg-white/15"
            >
              <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
              {t("securityCta.button")}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
