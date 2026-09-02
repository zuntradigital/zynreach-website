"use client";

import { useEffect } from "react";
import { captureError, isChunkLoadError, recoverFromChunkLoadError } from "@/lib/monitoring";

/**
 * SRS 30.6: catches errors thrown by the root layout itself (outside the
 * reach of app/error.tsx). Must render its own <html>/<body> per the
 * Next.js App Router convention, and cannot use the shared design system
 * components since the layout that provides fonts/globals may itself be
 * the thing that failed.
 *
 * A ChunkLoadError here (the root layout's own bundle failed to load a
 * chunk — the most common real-world trigger for this boundary, e.g. from
 * a multi-instance deploy serving mismatched build artifacts) gets a
 * silent full-page reload instead of this fallback markup — see
 * recoverFromChunkLoadError's doc comment for why `reset()` alone can't
 * fix it.
 */
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    captureError(error, { route: "root-layout", digest: error.digest });
    if (isChunkLoadError(error)) recoverFromChunkLoadError();
  }, [error]);

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
        <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
        <p style={{ marginTop: "0.5rem", color: "#555555" }}>
          We hit an unexpected error. Please try again.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: "1.5rem",
            padding: "0.625rem 1.25rem",
            borderRadius: "0.75rem",
            background: "#8A6118",
            color: "white",
            fontWeight: 600,
            border: "none",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
