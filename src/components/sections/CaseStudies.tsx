import { useTranslations } from "next-intl";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { customerStories } from "@/lib/content/customer-stories";
import { SectionHeading } from "@/components/ui/SectionHeading";

const featured = customerStories.slice(0, 3);

/**
 * Golden-hour gradient tones layer over each story's photo as a low-opacity
 * wash — ties four otherwise-unrelated stock photos into one consistent,
 * on-brand palette instead of showing them raw. The from/via stops are
 * bespoke per-item darkened shades with no design-token equivalent; the end
 * stop reuses the existing gold tokens (--color-primary-500 / --color-gold-dark
 * / --color-gold-grad-bottom) instead of repeating their literal hex.
 */
const gradientBySlug: Record<string, string> = {
  "northwind-traders": "from-[#2a2115] via-[#5c4520] to-[var(--color-primary-500)]",
  "cedarline-health": "from-[#241d13] via-[#4f3c1e] to-[var(--color-gold-grad-bottom)]",
  "fernbridge-realty": "from-[#231e14] via-[#4a3a1e] to-[var(--color-gold-dark)]",
  "meridian-analytics": "from-[#2b2216] via-[#5a4622] to-[var(--color-primary-500)]",
};

/** Three case-study cards: gradient image, title, description, "Read Case Study" link. Hover: image zoom + elevation. */
export function CaseStudies() {
  const t = useTranslations("home.caseStudies");
  const tc = useTranslations("common.cta");
  const tStories = useTranslations("customerStoriesPage.stories");
  return (
    <section className="bg-neutral-50 py-16">
      <div className="container-content">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading eyebrow={t("eyebrow")} headline={t("headline")} />
          <Link href="/customer-stories" className="flex items-center gap-1 text-sm font-semibold text-primary-600 hover:text-primary-700">
            {tc("viewAllCaseStudies")}
            <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
          </Link>
        </div>

        <ul className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {featured.map((story) => (
            <li key={story.slug} className="group">
              <Link
                href={`/customer-stories/${story.slug}`}
                className="flex h-full flex-col overflow-hidden rounded-xl shadow-card transition-shadow duration-300 hover:shadow-card-hover"
              >
                <div className="relative aspect-[16/9] shrink-0 overflow-hidden">
                  <Image
                    src={story.image}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 33vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div aria-hidden="true" className={`absolute inset-0 bg-gradient-to-br ${gradientBySlug[story.slug]} opacity-40`} />
                </div>
                <div className="flex flex-1 flex-col rounded-b-xl border border-t-0 border-neutral-200 bg-white dark:bg-neutral-100 p-5">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    {story.headlineMetric.value} {tStories(`${story.slug}.headlineMetricLabel` as Parameters<typeof tStories>[0])}
                  </h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">
                    {tStories(`${story.slug}.result` as Parameters<typeof tStories>[0])}
                  </p>
                  <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-primary-600">
                    {tc("readCaseStudy")}
                    <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
                  </span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
