import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

/** SRS 11.1 Pagination: numbered + prev/next, current page via aria-current, disabled (not just styled) at range boundaries. */
export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  const t = useTranslations("common.pagination");
  if (totalPages <= 1) return null;

  function pageHref(page: number) {
    if (page <= 1) return basePath;
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}page=${page}`;
  }

  return (
    <nav aria-label={t("label")} className="mt-10 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={pageHref(currentPage - 1)}
          aria-label={t("previous")}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 text-neutral-700 hover:border-primary-300"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-300"
        >
          <ChevronLeft aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
        </span>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          aria-current={page === currentPage ? "page" : undefined}
          className={`flex h-10 w-10 items-center justify-center rounded-md text-sm font-medium ${
            page === currentPage
              ? "bg-primary-600 text-white dark:text-neutral-50"
              : "border border-neutral-300 text-neutral-700 hover:border-primary-300"
          }`}
        >
          {page}
        </Link>
      ))}

      {currentPage < totalPages ? (
        <Link
          href={pageHref(currentPage + 1)}
          aria-label={t("next")}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-300 text-neutral-700 hover:border-primary-300"
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
        </Link>
      ) : (
        <span
          aria-disabled="true"
          className="flex h-10 w-10 items-center justify-center rounded-md border border-neutral-200 text-neutral-300"
        >
          <ChevronRight aria-hidden="true" className="h-4 w-4 rtl:rotate-180" />
        </span>
      )}
    </nav>
  );
}
