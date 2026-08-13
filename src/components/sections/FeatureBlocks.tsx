import { getTranslations } from "next-intl/server";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface FeatureBlock {
  headline: string;
  description: string;
  proof: { stat: string; label: string };
}

interface FeatureBlocksProps {
  items: FeatureBlock[];
}

/** 3–5 feature blocks with a supporting proof point each (SRS 7.3). */
export async function FeatureBlocks({ items }: FeatureBlocksProps) {
  const t = await getTranslations("capabilityPageChrome");
  return (
    <section className="bg-neutral-50 py-20">
      <div className="container-content">
        <SectionHeading eyebrow={t("capabilitiesEyebrow")} headline={t("whatItDoes")} />
        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item) => (
            <li
              key={item.headline}
              className="flex flex-col justify-between rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6"
            >
              <div>
                <h3 className="text-lg font-semibold text-neutral-900">{item.headline}</h3>
                <p className="mt-2 text-sm leading-normal text-neutral-600">{item.description}</p>
              </div>
              <div className="mt-6 flex items-baseline gap-2 border-t border-neutral-100 pt-4">
                <span className="text-2xl font-bold text-primary-600">{item.proof.stat}</span>
                <span className="text-sm text-neutral-500">{item.proof.label}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
