"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Conversation {
  id: string;
  visitorId: string;
  status: string;
  aiState: string;
  lastMessageAt: string;
}

interface Message {
  id: string;
  direction: string;
  authorKind: string;
  body: string;
  createdAt: string;
}

const AI_LABEL: Record<string, { text: string; cls: string }> = {
  active: { text: "AI active", cls: "bg-emerald-100 text-emerald-800" },
  human_owned: { text: "You own this", cls: "bg-indigo-100 text-indigo-800" },
  paused: { text: "AI paused", cls: "bg-amber-100 text-amber-800" },
  handoff_requested: { text: "Wants a human", cls: "bg-red-100 text-red-800" },
};

export default function InboxClient({
  initialConversations,
  initialSelected,
  aiReady,
}: {
  initialConversations: Conversation[];
  initialSelected: string | null;
  aiReady: boolean;
}) {
  const [conversations, setConversations] = useState(initialConversations);
  const [selected, setSelected] = useState<string | null>(
    initialSelected ?? initialConversations[0]?.id ?? null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const current = conversations.find((c) => c.id === selected) ?? null;

  const loadMessages = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/business/conversations/${id}/messages`, {
        cache: "no-store",
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load messages");
      setMessages(json.messages ?? []);
    } catch (e: any) {
      setError(e.message ?? "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshList = useCallback(async () => {
    try {
      const res = await fetch("/api/business/conversations", { cache: "no-store" });
      const json = await res.json();
      if (res.ok) setConversations(json.conversations ?? []);
    } catch {
      /* list refresh is best-effort */
    }
  }, []);

  useEffect(() => {
    if (selected) void loadMessages(selected);
  }, [selected, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Refresh on focus only — no idle polling.
  useEffect(() => {
    const onFocus = () => {
      if (selected) void loadMessages(selected);
      void refreshList();
    };
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [selected, loadMessages, refreshList]);

  async function send() {
    const text = draft.trim();
    if (!text || !selected || sending) return;
    setSending(true);
    setError(null);
    setDraft("");
    try {
      const res = await fetch(`/api/business/conversations/${selected}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: text, askAi: false }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Send failed");
      setMessages(json.messages ?? []);
      void refreshList();
    } catch (e: any) {
      setError(e.message ?? "Send failed");
      setDraft(text);
    } finally {
      setSending(false);
    }
  }

  async function setState(action: "takeover" | "return" | "resolve" | "reopen") {
    if (!selected) return;
    const body =
      action === "takeover"
        ? { aiState: "human_owned" }
        : action === "return"
          ? { aiState: "active" }
          : action === "resolve"
            ? { status: "resolved" }
            : { status: "open" };

    try {
      const res = await fetch(`/api/business/conversations/${selected}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Update failed");
      await refreshList();
      await loadMessages(selected);
    } catch (e: any) {
      setError(e.message);
    }
  }

  const ai = current ? AI_LABEL[current.aiState] ?? AI_LABEL.active : null;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Inbox</h1>
        <p className="text-sm text-slate-600 mt-1">
          Website conversations. Take over any chat to stop automatic replies instantly.
        </p>
      </div>

      {!aiReady && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          AI is not configured, so no automatic replies are generated. Messages are still stored.
        </div>
      )}

      <div className="grid md:grid-cols-[280px_1fr] gap-4">
        <aside className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Conversations ({conversations.length})
          </div>
          {conversations.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">No conversations yet.</p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
              {conversations.map((c) => {
                const badge = AI_LABEL[c.aiState] ?? AI_LABEL.active;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelected(c.id)}
                      className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 ${
                        selected === c.id ? "bg-slate-100" : ""
                      }`}
                    >
                      <div className="text-sm font-medium text-[#1B3A6B] truncate">
                        Visitor {c.visitorId.slice(-6)}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-[10px] text-slate-500">{c.status}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${badge.cls}`}>
                          {badge.text}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </aside>

        <section className="bg-white rounded-xl border border-slate-200 flex flex-col min-h-[50vh]">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {selected ? "Thread" : "Select a conversation"}
            </div>
            {current && (
              <div className="flex items-center gap-1.5">
                {ai && (
                  <span className={`text-[11px] px-2 py-1 rounded-full font-medium ${ai.cls}`}>
                    {ai.text}
                  </span>
                )}
                {current.aiState === "human_owned" ? (
                  <button
                    onClick={() => void setState("return")}
                    className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                  >
                    Return to AI
                  </button>
                ) : (
                  <button
                    onClick={() => void setState("takeover")}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#1B3A6B] text-white hover:bg-[#152d56]"
                  >
                    Take over
                  </button>
                )}
                <button
                  onClick={() => void setState(current.status === "resolved" ? "reopen" : "resolve")}
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  {current.status === "resolved" ? "Reopen" : "Resolve"}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="mx-4 mt-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
              {error}
            </div>
          )}

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[52vh]">
            {loading && <p className="text-sm text-slate-500">Loading…</p>}
            {!loading && selected && messages.length === 0 && (
              <p className="text-sm text-slate-500">No messages in this thread yet.</p>
            )}
            {messages.map((m) => {
              const outgoing = m.direction === "out";
              return (
                <div key={m.id} className={`flex ${outgoing ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      outgoing ? "bg-[#1B3A6B] text-white" : "bg-slate-100 text-slate-900"
                    }`}
                  >
                    <div className="text-[10px] uppercase tracking-wide opacity-70 mb-0.5">
                      {m.authorKind}
                    </div>
                    <div className="whitespace-pre-wrap break-words">{m.body}</div>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-slate-200 p-3 flex gap-2">
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              disabled={!selected || sending}
              placeholder={selected ? "Write a reply…" : "Select a conversation"}
              aria-label="Message"
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2] disabled:bg-slate-50"
            />
            <button
              onClick={() => void send()}
              disabled={!selected || sending || draft.trim().length === 0}
              className="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
            >
              {sending ? "Sending…" : "Send"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
