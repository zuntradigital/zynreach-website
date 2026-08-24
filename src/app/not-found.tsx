/**
 * Root-level 404 fallback. src/app/[locale]/not-found.tsx handles a
 * mismatched dynamic segment *within* a matched /en or /ar route tree,
 * but Next's App Router only reaches into a dynamic segment's own
 * not-found.tsx for that case — a path that doesn't match any defined
 * route pattern at all (e.g. a typo'd URL with no corresponding page)
 * never enters the [locale] segment in the first place, so it falls
 * through to this root-level file instead. Without this file, Next's
 * own unstyled built-in 404 renders here — this is the one gap
 * global-error.tsx's own comment describes for the sibling "no root
 * layout" case, applied to not-found instead of errors. Same reasoning
 * as global-error.tsx for why this needs its own <html>/<body> and
 * plain inline styles (no root layout.tsx exists to provide either, and
 * the locale isn't known at this level).
 */
import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: "system-ui, sans-serif",
          padding: "4rem 1.5rem",
          textAlign: "center",
          background: "#FAF8F4",
          color: "#111111",
        }}
      >
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>We couldn&apos;t find that page</h1>
        <p style={{ marginTop: "0.5rem", color: "#555555" }}>
          The page you&apos;re looking for doesn&apos;t exist.
        </p>
        <Link
          href="/en"
          style={{
            marginTop: "1.5rem",
            display: "inline-block",
            padding: "0.625rem 1.25rem",
            borderRadius: "0.75rem",
            background: "#8A6118",
            color: "white",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          Go to homepage
        </Link>
      </body>
    </html>
  );
}
