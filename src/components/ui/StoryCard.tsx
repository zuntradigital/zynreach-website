import { Link } from "@/i18n/navigation";

export interface ResolvedStoryCard {
  slug: string;
  customerName: string;
  metricValue: string;
  metricLabel: string;
  industryLabel: string;
  productAreaLabels: string[];
}

interface StoryCardProps {
  story: ResolvedStoryCard;
}

/**
 * Fully pre-resolved by the caller (list/detail pages) — this component
 * does no translation lookups of its own, so it renders identically for
 * CMS-backed stories (already-resolved live text) and the static
 * illustrative fallback (resolved via translation keys by the page before
 * this component ever sees it).
 */
export function StoryCard({ story }: StoryCardProps) {
  return (
    <Link
      href={`/customer-stories/${story.slug}`}
      className="flex h-full flex-col rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 p-6 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover"
    >
      <p className="text-sm font-semibold text-neutral-500">{story.customerName}</p>
      <p className="mt-2 text-3xl font-bold text-primary-600">{story.metricValue}</p>
      <p className="text-sm text-neutral-600">{story.metricLabel}</p>
      <div className="mt-4 flex flex-wrap gap-2 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
        <span className="rounded-full bg-neutral-100 px-2.5 py-1">{story.industryLabel}</span>
        {story.productAreaLabels.map((label) => (
          <span key={label} className="rounded-full bg-neutral-100 px-2.5 py-1">
            {label}
          </span>
        ))}
      </div>
    </Link>
  );
}
