import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/validation";
import { isRateLimited, getClientKey } from "@/lib/rate-limit";
import { subscribeToNotifications, type NotificationCategory } from "@/lib/services/notifications";

const VALID_CATEGORIES: NotificationCategory[] = ["BLOG", "WEBINARS"];

interface SubscribeBody {
  email?: string;
  categories?: string[];
}

/** Notifications Center — Notification Preferences write side, called by
 * NotificationBell's subscribe form. */
export async function POST(request: Request) {
  if (isRateLimited(`notifications-subscribe:${getClientKey(request)}`)) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let body: SubscribeBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const email = body.email?.trim() ?? "";
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }

  const categories = (body.categories ?? []).filter((c): c is NotificationCategory => VALID_CATEGORIES.includes(c as NotificationCategory));
  if (categories.length === 0) {
    return NextResponse.json({ error: "Choose at least one category." }, { status: 400 });
  }

  const result = await subscribeToNotifications(email, categories);
  if (!result.success) {
    return NextResponse.json({ error: result.error ?? "Couldn't save your preferences." }, { status: 502 });
  }

  return NextResponse.json({ status: "success", unsubscribeToken: result.unsubscribeToken ?? null });
}
