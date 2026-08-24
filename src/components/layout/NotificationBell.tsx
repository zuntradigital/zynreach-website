"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bell } from "lucide-react";
import { Link } from "@/i18n/navigation";
import {
  isPushSupported,
  getPushSubscription,
  subscribeToPush as clientSubscribeToPush,
  unsubscribeFromPush as clientUnsubscribeFromPush,
} from "@/lib/push-notifications";

type NotificationCategory = "BLOG" | "WEBINARS";

interface FeedItem {
  id: string;
  category: NotificationCategory;
  title: string;
  url: string;
  date: string;
}

const LAST_SEEN_KEY = "zr_notif_last_seen";
const EMAIL_KEY = "zr_notif_email";
const UNSUB_TOKEN_KEY = "zr_notif_unsub_token";
const CATEGORIES_KEY = "zr_notif_categories";
const ALL_CATEGORIES: NotificationCategory[] = ["BLOG", "WEBINARS"];

interface NotificationBellProps {
  variant?: "dark" | "light";
}

/**
 * Notifications Center entry point — In-App Notifications + Notification
 * History (real published Blog/Webinar items from /api/notifications/feed,
 * read-state kept client-side since this site has no visitor accounts —
 * see that route's own docstring) plus Notification Preferences (email
 * categories) and the Push Notifications opt-in, all in one panel so
 * there's a single, discoverable place for every notification channel.
 */
