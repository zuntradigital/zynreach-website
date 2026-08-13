import Script from "next/script";

interface JsonLdProps {
  id: string;
  data: object;
}

/**
 * next/script (not a raw <script> element) for the same reason as the
 * theme-init script in the root layout: a plain <script> rendered as
 * JSX is only executed when it's part of the server's initial HTML
 * parse. Any page containing one re-renders on every client-side
 * transition (a locale switch re-renders the whole route tree), and
 * React reconciling that same raw element via the DOM API rather than
 * an HTML parse triggers "Encountered a script tag while rendering
 * React component" — one instance per script, on every such page,
 * every time. Next's own JSON-LD guide prefers a raw <script> tag on
 * the grounds that JSON-LD isn't executable code, but doesn't execute
 * either way here (dangerouslySetInnerHTML renders identical markup
 * through next/script) and strategy="afterInteractive" doesn't block
 * hydration, so this trades that stylistic preference for eliminating
 * a warning that would otherwise recur on every localized page in the
 * project.
 */
export function JsonLd({ id, data }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
