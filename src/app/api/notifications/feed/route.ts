import { NextResponse } from "next/server";
import { getPublishedBlog } from "@/lib/services/blog-content";
import { getPublishedResources } from "@/lib/services/resources-content";

export interface NotificationFeedItem {
  id: string;
  category: "BLOG" | "WEBINARS";
  title: string;
  url: string;
  date: string;
}

/**
 * Notifications Center — "In-App Notifications" / "Notification History"
 * read side. This site has no visitor accounts (see repo-wide architecture
 * note: marketing site, no auth/session/database), so there is no server-
 * side per-visitor notification inbox to serve. Instead this returns the
 * real, live-published Blog/Webinar items — the same events that trigger
 * email/push sends (System B's notifySubscribers) — and NotificationBell
 * tracks each visitor's own read/seen state in localStorage. The feed
 * itself is genuine CMS data, not mocked; only the "have I seen this"
 * bookkeeping is client-side, because there is no account to store it
 * against server-side.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "en";

  const [blog, resources] = await Promise.all([getPublishedBlog(locale), getPublishedResources(locale)]);

  const items: NotificationFeedItem[] = [
    ...(blog?.posts ?? []).map((post) => ({
      id: `blog:${post.slug}`,
      category: "BLOG" as const,
      title: post.title,
      // Locale-agnostic — NotificationBell renders this through
      // @/i18n/navigation's Link, which prepends the current locale
      // itself; including it here too doubled it (/en/en/blog/...).
      url: `/blog/${post.slug}`,
      date: post.publishedDate,
    })),
    ...(resources?.webinars ?? []).map((webinar) => ({
      id: `webinar:${webinar.slug}`,
      category: "WEBINARS" as const,
      title: webinar.title,
      url: `/webinars/${webinar.slug}`,
      date: webinar.date,
    })),
  ]
    .filter((item) => Boolean(item.date))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  return NextResponse.json({ items });
}
