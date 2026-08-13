import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPin, Briefcase } from "lucide-react";
import { NavigationBar } from "@/components/layout/NavigationBar";
import { MobileStickyCta } from "@/components/layout/MobileStickyCta";
import { Footer } from "@/components/layout/Footer";
import { Breadcrumbs } from "@/components/layout/Breadcrumbs";
import { PageHero } from "@/components/sections/PageHero";
import { CareerApplicationForm } from "@/components/forms/CareerApplicationForm";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { jobListings, type JobListing } from "@/lib/content/careers";
import { breadcrumbJsonLd, jobPostingJsonLd } from "@/lib/structured-data";
import { site } from "@/lib/content/site";
import { localizedAlternates, localizedUrl, openGraphDefaults } from "@/lib/seo";
import { getPublishedCareers } from "@/lib/services/careers-content";

// Careers is admin-direct-save with no publish step — see the careers
// list page's own `revalidate = 0` comment.
export const revalidate = 0;

interface JobPageProps {
  params: Promise<{ locale: string; jobId: string }>;
}

export function generateStaticParams() {
  return jobListings.map((job) => ({ jobId: job.id }));
}

function getJob(jobId: string) {
  return jobListings.find((job) => job.id === jobId);
}

export async function generateMetadata({ params }: JobPageProps): Promise<Metadata> {
  const { locale, jobId } = await params;

  const liveCareers = await getPublishedCareers(locale);
  const liveJob = liveCareers?.jobListings.find((j) => j.id === jobId);
  if (liveJob) {
    const url = `/careers/${jobId}`;
    return {
      title: `${liveJob.title} — Careers`,
      description: liveJob.description,
      alternates: localizedAlternates(locale, url),
      openGraph: { ...openGraphDefaults(locale), title: `${liveJob.title} at ${site.name}`, description: liveJob.description, url: localizedUrl(locale, url) },
    };
  }
  if (liveCareers) return {};

  const raw = getJob(jobId);
  if (!raw) return {};

  const t = await getTranslations({ locale, namespace: `careersPage.jobs.${raw.id}` as "careersPage.jobs" });
  const title = t("title");
  const description = t("description");
  const url = `/careers/${raw.id}`;
  return {
    title: `${title} — Careers`,
    description,
    alternates: localizedAlternates(locale, url),
    openGraph: { ...openGraphDefaults(locale), title: `${title} at ${site.name}`, description, url: localizedUrl(locale, url) },
  };
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { locale, jobId } = await params;
  setRequestLocale(locale);

  const tCareers = await getTranslations("careersPage");
  const tJobDetail = await getTranslations("jobDetailPage");
  const tLinks = await getTranslations("common.links");

  const liveCareers = await getPublishedCareers(locale);
  const liveJob = liveCareers?.jobListings.find((j) => j.id === jobId);

  let job: JobListing;
  if (liveJob) {
    job = liveJob;
  } else if (liveCareers) {
    // System B reachable and this slug genuinely isn't a published listing.
    notFound();
  } else {
    const raw = getJob(jobId);
    if (!raw) notFound();
    const t = await getTranslations(`careersPage.jobs.${raw.id}`);
    job = {
      ...raw,
      title: t("title"),
      team: t("team"),
      location: t("location"),
      employmentType: t("employmentType"),
      description: t("description"),
      responsibilities: t.raw("responsibilities") as string[],
      qualifications: t.raw("qualifications") as string[],
      preferredSkills: t.raw("preferredSkills") as string[],
    };
  }
  const benefits = tCareers.raw("benefits") as { headline: string; description: string }[];
  const employeeTestimonial = {
    quote: tCareers("testimonial.quote"),
    authorName: tCareers("testimonial.authorName"),
    authorTitle: tCareers("testimonial.authorTitle"),
    company: tCareers("testimonial.company"),
  };

  const breadcrumbs = await breadcrumbJsonLd(locale, [
    { label: "Home", href: "/" },
    { label: "Careers", href: "/careers" },
    { label: job.title, href: `/careers/${job.id}` },
  ]);

  return (
    <>
      <JsonLd id="breadcrumbs-jsonld" data={breadcrumbs} />
      <JsonLd id="job-posting-jsonld" data={jobPostingJsonLd(job)} />
      <NavigationBar />
      <main id="main-content" className="flex-1">
        <PageHero
          headline={job.title}
          breadcrumbs={
            <Breadcrumbs
              items={[
                { label: tLinks("careers"), href: "/careers" },
                { label: job.title, href: `/careers/${job.id}` },
              ]}
            />
          }
        />

        <section className="bg-white dark:bg-neutral-100 py-20">
          <div className="container-content grid gap-12 lg:grid-cols-[2fr_1fr]">
            <div>
              <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Briefcase aria-hidden="true" className="h-4 w-4" />
                  {job.team} · {job.employmentType}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin aria-hidden="true" className="h-4 w-4" />
                  {job.location}
                </span>
              </div>
              <p className="mt-6 text-base leading-normal text-neutral-700">{job.description}</p>

              <h2 className="mt-10 text-lg font-semibold text-neutral-900">{tJobDetail("responsibilitiesHeading")}</h2>
              <ul className="mt-3 list-disc space-y-2 ps-6 text-base leading-normal text-neutral-700">
                {job.responsibilities.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2 className="mt-10 text-lg font-semibold text-neutral-900">{tJobDetail("qualificationsHeading")}</h2>
              <ul className="mt-3 list-disc space-y-2 ps-6 text-base leading-normal text-neutral-700">
                {job.qualifications.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2 className="mt-10 text-lg font-semibold text-neutral-900">{tJobDetail("preferredSkillsHeading")}</h2>
              <ul className="mt-3 list-disc space-y-2 ps-6 text-base leading-normal text-neutral-700">
                {job.preferredSkills.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div id="apply" className="rounded-xl border border-neutral-200 bg-neutral-50 p-8">
              <h2 className="text-lg font-semibold text-neutral-900">{tJobDetail("applyHeading")}</h2>
              <div className="mt-6">
                <CareerApplicationForm jobId={job.id} jobTitle={job.title} />
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-50 py-20">
          <div className="container-content">
            <SectionHeading eyebrow={tCareers("benefitsSection.eyebrow")} headline={tCareers("benefitsSection.headline")} />
            <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {benefits.map((benefit) => (
                <li key={benefit.headline} className="rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6">
                  <h3 className="font-semibold text-neutral-900">{benefit.headline}</h3>
                  <p className="mt-2 text-sm text-neutral-600">{benefit.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <TestimonialSection item={employeeTestimonial} />
      </main>
      <Footer />
      <MobileStickyCta />
    </>
  );
}
