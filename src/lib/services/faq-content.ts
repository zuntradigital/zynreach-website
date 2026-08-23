import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Read path into System B's FAQ module (CMS Navigation/Footer/FAQ
 * Management pass) — the live source for the FAQ page, replacing what
 * used to be hardcoded in messages/{locale}.json's faqPage.items. Same
 * shape/contract as customer-stories-content.ts's getPublishedCustomerStories.
 */

export interface LiveFaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export async function getPublishedFaqs(locale: string): Promise<LiveFaqItem[] | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-faq", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/faq?locale=${encodeURIComponent(locale)}`, {
      headers: { Authorization: `Bearer ${token}` },
      // A content edit in the Dashboard must be visible immediately, same
      // reasoning as customer-stories-content.ts's own revalidate: 0.
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-faq", "failure");
      return null;
    }

    const data = (await res.json()) as { faqs: LiveFaqItem[] };
    captureIntegrationCall("zynreach-admin-faq", "success");
    return data.faqs;
  } catch {
    captureIntegrationCall("zynreach-admin-faq", "failure");
    return null;
  }
}
