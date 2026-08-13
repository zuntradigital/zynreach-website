import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";

interface CapabilityCallout {
  label: string;
  href: string;
  description: string;
}

interface CapabilityCalloutsProps {
  items: CapabilityCallout[];
}

/** SRS 7.8 "3 relevant capability call-outs (deep-linked to Section 7.3 pages)". */
export function CapabilityCallouts({ items }: CapabilityCalloutsProps) {
  const t = useTranslations("capabilityCallouts");
  return (
    <section className="bg-neutral-50 py-20">
      <div className="container-content">
        <SectionHeading eyebrow={t("eyebrow")} headline={t("headline")} />
        <ul className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {items.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex h-full flex-col justify-between rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 hover:border-primary-300 hover:shadow-card-hover"
              >
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900">{item.label}</h3>
                  <p className="mt-2 text-sm leading-normal text-neutral-600">{item.description}</p>
                </div>
                <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-600">
                  {t("seeHowItWorks")}
                  <ArrowRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
