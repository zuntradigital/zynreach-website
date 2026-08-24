import { captureIntegrationCall } from "@/lib/monitoring";
import type { PricingPlan, ComparisonRow } from "@/types/content";

/**
 * Read path into System B (ZynReach Admin/CMS Dashboard)'s Pricing
 * Management module (SRS §15) — the live source for the public Pricing
 * page's plans and comparison table, replacing what used to be hardcoded
 * in src/lib/content/pricing.ts. Same shape and contract as
 * cms-content.ts's getPublishedCmsPage: a real HTTP call, service-token
 * authenticated, with the identical graceful-degradation contract (null
 * when the two env vars aren't configured, so this app keeps running
 * standalone in any environment where System B isn't reachable).
 */

export interface PricingContent {
  plans: (PricingPlan & { promotion: { name: string; discountType: string; discountValue: number } | null })[];
  comparisonMatrix: ComparisonRow[];
}

export async function getPublishedPricing(locale: string): Promise<PricingContent | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-pricing", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/pricing?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Unlike cms-content.ts's time-based revalidation, Pricing is
      // directly admin-editable with no publish step, so a Dashboard Save
      // must be visible on the next request, not after up to 60s of ISR
      // staleness — see the pricing page's own `revalidate = 0` comment.
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-pricing", "failure");
      return null;
    }

    const data = (await res.json()) as PricingContent;
    captureIntegrationCall("zynreach-admin-pricing", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-pricing", "failure");
    return null;
  }
}
