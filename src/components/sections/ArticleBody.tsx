import type { ArticleBlock } from "@/types/content";
import { CodeBlock } from "@/components/ui/CodeBlock";

interface ArticleBodyProps {
  blocks: ArticleBlock[];
}

/** Renders CMS-modeled article blocks (SRS 7.16 "Rich article layouts"). */
export function ArticleBody({ blocks }: ArticleBodyProps) {
  return (
    <div className="max-w-2xl space-y-5">
      {blocks.map((block, index) => {
        if (block.type === "heading") {
          return (
            <h2 key={index} id={block.id} className="pt-2 text-xl font-semibold text-neutral-900">
              {block.text}
            </h2>
          );
        }
        if (block.type === "quote") {
          return (
            <blockquote key={index} className="border-s-4 border-primary-300 ps-4 text-lg font-medium italic text-neutral-800">
              &ldquo;{block.text}&rdquo;
            </blockquote>
          );
        }
        if (block.type === "list") {
          return (
            <ul key={index} className="list-disc space-y-2 ps-6 text-base leading-normal text-neutral-700">
              {block.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }
        if (block.type === "code") {
          return <CodeBlock key={index} code={block.code} language={block.language} />;
        }
        return (
          <p key={index} className="text-base leading-normal text-neutral-700">
            {block.text}
          </p>
        );
      })}
    </div>
  );
}
