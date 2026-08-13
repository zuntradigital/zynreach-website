/**
 * Per-IP sliding-window rate limiting (SRS Section 19: "Applied per-IP and
 * per-session on form submission and search endpoints").
 *
 * In-memory implementation — correct for a single Node.js instance. A
 * multi-instance production deployment needs a shared store (Redis/Upstash)
 * so limits are enforced across instances; swapping this module's internals
 * for a shared-store client is the only change needed once that
 * infrastructure exists.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const hits = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowStart = now - WINDOW_MS;
  const existing = (hits.get(key) ?? []).filter((timestamp) => timestamp > windowStart);

  if (existing.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, existing);
    return true;
  }

  existing.push(now);
  hits.set(key, existing);
  return false;
}

export function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() ?? "unknown";
}
