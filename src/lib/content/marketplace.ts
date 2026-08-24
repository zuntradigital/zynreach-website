import { capabilityPages } from "./capabilities";
import { primaryNav } from "./nav";
import { hrefToLinkKey, headingToKey } from "@/lib/nav-i18n";

/**
 * ZynReach Marketplace — Suite/Tool Catalog structural data, derived (not
 * duplicated) from two content sources that already exist and are each
 * someone else's source of truth: capabilities.ts (which tool slugs
 * exist) and nav.ts's "Product" mega menu (which suite/pillar each tool
 * belongs to — the exact grouping already shown in primary nav).
 *
 * Deliberately locale-agnostic: the display name and suite heading are
 * NOT resolved here. Every other nav-driven label in this codebase
 * (Footer, MegaMenuPanel, MobileMenu) resolves through nav-i18n.ts's
 * hrefToLinkKey/headingToKey maps into common.links / common.megaMenu
 * translations rather than rendering nav.ts's English label text
 * directly — this catalog follows the same rule, so callers must
 * translate `navLabelKey`/`suiteHeadingKey` themselves (see
 * src/app/[locale]/marketplace/page.tsx, a server component with
 * getTranslations access, which marketplace.ts itself doesn't have).
 */
export interface MarketplaceToolRef {
  slug: string;
  href: string;
  /** Look up as t(`links.${navLabelKey}`) in the "common" namespace. */
  navLabelKey: string;
  /** Look up as t(`megaMenu.${suiteHeadingKey}`) in the "common" namespace. */
  suiteHeadingKey: string;
}

/**
 * Keyed by nav link label (not href) so this stays correct regardless of
 * which URL a given tool's Product-menu entry points to — e.g.
 * "Marketplace" itself points to /marketplace (this catalog), not
 * /platform/marketplace, but it's still one of the 6-pillar tools and
 * must still appear in the catalog under its own suite.
 */
function buildSuiteHeadingByLabel(): Map<string, string> {
  const map = new Map<string, string>();
  const productMenu = primaryNav.find((item) => item.label === "Product" && item.type === "mega");
  if (productMenu && productMenu.type === "mega") {
    for (const column of productMenu.columns) {
      for (const link of column.links) {
        map.set(link.label, column.heading);
      }
    }
  }
  return map;
}

const suiteHeadingByToolLabel = buildSuiteHeadingByLabel();

export const marketplaceToolRefs: MarketplaceToolRef[] = capabilityPages
  .filter((page) => suiteHeadingByToolLabel.has(page.navLabel) && hrefToLinkKey[`/platform/${page.slug}`])
  .map((page) => {
    const suiteHeading = suiteHeadingByToolLabel.get(page.navLabel)!;
    return {
      slug: page.slug,
      href: `/platform/${page.slug}`,
      navLabelKey: hrefToLinkKey[`/platform/${page.slug}`],
      suiteHeadingKey: headingToKey[suiteHeading] ?? suiteHeading,
    };
  });
