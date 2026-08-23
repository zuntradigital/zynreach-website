import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { Timeline } from "@/components/ui/Timeline";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBand } from "@/components/sections/CtaBand";
import { JsonLd } from "@/components/seo/JsonLd";
import { leadershipTeam } from "@/lib/content/about";
import { breadcrumbJsonLd, organizationJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "aboutPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/about"),
    openGraph: {
      ...openGraphDefaults(locale),
      title: t("headline"),
      description: t("subhead"),
      url: localizedUrl(locale, "/about"),
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("aboutPage");
  const tLinks = await getTranslations("common.links");

  const timeline = t.raw("timeline") as { year: string; headline: string; description: string }[];
  const leadershipRoles = t.raw("leadershipRoles") as string[];
  const companyValues = t.raw("companyValues") as { headline: string; description: string }[];
  const localizedLeadership = leadershipTeam.map((member, index) => ({
    name: t("leadership.placeholderName"),
    role: leadershipRoles[index] ?? member.role,
  }));

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="organization-jsonld" data={await organizationJsonLd()} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tLinks("about")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: tLinks("about"), href: "/about" }]} />}
        />

        <section id="story" className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("story.eyebrow")} headline={t("story.headline")} />
            <div className="mt-12">
              <Timeline items={timeline} />
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("leadership.eyebrow")} headline={t("leadership.headline")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {localizedLeadership.map((member) => (
                <li key={member.role} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 text-center">
                  <div
                    role="img"
                    aria-label={`${member.name}, ${member.role}`}
                    className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700"
                  >
                    {member.role.charAt(0)}
                  </div>
                  <p className="mt-4 font-semibold text-neutral-900">{member.name}</p>
                  <p className="mt-1 text-sm text-neutral-500">{member.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("values.eyebrow")} headline={t("values.headline")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {companyValues.map((value) => (
                <li key={value.headline} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="font-semibold text-neutral-900">{value.headline}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{value.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <CtaBand
          headline={t("cta.headline")}
          body={t("cta.body")}
          ctaPrimary={{ label: t("cta.ctaPrimary"), href: "/careers" }}
          ctaSecondary={{ label: t("cta.ctaSecondary"), href: "/contact" }}
        />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
