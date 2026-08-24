import { captureIntegrationCall } from "@/lib/monitoring";

/**
 * Write path into System B's Notifications Center module
 * (src/app/api/public/notifications/* on that side). Unlike lead-router.ts,
 * these calls have no dev-safe console fallback — a subscribe/unsubscribe
 * action either really happened or it didn't, and the caller (this repo's
 * own /api/notifications/* routes) needs the true result to tell the
 * visitor whether their preference was actually saved.
 */
export type NotificationCategory = "BLOG" | "WEBINARS";

interface ServiceResult {
  success: boolean;
  error?: string;
}

function getAdminConfig(): { baseUrl: string; token: string } | null {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;
  if (!baseUrl || !token) return null;
  return { baseUrl, token };
}

async function callAdmin<T extends ServiceResult = ServiceResult>(
  path: string,
  body: unknown,
  integrationName: string,
  extract?: (data: Record<string, unknown>) => Partial<T>
): Promise<T> {
  const config = getAdminConfig();
  if (!config) {
    captureIntegrationCall(integrationName, "failure");
    return { success: false, error: "Not configured." } as T;
  }

  try {
    const res = await fetch(`${config.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.token}` },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      captureIntegrationCall(integrationName, "failure");
      return { success: false, error: (data && typeof data.error === "string" ? data.error : undefined) ?? "Request failed." } as T;
    }

    captureIntegrationCall(integrationName, "success");
    return { success: true, ...(extract && data ? extract(data) : {}) } as T;
  } catch {
    captureIntegrationCall(integrationName, "failure");
    return { success: false, error: "Request failed." } as T;
  }
}

export interface SubscribeResult extends ServiceResult {
  unsubscribeToken?: string;
}

export function subscribeToNotifications(email: string, categories: NotificationCategory[]): Promise<SubscribeResult> {
  return callAdmin<SubscribeResult>(
    "/api/public/notifications/subscribe",
    { email, categories },
    "zynreach-admin-notifications-subscribe",
    (data) => ({ unsubscribeToken: typeof data.unsubscribeToken === "string" ? data.unsubscribeToken : undefined })
  );
}

export function unsubscribeFromNotifications(token: string): Promise<ServiceResult> {
  return callAdmin("/api/public/notifications/unsubscribe", { token }, "zynreach-admin-notifications-unsubscribe");
}

export interface PushSubscriptionKeys {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

export function subscribeToPush(subscription: PushSubscriptionKeys, categories: NotificationCategory[]): Promise<ServiceResult> {
  return callAdmin(
    "/api/public/notifications/push-subscribe",
    { endpoint: subscription.endpoint, keys: subscription.keys, categories },
    "zynreach-admin-notifications-push-subscribe"
  );
}

export function unsubscribeFromPush(endpoint: string): Promise<ServiceResult> {
  return callAdmin("/api/public/notifications/push-unsubscribe", { endpoint }, "zynreach-admin-notifications-push-unsubscribe");
}
