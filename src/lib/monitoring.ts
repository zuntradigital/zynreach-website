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
