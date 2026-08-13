import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

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

const nextConfig: NextConfig = {
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
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
