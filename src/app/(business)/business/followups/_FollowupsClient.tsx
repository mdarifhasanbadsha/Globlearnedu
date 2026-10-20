"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { formatDateTime } from "@/lib/business/dates";

interface Item {
  id: string;
  body: string;
  dueAt: string;
  channel: string;
  leadName: string | null;
  leadStage: string | null;
  overdue: boolean;
}

function formatDue(iso: string, timezone: string) {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: timezone,
    }).format(new Date(iso));
  } catch {
    return formatDateTime(iso);
  }
}

export default function FollowupsClient({
  items,
  timezone,
}: {
  items: Item[];
  timezone: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function act(id: string, action: string) {
    setBusy(id);
    setErr(null);
    try {
      const res = await fetch("/api/business/followups", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Update failed");
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  }

  const overdue = items.filter((i) => i.overdue).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Followups</h1>
        <p className="text-sm text-slate-600 mt-1">
          Reminders for your team, shown in {timezone}. Nothing is sent to students
          automatically from this screen.
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {err}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 max-w-md">
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Pending</div>
          <div className="text-2xl font-bold text-[#1B3A6B]">{items.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Overdue</div>
          <div className={`text-2xl font-bold ${overdue > 0 ? "text-[#C8102E]" : "text-[#1B3A6B]"}`}>
            {overdue}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        {items.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-600">No pending followups.</p>
            <p className="text-xs text-slate-500 mt-1">
              Reminders you create while reviewing leads appear here.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {items.map((i) => (
              <li key={i.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-slate-900">{i.body}</div>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-x-3">
                    <span>Due {formatDue(i.dueAt, timezone)}</span>
                    {i.leadName && <span>Lead: {i.leadName}</span>}
                    {i.leadStage && <span>Stage: {i.leadStage.replace(/_/g, " ")}</span>}
                    <span className="uppercase tracking-wide">{i.channel}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {i.overdue && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-medium">
                      overdue
                    </span>
                  )}
                  <button
                    onClick={() => void act(i.id, "done")}
                    disabled={busy === i.id}
                    className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1B3A6B] text-white hover:bg-[#152d56] disabled:opacity-40"
                  >
                    Done
                  </button>
                  <button
                    onClick={() => void act(i.id, "skip")}
                    disabled={busy === i.id}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                  >
                    Skip
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
