import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { execSync } from "node:child_process";
import { routing } from "./src/i18n/routing";

/**
 * Root cause of the intermittent production chunk 404s (client sees
 * "Failed to load chunk .../<hash>.js from module ..." / MIME-type errors
 * / the global-error boundary): with `deploymentId` unset, every
 * `next build` invocation gets its own random, independent build ID and
 * its own independently-hashed chunk filenames — even from the exact same
 * source commit. The moment more than one server process/instance is
 * running this app (Hostinger's Node.js App panel, a PM2 cluster, or the
 * brief window during a redeploy where the old process is still serving
 * traffic while a new `next build` is writing over `.next/static/*`), a
 * single page load's parallel asset requests can land on different
 * backend processes — each expecting a chunk manifest only ITS OWN build
 * produced. A request for a chunk that exists in build A's manifest,
 * served against build B's `.next/static`, 404s. This is Next's own
 * documented "version skew" failure mode (see
 * node_modules/next/dist/docs/01-app/02-guides/self-hosting.md, "Build
 * Cache" / "Deployment identifier" / "Version Skew" sections) — it is not
 * a bug in any page or component, and no amount of client-side
 * retry/reload logic fixes its cause, only its symptom.
 *
 * The real fix has two parts:
 *  1. `deploymentId` below, pinned to the actual source commit, so that
 *     if the deployment process ever does end up re-running `next build`
 *     per instance/stage from the SAME commit (rather than building once
 *     and sharing that output — the deployment-process fix this alone
 *     does not replace), every one of those independent builds still
 *     agrees on the same deployment tag, and Next's own client runtime
 *     can detect a REAL mismatch (an old client talking to a genuinely
 *     newer deployment after a rollout) and force a full reload instead
 *     of a broken partial one.
 *
 *     `generateBuildId` is deliberately NOT also set: verified against
 *     this exact Next 16.2.12 install's own source
 *     (node_modules/next/dist/build/index.js, `getBuildId`) that once
 *     `config.deploymentId` is present, Next intentionally ignores
 *     `generateBuildId` entirely and writes a fixed placeholder string to
 *     `.next/BUILD_ID` instead — "Skew protection is enabled and
 *     NEXT_NAV_DEPLOYMENT_ID_HEADER will be used instead" (that file's own
 *     comment). `deploymentId` fully supersedes `generateBuildId`'s role
 *     here; setting both would just leave `generateBuildId` as dead code
 *     Next never calls.
 *  2. Deploy correctly: build once per release and start every
 *     process/worker from that one already-built `.next` output — see
 *     ecosystem.config.js and scripts/deploy.sh in this repo, which
 *     implement the atomic build-then-swap pattern self-hosting.md's
 *     "Build Cache" section calls for ("The same build should be used to
 *     boot up multiple containers").
 *
 * Resolution order: an explicit NEXT_DEPLOYMENT_ID (set by
 * scripts/deploy.sh, or by hand for a manual deploy) wins; otherwise the
 * current git commit SHA, since this repo is deployed from a git
 * checkout (see scripts/deploy.sh) and every build from the same commit
 * must produce the same identifier; otherwise a per-process-start
 * timestamp — worse than a real commit-derived ID (two independently
 * started processes from the same commit would disagree), but still
 * infinitely better than leaving deploymentId unset, which is what
 * actively causes the bug being fixed here.
 */
function resolveBuildIdentifier(): string {
  if (process.env.NEXT_DEPLOYMENT_ID) return process.env.NEXT_DEPLOYMENT_ID;
  try {
    return execSync("git rev-parse HEAD", { cwd: __dirname, stdio: ["ignore", "pipe", "ignore"] })
      .toString()
      .trim();
  } catch {
    return `fallback-${Date.now()}`;
  }
}

const buildIdentifier = resolveBuildIdentifier();

/**
 * SRS Section 19: HTTPS/HSTS, secure headers, CSP, XSS protection.
 *
 * CSP uses 'unsafe-inline' for script-src because this app renders
 * inline JSON-LD <script> tags on every page (structured data) without
 * a nonce-issuing middleware. This is a real, common production
 * trade-off for Next.js sites without nonce infrastructure — not a gap
 * hidden as done. Tightening it to a nonce-based policy is a follow-up,
 * not a blocker: it would touch every page that renders JSON-LD.
 *
 * 'unsafe-eval' is added only outside production — Next.js dev mode
 * (React DevTools stack reconstruction, Turbopack HMR) uses eval() for
 * debugging only; "React will never use eval() in production mode."
 */
const isDev = process.env.NODE_ENV !== "production";

// System B (ZynReach Admin/CMS Dashboard) serves CMS-uploaded media from
// its own origin (src/lib/media/storage.ts) — CMS Pages rendered at
// /cms/{slug} (src/lib/services/cms-content.ts) load images cross-origin
// from there. Both next/image's allowlist and CSP img-src need that
// origin explicitly; derived from the same env var the fetch itself
// uses, not hardcoded, so this stays correct wherever System B is
// actually reachable. Unset: no extra origin is allowed, matching that
// integration's own graceful "returns null" degradation.
const zynreachAdminOrigin = process.env.ZYNREACH_ADMIN_API_URL ? new URL(process.env.ZYNREACH_ADMIN_API_URL) : null;

