import { NextResponse } from "next/server";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";
import { unsubscribeFromNotifications } from "@/lib/services/notifications";

export async function POST(request: Request) {
  if (isRateLimited(`notifications-unsubscribe:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body: { token?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const token = body.token?.trim() ?? "";
  if (!token) {
    return NextResponse.json({ error: "Missing token." }, { status: 400 });
  }

  const result = await unsubscribeFromNotifications(token);
  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Couldn't unsubscribe." }, { status: 502 });
  }

  return NextResponse.json({ status: "success" });
}
