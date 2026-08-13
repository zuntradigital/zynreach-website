import { Link } from "@/i18n/navigation";
import type { FeatureCardItem } from "@/types/content";
import { cn } from "@/lib/utils";

export function FeatureCard({ icon: Icon, headline, description, href }: FeatureCardItem) {
  const content = (
    <>
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-md bg-primary-50 text-primary-600">
        <Icon className="h-6 w-6" aria-hidden="true" strokeWidth={1.75} />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">{headline}</h3>
      <p className="mt-2 text-sm leading-normal text-neutral-600">{description}</p>
    </>
  );

  const cardClasses = cn(
    "block min-w-65 rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100 p-6 transition-all duration-150",
    href && "hover:-translate-y-0.5 hover:border-primary-200 hover:shadow-card-hover"
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return <div className={cardClasses}>{content}</div>;
}
