import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";
import type { BreadcrumbEntry } from "@/lib/structured-data";

interface BreadcrumbsProps {
  items: BreadcrumbEntry[];
  className?: string;
}

/**
 * SRS 11.1: <nav aria-label="Breadcrumb"> with an ordered list; the final
 * (current-page) item is non-interactive text, not a link. Only rendered
 * on pages two levels or deeper (SRS Section 6).
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const t = useTranslations("common");
  return (
    <nav aria-label={t("nav.breadcrumb")} className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const label = item.label === "Home" ? t("links.home") : item.label;
          return (
            <li key={item.href} className="flex items-center gap-1.5">
              {isLast ? (
                <span aria-current="page" className="font-medium text-current">
                  {label}
                </span>
              ) : (
                <>
                  {/*
                    Solid text-current, not an opacity-dimmed variant: this
                    component is called with different wrapper colors for
                    light vs. dark contexts (e.g. text-neutral-500 vs.
                    text-white/60), and compounding a second opacity here
                    on top of an already-diluted wrapper color pushed
                    contrast under WCAG AA in the dark-background case.
                    Underline-on-hover provides the link affordance instead.
                  */}
                  <Link href={item.href} className="text-current underline-offset-2 hover:underline">
                    {label}
                  </Link>
                  <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-current/70 rtl:rotate-180" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
