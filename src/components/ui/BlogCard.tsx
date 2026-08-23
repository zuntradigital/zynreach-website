import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Clock } from "lucide-react";

export interface BlogCardData {
  slug: string;
  title: string;
  excerpt: string;
  categoryLabel: string;
  authorName: string | null;
  readingTimeMinutes: number;
  minReadLabel: string;
  imageUrl?: string;
  imageAlt?: string;
  tags?: string[];
}

interface BlogCardProps {
  post: BlogCardData;
}

/**
 * Renders pre-resolved text only (title/excerpt/category label/author
 * name/reading-time string) — the caller resolves those, either from a
 * live System B post (already localized) or from the hardcoded fallback +
 * next-intl `t()` lookups, so this component itself needs no translation
 * dependency and works identically for both data sources. `imageUrl` is
 * absent for hardcoded/fallback posts and any live post without a cover
 * image set yet — the card layout degrades gracefully without one.
 */
export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white dark:bg-neutral-100 transition-all hover:-translate-y-0.5 hover:border-primary-300 hover:shadow-card-hover"
    >
      {post.imageUrl ? (
        <div className="relative aspect-[16/9] w-full">
          <Image src={post.imageUrl} alt={post.imageAlt ?? ""} fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-6">
        <span className="w-fit rounded-full bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-700">{post.categoryLabel}</span>
        <h3 className="mt-4 text-lg font-semibold text-neutral-900">{post.title}</h3>
        <p className="mt-2 flex-1 text-sm leading-normal text-neutral-600">{post.excerpt}</p>
        {post.tags && post.tags.length > 0 ? (
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <li key={tag} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600">
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-4 flex items-center gap-3 border-t border-neutral-100 pt-4 text-xs text-neutral-500">
          <span>{post.authorName}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock aria-hidden="true" className="h-3.5 w-3.5" />
            {post.minReadLabel}
          </span>
        </div>
      </div>
    </Link>
  );
}
