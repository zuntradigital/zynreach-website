/**
 * Error/monitoring abstraction (SRS Section 30.6: "Application logging
 * captures API error rates, form-submission success/failure rates, and
 * downstream-integration availability... with alerting on error-rate
 * thresholds").
 *
 * BLOCKER: no error-reporting provider (Sentry, Datadog, etc.) is
 * connected — SENTRY_DSN / equivalent isn't set. This logs structured
 * errors server-side (visible in platform logs, e.g. Vercel's log
 * stream) so nothing is silently swallowed today. Swapping the body of
 * `captureError` for a real provider SDK call is the only change needed
 * once credentials exist — every call site in this codebase stays the
 * same.
 *
 * SRS 30.6 also requires "no plaintext sensitive data in long-lived
 * logs" — callers must pass only non-PII context (form IDs, status
 * codes, route names), never raw form field values.
 */

export interface ErrorContext {
  route?: string;
  formId?: string;
  statusCode?: number;
  [key: string]: unknown;
}

export function captureError(error: unknown, context: ErrorContext = {}) {
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  console.error(
    "[monitoring]",
    JSON.stringify({ message, stack, context, timestamp: new Date().toISOString() })
  );
}

const CHUNK_ERROR_RELOAD_KEY = "zr_chunk_error_reload_attempted";

/**
 * A "ChunkLoadError" (or a bare 404 while `import()`-ing a route chunk)
 * means the JS bundle already running in the browser is out of sync with
 * the server's current build manifest — most commonly because production
 * runs more than one app instance/process built independently (no
 * `generateBuildId` is pinned in next.config.ts), and a load balancer
 * routed this asset request to an instance that never emitted this exact
 * chunk filename. It is not a bug in the page itself.
 */
export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  return error.name === "ChunkLoadError" || /loading chunk .*failed|failed to load chunk/i.test(error.message);
}

/**
 * React's own error-boundary `reset()` re-renders with the SAME
 * already-loaded (stale) bundle, so it can never recover a missing static
 * chunk — only a real navigation re-fetches fresh HTML and an up-to-date
 * asset manifest. Retried at most once per browser tab (the sessionStorage
 * flag persists across the reload itself but not into a new tab) so a
 * genuinely down server still falls through to the normal error UI
 * instead of reload-looping forever. Returns true if a reload was
 * triggered, so callers can skip rendering the fallback UI for that frame.
 */
export function recoverFromChunkLoadError(): boolean {
  if (typeof window === "undefined") return false;
  if (window.sessionStorage.getItem(CHUNK_ERROR_RELOAD_KEY)) return false;
  window.sessionStorage.setItem(CHUNK_ERROR_RELOAD_KEY, "1");
  window.location.reload();
  return true;
}

/** SRS 30.6: form-submission success/failure rate logging. */
export function captureFormOutcome(formId: string, outcome: "success" | "validation_error" | "server_error") {
  console.info("[monitoring:form]", JSON.stringify({ formId, outcome, timestamp: new Date().toISOString() }));
}

/** SRS 30.6: downstream-integration availability logging (CRM, scheduling, ATS, search). */
export function captureIntegrationCall(integration: string, outcome: "success" | "failure") {
  console.info(
    "[monitoring:integration]",
    JSON.stringify({ integration, outcome, timestamp: new Date().toISOString() })
  );
}
