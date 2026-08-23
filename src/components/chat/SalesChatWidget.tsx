"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { useTranslations } from "next-intl";
import { MessageCircle, X, Send } from "lucide-react";

interface ChatMessageDto {
  id: string;
  sender: "VISITOR" | "AGENT";
  body: string;
  createdAt: string;
}

const STORAGE_KEY = "zynreach-chat-token";
const POLL_INTERVAL_MS = 4000;

/**
 * First-party "chat with our team" widget — additional to Tawk.to
 * (TawkChat.tsx), not a replacement (Roles/Permissions/Chatbot
 * directive, item 7: "Do not remove or replace the existing public
 * chatbot functionality"). Tawk is a pure third-party embed with no
 * controllable backend, so it cannot feed our own database; this widget
 * is the separate channel that actually reaches a Sales user with the
 * chat:reply permission in the Dashboard's Chat Inbox (item 5/6),
 * deliberately labeled distinctly from Tawk's own bubble so visitors
 * aren't left guessing which one they're talking to.
 *
 * Anchored bottom-start (opposite physical corner from Tawk + the
 * WhatsApp/call cluster, both anchored bottom-end/right per
 * FloatingContactActions' own comments) so none of the three
 * fixed-position launchers ever overlap. bottom-24 (clearing
 * MobileStickyCta's full-width bar, visible below `lg`, same offset it
 * makes its own right-side neighbors use) down to lg:bottom-6 also
 * happens to clear the Next.js dev toolbar's default bottom-left corner
 * icon in local development — the same collision
 * FloatingContactActions' own comments describe having to route around
 * on the opposite corner.
 *
 * Polls /api/chat/messages every 4s while open — same "no
 * websocket/SSE infrastructure exists in this codebase" constraint the
 * Dashboard's own Chat Inbox follows.
 */
export function SalesChatWidget() {
  const t = useTranslations("common.chatWidget");
  const [open, setOpen] = useState(false);
  const [conversationToken, setConversationToken] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const threadEndRef = useRef<HTMLDivElement>(null);
  const latestTimestampRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored) setConversationToken(stored);
  }, []);

  const poll = useCallback(async (token: string) => {
    try {
      const params = new URLSearchParams({ conversationToken: token });
      if (latestTimestampRef.current) params.set("after", latestTimestampRef.current);
      const res = await fetch(`/api/chat/messages?${params.toString()}`);
      if (res.status === 503) {
        setUnavailable(true);
        return;
      }
      if (!res.ok) return;
      const data = (await res.json()) as { status: string; messages: ChatMessageDto[] };
      setUnavailable(false);
      if (data.messages.length > 0) {
        latestTimestampRef.current = data.messages[data.messages.length - 1].createdAt;
        setMessages((prev) => [...prev, ...data.messages]);
      }
    } catch {
      setUnavailable(true);
    }
  }, []);

  useEffect(() => {
    if (!open || !conversationToken) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void poll(conversationToken);
    const interval = window.setInterval(() => void poll(conversationToken), POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [open, conversationToken, poll]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  async function handleSend(event: FormEvent) {
    event.preventDefault();
    const body = draft.trim();
    if (!body || sending) return;

    setSending(true);
    setDraft("");
    try {
      const res = await fetch("/api/chat/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationToken: conversationToken ?? undefined, body }),
      });
      if (res.status === 503) {
        setUnavailable(true);
        setDraft(body);
        return;
      }
      if (!res.ok) {
        setDraft(body);
        return;
      }
      const data = (await res.json()) as { conversationToken: string; message: ChatMessageDto };
      setUnavailable(false);
      if (data.conversationToken !== conversationToken) {
        window.localStorage.setItem(STORAGE_KEY, data.conversationToken);
        setConversationToken(data.conversationToken);
      }
      latestTimestampRef.current = data.message.createdAt;
      setMessages((prev) => [...prev, data.message]);
    } catch {
      setUnavailable(true);
      setDraft(body);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-24 start-4 z-40 flex flex-col items-start gap-3 lg:bottom-6 lg:start-6">
      {open ? (
        <div
          role="dialog"
          aria-label={t("title")}
          className="flex h-[28rem] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-card-hover dark:border-neutral-300 dark:bg-neutral-100"
        >
          <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-3 dark:border-neutral-300">
            <div>
              <p className="text-sm font-semibold text-neutral-900">{t("title")}</p>
              <p className="text-xs text-neutral-500">{t("subtitle")}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("close")}
              className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-50 hover:text-neutral-600 dark:hover:bg-neutral-200"
            >
              <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>

          <div className="flex-1 space-y-2 overflow-y-auto p-4">
            {messages.length === 0 ? <p className="text-sm text-neutral-500">{t("emptyState")}</p> : null}
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "VISITOR" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${
                    message.sender === "VISITOR" ? "bg-primary-600 text-white" : "bg-neutral-100 text-neutral-800 dark:bg-neutral-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{message.body}</p>
                </div>
              </div>
            ))}
            <div ref={threadEndRef} />
          </div>

          {unavailable ? <p className="border-t border-neutral-200 px-4 py-2 text-xs text-error dark:border-neutral-300">{t("unavailable")}</p> : null}

          <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-neutral-200 p-3 dark:border-neutral-300">
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={t("placeholder")}
              maxLength={4000}
              className="block w-full flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 dark:border-neutral-400 dark:bg-neutral-50"
            />
            <button
              type="submit"
              disabled={sending || !draft.trim()}
              aria-label={t("send")}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:opacity-60"
            >
              <Send aria-hidden="true" className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </form>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? t("close") : t("launcherLabel")}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-card-hover transition-all duration-300 ease-out-default hover:scale-110 hover:bg-primary-700 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-600 focus-visible:ring-offset-2"
      >
        {open ? <X aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} /> : <MessageCircle aria-hidden="true" className="h-6 w-6" strokeWidth={1.75} />}
      </button>
    </div>
  );
}
