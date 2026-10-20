"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";

interface Conversation {
  id: string;
  visitorId: string;
  channel?: string;
  status: string;
  aiState: string;
  lastMessageAt: string;
  displayName?: string;
  contactName?: string | null;
  contactPicture?: string | null;
  contactLocale?: string | null;
  sourceLabel?: string | null;
  leadName?: string | null;
  leadPriority?: string | null;
  leadScore?: number | null;
  leadStage?: string | null;
  leadId?: string | null;
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
  const [live, setLive] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const current = conversations.find((c) => c.id === selected) ?? null;
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<Conversation[] | null>(null);

  async function runSearch(value: string) {
    setQuery(value);
    const q = value.trim();
    if (q.length < 2) {
      setResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    try {
      const res = await fetch(`/api/business/search?q=${encodeURIComponent(q)}`, {
        cache: "no-store",
      });
      const json = await res.json();
      // Search results carry a slightly different shape; normalise.
      setResults(
        (json.results ?? []).map((r: any) => ({
          id: r.id,
          visitorId: r.visitorId,
          status: r.status,
          aiState: r.aiState,
          lastMessageAt: r.lastMessageAt,
        }))
      );
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }

  const listed = results ?? conversations;

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

  /**
   * Live updates over Server-Sent Events: one connection per open inbox,
   * silent when nothing happens, instant when a message lands. EventSource
   * reconnects by itself when the server closes the stream.
   */
  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource("/api/business/inbox/stream");

      es.addEventListener("update", () => {
        void refreshList();
        if (selected) void loadMessages(selected);
        setLive(true);
      });
      es.addEventListener("ready", () => setLive(true));
      es.onerror = () => setLive(false);
    } catch {
      setLive(false);
    }

    return () => {
      es?.close();
    };
  }, [refreshList, loadMessages, selected]);

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

      // A saved message that never reached Messenger must not look sent.
      const d = json.delivery as { channel: string; status: string; note?: string } | undefined;
      if (d && d.channel === "messenger" && d.status !== "sent") {
        setError(
          d.status === "deferred"
            ? `Saved, but not delivered: ${d.note ?? "outside Meta's 24-hour window"}. An approved template is required.`
            : `Saved, but Messenger delivery failed: ${d.note ?? d.status}`
        );
      }
      void refreshList();
    } catch (e: any) {
      setError(e.message ?? "Send failed");
      setDraft(text);
    } finally {
      setSending(false);
    }
  }

  async function setState(action: "takeover" | "return" | "resolve" | "reopen" | "snooze") {
    if (!selected) return;
    const body =
      action === "takeover"
        ? { aiState: "human_owned" }
        : action === "return"
          ? { aiState: "active" }
          : action === "resolve"
            ? { status: "resolved" }
            : action === "snooze"
              ? { status: "snoozed" }
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

  async function assignToMe() {
    if (!selected) return;
    // Taking the thread makes the current staff member its owner.
    await setState("takeover");
  }

  const ai = current ? AI_LABEL[current.aiState] ?? AI_LABEL.active : null;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl font-bold text-[#1B3A6B]">Inbox</h1>
          <span
            className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-0.5 rounded-full ${
              live ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-500"
            }`}
            title={
              live
                ? "Connected — new messages appear automatically"
                : "Reconnecting — new messages may be delayed"
            }
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${live ? "bg-emerald-600" : "bg-slate-400"}`}
              aria-hidden
            />
            {live ? "Live" : "Reconnecting"}
          </span>
        </div>
        <p className="text-sm text-slate-600 mt-1">
          Conversations from every channel. New messages arrive automatically.
        </p>
      </div>

      {!aiReady && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          AI is not configured, so no automatic replies are generated. Messages are still stored.
        </div>
      )}

      <div className="grid lg:grid-cols-[240px_minmax(0,1fr)_200px] gap-4">
        <aside className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-3 py-2 border-b border-slate-200">
            <input
              value={query}
              onChange={(e) => void runSearch(e.target.value)}
              placeholder="Search name, phone or message…"
              aria-label="Search conversations"
              className="w-full rounded-lg border border-slate-300 px-3 py-1.5 text-xs outline-none focus:border-[#29ABE2]"
            />
            <div className="text-[11px] text-slate-500 mt-1">
              {searching
                ? "Searching…"
                : results
                  ? `${results.length} result(s)`
                  : `${conversations.length} conversation(s)`}
            </div>
          </div>
          {listed.length === 0 ? (
            <p className="p-4 text-sm text-slate-500">
              {results ? "No matches." : "No conversations yet."}
            </p>
          ) : (
            <ul className="max-h-[60vh] overflow-y-auto divide-y divide-slate-100">
              {listed.map((c) => {
                const badge = AI_LABEL[c.aiState] ?? AI_LABEL.active;
                return (
                  <li key={c.id}>
                    <button
                      onClick={() => setSelected(c.id)}
                      className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 ${
                        selected === c.id ? "bg-slate-100" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <Avatar
                          name={c.displayName ?? c.contactName ?? "?"}
                          src={c.contactPicture ?? null}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-medium text-[#0F2A52] truncate">
                            {c.displayName ?? `Visitor ${c.visitorId.slice(-6)}`}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            {c.leadPriority === "hot" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">
                                hot {c.leadScore ?? ""}
                              </span>
                            )}
                            {c.leadPriority === "warm" && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                                warm
                              </span>
                            )}
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${badge.cls}`}>
                              {badge.text}
                            </span>
                            {c.sourceLabel && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-sky-100 text-sky-800">
                                {c.sourceLabel}
                              </span>
                            )}
                          </div>
                        </div>
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
                  onClick={() => void setState("snooze")}
                  disabled={current.status === "snoozed"}
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  Later
                </button>
                <button
                  onClick={() => void setState(current.status === "resolved" ? "reopen" : "resolve")}
                  className="text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                >
                  {current.status === "resolved" ? "Reopen" : "Done"}
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

        {/* Third pane: who am I talking to, and what can I do next */}
        {current && (
          <aside className="bg-white rounded-xl border border-slate-200 p-3 space-y-3 h-fit">
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Contact
              </div>
              <div className="flex items-center gap-2 mt-1.5">
                <Avatar
                  name={current.displayName ?? current.contactName ?? "?"}
                  src={current.contactPicture ?? null}
                />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-[#0F2A52] truncate">
                    {current.displayName ??
                      (current.visitorId.startsWith("g_")
                        ? "Website visitor"
                        : `Messenger ${current.visitorId.slice(-6)}`)}
                  </div>
                  {current.contactLocale && (
                    <div className="text-[10px] text-slate-400">{current.contactLocale}</div>
                  )}
                </div>
              </div>
            </div>

            {current.sourceLabel && (
              <div className="rounded-lg bg-sky-50 border border-sky-100 px-2 py-1.5">
                <div className="text-[10px] uppercase tracking-wide text-sky-700">Came from</div>
                <div className="text-xs text-sky-900 font-medium">{current.sourceLabel}</div>
              </div>
            )}

            <div className="space-y-1.5 text-[11px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Status</span>
                <span className="font-medium capitalize">{current.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">AI</span>
                <span className="font-medium capitalize">{current.aiState.replace(/_/g, " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Messages</span>
                <span className="font-medium tabular-nums">{messages.length}</span>
              </div>
              {current.leadPriority && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Lead</span>
                  <span className="font-medium capitalize">
                    {current.leadPriority} · {current.leadScore ?? 0}
                  </span>
                </div>
              )}
              {current.leadStage && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Stage</span>
                  <span className="font-medium capitalize">
                    {current.leadStage.replace(/_/g, " ")}
                  </span>
                </div>
              )}
            </div>

            {current.leadId && (
              <Link
                href={`/business/leads/${current.leadId}`}
                className="block text-center text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 text-[#0F2A52] hover:border-[#29ABE2]"
              >
                Open lead record →
              </Link>
            )}

            <div className="pt-2 border-t border-slate-100 space-y-1.5">
              <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Actions
              </div>
              <button
                onClick={() => void assignToMe()}
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-[#0F2A52] text-white hover:bg-[#1B3A6B]"
              >
                Assign to me
              </button>
              <button
                onClick={() => void setState("snooze")}
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Snooze
              </button>
              <button
                onClick={() => void setState(current.status === "resolved" ? "reopen" : "resolve")}
                className="w-full text-xs font-medium px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                {current.status === "resolved" ? "Reopen" : "Mark done"}
              </button>
            </div>

            <Link
              href="/business/lab"
              className="block text-center text-[11px] text-[#29ABE2] hover:underline pt-1"
            >
              Test this answer in the lab →
            </Link>
          </aside>
        )}
      </div>
    </div>
  );
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
  return (
    <span className="h-8 w-8 shrink-0 rounded-full overflow-hidden bg-[#0F2A52] text-white flex items-center justify-center text-[11px] font-semibold">
      {src ? (
        // Meta profile photos are short-lived signed URLs; a plain img is
        // correct here and avoids configuring remote image domains.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
      ) : (
        initials || "?"
      )}
    </span>
  );
}
