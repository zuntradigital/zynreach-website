import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Read path into System B's CMS General "Redirects" feature. Mirrors
 * site-settings.ts's getSiteSettings() shape/contract exactly — same env
 * vars, same fail-open-to-null behavior — since proxy.ts consumes both
 * with its own short-TTL in-memory cache rather than Next's ISR cache
 * (a proxy can't rely on the data cache the way a page can).
 */

export interface WebsiteRedirect {
  from: string;
  to: string;
  permanent: boolean;
}

export async function getRedirects(): Promise<WebsiteRedirect[] | null> {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;

  if (!baseUrl || !token) {
    captureIntegrationCall("zynreach-admin-redirects", "failure");
    return null;
  }

  try {
    const res = await fetch(`${baseUrl}/api/public/redirects`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-redirects", "failure");
      return null;
    }

    const data = (await res.json()) as { redirects: WebsiteRedirect[] };
    captureIntegrationCall("zynreach-admin-redirects", "success");
    return Array.isArray(data.redirects) ? data.redirects : [];
  } catch {
    captureIntegrationCall("zynreach-admin-redirects", "failure");
    return null;
  }
}
