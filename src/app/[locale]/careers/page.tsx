import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { JobListings } from "@/components/sections/JobListings";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/structured-data";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedCareers } from "@/lib/services/careers-content";
import { jobListings as hardcodedJobListings } from "@/lib/content/careers";

// Careers is admin-direct-save with no publish step (see ZynReach Admin's
// PATCH /api/admin/careers/[id] docstring) — a Save's Draft/Published
// choice must be visible immediately, so unlike time-based ISR this route
// is always dynamically rendered.
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "careersPage" });
  return {
    title: t("headline"),
    description: t("subhead"),
    alternates: localizedAlternates(locale, "/careers"),
    openGraph: { ...openGraphDefaults(locale), title: t("headline"), description: t("subhead"), url: localizedUrl(locale, "/careers") },
  };
}

export default async function CareersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("careersPage");
  const tJobs = await getTranslations("careersPage.jobs");
  const tLinks = await getTranslations("common.links");
  const benefits = t.raw("benefits") as { headline: string; description: string }[];
  const employeeTestimonial = {
    quote: t("testimonial.quote"),
    authorName: t("testimonial.authorName"),
    authorTitle: t("testimonial.authorTitle"),
    company: t("testimonial.company"),
  };

  const liveCareers = await getPublishedCareers(locale);
  const jobs = liveCareers
    ? liveCareers.jobListings.map((j) => ({ id: j.id, title: j.title, team: j.team, location: j.location }))
    : hardcodedJobListings.map((j) => ({
        id: j.id,
        title: tJobs(`${j.id}.title` as Parameters<typeof tJobs>[0]),
        team: tJobs(`${j.id}.team` as Parameters<typeof tJobs>[0]),
        location: tJobs(`${j.id}.location` as Parameters<typeof tJobs>[0]),
      }));

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Careers", href: "/careers" },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          eyebrow={tLinks("careers")}
          headline={t("headline")}
          subhead={t("subhead")}
          breadcrumbs={<Breadcrumbs items={[{ label: "Home", href: "/" }, { label: tLinks("careers"), href: "/careers" }]} />}
        />

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("benefitsSection.eyebrow")} headline={t("benefitsSection.headline")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <li key={benefit.headline} className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
                  <h3 className="font-semibold text-neutral-900">{benefit.headline}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{benefit.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={t("rolesSection.eyebrow")} headline={t("rolesSection.headline")} />
            <div className="mt-10">
              <JobListings jobs={jobs} />
            </div>
          </div>
        </section>

        <TestimonialSection item={employeeTestimonial} />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