const csp = [
  "default-src 'self'",
  // cdn.jsdelivr.net: Tawk.to's own widget assets (per Tawk.to's documented CSP requirements).
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""} https://www.googletagmanager.com https://*.tawk.to https://cdn.jsdelivr.net`,
  "style-src 'self' 'unsafe-inline' https://*.tawk.to https://fonts.googleapis.com https://cdn.jsdelivr.net",
  `img-src 'self' data: https://www.google-analytics.com https://www.googletagmanager.com https://*.tawk.to https://cdn.jsdelivr.net https://tawk.link https://s3.amazonaws.com${zynreachAdminOrigin ? ` ${zynreachAdminOrigin.origin}` : ""}`,
  "font-src 'self' data: https://*.tawk.to https://fonts.gstatic.com",
  "connect-src 'self' https://www.google-analytics.com https://analytics.google.com https://www.googletagmanager.com https://*.tawk.to wss://*.tawk.to",
  // Tawk.to's notification/message audio.
  "media-src 'self' https://*.tawk.to",
  // Tawk.to spins up a background worker from a blob: URL; without this, script-src is used as
  // the fallback and blob: isn't in it.
  "worker-src 'self' blob:",
  // google.com: the embedded headquarters map on /contact. *.tawk.to: the chat widget's own iframe.
  "frame-src https://www.google.com https://*.tawk.to",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self' https://*.tawk.to",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
];

// Knowledge Center IA restructure: /resources/guides and /resources/webinars
// moved to their own top-level URLs (/guides-templates, /webinars — see
// Knowledge Center §8.1/§9.1's explicit "URL:" declarations, the more
// specific and authoritative statement over the sitemap tree diagram
// elsewhere in that same spec, which read as organizational nesting rather
// than a literal path requirement), and the /resources hub itself was
// replaced by /knowledge-center. routing.localePrefix is "always" (see
// src/i18n/routing.ts), so every real URL on this site carries an /en or
// /ar prefix — redirect sources need that prefix explicitly, a bare
// "/resources/..." source would never match an actual request.
const knowledgeCenterRedirects = [
  { from: "/resources/guides", to: "/guides-templates" },
  { from: "/resources/guides/:slug*", to: "/guides-templates/:slug*" },
  { from: "/resources/webinars", to: "/webinars" },
  { from: "/resources/webinars/:slug*", to: "/webinars/:slug*" },
  { from: "/resources", to: "/knowledge-center" },
  // These two were themselves live for a period under the (superseded)
  // nested interpretation — preserved as their own redirect so no URL
  // that was ever real goes broken, per the "old URLs must not become
  // broken" rule.
  { from: "/knowledge-center/guides-templates", to: "/guides-templates" },
  { from: "/knowledge-center/guides-templates/:slug*", to: "/guides-templates/:slug*" },
  { from: "/knowledge-center/webinars", to: "/webinars" },
  { from: "/knowledge-center/webinars/:slug*", to: "/webinars/:slug*" },
].flatMap(({ from, to }) =>
  routing.locales.map((locale) => ({
    source: `/${locale}${from}`,
    destination: `/${locale}${to}`,
    permanent: true,
  }))
);

// Knowledge Center IA restructure: Customer Stories moved from /customers
// (nested under the old Resources hub) to its own top-level /customer-stories
// URL, now CMS-backed (see src/lib/services/customer-stories-content.ts).
const customerStoriesRedirects = [
  { from: "/customers", to: "/customer-stories" },
  { from: "/customers/:slug*", to: "/customer-stories/:slug*" },
].flatMap(({ from, to }) =>
  routing.locales.map((locale) => ({
    source: `/${locale}${from}`,
    destination: `/${locale}${to}`,
    permanent: true,
  }))
);

// Developers section removed entirely (public site + dashboard) — every
// legacy Developers/Documentation/API Reference URL now redirects to the
// Knowledge Center rather than 404ing, covering both the original /docs*
// paths and the short-lived /developers* paths from the now-removed
// section.
const developersRedirects = [
  { from: "/docs/api", to: "/knowledge-center" },
  { from: "/docs/api/:slug*", to: "/knowledge-center" },
  { from: "/docs/:slug*", to: "/knowledge-center" },
  { from: "/docs", to: "/knowledge-center" },
  { from: "/developers/:slug*", to: "/knowledge-center" },
  { from: "/developers", to: "/knowledge-center" },
].flatMap(({ from, to }) =>
  routing.locales.map((locale) => ({
    source: `/${locale}${from}`,
    destination: `/${locale}${to}`,
    permanent: true,
  }))
);

const nextConfig: NextConfig = {
  deploymentId: buildIdentifier,
  async redirects() {
    return [...knowledgeCenterRedirects, ...customerStoriesRedirects, ...developersRedirects];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: zynreachAdminOrigin
      ? [
          {
            protocol: zynreachAdminOrigin.protocol.replace(":", "") as "http" | "https",
            hostname: zynreachAdminOrigin.hostname,
            port: zynreachAdminOrigin.port || undefined,
            pathname: "/uploads/**",
          },
        ]
      : [],
    // Next 16's image optimizer refuses to fetch from any host that
    // resolves to a loopback/private IP (images.dangerouslyAllowLocalIP,
    // default false) — a real SSRF guard, but it also blocks the very
    // common local-dev setup where System B (this admin) runs on
    // localhost and serves blog/media images from there. remotePatterns
    // above already restricts *which* host/path is allowed; this only
    // relaxes the separate "is that host a local IP" check, and only in
    // development — production deployments serve media from System B's
    // real (non-loopback) origin, where this guard is exactly the
    // protection you want left in place.
    dangerouslyAllowLocalIP: isDev,
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
