import { useTranslations } from "next-intl";
import { CheckCircle2 } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function AIModule() {
  const t = useTranslations("platformPage.aiModule");
  const points = t.raw("points") as { headline: string; description: string }[];
  return (
    <section className="bg-footer py-20">
      <div className="container-content grid items-center gap-12 lg:grid-cols-2">
        <div>
          <SectionHeading
            eyebrow={t("eyebrow")}
            headline={t("headline")}
            className="[&_h2]:text-white [&_p]:text-primary-300 dark:[&_p]:text-primary-600"
          />
          <ul className="mt-8 space-y-6">
            {points.map((point) => (
              <li key={point.headline} className="flex gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="mt-1 h-5 w-5 flex-shrink-0 text-primary-400"
                  strokeWidth={1.75}
                />
                <div>
                  <p className="font-semibold text-white">{point.headline}</p>
                  <p className="mt-1 text-sm leading-normal text-neutral-300 dark:text-white/60">
                    {point.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div
          aria-hidden="true"
          className="relative aspect-square rounded-xl border border-white/10 bg-gradient-to-br from-primary-900/60 via-neutral-800 to-footer dark:from-primary-100/60 dark:via-[#262626] p-8"
        >
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <div className="h-24 w-24 rounded-2xl border border-primary-400/40 bg-primary-500/20" />
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-lg border border-primary-400/30 bg-primary-500/10" />
              <div className="h-10 w-10 rounded-lg border border-primary-400/30 bg-primary-500/10" />
              <div className="h-10 w-10 rounded-lg border border-primary-400/30 bg-primary-500/10" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
