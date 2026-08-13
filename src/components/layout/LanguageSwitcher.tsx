"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Globe, Check, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

interface LanguageSwitcherProps {
  variant?: "dark" | "light";
}

/**
 * Swaps the active locale while staying on the exact same page (not
 * redirecting to home) — router.replace with a locale override re-renders
 * the current route under the new locale, no full page reload.
 */
export function LanguageSwitcher({ variant = "dark" }: LanguageSwitcherProps) {
  const t = useTranslations("common.languageSwitcher");
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      } else if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const index = routing.locales.indexOf(locale);
        const delta = event.key === "ArrowDown" ? 1 : -1;
        const next = routing.locales[(index + delta + routing.locales.length) % routing.locales.length];
        optionRefs.current[next]?.focus();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, locale]);

  function switchTo(nextLocale: Locale) {
    setOpen(false);
    triggerRef.current?.focus();
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  const toneClasses =
    variant === "light"
      ? "text-white/90 hover:text-primary-300"
      : "text-neutral-700 hover:text-primary-600";

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        disabled={isPending}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex items-center gap-1.5 rounded-md px-2.5 py-2 text-sm font-semibold transition-colors duration-200 disabled:opacity-60 ${toneClasses}`}
      >
        <Globe aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
        <span>{t(locale)}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <div
        role="menu"
        aria-label={t("label")}
        className={`absolute end-0 top-full z-10 pt-2 transition-all duration-150 ease-out-default ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="min-w-[9rem] overflow-hidden rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100 py-1 shadow-card-hover">
          {routing.locales.map((loc) => {
            const active = loc === locale;
            return (
              <button
                key={loc}
                ref={(el) => {
                  optionRefs.current[loc] = el;
                }}
                type="button"
                role="menuitemradio"
                aria-checked={active}
                tabIndex={open ? 0 : -1}
                onClick={() => switchTo(loc)}
                className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-sm transition-colors duration-150 ${
                  active
                    ? "font-semibold text-primary-600"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-primary-600"
                }`}
              >
                {t(loc)}
                {active ? <Check aria-hidden="true" className="h-4 w-4" strokeWidth={2} /> : null}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
