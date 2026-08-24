import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Read path into System B's Customer Story module (Knowledge Center §7) —
 * the live source for Customer Stories, replacing what used to be
 * hardcoded in src/lib/content/customer-stories.ts. Same shape/contract
 * as resources-content.ts's getPublishedResources.
 */

export interface LiveCustomerStory {
  slug: string;
  customerName: string;
  customerLogo: { url: string; altText: string } | null;
  industry: string;
  companySize: string | null;
  country: string | null;
  featured: boolean;
  challenge: string;
  solution: string;
  results: string;
  metrics: { label: string; value: string }[];
  testimonialQuote: string;
  testimonialName: string | null;
  testimonialTitle: string | null;
  testimonialCompany: string | null;
  testimonialPhoto: { url: string; altText: string } | null;
  relatedCapabilitySlugs: string[];
  publishedDate: string;
  seoTitle?: string;
  seoDescription?: string;
}

export async function getPublishedCustomerStories(locale: string): Promise<LiveCustomerStory[] | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-customer-stories", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/customer-stories?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // A content edit in the Dashboard must be visible immediately — see
      // the customer-stories pages' own `revalidate = 0` comment.
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-customer-stories", "failure");
      return null;
    }

    const data = (await res.json()) as { stories: LiveCustomerStory[] };
    captureIntegrationCall("zynreach-admin-customer-stories", "success");
    return data.stories;
  } catch {
    captureIntegrationCall("zynreach-admin-customer-stories", "failure");
    return null;
  }
}

export async function getPublishedCustomerStory(locale: string, slug: string): Promise<LiveCustomerStory | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-customer-stories", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/customer-stories/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: 0 },
      signal: AbortSignal.timeout(5000),
    });

    if (res.status === 404) {
      captureIntegrationCall("zynreach-admin-customer-stories", "success");
      return null;
    }
    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-customer-stories", "failure");
      return null;
    }

    const data = (await res.json()) as { story: LiveCustomerStory };
    captureIntegrationCall("zynreach-admin-customer-stories", "success");
    return data.story;
  } catch {
    captureIntegrationCall("zynreach-admin-customer-stories", "failure");
    return null;
  }
}
