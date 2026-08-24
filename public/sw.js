/**
 * Notifications Center — Web Push service worker. Registered by
 * src/lib/push-notifications.ts. Root-scoped (excluded from proxy.ts's
 * locale redirect — see that file's matcher) so it controls the whole
 * origin, matching every push subscription's scope.
 */

self.addEventListener("push", (event) => {
  let payload = { title: "ZynReach", body: "You have a new update.", url: "/" };
  try {
    if (event.data) payload = { ...payload, ...event.data.json() };
  } catch {
    // Non-JSON push payload — fall back to the defaults above.
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: "/logo-mark.png",
      data: { url: payload.url },
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data?.url || "/";

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if (client.url === url && "focus" in client) return client.focus();
      }
      return self.clients.openWindow(url);
    })
  );
});
