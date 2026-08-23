"use client";

import { createContext, useContext } from "react";
import type { NavItem } from "@/types/content";
import type { NavigationSettings } from "@/lib/services/site-settings";

/**
 * CMS Navigation Management: lets an admin hide a top-level primaryNav
 * item (src/lib/content/nav.ts) sitewide, the same "existing structure,
 * toggle-only" convention Footer Settings already established for footer
 * columns (Footer.tsx's ALL_LINK_COLUMNS/ALL_SECONDARY_GROUPS). The nav
 * structure itself — hrefs, mega-menu columns, translations — is
 * untouched; this only ever filters which top-level items render.
 *
 * A Context (not a prop) because NavigationBar/MobileMenu are rendered by
 * every individual page component, not by [locale]/layout.tsx directly —
 * threading a prop through every page file that already does
 * `<NavigationBar />` would mean touching dozens of otherwise-untouched
 * files. RootLayout fetches settings once (it already does, for
 * CookieBanner/AnnouncementBanner) and provides them here instead.
 */
const LABEL_TO_SETTINGS_KEY: Record<string, keyof NavigationSettings> = {
  Product: "showPlatformNav",
  Solutions: "showSolutionsNav",
  Industries: "showIndustriesNav",
  Pricing: "showPricingNav",
  "Knowledge Center": "showKnowledgeCenterNav",
  Company: "showCompanyNav",
};

const NavVisibilityContext = createContext<NavigationSettings>({});

export function NavVisibilityProvider({
  settings,
  children,
}: {
  settings: NavigationSettings;
  children: React.ReactNode;
}) {
  return <NavVisibilityContext.Provider value={settings}>{children}</NavVisibilityContext.Provider>;
}

/** Undefined/missing (not yet touched by an admin) defaults to visible, so behavior is unchanged until someone actively unchecks a menu in the Dashboard. */
export function useVisiblePrimaryNav(items: NavItem[]): NavItem[] {
  const visibility = useContext(NavVisibilityContext);
  return items.filter((item) => {
    const key = LABEL_TO_SETTINGS_KEY[item.label];
    return !key || visibility[key] !== false;
  });
}
