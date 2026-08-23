import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Mail, Phone, MapPin, ArrowRight } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd, organizationJsonLd, localBusinessJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/content/site";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getSiteSettings } from "@/lib/services/site-settings";

const mapsEmbedSrc = `https://www.google.com/maps?q=${site.contact.geo.lat},${site.contact.geo.lng}&z=16&output=embed`;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: localizedAlternates(locale, "/contact"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: `${t("metaTitle")} ${site.name}`,
      description: t("metaDescription"),
      url: localizedUrl(locale, "/contact"),
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact");
  const tc = await getTranslations("common.cta");
  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: t("eyebrow"), href: "/contact" },
  ]);

  // Dashboard-managed values (SRS §22 Contact Information) override the
  // hardcoded defaults when set, same merge-with-fallback pattern as
  // Footer.tsx. WhatsApp, the maps link, and geo-coordinates have no
  // equivalent field in the admin's Settings module yet, so those stay
  // hardcoded.
  const remote = await getSiteSettings();
  const { email: fallbackEmail, phone: fallbackPhone } = site.contact;
  const email = remote?.settings.contact.supportEmail || fallbackEmail;
  const phone = remote?.settings.contact.phone || fallbackPhone;

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="organization-jsonld" data={await organizationJsonLd()} />
      <JsonLd id="local-business-jsonld" data={await localBusinessJsonLd()} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={t("eyebrow")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: t("eyebrow"), href: "/contact" }]} />}
        />

        <section className="bg-white dark:bg-neutral-50 py-20">
          <div className="container-content grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-8 shadow-sm">
              <ContactForm />
            </div>

            <aside className="space-y-6">
              <div className="rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-100 p-6">
                <h2 className="text-sm font-semibold text-neutral-900">{t("contactInformation")}</h2>
                <ul className="mt-4 space-y-3 text-sm text-neutral-700">
                  <li className="flex items-start gap-2">
                    <Mail aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" strokeWidth={1.75} />
                    <a
                      href={`mailto:${email}`}
                      aria-label={`Email ${site.name} at ${email}`}
                      dir="ltr"
                      className="hover:text-primary-600"
                    >
                      {email}
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <WhatsAppIcon aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" />
                    <a
                      href={`https://wa.me/${site.contact.whatsapp.replace(/[^\d]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Message ${site.name} on WhatsApp at ${site.contact.whatsapp}`}
                      dir="ltr"
                      className="hover:text-primary-600"
                    >
                      {site.contact.whatsapp}
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <Phone aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" strokeWidth={1.75} />
                    <a
                      href={`tel:${phone.replace(/[^+\d]/g, "")}`}
                      aria-label={`Call ${site.name} at ${phone}`}
                      dir="ltr"
                      className="hover:text-primary-600"
                    >
                      {phone}
                    </a>
                  </li>
                  <li className="flex items-start gap-2">
                    <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary-600" strokeWidth={1.75} />
                    <a
                      href={site.contact.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${site.name} headquarters address — open in Google Maps`}
                      className="hover:text-primary-600"
                    >
                      {t("address")}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-100 p-6">
                <h2 className="text-sm font-semibold text-neutral-900">{t("lookingForSomethingSpecific")}</h2>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <Link href="/demo" className="flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700">
                      {tc("bookDemo")}
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 rtl:rotate-180" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/enterprise" className="flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700">
                      {t("enterpriseSalesInquiries")}
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 rtl:rotate-180" />
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="flex items-center gap-1 font-medium text-primary-600 hover:text-primary-700">
                      {t("frequentlyAskedQuestions")}
                      <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 rtl:rotate-180" />
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section className="bg-neutral-50 pb-20">
          <div className="container-content">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-neutral-900">{t("visitOurOffice")}</h2>
                <a
                  href={site.contact.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.name} headquarters address — open in Google Maps`}
                  className="mt-1 inline-block text-sm text-neutral-600 hover:text-primary-600"
                >
                  {t("address")}
                </a>
              </div>
              <a
                href={site.contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Get directions to ${site.name} headquarters on Google Maps`}
                className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700"
              >
                {tc("getDirections")}
                <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
              </a>
            </div>
            <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 shadow-card">
              <iframe
                src={mapsEmbedSrc}
                title={`Map showing ${site.name} headquarters location`}
                width="100%"
                height="380"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
