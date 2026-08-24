"use client";

/** Notifications Center — Web Push client. Registers public/sw.js, asks
 * the browser's PushManager to subscribe using the site's VAPID public
 * key, and posts the resulting subscription to this app's own
 * /api/notifications/push/* routes (which forward it to System B with
 * the service token). */

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i++) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isPushSupported(): boolean {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "PushManager" in window && Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
}

export async function getPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) return null;
  return registration.pushManager.getSubscription();
}

export async function subscribeToPush(categories: ("BLOG" | "WEBINARS")[]): Promise<{ success: boolean; error?: string }> {
  if (!isPushSupported()) return { success: false, error: "Push notifications aren't supported in this browser." };

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { success: false, error: "Notification permission was denied." };
  }

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
  });

  const json = subscription.toJSON();
  const res = await fetch("/api/notifications/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint: json.endpoint, keys: json.keys, categories }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return { success: false, error: data?.error ?? "Couldn't enable push notifications." };
  }

  return { success: true };
}

export async function unsubscribeFromPush(): Promise<{ success: boolean; error?: string }> {
  const subscription = await getPushSubscription();
  if (!subscription) return { success: true };

  const endpoint = subscription.endpoint;
  await subscription.unsubscribe();

  const res = await fetch("/api/notifications/push/unsubscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ endpoint }),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => null);
    return { success: false, error: data?.error ?? "Couldn't disable push notifications." };
  }

  return { success: true };
}
