"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface Lead {
  id: string;
  fullName: string | null;
  phone: string | null;
  email: string | null;
  nationality: string | null;
  degreeLevel: string | null;
  subjectInterest: string | null;
  gpaValue: string | null;
  gpaScale: string | null;
  budgetAmount: number | null;
  budgetCurrency: string | null;
  intakeTarget: string | null;
  languageTest: string | null;
  stage: string;
  stageReason: string | null;
  consentContact: boolean;
  source: string;
  conversationId: string | null;
  createdAt: string;
}

interface Msg {
  id: string;
  direction: string;
  authorKind: string;
  body: string;
  createdAt: string;
}

const STAGES = [
  ["new", "New"],
  ["profile_pending", "Profile pending"],
  ["qualified", "Qualified"],
  ["counseling_booked", "Counseling booked"],
  ["counseling_completed", "Counseling completed"],
  ["considering", "Considering"],
  ["closed", "Closed / Lost"],
] as const;

export default function LeadDetailClient({ lead, messages }: { lead: Lead; messages: Msg[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName: lead.fullName ?? "",
    phone: lead.phone ?? "",
    email: lead.email ?? "",
    nationality: lead.nationality ?? "",
    degreeLevel: lead.degreeLevel ?? "",
    subjectInterest: lead.subjectInterest ?? "",
    intakeTarget: lead.intakeTarget ?? "",
    languageTest: lead.languageTest ?? "",
    gpaValue: lead.gpaValue ?? "",
    gpaScale: lead.gpaScale ?? "",
  });

  async function patch(body: Record<string, unknown>) {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch(`/api/business/leads/${lead.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Update failed");
      setMsg("Saved.");
      router.refresh();
      return true;
    } catch (e: any) {
      setErr(e.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function changeStage(stage: string) {
    const reason =
      stage === "closed"
        ? window.prompt("Reason for closing this lead (optional):") ?? undefined
        : undefined;
    await patch({ stage, stageReason: reason });
  }

  async function saveEdits() {
    const ok = await patch({
      fullName: form.fullName,
      phone: form.phone,
      email: form.email,
      nationality: form.nationality,
      degreeLevel: form.degreeLevel,
      subjectInterest: form.subjectInterest,
      intakeTarget: form.intakeTarget,
      languageTest: form.languageTest,
      gpaValue: form.gpaValue === "" ? null : Number(form.gpaValue),
      gpaScale: form.gpaScale === "" ? null : Number(form.gpaScale),
    });
    if (ok) setEditing(false);
  }

  const gpa = lead.gpaValue && lead.gpaScale ? `${lead.gpaValue} / ${lead.gpaScale}` : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <Link href="/business/leads" className="text-xs text-[#29ABE2] hover:underline">
            ← Back to leads
          </Link>
          <h1 className="text-2xl font-bold text-[#1B3A6B] mt-1">
            {lead.fullName ?? "Unnamed lead"}
          </h1>
          <p className="text-sm text-slate-600">
            From {lead.source.replace(/_/g, " ")} · added{" "}
            {new Date(lead.createdAt).toLocaleDateString()}
          </p>
        </div>
        {lead.conversationId && (
          <Link
            href={`/business/inbox?c=${lead.conversationId}`}
            className="text-sm font-semibold px-4 py-2 rounded-lg bg-[#1B3A6B] text-white hover:bg-[#152d56]"
          >
            Open chat
          </Link>
        )}
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {msg}
        </div>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-4">
        <h2 className="font-semibold text-[#1B3A6B] text-sm mb-3">Pipeline stage</h2>
        <div className="flex flex-wrap gap-2">
          {STAGES.map(([key, label]) => (
            <button
              key={key}
              onClick={() => void changeStage(key)}
              disabled={busy}
              className={`text-xs font-medium px-3 py-2 rounded-lg disabled:opacity-40 ${
                lead.stage === key
                  ? "bg-[#0A1628] text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
        {lead.stageReason && (
          <p className="text-xs text-slate-600 mt-2">Reason: {lead.stageReason}</p>
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-[#1B3A6B] text-sm">Profile</h2>
          <button
            onClick={() => setEditing((e) => !e)}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {!editing ? (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {[
              ["Phone", lead.phone],
              ["Email", lead.email],
              ["Nationality", lead.nationality],
              ["Degree level", lead.degreeLevel],
              ["Subject interest", lead.subjectInterest],
              ["GPA", gpa],
              ["Budget", lead.budgetAmount ? `${lead.budgetAmount} ${lead.budgetCurrency ?? ""}` : null],
              ["Intake", lead.intakeTarget],
              ["Language test", lead.languageTest],
              ["Contact consent", lead.consentContact ? "Yes" : "No"],
            ].map(([label, value]) => (
              <div key={label as string} className="flex justify-between gap-3 py-1 border-b border-slate-100">
                <dt className="text-slate-500">{label}</dt>
                <dd className="text-slate-900 text-right">
                  {(value as string) ?? <span className="text-slate-400">—</span>}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {(
              [
                ["fullName", "Full name"],
                ["phone", "Phone"],
                ["email", "Email"],
                ["nationality", "Nationality"],
                ["degreeLevel", "Degree level"],
                ["subjectInterest", "Subject interest"],
                ["intakeTarget", "Intake"],
                ["languageTest", "Language test"],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className="block">
                <span className="text-xs font-medium text-slate-700">{label}</span>
                <input
                  value={(form as any)[k]}
                  onChange={(e) => setForm((f) => ({ ...f, [k]: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
                />
              </label>
            ))}
            <label className="block">
              <span className="text-xs font-medium text-slate-700">GPA value</span>
              <input
                type="number"
                step="0.01"
                value={form.gpaValue}
                onChange={(e) => setForm((f) => ({ ...f, gpaValue: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="text-xs font-medium text-slate-700">GPA scale</span>
              <input
                type="number"
                step="0.01"
                value={form.gpaScale}
                onChange={(e) => setForm((f) => ({ ...f, gpaScale: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              />
            </label>
            <p className="text-xs text-slate-500 sm:col-span-2">
              GPA needs both a value and a scale. Never compare GPAs on different scales.
            </p>
            <div className="sm:col-span-2">
              <button
                onClick={() => void saveEdits()}
                disabled={busy}
                className="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
              >
                {busy ? "Saving…" : "Save profile"}
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="bg-white rounded-xl border border-slate-200">
        <h2 className="font-semibold text-[#1B3A6B] text-sm px-4 py-3 border-b border-slate-200">
          Conversation ({messages.length})
        </h2>
        {messages.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No conversation linked to this lead.</p>
        ) : (
          <div className="p-4 space-y-3 max-h-[50vh] overflow-y-auto">
            {messages.map((m) => {
              const out = m.direction === "out";
              return (
                <div key={m.id} className={`flex ${out ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      out ? "bg-[#1B3A6B] text-white" : "bg-slate-100 text-slate-900"
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
          </div>
        )}
      </section>
    </div>
  );
}