export function NotificationBell({ variant = "dark" }: NotificationBellProps) {
  const t = useTranslations("notificationsCenter");
  const locale = useLocale();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<FeedItem[] | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const [email, setEmail] = useState("");
  const [categories, setCategories] = useState<Set<NotificationCategory>>(new Set(ALL_CATEGORIES));
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);
  const [formStatus, setFormStatus] = useState<"idle" | "saving" | "error" | "saved">("idle");

  const [pushSupported, setPushSupported] = useState(false);
  const [pushEnabled, setPushEnabled] = useState(false);
  const [pushBusy, setPushBusy] = useState(false);
  const [pushError, setPushError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/notifications/feed?locale=${encodeURIComponent(locale)}`)
      .then((res) => res.json())
      .then((data: { items?: FeedItem[] }) => {
        const list = data.items ?? [];
        setItems(list);
        const lastSeen = localStorage.getItem(LAST_SEEN_KEY);
        const lastSeenTime = lastSeen ? new Date(lastSeen).getTime() : 0;
        setUnreadCount(list.filter((item) => new Date(item.date).getTime() > lastSeenTime).length);
      })
      .catch(() => setItems([]));

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPushSupported(isPushSupported());
    getPushSubscription()
      .then((sub) => setPushEnabled(Boolean(sub)))
      .catch(() => undefined);

    const storedEmail = localStorage.getItem(EMAIL_KEY);
    if (storedEmail) {
      setEmail(storedEmail);
      setSubscribedEmail(storedEmail);
    }
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    if (storedCategories) {
      try {
        const parsed = JSON.parse(storedCategories) as string[];
        setCategories(new Set(parsed.filter((c): c is NotificationCategory => ALL_CATEGORIES.includes(c as NotificationCategory))));
      } catch {
        // Corrupt/old localStorage value — keep the default (all categories).
      }
    }
  }, [locale]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function toggleOpen() {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        localStorage.setItem(LAST_SEEN_KEY, new Date().toISOString());
        setUnreadCount(0);
      }
      return next;
    });
  }

  function toggleCategory(category: NotificationCategory) {
    setCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  async function handleSubscribe() {
    if (!email.trim() || categories.size === 0) return;
    setFormStatus("saving");
    try {
      const res = await fetch("/api/notifications/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), categories: Array.from(categories) }),
      });
      const data = await res.json();
      if (!res.ok) {
        setFormStatus("error");
        return;
      }
      localStorage.setItem(EMAIL_KEY, email.trim());
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(Array.from(categories)));
      if (data.unsubscribeToken) localStorage.setItem(UNSUB_TOKEN_KEY, data.unsubscribeToken);
      setSubscribedEmail(email.trim());
      setFormStatus("saved");
    } catch {
      setFormStatus("error");
    }
  }

  async function handleUnsubscribe() {
    const token = localStorage.getItem(UNSUB_TOKEN_KEY);
    if (token) {
      await fetch("/api/notifications/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      }).catch(() => undefined);
    }
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(UNSUB_TOKEN_KEY);
    setSubscribedEmail(null);
    setFormStatus("idle");
  }

  async function handleTogglePush() {
    setPushBusy(true);
    setPushError(null);
    try {
      if (pushEnabled) {
        const result = await clientUnsubscribeFromPush();
        if (result.success) setPushEnabled(false);
        else setPushError(result.error ?? null);
      } else {
        const result = await clientSubscribeToPush(Array.from(categories));
        if (result.success) setPushEnabled(true);
        else setPushError(result.error ?? null);
      }
    } finally {
      setPushBusy(false);
    }
  }

  const toneClasses = variant === "light" ? "text-white/90 hover:text-primary-300" : "text-neutral-700 hover:text-primary-600";

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t("bellLabel")}
        onClick={toggleOpen}
        className={`relative inline-flex h-9 w-9 items-center justify-center rounded-md transition-colors duration-200 ${toneClasses}`}
      >
        <Bell aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
        {unreadCount > 0 ? (
          <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        ) : null}
      </button>

      <div
        role="dialog"
        aria-label={t("panelLabel")}
        className={`absolute end-0 top-full z-20 pt-2 transition-all duration-150 ease-out-default ${
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
        }`}
      >
        <div className="w-[22rem] max-w-[90vw] overflow-hidden rounded-lg border border-neutral-200 bg-white dark:bg-neutral-100 shadow-card-hover">
          <div className="max-h-72 overflow-y-auto border-b border-neutral-200">
            <p className="px-4 pt-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">{t("historyTitle")}</p>
            {items === null ? (
              <p className="px-4 py-4 text-sm text-neutral-500">{t("loading")}</p>
            ) : items.length === 0 ? (
              <p className="px-4 py-4 text-sm text-neutral-500">{t("empty")}</p>
            ) : (
              <ul className="divide-y divide-neutral-100 py-1">
                {items.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <Link
                      href={item.url}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-200"
                    >
                      <span className="block text-xs font-medium text-primary-600">
                        {item.category === "BLOG" ? t("categoryBlog") : t("categoryWebinars")}
                      </span>
                      <span className="block truncate text-sm text-neutral-900">{item.title}</span>
                      <span className="block text-xs text-neutral-500">{new Date(item.date).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US")}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{t("preferencesTitle")}</p>

            <div className="mt-2 flex gap-3">
              <label className="flex items-center gap-1.5 text-sm text-neutral-700">
                <input type="checkbox" checked={categories.has("BLOG")} onChange={() => toggleCategory("BLOG")} className="h-4 w-4" />
                {t("categoryBlog")}
              </label>
              <label className="flex items-center gap-1.5 text-sm text-neutral-700">
                <input type="checkbox" checked={categories.has("WEBINARS")} onChange={() => toggleCategory("WEBINARS")} className="h-4 w-4" />
                {t("categoryWebinars")}
              </label>
            </div>

            {subscribedEmail ? (
              <div className="mt-3">
                <p className="text-sm text-neutral-700">{t("subscribedAs", { email: subscribedEmail })}</p>
                <button
                  type="button"
                  onClick={() => void handleUnsubscribe()}
                  className="mt-2 text-sm font-medium text-error hover:underline"
                >
                  {t("unsubscribe")}
                </button>
              </div>
            ) : (
              <div className="mt-3">
                <label htmlFor="notif-email" className="sr-only">
                  {t("emailLabel")}
                </label>
                <input
                  id="notif-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm text-neutral-900 focus-visible:border-primary-600 focus-visible:outline-none"
                />
                {formStatus === "error" ? <p className="mt-1 text-xs text-error">{t("saveError")}</p> : null}
                <button
                  type="button"
                  onClick={() => void handleSubscribe()}
                  disabled={formStatus === "saving"}
                  className="mt-2 min-h-9 w-full rounded-md bg-primary-600 px-3 text-sm font-medium text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  {formStatus === "saving" ? t("saving") : t("subscribe")}
                </button>
              </div>
            )}

            {pushSupported ? (
              <div className="mt-4 border-t border-neutral-200 pt-3">
                <label className="flex items-center justify-between gap-3 text-sm text-neutral-700">
                  {t("pushLabel")}
                  <input type="checkbox" checked={pushEnabled} disabled={pushBusy} onChange={() => void handleTogglePush()} className="h-4 w-4" />
                </label>
                {pushError ? <p className="mt-1 text-xs text-error">{pushError}</p> : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
