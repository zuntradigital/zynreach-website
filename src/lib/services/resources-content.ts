import { captureIntegrationCall } from "@/lib/monitoring";
import type { Guide, Webinar } from "@/types/content";

/**
 * Read path into System B's Resources module (SRS §16) — the live source
 * for the Resources library (guides/templates/whitepapers/webinars),
 * replacing what used to be hardcoded in src/lib/content/resources.ts.
 * Same shape/contract as pricing-content.ts's getPublishedPricing.
 */

export interface ResourcesContent {
  guides: Guide[];
  webinars: Webinar[];
}

export async function getPublishedResources(locale: string): Promise<ResourcesContent | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-resources", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/resources?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // A content edit in the Dashboard must be visible immediately —
      // staleness — see the resources pages' own `revalidate = 0` comment.
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-resources", "failure");
      return null;
    }

    const data = (await res.json()) as ResourcesContent;
    captureIntegrationCall("zynreach-admin-resources", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-resources", "failure");
    return null;
  }
}
