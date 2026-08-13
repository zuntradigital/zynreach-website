import { getTranslations } from "next-intl/server";

interface ComparisonSectionProps {
  title: string;
  statusQuo: string;
  withZynReach: string;
}

/** "Comparison to status quo" section (SRS 7.3, e.g. "CRM vs. spreadsheets"). */
export async function ComparisonSection({ title, statusQuo, withZynReach }: ComparisonSectionProps) {
  const t = await getTranslations("capabilityPageChrome");
  return (
    <section className="bg-footer py-20">
      <div className="container-content">
        <h2 className="text-center text-3xl font-bold text-white sm:text-4xl">{title}</h2>
        <div className="mx-auto mt-12 grid max-w-4xl gap-6 sm:grid-cols-2">
          <div className="rounded-xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-neutral-400 dark:text-white/50">
              {t("statusQuoLabel")}
            </p>
            <p className="mt-3 text-base leading-normal text-neutral-300 dark:text-white/70">{statusQuo}</p>
          </div>
          <div className="rounded-xl border border-primary-400/30 bg-primary-500/10 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary-300 dark:text-primary-600">
              {t("withZynReachLabel")}
            </p>
            <p className="mt-3 text-base leading-normal text-white">{withZynReach}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
