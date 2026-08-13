import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface HowItWorksStep {
  headline: string;
  description: string;
}

interface HowItWorksProps {
  items: HowItWorksStep[];
}

/** 3–4 step "how it works" sequence (SRS 7.3). */
export async function HowItWorks({ items }: HowItWorksProps) {
  const t = await getTranslations("capabilityPageChrome");
  return (
    <section className="bg-white dark:bg-neutral-100 py-20">
      <div className="container-content">
        <SectionHeading eyebrow={t("howItWorksEyebrow")} headline={t("howItWorksHeadline")} align="center" className="mx-auto" />
        <ol className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((step, index) => (
            <li key={step.headline} className="relative">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white dark:text-neutral-50">
                {index + 1}
              </span>
              <h3 className="mt-4 text-base font-semibold text-neutral-900">{step.headline}</h3>
              <p className="mt-2 text-sm leading-normal text-neutral-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
