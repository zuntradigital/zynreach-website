import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { CustomerStory } from "@/types/content";
import { industryToLinkKey, productAreaToLinkKey } from "@/lib/nav-i18n";

interface StoryCardProps {
  story: CustomerStory;
}

export async function StoryCard({ story }: StoryCardProps) {
  const t = await getTranslations(`customersPage.stories.${story.slug}`);
  const tPage = await getTranslations("customersPage");
  const tLinks = await getTranslations("common.links");

  return (
    <Link
      href={`/customers/${story.slug}`}
      className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover"
    >
      <p className="text-sm font-semibold text-neutral-500">
        {t("customerName")} {tPage("illustrativeSuffix")}
      </p>
      <p className="mt-2 text-3xl font-bold text-primary-600">{story.headlineMetric.value}</p>
      <p className="text-sm text-neutral-600">{t("headlineMetricLabel")}</p>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
        <span className="rounded-full bg-neutral-100 px-2.5 py-1">
          {industryToLinkKey[story.industry] ? tLinks(industryToLinkKey[story.industry] as Parameters<typeof tLinks>[0]) : story.industry}
        </span>
        <span className="rounded-full bg-neutral-100 px-2.5 py-1">
          {productAreaToLinkKey[story.productArea] ? tLinks(productAreaToLinkKey[story.productArea] as Parameters<typeof tLinks>[0]) : story.productArea}
        </span>
      </div>
    </Link>
  );
}
