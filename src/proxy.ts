import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSiteSettings } from "@/lib/services/site-settings";
import { getRedirects, type WebsiteRedirect } from "@/lib/services/redirects";
import { routing, type Locale } from "@/i18n/routing";

/**
 * SRS §22 Maintenance Mode: when the Dashboard toggle is on, every visitor
 * gets the maintenance page instead of the requested route — the setting
 * must actually take effect on the live site, not just save in the admin.
 *
 * Runs on the Node.js runtime by default in this Next.js version (proxy
 * replaces the deprecated `middleware` convention here — see
 * node_modules/next/dist/docs/.../file-conventions/proxy.md), so a plain
 * module-level cache works: it persists across requests within one running
 * server process. A 30s TTL means a toggle flip is live within 30s without
 * calling the admin API on every single page request, and any fetch
 * failure fails OPEN (site behaves normally) rather than closed — an
 * unreachable Settings service must never be able to take the whole
 * public site down.
 */
let cached: { enabled: boolean; reason?: string; fetchedAt: number } | null = null;
const CACHE_TTL_MS = 30_000;

async function isMaintenanceModeEnabled(): Promise<{ enabled: boolean; reason?: string }> {
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached;
  }
  const remote = await getSiteSettings();
  const enabled = remote?.settings.maintenanceMode.enabled ?? false;
  const reason = remote?.settings.maintenanceMode.reason;
  cached = { enabled, reason, fetchedAt: Date.now() };
  return cached;
}

/**
 * CMS General "Redirects" — admin-managed URL redirects for moved/retired
 * pages. Same cached, fail-open pattern as Maintenance Mode above (this
 * app can't rely on Next's data cache inside a proxy, so it keeps its own
 * short-TTL in-memory copy). `from`/`to` are stored locale-agnostic in the
 * admin (e.g. "/old-page"); the current locale prefix is re-applied here
 * before redirecting so the visitor stays on the same locale they arrived on.
 */
let cachedRedirects: { list: WebsiteRedirect[]; fetchedAt: number } | null = null;

async function loadRedirects(): Promise<WebsiteRedirect[]> {
  if (cachedRedirects && Date.now() - cachedRedirects.fetchedAt < CACHE_TTL_MS) {
    return cachedRedirects.list;
  }
  const remote = await getRedirects();
  const list = remote ?? cachedRedirects?.list ?? [];
  cachedRedirects = { list, fetchedAt: Date.now() };
  return list;
}

function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/")[1];
  return (routing.locales as readonly string[]).includes(first) ? (first as Locale) : routing.defaultLocale;
}

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const locale = localeFromPathname(pathname);

  if (pathname === `/${locale}/maintenance`) {
    return NextResponse.next();
  }

  const pathAfterLocale = pathname.slice(`/${locale}`.length) || "/";
  const redirects = await loadRedirects();
  const match = redirects.find((r) => r.from === pathAfterLocale);
  if (match) {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}${match.to}`;
    return NextResponse.redirect(url, match.permanent ? 301 : 307);
  }

  const { enabled } = await isMaintenanceModeEnabled();
  if (!enabled) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/maintenance`;
  return NextResponse.rewrite(url, {
    status: 503,
    headers: { "Retry-After": "3600" },
  });
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|opengraph-image|favicon.ico|robots.txt|sitemap.xml|manifest.webmanifest|icon.png|apple-icon.png).*)",
  ],
};
