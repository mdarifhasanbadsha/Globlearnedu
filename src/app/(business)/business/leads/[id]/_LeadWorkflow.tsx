"use client";

import { useCallback, useEffect, useState } from "react";
import { formatDate, formatDateTime } from "@/lib/business/dates";

interface Note {
  id: string;
  body: string;
  kind: string;
  outcome: string | null;
  createdAt: string;
}

interface Activity {
  id: string;
  kind: string;
  summary: string;
  actorKind: string;
  createdAt: string;
}

interface Followup {
  id: string;
  body: string;
  dueAt: string;
  status: string;
}

interface Task {
  id: string;
  title: string;
  dueAt: string | null;
  status: string;
  priority: string;
}

const ACTIVITY_ICON: Record<string, string> = {
  created: "＋",
  stage_changed: "→",
  assigned: "◉",
  note_added: "✎",
  inbound: "↓",
  outbound: "↑",
  followup_scheduled: "◷",
  followup_done: "✓",
  alerted: "!",
  score_changed: "★",
};

export default function LeadWorkflow({ leadId }: { leadId: string }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const [noteBody, setNoteBody] = useState("");
  const [noteKind, setNoteKind] = useState("call");
  const [fuBody, setFuBody] = useState("");
  const [fuDays, setFuDays] = useState("2");
  const [taskTitle, setTaskTitle] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/business/leads/${leadId}/workflow`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load");
      setNotes(json.notes ?? []);
      setActivity(json.timeline ?? []);
      setFollowups(json.followups ?? []);
      setTasks(json.tasks ?? []);
    } catch (e: any) {
      setErr(e.message);
    }
  }, [leadId]);

  useEffect(() => {
    void load();
  }, [load]);

  async function act(payload: Record<string, unknown>, successText: string) {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/business/leads/${leadId}/workflow`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      setMsg(successText);
      await load();
      return true;
    } catch (e: any) {
      setErr(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
          {msg}
        </div>
      )}

      {/* Log a call / note */}
      <section className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="font-semibold text-[#0F2A52] text-sm mb-2">Log what happened</h2>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {[
            ["call", "Call"],
            ["whatsapp", "WhatsApp"],
            ["messenger", "Messenger"],
            ["email", "Email"],
            ["note", "Note"],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setNoteKind(k)}
              className={`text-[11px] px-2.5 py-1 rounded-full ${
                noteKind === k ? "bg-[#0F2A52] text-white" : "bg-slate-100 text-slate-700"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        <textarea
          value={noteBody}
          onChange={(e) => setNoteBody(e.target.value)}
          rows={2}
          placeholder="Called, asked for HSC result, will send transcript by Sunday…"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
        />
        <button
          onClick={async () => {
            if (!noteBody.trim()) return;
            const ok = await act(
              { action: "note", body: noteBody, kind: noteKind },
              "Note saved."
            );
            if (ok) setNoteBody("");
          }}
          disabled={busy || noteBody.trim().length === 0}
          className="mt-2 bg-[#C8102E] text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
        >
          Save note
        </button>
      </section>

      {/* Schedule followup */}
      <section className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="font-semibold text-[#0F2A52] text-sm mb-2">Schedule followup</h2>
        <div className="flex gap-2 flex-wrap">
          <input
            value={fuBody}
            onChange={(e) => setFuBody(e.target.value)}
            placeholder="Send the Chongqing fee list"
            className="flex-1 min-w-[180px] rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
          />
          <select
            value={fuDays}
            onChange={(e) => setFuDays(e.target.value)}
            className="rounded-lg border border-slate-300 px-2 py-2 text-sm"
          >
            <option value="1">tomorrow</option>
            <option value="2">in 2 days</option>
            <option value="3">in 3 days</option>
            <option value="7">in 1 week</option>
            <option value="14">in 2 weeks</option>
          </select>
          <button
            onClick={async () => {
              if (!fuBody.trim()) return;
              const ok = await act(
                { action: "followup", body: fuBody, days: Number(fuDays) },
                "Followup scheduled."
              );
              if (ok) setFuBody("");
            }}
            disabled={busy || fuBody.trim().length === 0}
            className="bg-[#0F2A52] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#1B3A6B] disabled:opacity-40"
          >
            Schedule
          </button>
        </div>

        {followups.length > 0 && (
          <ul className="mt-3 space-y-1">
            {followups.slice(0, 5).map((f) => (
              <li key={f.id} className="text-xs flex items-center justify-between gap-2">
                <span className="text-slate-700 truncate">{f.body}</span>
                <span className="text-slate-500 shrink-0">
                  {formatDate(f.dueAt)} · {f.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Task */}
      <section className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="font-semibold text-[#0F2A52] text-sm mb-2">Add a task</h2>
        <div className="flex gap-2">
          <input
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            placeholder="Collect passport copy"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
          />
          <button
            onClick={async () => {
              if (!taskTitle.trim()) return;
              const ok = await act(
                { action: "task", title: taskTitle, days: 2 },
                "Task created."
              );
              if (ok) setTaskTitle("");
            }}
            disabled={busy || taskTitle.trim().length === 0}
            className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-200 disabled:opacity-40"
          >
            Add
          </button>
        </div>
        {tasks.length > 0 && (
          <ul className="mt-3 space-y-1">
            {tasks.slice(0, 5).map((t) => (
              <li key={t.id} className="text-xs flex items-center justify-between gap-2">
                <span className={t.status === "done" ? "line-through text-slate-400" : "text-slate-700"}>
                  {t.title}
                </span>
                <span className="text-slate-500 shrink-0">{t.dueAt ? formatDate(t.dueAt) : "—"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Timeline */}
      <section className="bg-white rounded-xl border border-slate-200">
        <h2 className="font-semibold text-[#0F2A52] text-sm px-4 py-3 border-b border-slate-200">
          Timeline ({activity.length})
        </h2>
        {activity.length === 0 ? (
          <p className="p-4 text-xs text-slate-500">
            Nothing logged yet. Notes, stage changes and student replies appear here.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
            {activity.map((a) => (
              <li key={a.id} className="px-4 py-2 flex items-start gap-2.5">
                <span className="mt-0.5 text-slate-400 text-xs w-4 text-center shrink-0">
                  {ACTIVITY_ICON[a.kind] ?? "•"}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-slate-800">{a.summary}</p>
                  <p className="text-[10px] text-slate-400">
                    {a.actorKind} · {formatDateTime(a.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Notes list */}
      <section className="bg-white rounded-xl border border-slate-200">
        <h2 className="font-semibold text-[#0F2A52] text-sm px-4 py-3 border-b border-slate-200">
          Notes ({notes.length})
        </h2>
        {notes.length === 0 ? (
          <p className="p-4 text-xs text-slate-500">No notes yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
            {notes.map((n) => (
              <li key={n.id} className="px-4 py-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] uppercase tracking-wide text-slate-400">{n.kind}</span>
                  <span className="text-[10px] text-slate-400">{formatDateTime(n.createdAt)}</span>
                </div>
                <p className="text-xs text-slate-800 whitespace-pre-wrap">{n.body}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
