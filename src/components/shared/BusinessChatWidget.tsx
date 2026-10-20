"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UniversityCard {
  universityName: string;
  city: string | null;
  programName: string | null;
  tuitionLabel: string;
  deadline: string | null;
  intake: string | null;
}

interface QuickReply {
  label: string;
  send: string;
}

interface Bubble {
  id: string;
  role: "user" | "assistant" | "system";
  text: string;
  pending?: boolean;
  cards?: UniversityCard[];
  chips?: QuickReply[];
}

const TOKEN_KEY = "gl_chat_token";
const GREETING =
  "Hi! 👋 I'm the GL Education assistant. Ask me about studying in China — I can help with programs, tuition and next steps.";

export default function BusinessChatWidget() {
  const [open, setOpen] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const tokenRef = useRef<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoredRef = useRef(false);

  useEffect(() => {
    try {
      tokenRef.current = localStorage.getItem(TOKEN_KEY) ?? "";
    } catch {
      tokenRef.current = "";
    }
    setBubbles([{ id: "greet", role: "assistant", text: GREETING }]);
  }, []);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [bubbles, open]);

  // Returning visitor: restore their own earlier conversation once.
  useEffect(() => {
    if (!open || restoredRef.current || !tokenRef.current) return;
    restoredRef.current = true;

    (async () => {
      try {
        const res = await fetch(
          `/api/public/chat?token=${encodeURIComponent(tokenRef.current)}`,
          { cache: "no-store" }
        );
        const json = await res.json();
        const past = (json.messages ?? []) as { role: string; text: string }[];
        if (past.length === 0) return;

        setBubbles([
          { id: "resumed", role: "system", text: "Welcome back — here is where we left off" },
          ...past.map((m, i) => ({
            id: `h_${i}`,
            role: m.role === "user" ? ("user" as const) : ("assistant" as const),
            text: m.text,
          })),
        ]);
      } catch {
        /* restore is best effort */
      }
    })();
  }, [open]);

  const send = useCallback(
    async (override?: string) => {
      const text = (override ?? draft).trim();
      if (!text || busy) return;

      setError(null);
      setDraft("");
      setBusy(true);

      const stamp = Date.now();
      const pendingId = `p_${stamp}`;
      setBubbles((b) => [
        ...b,
        { id: `u_${stamp}`, role: "user", text },
        { id: pendingId, role: "assistant", text: "", pending: true },
      ]);

      const sentAt = Date.now();

      try {
        const res = await fetch("/api/public/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: text, token: tokenRef.current }),
        });
        const json = await res.json();

        // Adopt any token the server hands back before checking ok: on a 429
        // the reply is a rate-limit notice, and losing the token there starts
        // a fresh conversation and silently wipes the student's history.
        if (typeof json?.token === "string" && json.token) {
          tokenRef.current = json.token;
          try {
            localStorage.setItem(TOKEN_KEY, json.token);
          } catch {
            /* storage may be blocked */
          }
        }

        if (!res.ok) throw new Error(json?.error ?? "Something went wrong");

        if (typeof json.token === "string" && json.token) {
          tokenRef.current = json.token;
          try {
            localStorage.setItem(TOKEN_KEY, json.token);
          } catch {
            /* storage may be blocked */
          }
        }

        // Keep the typing indicator up for a believable span. The API tells
        // us how long; the delay is bounded there, not invented here.
        const typingMs: number = Math.min(json.typingMs ?? 0, 12_000);
        const elapsed = Date.now() - sentAt;
        const wait = Math.max(0, typingMs - elapsed);
        if (wait > 0) await new Promise((r) => setTimeout(r, wait));

        const cards: UniversityCard[] = json.cards ?? [];
        const chips: QuickReply[] = json.quickReplies ?? [];

        setBubbles((b) =>
          b
            .filter((x) => x.id !== pendingId)
            .concat(
              json.reply
                ? [
                    {
                      id: `a_${Date.now()}`,
                      role: "assistant" as const,
                      text: json.reply,
                      cards,
                      chips,
                    },
                  ]
                : [
                    {
                      id: `s_${Date.now()}`,
                      role: "system" as const,
                      text: "Thanks — a counselor will reply here shortly.",
                    },
                  ]
            )
        );
      } catch (e: any) {
        setBubbles((b) => b.filter((x) => x.id !== pendingId));
        setError(e?.message ?? "Could not send. Please try again.");
      } finally {
        setBusy(false);
      }
    },
    [draft, busy]
  );

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Chat with GL Education"}
        aria-expanded={open}
        className="fixed bottom-20 right-4 md:bottom-6 md:right-6 z-[60] h-14 w-14 rounded-full bg-[#C8102E] text-white shadow-lg hover:bg-[#A50D25] transition flex items-center justify-center"
      >
        {open ? (
          <span className="text-2xl leading-none" aria-hidden>
            ×
          </span>
        ) : (
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="GL Education chat"
          className="fixed z-[60] bottom-36 right-2 left-2 md:left-auto md:bottom-24 md:right-6 md:w-[380px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden"
          style={{ maxHeight: "70vh" }}
        >
          <div className="bg-[#1B3A6B] text-white px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">GL Education</div>
              <div className="text-[11px] text-white/70">Study in China counseling</div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-white/80 hover:text-white text-xl leading-none px-1"
            >
              ×
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-[#F8FAFC]">
            {bubbles.map((b) => {
              if (b.role === "system") {
                return (
                  <div key={b.id} className="text-center">
                    <span className="inline-block text-[11px] text-slate-600 bg-white border border-slate-200 rounded-full px-3 py-1">
                      {b.text}
                    </span>
                  </div>
                );
              }
              const mine = b.role === "user";
              return (
                <div key={b.id} className="space-y-1.5">
                  <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words ${
                        mine
                          ? "bg-[#C8102E] text-white rounded-br-sm"
                          : "bg-white text-slate-900 border border-slate-200 rounded-bl-sm"
                      }`}
                    >
                      {b.pending ? (
                        <span
                          className="flex gap-1 items-center h-5"
                          aria-label="Assistant is typing"
                        >
                          <Dot delay="0s" />
                          <Dot delay="0.15s" />
                          <Dot delay="0.3s" />
                        </span>
                      ) : (
                        b.text
                      )}
                    </div>
                  </div>

                  {!mine && b.cards && b.cards.length > 0 && (
                    <div className="space-y-1.5">
                      {b.cards.map((c, i) => (
                        <div
                          key={i}
                          className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs"
                        >
                          <div className="font-semibold text-[#1B3A6B] truncate">
                            {c.universityName}
                          </div>
                          {c.city && <div className="text-slate-500">{c.city}</div>}
                          {c.programName && (
                            <div className="text-slate-700 truncate">{c.programName}</div>
                          )}
                          <div className="mt-1 flex flex-wrap gap-x-3 text-slate-600">
                            <span className="font-medium text-[#1B3A6B]">{c.tuitionLabel}</span>
                            {c.deadline && <span>Deadline {c.deadline}</span>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {!mine && b.chips && b.chips.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {b.chips.map((q, i) => (
                        <button
                          key={i}
                          onClick={() => void send(q.send)}
                          disabled={busy}
                          className="text-[11px] font-medium px-2.5 py-1.5 rounded-full border border-[#29ABE2] text-[#1B3A6B] bg-white hover:bg-[#29ABE2]/10 disabled:opacity-40"
                        >
                          {q.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {error && (
            <div className="px-3 py-2 text-[11px] text-red-700 bg-red-50 border-t border-red-100">
              {error}
            </div>
          )}

          <div className="border-t border-slate-200 p-2 flex items-end gap-2 bg-white">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
              placeholder="Type your question…"
              aria-label="Your message"
              maxLength={2000}
              disabled={busy}
              className="flex-1 rounded-full border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-[#29ABE2] disabled:bg-slate-50 min-w-0"
            />
            <button
              onClick={() => void send()}
              disabled={busy || draft.trim().length === 0}
              aria-label="Send message"
              className="h-10 w-10 shrink-0 rounded-full bg-[#C8102E] text-white flex items-center justify-center hover:bg-[#A50D25] disabled:opacity-40"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
          <p className="text-[10px] text-slate-400 text-center pb-1.5 bg-white">
            Guidance only — the Chinese Embassy decides visa outcomes.
          </p>
        </div>
      )}
    </>
  );
}

function Dot({ delay }: { delay: string }) {
  return (
    <span
      className="h-1.5 w-1.5 rounded-full bg-slate-400 animate-bounce"
      style={{ animationDelay: delay }}
      aria-hidden
    />
  );
}
