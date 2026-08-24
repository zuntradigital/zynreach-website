import { NextResponse } from "next/server";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";
import { unsubscribeFromPush } from "@/lib/services/notifications";

export async function POST(request: Request) {
  if (isRateLimited(`notifications-push-unsubscribe:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body: { endpoint?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const endpoint = body.endpoint?.trim() ?? "";
  if (!endpoint) {
    return NextResponse.json({ error: "Missing endpoint." }, { status: 400 });
  }

  const result = await unsubscribeFromPush(endpoint);
  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Couldn't disable push notifications." }, { status: 502 });
  }

  return NextResponse.json({ status: "success" });
}
