import { NextResponse } from "next/server";
import { pollChatMessages } from "@/lib/services/chat-relay";

/**
 * Poll endpoint SalesChatWidget calls on an interval to pick up AGENT
 * replies sent from the Dashboard's Chat Inbox — "Dashboard -> Backend
 * -> Database -> Website Chatbot" (item 8). No websocket/SSE
 * infrastructure exists anywhere in this codebase, so polling matches
 * the project's existing architecture rather than adding a new one.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const conversationToken = searchParams.get("conversationToken");
  const after = searchParams.get("after") ?? undefined;

  if (!conversationToken) {
    return NextResponse.json({ error: "conversationToken is required." }, { status: 400 });
  }

  const result = await pollChatMessages(conversationToken, after);
  if (!result) {
    return NextResponse.json({ error: "Chat is temporarily unavailable." }, { status: 503 });
  }

  return NextResponse.json(result, { status: 200 });
}
