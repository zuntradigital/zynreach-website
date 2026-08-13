"use client";

import { useTranslations } from "next-intl";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "./ThemeProvider";

interface ThemeToggleProps {
  /** Nav-backdrop context (transparent-over-hero vs solid nav), same convention as Logo/LanguageSwitcher — not the site's light/dark theme itself. */
  variant?: "dark" | "light";
}

/**
 * Defaults to the system preference on first load; clicking sets an explicit
 * preference that persists (see ThemeProvider) and overrides the OS setting
 * from then on — the standard toggle pattern, simpler in limited nav space
 * than a three-way system/light/dark selector.
 */
export function ThemeToggle({ variant = "dark" }: ThemeToggleProps) {
  const t = useTranslations("common.themeToggle");
  const { resolvedTheme, setPreference } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setPreference(isDark ? "light" : "dark")}
      aria-label={`${t("label")}: ${isDark ? t("dark") : t("light")}`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-200 ${
        variant === "light" ? "text-white/90 hover:text-primary-300" : "text-neutral-700 hover:text-primary-600"
      }`}
    >
      {isDark ? (
        <Sun aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
      ) : (
        <Moon aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
      )}
    </button>
  );
}
