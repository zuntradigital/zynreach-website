import { getTranslations } from "next-intl/server";
import type { ArticleBlock } from "@/types/content";

interface TableOfContentsProps {
  blocks: ArticleBlock[];
}

export async function TableOfContents({ blocks }: TableOfContentsProps) {
  const headings = blocks.filter((block): block is Extract<ArticleBlock, { type: "heading" }> => block.type === "heading");
  if (headings.length === 0) return null;

  const t = await getTranslations("blogPage.toc");

  return (
    <nav aria-label={t("label")} className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{t("heading")}</p>
      <ul className="mt-3 space-y-2">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`} className="text-sm text-neutral-600 hover:text-primary-600">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
