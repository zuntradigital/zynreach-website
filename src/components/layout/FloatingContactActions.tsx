"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/SocialIcons";
import { site } from "@/lib/content/site";

const actionButtonClass =
  "flex h-14 w-14 items-center justify-center rounded-full shadow-card-hover transition-all duration-300 ease-out-default hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent";

// Matches MobileStickyCta's own threshold, so both fixed-bottom widgets stay in sync.
const SHOW_AFTER_SCROLL = 320;
// Below Tailwind's `lg` breakpoint (1024px) — matches MobileStickyCta's own `lg:hidden`.
const MOBILE_QUERY = "(max-width: 1023px)";

/**
 * Bottom offsets clear two different fixed-position neighbors:
 *
 * Below `sm`, bottom-24-ish (6rem) clears MobileStickyCta — a full-width
 * fixed bar (~76px tall: 52px button + 2 x 12px padding) that also sits
 * at bottom-0 on the same viewports — with a small margin to spare.
 *
 * At `sm` and up, MobileStickyCta is hidden (lg:hidden), but the Tawk.to
 * chat launcher (TawkChat.tsx) now occupies that corner instead. Tawk
 * fixes its own on-page position via inline `!important` styles applied
 * by its own script — not overridable from our CSS (verified: an exact-ID
 * override with !important has zero effect) — so this cluster is the one
 * that has to move. 8.6rem clears the launcher's widest observed footprint
 * (its greeting-label frame, ~125px tall from the viewport bottom) with
 * the same ~12px gap used elsewhere (gap-3) between this cluster's own
 * buttons. Below `sm`, Tawk shows only its compact icon (~84px tall), well
 * inside the 6rem/96px mobile offset already required to clear
 * MobileStickyCta, so no separate mobile-specific Tawk adjustment is needed.
 *
 * Physical `right` (not the logical `end` used almost everywhere else in
 * this codebase) is deliberate here: a floating action cluster like this
 * is closer to browser chrome than to page content — real-world chat/
 * contact widgets conventionally stay anchored to one physical corner
 * regardless of text direction. It also sidesteps a genuine collision:
 * the Next.js dev toolbar defaults to the bottom-left corner, which is
 * exactly where `end-*` would have placed this cluster once the page
 * flipped to RTL (`end` = left in RTL) — so in Arabic, during
 * development, the two fixed-position clusters landed in the same
 * corner. Anchoring to the physical right avoids that in both
 * directions and in production, where the dev toolbar doesn't exist,
 * this is purely the more conventional placement.
 */
export function FloatingContactActions() {
  const t = useTranslations("common.floatingActions");
  const [mounted, setMounted] = useState(false);
  // Below `lg`, the Hero stacks to full width and its CTA buttons/illustration
  // land in the same screen region this cluster occupies — unlike desktop,
  // where the Hero's two-column layout keeps that corner clear. Gating
  // mobile visibility behind the same scroll threshold MobileStickyCta
  // already uses keeps the cluster from covering Hero content on load,
  // without changing anything about its own design or desktop behavior.
  const [clearOfHero, setClearOfHero] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 400);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const mobileQuery = window.matchMedia(MOBILE_QUERY);
    function evaluate() {
      setClearOfHero(!mobileQuery.matches || window.scrollY > SHOW_AFTER_SCROLL);
    }
    evaluate();
    window.addEventListener("scroll", evaluate, { passive: true });
    mobileQuery.addEventListener("change", evaluate);
    return () => {
      window.removeEventListener("scroll", evaluate);
      mobileQuery.removeEventListener("change", evaluate);
    };
  }, []);

  const visible = mounted && clearOfHero;
  const whatsappHref = `https://wa.me/${site.contact.whatsapp.replace(/[^\d]/g, "")}`;
  const phoneHref = `tel:${site.contact.phone.replace(/[^+\d]/g, "")}`;

  return (
    <div
      className={`fixed right-4 bottom-[calc(6rem+env(safe-area-inset-bottom))] z-40 flex flex-col items-center gap-3 sm:right-6 sm:bottom-[calc(8.6rem+env(safe-area-inset-bottom))] ${
        visible ? "" : "pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      <a
        href={phoneHref}
        aria-label={t("callLabel", { name: site.name })}
        tabIndex={visible ? 0 : -1}
        className={`${actionButtonClass} bg-neutral-900 text-white hover:bg-neutral-800 focus-visible:ring-neutral-900 dark:bg-neutral-200 dark:text-neutral-900 dark:hover:bg-neutral-300 dark:focus-visible:ring-neutral-200 ${
          visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none translate-y-4 scale-90 opacity-0"
        }`}
      >
        <Phone aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />
      </a>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={t("whatsappLabel")}
        tabIndex={visible ? 0 : -1}
        className={`${actionButtonClass} bg-[#25D366] text-white hover:bg-[#20bd5a] focus-visible:ring-[#25D366] ${
          visible
            ? "translate-y-0 scale-100 opacity-100 delay-100"
            : "pointer-events-none translate-y-4 scale-90 opacity-0"
        }`}
      >
        <WhatsAppIcon aria-hidden="true" className="h-6 w-6" />
      </a>
    </div>
  );
}
