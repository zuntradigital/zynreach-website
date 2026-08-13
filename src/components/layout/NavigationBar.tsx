"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { primaryNav } from "@/lib/content/nav";
import { site } from "@/lib/content/site";
import { topNavKey } from "@/lib/nav-i18n";
import { Button } from "@/components/ui/Button";
import { SearchOverlay } from "@/components/ui/SearchOverlay";
import { Logo } from "./Logo";
import { MegaMenuPanel } from "./MegaMenuPanel";
import { MobileMenu } from "./MobileMenu";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { ThemeToggle } from "./ThemeToggle";

const HOVER_INTENT_DELAY = 150;
// Long enough to survive a diagonal mouse move through the gap between the
// trigger and the panel below it (was 0ms — any brief transit through that
// gap fired mouseleave and closed the menu before the cursor reached the
// panel, since MegaMenuPanel unmounts synchronously on close). Short enough
// to still feel responsive when genuinely moving away.
const CLOSE_DELAY = 250;
const SOLID_SCROLL_OFFSET = 80;

interface NavigationBarProps {
  transparentOnHero?: boolean;
}

export function NavigationBar({ transparentOnHero = false }: NavigationBarProps) {
  const t = useTranslations("common");
  const [scrolled, setScrolled] = useState(!transparentOnHero);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const pathname = usePathname();

  useEffect(() => {
    if (!transparentOnHero) return;
    const onScroll = () => setScrolled(window.scrollY > SOLID_SCROLL_OFFSET);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOnHero]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && openMenu) {
        triggerRefs.current[openMenu]?.focus();
        setOpenMenu(null);
      }
    }
    function onClickOutside(event: MouseEvent) {
      if (openMenu && navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [openMenu]);

  const isTransparent = transparentOnHero && !scrolled && !mobileOpen;

  function isActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  function handleMouseEnter(label: string) {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenMenu(label), HOVER_INTENT_DELAY);
  }

  function handleMouseLeave() {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setOpenMenu(null), CLOSE_DELAY);
  }

  /** Keyboard focus is an explicit, intentional action — open immediately, no hover-intent delay. */
  function handleFocus(label: string) {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenMenu(label);
  }

  /** Only close on blur if focus actually left the trigger+panel group, not when it moved between them. */
  function handleBlur(event: React.FocusEvent<HTMLLIElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setOpenMenu(null);
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full">
      {/*
        backdrop-blur lives on its own inert layer behind <nav>, not on
        <header> itself. Safari has a documented history of touch
        hit-testing becoming unreliable for interactive descendants that
        share a backdrop-filter's own GPU-composited layer (a different
        symptom of the same trouble spot already noted below: this
        header's backdrop-filter also used to hijack the containing
        block for fixed-position descendants). Keeping the blur on a
        plain aria-hidden div with no interactive children of its own
        sidesteps that class of bug entirely, regardless of whether any
        single instance of it is still present in current WebKit.
      */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 transition-colors duration-200 ease-out-default ${
          isTransparent ? "bg-transparent" : "border-b border-neutral-200 bg-neutral-50/95 backdrop-blur"
        }`}
      />
      <nav
        ref={navRef}
        aria-label={t("nav.primary")}
        className="container-content relative z-10 flex h-[var(--nav-height)] items-center justify-between"
      >
        <Logo variant={isTransparent ? "light" : "dark"} animated />

        <ul className="hidden flex-1 items-center justify-center gap-1 lg:flex">
          {primaryNav.map((item) => {
            if (item.type === "link") {
              const active = isActive(item.href);
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className={`relative rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                      active
                        ? "text-primary-600"
                        : isTransparent
                          ? "text-white/90 hover:text-primary-300"
                          : "text-neutral-700 hover:text-primary-600"
                    }`}
                  >
                    {t(`nav.${topNavKey[item.label]}`)}
                    {active ? (
                      <span className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-primary-600" />
                    ) : null}
                  </Link>
                </li>
              );
            }

            const menuId = `menu-${item.label.toLowerCase()}`;
            const isOpen = openMenu === item.label;

            return (
              <li
                key={item.label}
                // Only the narrow "dropdown" variant (e.g. Industries) should
                // anchor to its own trigger — it stays position:relative so
                // its panel positions against this <li>. The wide "mega"
                // variant intentionally has no positioning context here so
                // its panel's `absolute` skips past this <li> and binds to
                // the <nav> instead (see MegaMenuPanel), keeping it centered
                // in the page's content column instead of centered on
                // whichever trigger happens to be off-center.
                className={item.type === "dropdown" ? "relative" : undefined}
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
                onFocus={() => handleFocus(item.label)}
                onBlur={handleBlur}
              >
                <button
                  ref={(el) => {
                    triggerRefs.current[item.label] = el;
                  }}
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  onClick={() => setOpenMenu(isOpen ? null : item.label)}
                  className={`flex items-center gap-1 rounded-md px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
                    isTransparent
                      ? "text-white/90 hover:text-primary-300"
                      : "text-neutral-700 hover:text-primary-600"
                  }`}
                >
                  {t(`nav.${topNavKey[item.label]}`)}
                  <ChevronDown
                    aria-hidden="true"
                    className={`h-4 w-4 transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen ? (
                  <MegaMenuPanel item={item} id={menuId} onLinkClick={() => setOpenMenu(null)} />
                ) : null}
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          <LanguageSwitcher variant={isTransparent ? "light" : "dark"} />
          <ThemeToggle variant={isTransparent ? "light" : "dark"} />
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t("nav.search")}
            className={`inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-200 ${
              isTransparent ? "text-white/90 hover:text-primary-300" : "text-neutral-700 hover:text-primary-600"
            }`}
          >
            <Search aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <Link
            href={site.loginUrl}
            className={`px-3 py-2 text-sm font-semibold transition-colors duration-200 ${
              isTransparent ? "text-white/90 hover:text-primary-300" : "text-neutral-700 hover:text-primary-600"
            }`}
          >
            {t("nav.login")}
          </Link>
          <Button href="/demo" variant="primary" analyticsId="book-a-demo" analyticsLocation="nav">
            {t("cta.bookDemo")}
          </Button>
        </div>

        <div className="flex items-center gap-1 lg:hidden">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={t("nav.search")}
            className={`inline-flex h-[2.75rem] w-[2.75rem] touch-manipulation items-center justify-center rounded-md ${
              isTransparent ? "text-white" : "text-neutral-900"
            }`}
          >
            <Search aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={`inline-flex h-[2.75rem] w-[2.75rem] touch-manipulation items-center justify-center rounded-md ${
              isTransparent ? "text-white" : "text-neutral-900"
            }`}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? t("nav.closeMenu") : t("nav.openMenu")}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X aria-hidden="true" strokeWidth={1.75} /> : <Menu aria-hidden="true" strokeWidth={1.75} />}
          </button>
        </div>
      </nav>
      </header>

      {/*
        Rendered as siblings of <header>, not children: the header's
        backdrop-blur (backdrop-filter) establishes a new CSS containing
        block for position:fixed descendants per spec, which was clipping
        both overlays to the header's own (--nav-height) box instead of the full viewport
        (verified: mobile menu rendered as an 18px sliver, search overlay
        as a 96px-tall band). Moving them outside the filtered ancestor
        restores normal viewport-relative fixed positioning.
      */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      {searchOpen ? <SearchOverlay onClose={() => setSearchOpen(false)} /> : null}
    </>
  );
}
