/**
 * Sales chat relay (Roles/Permissions/Chatbot directive, items 5/8): the
 * website-side half of "Website Chatbot -> Backend/API -> Database ->
 * Dashboard". This is a SEPARATE channel from Tawk.to (TawkChat.tsx) —
 * Tawk is a pure third-party embed with no controllable backend of its
 * own, so it cannot be "connected" to our database without Tawk's own
 * paid webhook product. This relay instead talks to ZynReach Admin's
 * first-party chat API (POST/GET /api/public/chat/messages), the same
 * service-token-authenticated hand-off routeLead() already uses for
 * leads, so a Sales user with the chat:reply permission can see and
 * answer from the Dashboard's Chat Inbox.
 *
 * Same graceful-degradation contract as lead-router.ts: if the two env
 * vars aren't configured, or the admin API is unreachable, calls return
 * `null` rather than throwing — callers (the /api/chat/* routes) turn
 * that into a "chat temporarily unavailable" response instead of a 500.
 */

import { captureIntegrationCall } from "@/lib/monitoring";

export interface ChatMessageDto {
  id: string;
  sender: "VISITOR" | "AGENT";
  body: string;
  createdAt: string;
}

export interface ChatSendResult {
  conversationToken: string;
  message: ChatMessageDto;
}

export interface ChatPollResult {
  status: "OPEN" | "CLOSED";
  messages: ChatMessageDto[];
}

function adminConfig(): { baseUrl: string; token: string } | null {
  const baseUrl = process.env.ZYNREACH_ADMIN_API_URL;
  const token = process.env.ZYNREACH_ADMIN_SERVICE_TOKEN;
  return baseUrl && token ? { baseUrl, token } : null;
}

export async function sendChatMessage(conversationToken: string | undefined, body: string): Promise<ChatSendResult | null> {
  const config = adminConfig();
  if (!config) return null;

  try {
    const res = await fetch(`${config.baseUrl}/api/public/chat/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.token}` },
      body: JSON.stringify({ conversationToken, body }),
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-chat", "failure");
      return null;
    }

    const data = (await res.json()) as ChatSendResult;
    captureIntegrationCall("zynreach-admin-chat", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-chat", "failure");
    return null;
  }
}

export async function pollChatMessages(conversationToken: string, after?: string): Promise<ChatPollResult | null> {
  const config = adminConfig();
  if (!config) return null;

  try {
    const params = new URLSearchParams({ conversationToken, ...(after ? { after } : {}) });
    const res = await fetch(`${config.baseUrl}/api/public/chat/messages?${params.toString()}`, {
      headers: { Authorization: `Bearer ${config.token}` },
    });

    if (!res.ok) {
      captureIntegrationCall("zynreach-admin-chat", "failure");
      return null;
    }

    const data = (await res.json()) as ChatPollResult;
    captureIntegrationCall("zynreach-admin-chat", "success");
    return data;
  } catch {
    captureIntegrationCall("zynreach-admin-chat", "failure");
    return null;
  }
}
