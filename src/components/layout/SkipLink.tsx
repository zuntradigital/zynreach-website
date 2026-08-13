import { useTranslations } from "next-intl";

export function SkipLink() {
  const t = useTranslations("common");
  return (
    <a
      href="#main-content"
      className="skip-link rounded-md bg-primary-600 px-4 py-3 text-sm font-semibold text-white dark:text-neutral-50"
    >
      {t("skipLink")}
    </a>
  );
}
