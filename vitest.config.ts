import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    exclude: ["e2e/**"],
    server: {
      // Vitest externalizes node_modules packages by default (resolved by
      // plain Node.js resolution, bypassing Vite entirely) — which is why
      // the resolve.alias entries below had no effect on next-intl's own
      // `next/navigation` import: Node's resolver, not Vite's, was
      // handling it. Routing next-intl through Vite's own transform
      // pipeline instead makes those aliases actually apply.
      deps: {
        inline: ["next-intl"],
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // This project's `next` install has no package.json#exports map (an
      // artifact of the experimental Next.js build in use — see AGENTS.md),
      // so extensionless deep imports like `next/navigation` that Next's
      // own bundler resolves permissively fail under Vite/Vitest's
      // stricter ESM resolver ("Cannot find module .../next/navigation").
      // next-intl's compiled output uses exactly this import form for
      // these four submodules; aliasing each to its concrete .js file
      // (which does exist on disk) resolves it without touching
      // node_modules or next-intl's own source.
      "next/navigation": path.resolve(__dirname, "./node_modules/next/navigation.js"),
      "next/link": path.resolve(__dirname, "./node_modules/next/link.js"),
      "next/headers": path.resolve(__dirname, "./node_modules/next/headers.js"),
      "next/server": path.resolve(__dirname, "./node_modules/next/server.js"),
    },
  },
});
