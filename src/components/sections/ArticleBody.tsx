import Image from "next/image";
import type { ArticleBlock, InlineSpan } from "@/types/content";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

const HEADING_CLASS: Record<1 | 2 | 3, string> = {
  1: "pt-2 text-2xl font-bold text-neutral-900",
  2: "pt-2 text-xl font-semibold text-neutral-900",
  3: "pt-2 text-lg font-semibold text-neutral-900",
};

/**
 * The article's own title already renders as the page's <h1> (see
 * blog/[slug]/page.tsx), so a body-authored level-1/2/3 heading nests one
 * step below it — h2/h3/h4 — to keep a single, correct document outline
 * instead of emitting sibling <h1>s or, as before, a literal <h2> for
 * every level regardless of author-selected level (visually distinct via
 * className, but structurally flat — the actual DOM tag never changed).
 */
const HEADING_TAG: Record<1 | 2 | 3, "h2" | "h3" | "h4"> = { 1: "h2", 2: "h3", 3: "h4" };

/** Renders a block's inline content — the Tiptap-authored `content` spans when present, falling back to the plain `text` string for hand-authored/hardcoded blocks that predate inline formatting. */
function Inline({ text, content }: { text: string; content?: InlineSpan[] }) {
  if (!content || content.length === 0) return <>{text}</>;
  return (
    <>
      {content.map((span, i) => {
        let node: React.ReactNode = span.text;
        if (span.bold) node = <strong key="b">{node}</strong>;
        if (span.italic) node = <em key="i">{node}</em>;
        if (span.href) {
          node = (
            <a key="a" href={span.href} className="text-primary-600 underline hover:text-primary-700" target={span.href.startsWith("http") ? "_blank" : undefined} rel={span.href.startsWith("http") ? "noopener noreferrer" : undefined}>
              {node}
            </a>
          );
        }
        return <span key={i}>{node}</span>;
      })}
    </>
  );
}

/** Renders CMS-modeled article blocks (SRS 7.16 "Rich article layouts"). */
export function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="max-w-2xl space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          const level = block.level ?? 2;
          const HeadingTag = HEADING_TAG[level];
          return (
            <HeadingTag key={index} id={block.id} className={HEADING_CLASS[level]}>
              <Inline text={block.text} content={block.content} />
            </HeadingTag>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={index} className="border-s-4 border-primary-300 ps-4 text-lg font-medium italic text-neutral-800">
              &ldquo;<Inline text={block.text} content={block.content} />&rdquo;
            </blockquote>
          );
        }
        if (block.type === "list") {
          const ListTag = block.ordered ? "ol" : "ul";
          return (
            <ListTag key={index} className={`${block.ordered ? "list-decimal" : "list-disc"} space-y-2 ps-6 text-base leading-normal text-neutral-700`}>
              {block.items.map((item, i) => (
                <li key={i}>
                  <Inline text={item} content={block.itemsContent?.[i]} />
                </li>
              ))}
            </ListTag>
          );
        }
        if (block.type === "image") {
          return (
            <div key={index} className="relative aspect-[16/9] w-full overflow-hidden rounded-xl">
              <Image src={block.url} alt={block.alt} fill sizes="(min-width: 768px) 42rem, 100vw" className="object-cover" />
            </div>
          );
        }
        if (block.type === "code") {
          return <CodeBlock key={index} code={block.code} language={block.language} />;
        }
        return (
          <p key={index} className="text-base leading-normal text-neutral-700">
            <Inline text={block.text} content={block.content} />
          </p>
        );
      })}
    </div>
  );
}
