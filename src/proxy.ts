import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Match every path except Next.js internals, API routes, and files with an extension
  // (favicon.ico, icon.png, opengraph-image, manifest.webmanifest, robots.txt, sitemap.xml).
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
