"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

const SESSION_KEY = "zynreach-welcome-shown";
const SHOW_DELAY_MS = 500;
const VISIBLE_DURATION_MS = 7000;
const EXIT_DURATION_MS = 400;

/**
 * Fixed + a null render until `visible` flips true (post-mount, client-only)
 * keeps this out of the document flow entirely, so it can never push page
 * content down — no layout shift on entrance or exit. sessionStorage is
 * read/written before scheduling the show-timer so a second page load in
 * the same tab session never re-arms it.
 */
export function WelcomePopup() {
  const t = useTranslations("common.welcomePopup");
  const [visible, setVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (window.sessionStorage.getItem(SESSION_KEY)) return;
    const showTimer = window.setTimeout(() => {
      window.sessionStorage.setItem(SESSION_KEY, "1");
      setVisible(true);
    }, SHOW_DELAY_MS);
    return () => window.clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // A short setTimeout (not requestAnimationFrame) triggers the entrance:
    // rAF callbacks are paused entirely in backgrounded/hidden tabs per the
    // Page Visibility spec, which would leave the popup stuck invisible
    // (opacity-0) if it happened to mount while the tab wasn't foregrounded.
    // setTimeout is only throttled in that scenario, not paused — it still
    // reliably fires, and 20ms is imperceptible as a delay either way.
    const enterTimer = window.setTimeout(() => setEntered(true), 20);
    const dismissTimer = window.setTimeout(dismiss, VISIBLE_DURATION_MS);
    return () => {
      window.clearTimeout(enterTimer);
      window.clearTimeout(dismissTimer);
    };
  }, [visible]);

  function dismiss() {
    setEntered(false);
    window.setTimeout(() => setVisible(false), EXIT_DURATION_MS);
  }

  useEffect(() => {
    if (!visible) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[calc(var(--nav-height)+0.75rem)] z-[65] flex justify-center px-4">
      <div className="relative w-full max-w-sm">
        {/*
         * Ambient glow: a large, soft, slow-breathing radial gradient
         * sitting behind the card. Absolutely positioned and inset
         * negative so it never affects the card's own box (no CLS),
         * and low-opacity/blurred enough to stay "barely noticeable"
         * per the directive rather than a visible halo.
         */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute -inset-8 -z-10 rounded-[2rem] bg-[radial-gradient(closest-side,rgba(200,155,60,0.28),transparent)] blur-2xl transition-opacity duration-700 ease-out-default dark:bg-[radial-gradient(closest-side,rgba(230,198,122,0.22),transparent)] ${
            entered ? "welcome-glow-pulse opacity-100" : "opacity-0"
          }`}
        />
        <div
          role="status"
          aria-live="polite"
          className={`pointer-events-auto flex w-full items-center gap-4 rounded-2xl border border-neutral-200 bg-white dark:bg-neutral-100 p-4 transition-all ease-out-default sm:p-5 ${
            entered
              ? `welcome-card-settled translate-y-0 scale-100 opacity-100 shadow-card-hover duration-500`
              : "-translate-y-3 scale-[0.97] opacity-0 shadow-card duration-300"
          }`}
        >
          <span
            className={`logo-animated logo-shine relative inline-block shrink-0 overflow-hidden transition-all delay-[80ms] duration-500 ease-out-default ${
              entered ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
            }`}
          >
            <Image
              src="/logo-mark.png"
              alt=""
              aria-hidden="true"
              width={471}
              height={312}
              className="h-10 w-auto shrink-0"
            />
          </span>
          <div className="min-w-0 flex-1">
            <p
              className={`text-sm font-semibold text-neutral-900 transition-all delay-150 duration-500 ease-out-default ${
                entered ? "translate-y-0 opacity-100 blur-none" : "translate-y-1.5 opacity-0 blur-[2px]"
              }`}
            >
              {t("eyebrow")}
            </p>
            <p
              className={`mt-0.5 hidden text-sm text-neutral-600 transition-all delay-[220ms] duration-500 ease-out-default sm:block ${
                entered ? "translate-y-0 opacity-100 blur-none" : "translate-y-1.5 opacity-0 blur-[2px]"
              }`}
            >
              {t("headline")}
            </p>
            <span
              aria-hidden="true"
              className={`mt-2 block h-px w-8 origin-left bg-gradient-to-r from-primary-500 to-transparent transition-all delay-[320ms] duration-500 ease-out-default ${
                entered ? "scale-x-100 opacity-100" : "scale-x-0 opacity-0"
              }`}
            />
          </div>
          <button
            type="button"
            onClick={dismiss}
            aria-label={t("close")}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-neutral-400 transition-colors duration-150 hover:bg-neutral-50 hover:text-neutral-600 dark:hover:bg-neutral-200"
          >
            <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>
    </div>
  );
}
