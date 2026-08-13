import { NextResponse } from "next/server";

/**
 * SRS 30.1/30.6: health check endpoint for load balancer / uptime
 * monitor probes. Returns 200 with build metadata whenever the app
 * server can handle requests — no downstream dependency checks, since
 * this route's only job is proving the Next.js server itself is up.
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
}
