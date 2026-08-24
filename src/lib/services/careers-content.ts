import { captureIntegrationCall } from "@/lib/monitoring";
import type { JobListing } from "@/lib/content/careers";

/**
 * Read path into System B's Careers override layer (SRS §16, FR-ADM-029)
 * — the live source for the public Careers hub/detail pages, replacing
 * what used to be hardcoded in src/lib/content/careers.ts. Same
 * shape/contract as blog-content.ts's getPublishedBlog: service-token
 * authenticated, graceful-degradation to null.
 */

export interface CareersContent {
  jobListings: JobListing[];
}

export async function getPublishedCareers(locale: string): Promise<CareersContent | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-careers", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/careers?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // Careers is direct-save with no publish step (see ZynReach Admin's
      // PATCH /api/admin/careers/[id] docstring) — Draft/Published must
      // take effect on the very next request, not after up to 60s of ISR
      // staleness — see the careers pages' own `revalidate = 0` comment.
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-careers", "failure");
      return null;
    }

    const data = (await res.json()) as CareersContent;
    captureIntegrationCall("zynreach-admin-careers", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-careers", "failure");
    return null;
  }
}
