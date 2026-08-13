import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Handshake, Repeat, Cpu, Building2 } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PartnerApplicationForm } from "@/components/forms/PartnerApplicationForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "partnersPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/partners"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/partners") },
  };
}

const partnerIcons = [Repeat, Handshake, Cpu, Building2];

export default async function PartnersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("partnersPage");
  const tLinks = await getTranslations("common.links");
  const partnerTypes = (t.raw("partnerTypes") as { label: string; description: string }[]).map((p, i) => ({
    ...p,
    icon: partnerIcons[i],
  }));

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Partners", href: "/partners" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero eyebrow={tLinks("partners")} headline={t("headline")} subhead={t("subhead")} />

        <section className="bg-white dark:bg-neutral-100 py-16">
          <div className="container-content">
            <SectionHeading eyebrow={t("types.eyebrow")} headline={t("types.headline")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {partnerTypes.map((type) => (
                <li key={type.label} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                  <type.icon aria-hidden="true" className="h-7 w-7 text-primary-600" strokeWidth={1.75} />
                  <h3 className="mt-3 font-semibold text-neutral-900">{type.label}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{type.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-16">
          <div className="container-content max-w-xl">
            <SectionHeading eyebrow={t("apply.eyebrow")} headline={t("apply.headline")} />
            <div className="mt-8 rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-8 shadow-sm">
              <PartnerApplicationForm />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
