import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Read path into System B's Marketplace module (admin-curated visibility/
 * featured/plan-gating/order per tool slug — src/app/[locale]/(dashboard)/
 * marketplace/page.tsx on that side). Same shape/contract as
 * faq-content.ts's getPublishedFaqs. Unlike Blog/FAQ this has no static-
 * array precedent in this repo to fall back to — a fetch failure returns
 * null and the Marketplace page falls back to showing every tool from
 * marketplace.ts's derived catalog as visible/unfeatured/Starter-tier
 * (see the marketplace page's own fallback comment), same "degrade, don't
 * break" contract every other live-CMS integration in this repo follows.
 */
export type MarketplacePlanTier = "STARTER" | "GROWTH" | "ENTERPRISE";

export interface LiveMarketplaceListing {
  toolSlug: string;
  featured: boolean;
  minPlanTier: MarketplacePlanTier;
  order: number;
}

export async function getMarketplaceListings(): Promise<LiveMarketplaceListing[] | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-marketplace", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/marketplace`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-marketplace", "failure");
      return null;
    }

    const data = (await res.json()) as { listings: LiveMarketplaceListing[] };
    captureIntegrationCall("zynreach-admin-marketplace", "success");
    return data.listings;
  } catch {
    captureIntegrationCall("zynreach-admin-marketplace", "failure");
    return null;
  }
}
