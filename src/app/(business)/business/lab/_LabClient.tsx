"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatDate, formatDateTime } from "@/lib/business/dates";

interface Session {
  id: string;
  title: string;
  persona: string;
  mode: string;
  createdAt: string;
}

interface Finding {
  id: string;
  sessionId: string;
  verdict: string;
  question: string | null;
  answer: string | null;
  expected: string | null;
  note: string | null;
  createdAt: string;
}

interface Msg {
  id: string;
  role: string;
  body: string;
  meta: any;
  createdAt: string;
}

interface Mode {
  key: string;
  label: string;
  detail: string;
}

interface Persona {
  key: string;
  label: string;
  opener: string;
}

const VERDICT_TONE: Record<string, string> = {
  accurate: "bg-emerald-100 text-emerald-800",
  wrong: "bg-red-100 text-red-800",
  incomplete: "bg-amber-100 text-amber-800",
  unclear: "bg-slate-200 text-slate-700",
};

export default function LabClient({
  initialSessions,
  initialFindings,
  modes,
  personas,
  aiReady,
}: {
  initialSessions: Session[];
  initialFindings: Finding[];
  modes: Mode[];
  personas: Persona[];
  aiReady: boolean;
}) {
  const router = useRouter();
  const [sessions, setSessions] = useState(initialSessions);
  const [findings, setFindings] = useState(initialFindings);
  const [activeId, setActiveId] = useState<string | null>(initialSessions[0]?.id ?? null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [mode, setMode] = useState("live");
  const [persona, setPersona] = useState("student_bangla");
  const [grading, setGrading] = useState<{ q: string; a: string } | null>(null);
  const [expected, setExpected] = useState("");
  const [note, setNote] = useState("");
  const [teachMsg, setTeachMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = sessions.find((s) => s.id === activeId) ?? null;

  const loadMessages = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/business/lab/${id}`, { cache: "no-store" });
      const json = await res.json();
      if (res.ok) setMessages(json.messages ?? []);
    } catch {
      /* best effort */
    }
  }, []);

  useEffect(() => {
    if (activeId) void loadMessages(activeId);
  }, [activeId, loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function startSession() {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/business/lab", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `${persona} · ${mode}`, persona, mode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Could not start session");
      const list = await fetch("/api/business/lab", { cache: "no-store" });
      const lj = await list.json();
      setSessions(lj.sessions ?? []);
      setActiveId(json.id);
      setMessages([]);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function send(text?: string) {
    const body = (text ?? draft).trim();
    if (!body || !activeId || busy) return;
    setBusy(true);
    setErr(null);
    setDraft("");

    const optimistic: Msg = {
      id: `tmp_${Date.now()}`,
      role: "user",
      body,
      meta: null,
      createdAt: new Date().toISOString(),
    };
    setMessages((m) => [...m, optimistic]);

    try {
      const res = await fetch(`/api/business/lab/${activeId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Send failed");
      if (!json.ok) setErr(json.error ?? "The AI returned nothing.");
      await loadMessages(activeId);
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function grade(verdict: string) {
    if (!grading || !activeId) return;
    setBusy(true);
    setTeachMsg(null);
    try {
      const res = await fetch("/api/business/lab/findings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeId,
          verdict,
          question: grading.q,
          answer: grading.a,
          expected,
          note,
        }),
      });
      if (!res.ok) throw new Error((await res.json())?.error ?? "Failed");

      // If the owner stated what it should say, offer to teach it now.
      if (expected.trim().length > 0) {
        const list = await fetch("/api/business/lab", { cache: "no-store" });
        const lj = await list.json();
        setFindings(lj.findings ?? []);
        const newest = (lj.findings ?? [])[0];
        if (newest) {
          const t = await fetch("/api/business/lab/teach", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ findingId: newest.id }),
          });
          const tj = await t.json();
          setTeachMsg(t.ok ? tj.note : (tj.error ?? "Could not teach this yet."));
        }
      } else {
        const list = await fetch("/api/business/lab", { cache: "no-store" });
        const lj = await list.json();
        setFindings(lj.findings ?? []);
      }

      setGrading(null);
      setExpected("");
      setNote("");
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  const counts = {
    accurate: findings.filter((f) => f.verdict === "accurate").length,
    wrong: findings.filter((f) => f.verdict === "wrong").length,
    incomplete: findings.filter((f) => f.verdict === "incomplete").length,
  };
  const graded = counts.accurate + counts.wrong + counts.incomplete;
  const score = graded > 0 ? Math.round((counts.accurate / graded) * 100) : null;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A52]">Test &amp; Train</h1>
        <p className="text-sm text-slate-600 mt-1">
          Talk to your AI exactly as a student would. Nothing here reaches real students or creates
          a real conversation.
        </p>
      </div>

      {!aiReady && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          The AI key is missing on the server, so the assistant cannot reply. Run{" "}
          <code className="font-mono text-xs">node scripts/set-worker-secrets.mjs</code>.
        </div>
      )}

      {err && (
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {err}
        </div>
      )}

      {teachMsg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 flex items-start justify-between gap-3">
          <span>{teachMsg}</span>
          <button onClick={() => setTeachMsg(null)} className="text-emerald-700 shrink-0" aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-4">
        {/* Left: setup + history */}
        <aside className="space-y-4">
          <section className="bg-white rounded-xl border border-slate-200 p-3 space-y-2.5">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              New test
            </h2>
            <label className="block">
              <span className="text-xs text-slate-600">Pretend to be</span>
              <select
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
              >
                {personas.map((p) => (
                  <option key={p.key} value={p.key}>
                    {p.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-xs text-slate-600">What to test</span>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 px-2.5 py-2 text-sm"
              >
                {modes.map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
            <p className="text-[11px] text-slate-500 leading-snug">
              {modes.find((m) => m.key === mode)?.detail}
            </p>
            <button
              onClick={() => void startSession()}
              disabled={busy}
              className="w-full bg-[#0F2A52] text-white text-sm font-semibold px-3 py-2 rounded-lg hover:bg-[#1B3A6B] disabled:opacity-40"
            >
              Start test
            </button>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 px-3 py-2 border-b border-slate-100">
              Past tests ({sessions.length})
            </h2>
            {sessions.length === 0 ? (
              <p className="p-3 text-xs text-slate-500">No tests yet.</p>
            ) : (
              <ul className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                {sessions.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => setActiveId(s.id)}
                      className={`w-full text-left px-3 py-2 hover:bg-slate-50 ${
                        activeId === s.id ? "bg-slate-100" : ""
                      }`}
                    >
                      <div className="text-xs font-medium text-[#0F2A52] truncate">{s.title}</div>
                      <div className="text-[10px] text-slate-500">
                        {formatDate(s.createdAt)}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="bg-white rounded-xl border border-slate-200 p-3">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2">
              Accuracy score
            </h2>
            {score === null ? (
              <p className="text-xs text-slate-500">
                Grade some answers to see a score.
              </p>
            ) : (
              <>
                <div className="text-3xl font-bold text-[#0F2A52] tabular-nums">{score}%</div>
                <p className="text-[11px] text-slate-500">{graded} answer(s) graded</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {counts.accurate} right
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-100 text-red-800">
                    {counts.wrong} wrong
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                    {counts.incomplete} partial
                  </span>
                </div>
              </>
            )}
          </section>
        </aside>

        {/* Right: chat */}
        <section className="bg-white rounded-xl border border-slate-200 flex flex-col min-h-[60vh]">
          <div className="px-4 py-2.5 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {active ? active.title : "Start a test to begin"}
            </div>
            {activeId && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-500">
                  {messages.length} message(s)
                </span>
                <button
                  onClick={async () => {
                    await fetch(`/api/business/lab/${activeId}`, { method: "DELETE" });
                    setSessions((s) => s.filter((x) => x.id !== activeId));
                    setActiveId(null);
                    setMessages([]);
                  }}
                  className="text-[11px] text-slate-500 hover:text-red-600"
                >
                  Delete test
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 max-h-[52vh] bg-slate-50">
            {!activeId && (
              <div className="text-center py-12">
                <p className="text-sm text-slate-600">
                  Choose a persona and press <strong>Start test</strong>.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  You will be chatting as a student, not as staff.
                </p>
              </div>
            )}
            {activeId && messages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-slate-500">Try opening with:</p>
                {personas
                  .filter((p) => p.key === persona)
                  .map((p) => (
                    <button
                      key={p.key}
                      onClick={() => void send(p.opener)}
                      className="block w-full text-left text-sm px-3 py-2 rounded-lg border border-slate-200 bg-white hover:border-[#29ABE2]"
                    >
                      {p.opener}
                    </button>
                  ))}
              </div>
            )}
            {messages.map((m) => {
              const mine = m.role === "user";
              return (
                <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] ${mine ? "" : "space-y-1"}`}>
                    <div
                      className={`rounded-2xl px-3.5 py-2 text-sm whitespace-pre-wrap break-words ${
                        mine
                          ? "bg-[#C8102E] text-white rounded-br-sm"
                          : "bg-white border border-slate-200 text-slate-900 rounded-bl-sm"
                      }`}
                    >
                      {m.body}
                    </div>
                    {!mine && (
                      <div className="flex items-center gap-2 px-1 flex-wrap">
                        {m.meta?.knowledgeUsed != null && (
                          <span className="text-[10px] text-slate-400">
                            {m.meta.knowledgeUsed} univ.
                          </span>
                        )}
                        {m.meta?.styleUsed && (
                          <span className="text-[10px] text-slate-400">brand voice</span>
                        )}
                        {m.meta?.latencyMs != null && (
                          <span className="text-[10px] text-slate-400">{m.meta.latencyMs}ms</span>
                        )}
                        <button
                          onClick={() => {
                            const prev = messages[messages.indexOf(m) - 1];
                            setGrading({ q: prev?.body ?? "", a: m.body });
                          }}
                          className="text-[10px] font-medium text-[#29ABE2] hover:underline"
                        >
                          Grade this answer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {grading && (
            <div className="border-t border-slate-200 p-3 bg-amber-50 space-y-2">
              <div className="text-xs font-semibold text-amber-900">Grade this answer</div>
              <p className="text-[11px] text-slate-700">
                <strong>Q:</strong> {grading.q.slice(0, 120)}
              </p>
              <input
                value={expected}
                onChange={(e) => setExpected(e.target.value)}
                placeholder="What should it have said? Filling this teaches your brand voice."
                className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
              />
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Note for later (optional)"
                className="w-full rounded-lg border border-slate-300 px-2.5 py-1.5 text-xs"
              />
              <div className="flex flex-wrap gap-1.5">
                {["accurate", "wrong", "incomplete", "unclear"].map((v) => (
                  <button
                    key={v}
                    onClick={() => void grade(v)}
                    disabled={busy}
                    className={`text-[11px] font-medium px-2.5 py-1 rounded-full ${VERDICT_TONE[v]} disabled:opacity-40`}
                  >
                    {v}
                  </button>
                ))}
                <button
                  onClick={() => setGrading(null)}
                  className="text-[11px] px-2.5 py-1 rounded-full bg-slate-200 text-slate-700"
                >
                  cancel
                </button>
              </div>
            </div>
          )}

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
              disabled={!activeId || busy}
              placeholder={activeId ? "Type as a student…" : "Start a test first"}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2] disabled:bg-slate-50"
            />
            <button
              onClick={() => void send()}
              disabled={!activeId || busy || draft.trim().length === 0}
              className="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
            >
              {busy ? "…" : "Send"}
            </button>
          </div>
        </section>
      </div>

      {findings.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200">
          <h2 className="font-semibold text-[#0F2A52] text-sm px-4 py-3 border-b border-slate-200">
            Findings ({findings.length})
          </h2>
          <ul className="divide-y divide-slate-100">
            {findings.slice(0, 20).map((f) => (
              <li key={f.id} className="px-4 py-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${VERDICT_TONE[f.verdict]}`}>
                    {f.verdict}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {formatDateTime(f.createdAt)}
                  </span>
                </div>
                {f.question && (
                  <p className="text-xs text-slate-600">
                    <strong>Student:</strong> {f.question.slice(0, 180)}
                  </p>
                )}
                {f.expected && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    <strong>Should say:</strong> {f.expected.slice(0, 180)}
                  </p>
                )}
                {f.note && <p className="text-xs text-slate-500 italic mt-0.5">{f.note}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
