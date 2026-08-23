import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Read path into System B's full Webinar detail endpoint (Knowledge
 * Center §9.5-9.7) — richer than the list-shape `webinars` array
 * src/lib/services/resources-content.ts already serves (see that
 * endpoint's own comment for why the two are separate). Same
 * shape/contract as customer-stories-content.ts's getPublishedCustomerStory.
 */

export interface LiveWebinarDetail {
  slug: string;
  gated: boolean;
  featured: boolean;
  scheduledAt: string | null;
  durationMinutes: number | null;
  isOnDemand: boolean;
  videoUrl: string | null;
  category?: string;
  speakerPhoto: { url: string; altText: string } | null;
  title: string;
  description: string;
  speakerName: string;
  speakerTitle: string;
  speakerCompany: string;
  agenda?: string;
  whatYouWillLearn?: string;
  keyTakeaways?: string;
  seoTitle?: string;
  seoDescription?: string;
}

export async function getPublishedWebinarDetail(locale: string, slug: string): Promise<LiveWebinarDetail | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-webinars", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/webinars/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // A content edit in the Dashboard must be visible immediately — see
      // the webinar detail page's own `revalidate = 0` comment.
      next: { revalidate: 0 },
    });

    if (res.status === 404) {
      captureIntegrationCall("zynreach-admin-webinars", "success");
      return null;
    }
    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-webinars", "failure");
      return null;
    }

    const data = (await res.json()) as { webinar: LiveWebinarDetail };
    captureIntegrationCall("zynreach-admin-webinars", "success");
    return data.webinar;
  } catch {
    captureIntegrationCall("zynreach-admin-webinars", "failure");
    return null;
  }
}
