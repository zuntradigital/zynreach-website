import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
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

  const introParagraphs = t.raw("intro.paragraphs") as string[];
  const problemParagraphs = t.raw("problem.paragraphs") as string[];
  const originParagraphs = t.raw("origin.paragraphs") as string[];
  const visionParagraphs = t.raw("vision.paragraphs") as string[];
  const missionPillars = t.raw("mission.pillars") as { title: string; description: string }[];
  const focusAreas = t.raw("productPhilosophy.focusAreas") as { title: string; description: string }[];
  const audienceQuestions = t.raw("audience.questions") as string[];
  const destinationParagraphs = t.raw("destination.paragraphs") as string[];
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
          <div className="container-content max-w-3xl">
            <SectionHeading eyebrow={t("intro.eyebrow")} headline={t("intro.headline")} />
            <div className="mt-8 space-y-5">
              {introParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-normal text-neutral-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content max-w-3xl">
            <SectionHeading eyebrow={t("problem.eyebrow")} headline={t("problem.headline")} />
            <div className="mt-8 space-y-5">
              {problemParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-normal text-neutral-700">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content max-w-3xl">
            <SectionHeading eyebrow={t("origin.eyebrow")} headline={t("origin.headline")} />
            <div className="mt-8 space-y-5">
              {originParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-normal text-neutral-700">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-8 text-lg font-semibold text-neutral-900 text-balance">{t("origin.tagline")}</p>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content max-w-3xl">
            <SectionHeading eyebrow={t("vision.eyebrow")} headline={t("vision.headline")} />
            <div className="mt-8 space-y-5">
              {visionParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-normal text-neutral-700">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-8 rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 text-base font-semibold text-neutral-900 text-balance">
              {t("vision.statement")}
            </p>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("mission.eyebrow")} headline={t("mission.headline")} body={t("mission.intro")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {missionPillars.map((pillar) => (
                <li key={pillar.title} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="font-semibold text-neutral-900">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{pillar.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content">
            <SectionHeading
              eyebrow={t("productPhilosophy.eyebrow")}
              headline={t("productPhilosophy.headline")}
              body={t("productPhilosophy.paragraph")}
            />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {focusAreas.map((area) => (
                <li key={area.title} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                  <h3 className="font-semibold text-neutral-900">{area.title}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{area.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content max-w-3xl">
            <SectionHeading eyebrow={t("ai.eyebrow")} headline={t("ai.headline")} body={t("ai.paragraph")} />
            <p className="mt-6 text-base font-semibold text-neutral-900">{t("ai.goal")}</p>
            <p className="mt-4 text-sm font-medium uppercase tracking-wide text-primary-600">{t("ai.tagline")}</p>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content max-w-3xl">
            <SectionHeading eyebrow={t("audience.eyebrow")} headline={t("audience.headline")} body={t("audience.intro")} />
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {audienceQuestions.map((question) => (
                <li
                  key={question}
                  className="rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100 px-4 py-3 text-sm font-medium text-neutral-800"
                >
                  {question}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-base leading-normal text-neutral-700">{t("audience.closing")}</p>
          </div>
        </section>

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("values.eyebrow")} headline={t("values.headline")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {companyValues.map((value) => (
                <li key={value.headline} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="font-semibold text-neutral-900">{value.headline}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{value.description}</p>
                </li>
              ))}
            </ul>
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
          <div className="container-content max-w-3xl">
            <SectionHeading eyebrow={t("destination.eyebrow")} headline={t("destination.headline")} />
            <div className="mt-8 space-y-5">
              {destinationParagraphs.map((paragraph) => (
                <p key={paragraph} className="text-base leading-normal text-neutral-700">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-8 text-lg font-semibold text-neutral-900 text-balance">{t("destination.closingStatement")}</p>
          </div>
        </section>

        <section className="bg-footer py-16">
          <div className="container-content flex flex-col items-center gap-2 text-center">
            <p className="text-xl font-bold text-white">{t("brandClosing.tagline1")}</p>
            <p className="text-xl font-bold text-white">{t("brandClosing.tagline2")}</p>
            <p className="mt-4 max-w-xl text-base text-white/70">{t("brandClosing.body")}</p>
            <p className="mt-2 max-w-xl text-base font-semibold text-white text-balance">{t("brandClosing.punch")}</p>
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
