import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  headline: string;
  body?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  headline,
  body,
  align = "left",
  as: HeadingTag = "h2",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary-600">
          {eyebrow}
        </p>
      ) : null}
      <HeadingTag className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl">
        {headline}
      </HeadingTag>
      {body ? <p className="mt-4 text-lg text-neutral-600">{body}</p> : null}
    </div>
  );
}
