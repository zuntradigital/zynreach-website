"use client";

import { useEffect, useState } from "react";

type Status = "loading" | "success" | "error" | "missing-token";

interface NotificationsUnsubscribeStatusProps {
  messages: Record<Status, string>;
}

/** Client half of /notifications/unsubscribe — the token is only ever
 * meaningful at request time, so this reads it from the URL and calls
 * the unsubscribe API on mount. Split out from page.tsx because that
 * page also renders NavigationBar/Footer, which are (partly) server
 * components and can't be statically imported into a "use client" page. */
export function NotificationsUnsubscribeStatus({ messages }: NotificationsUnsubscribeStatusProps) {
  const [status, setStatus] = useState<Status>("loading");

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setStatus("missing-token");
      return;
    }
    fetch("/api/notifications/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
      .then((res) => setStatus(res.ok ? "success" : "error"))
      .catch(() => setStatus("error"));
  }, []);

  return <p className="mt-4 text-center text-neutral-600">{messages[status]}</p>;
}
