import { NextResponse } from "next/server";
import { isNonEmpty } from "@/lib/validation";
import { sendChatMessage } from "@/lib/services/chat-relay";

interface ChatSendRequestBody {
  conversationToken?: string;
  body?: string;
}

/**
 * Visitor-facing half of the Sales chat relay — called by SalesChatWidget
 * in the browser. Keeps ZYNREACH_ADMIN_SERVICE_TOKEN server-side only
 * (never sent to the client), same boundary every other form on this
 * site already respects for its own admin hand-off.
 */
export async function POST(request: Request) {
  let payload: ChatSendRequestBody;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const body = payload.body?.trim() ?? "";
  if (!isNonEmpty(body) || body.length > 4000) {
    return NextResponse.json({ error: "Message is required and must be under 4000 characters." }, { status: 400 });
  }

  const result = await sendChatMessage(payload.conversationToken, body);
  if (!result) {
    return NextResponse.json({ error: "Chat is temporarily unavailable." }, { status: 503 });
  }

  return NextResponse.json(result, { status: 201 });
}
