import { NextResponse } from "next/server";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";
import { subscribeToPush, type NotificationCategory } from "@/lib/services/notifications";

const VALID_CATEGORIES: NotificationCategory[] = ["BLOG", "WEBINARS"];

interface PushSubscribeBody {
  endpoint?: string;
  keys?: { p256dh?: string; auth?: string };
  categories?: string[];
}

export async function POST(request: Request) {
  if (isRateLimited(`notifications-push-subscribe:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body: PushSubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const endpoint = body.endpoint?.trim() ?? "";
  const p256dh = body.keys?.p256dh?.trim() ?? "";
  const auth = body.keys?.auth?.trim() ?? "";
  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ error: "Invalid subscription." }, { status: 400 });
  }

  const categories = (body.categories ?? []).filter((c): c is NotificationCategory => VALID_CATEGORIES.includes(c as NotificationCategory));
  if (categories.length === 0) {
    return NextResponse.json({ error: "Choose at least one category." }, { status: 400 });
  }

  const result = await subscribeToPush({ endpoint, keys: { p256dh, auth } }, categories);
  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Couldn't enable push notifications." }, { status: 502 });
  }

  return NextResponse.json({ status: "success" });
}
