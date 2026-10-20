"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Entry {
  id: string;
  sourceId: string | null;
  universityName: string | null;
  city: string | null;
  programName: string | null;
  level: string | null;
  tuitionAmount: number | null;
  tuitionCurrency: string | null;
  tuitionPeriod: string | null;
  hostelAmount: number | null;
  hostelPeriod: string | null;
  applicationFee: number | null;
  insuranceFee: number | null;
  intakeText: string | null;
  intakeMonths: unknown;
  applicationDeadline: string | null;
  sourcePage: number | null;
  status: string;
  issues: string[];
}

interface Source {
  id: string;
  title: string;
  status: string;
  error: string | null;
  createdAt: string;
}

const LEVELS = [
  "bachelor", "master", "phd", "language", "diploma", "foundation", "short_course", "mbbs",
];

function money(amount: number | null, currency: string | null, period?: string | null) {
  if (amount == null) return "—";
  const base = `${amount.toLocaleString()} ${currency ?? ""}`.trim();
  return period ? `${base} / ${period}` : base;
}

export default function KnowledgeClient() {
  const [sources, setSources] = useState<Source[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  // Default to "all" so an owner who just approved data sees it, not an empty tab.
  const [filter, setFilter] = useState<"all" | "approved" | "draft" | "issues">("all");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Entry | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/business/knowledge", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed to load");
      setSources(json.sources ?? []);
      setEntries(json.entries ?? []);
    } catch (e: any) {
      setErr(e.message);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload() {
    const file = fileRef.current?.files?.[0];
    if (!file) {
      setErr("Choose an image first.");
      return;
    }
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("title", title || file.name);
      const res = await fetch("/api/business/knowledge", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Upload failed");
      setMsg(
        `Extracted ${json.created} program(s) as drafts.${
          json.uncertain?.length ? ` Uncertain: ${json.uncertain.join("; ")}` : ""
        }`
      );
      setTitle("");
      if (fileRef.current) fileRef.current.value = "";
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function act(action: string, id: string, fields?: Record<string, unknown>) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/business/knowledge/review", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action, fields }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Action failed");
      if (json.issues?.length) setMsg(`Saved. Note: ${json.issues.join(" ")}`);
      await load();
      return json;
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  function openEdit(e: Entry) {
    setEditing(e);
    setForm({
      universityName: e.universityName ?? "",
      city: e.city ?? "",
      programName: e.programName ?? "",
      level: e.level ?? "",
      tuitionAmount: e.tuitionAmount?.toString() ?? "",
      tuitionCurrency: e.tuitionCurrency ?? "CNY",
      tuitionPeriod: e.tuitionPeriod ?? "",
      hostelAmount: e.hostelAmount?.toString() ?? "",
      hostelPeriod: e.hostelPeriod ?? "",
      applicationFee: e.applicationFee?.toString() ?? "",
      insuranceFee: e.insuranceFee?.toString() ?? "",
      intakeText: e.intakeText ?? "",
      applicationDeadline: e.applicationDeadline ?? "",
    });
  }

  async function saveEdit() {
    if (!editing) return;
    const fields: Record<string, unknown> = {
      universityName: form.universityName || null,
      city: form.city || null,
      programName: form.programName || null,
      level: form.level || null,
      tuitionAmount: form.tuitionAmount === "" ? null : Number(form.tuitionAmount),
      tuitionCurrency: form.tuitionCurrency || "CNY",
      tuitionPeriod: form.tuitionPeriod || null,
      hostelAmount: form.hostelAmount === "" ? null : Number(form.hostelAmount),
      hostelPeriod: form.hostelPeriod || null,
      applicationFee: form.applicationFee === "" ? null : Number(form.applicationFee),
      insuranceFee: form.insuranceFee === "" ? null : Number(form.insuranceFee),
      intakeText: form.intakeText || null,
      applicationDeadline: form.applicationDeadline || null,
    };
    const r = await act("edit", editing.id, fields);
    if (r?.ok) {
      setEditing(null);
      setMsg("Saved as draft — re-approve to make it available to the AI.");
    }
  }

  const q = query.trim().toLowerCase();
  const shown = entries.filter((e) => {
    if (filter !== "all") {
      if (filter === "issues") {
        if (e.issues.length === 0) return false;
      } else if (e.status !== filter) {
        return false;
      }
    }
    if (!q) return true;
    return (
      (e.universityName ?? "").toLowerCase().includes(q) ||
      (e.city ?? "").toLowerCase().includes(q) ||
      (e.programName ?? "").toLowerCase().includes(q)
    );
  });

  const draftCount = entries.filter((e) => e.status === "draft").length;
  const approvedCount = entries.filter((e) => e.status === "approved").length;
  const issueCount = entries.filter((e) => e.issues.length > 0).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0F2A52]">Universities</h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload brochures and photos. The AI extracts program details as drafts — nothing is
          used in student conversations until you approve it.
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {err}
        </div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {msg}
        </div>
      )}

      <section className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
        <h2 className="font-semibold text-[#1B3A6B] text-sm">Upload a brochure or photo</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Document title (e.g. Beihang University 2027 brochure)"
          className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="block w-full text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-[#1B3A6B] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#152d56]"
        />
        <p className="text-xs text-slate-500">JPEG, PNG, WebP or GIF · max 8 MB per file.</p>
        <button
          onClick={() => void upload()}
          disabled={busy}
          className="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2.5 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
        >
          {busy ? "Extracting…" : "Upload & extract"}
        </button>
      </section>

      <section className="bg-white rounded-xl border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200 space-y-3">
          <div className="flex flex-wrap items-center gap-2 justify-between">
            <h2 className="font-semibold text-[#0F2A52] text-sm">
              Universities
              <span className="ml-2 text-xs font-normal text-slate-500">
                {approvedCount} live · {draftCount} draft
                {issueCount > 0 && (
                  <span className="text-amber-700"> · {issueCount} need review</span>
                )}
              </span>
            </h2>
            <div className="flex gap-1">
              {(["all", "approved", "draft", "issues"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                    filter === f
                      ? "bg-[#0F2A52] text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {f === "all" ? "All" : f}
                </button>
              ))}
            </div>
          </div>
          <input
            value={query}
            onChange={(ev) => setQuery(ev.target.value)}
            placeholder="Search by university, city or program…"
            aria-label="Search universities"
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
          />
        </div>

        {shown.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm font-medium text-slate-700">
              {entries.length === 0 ? "No universities yet." : "No universities match."}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {entries.length === 0
                ? "Upload a brochure above and the AI will extract the details."
                : "Try a different search, or switch the filter."}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {shown.map((e) => (
              <li key={e.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-[#1B3A6B] truncate">
                      {e.universityName ?? "Unknown university"}
                      {e.city ? <span className="text-slate-500"> · {e.city}</span> : null}
                    </div>
                    <div className="text-sm text-slate-700 truncate">
                      {e.programName ?? <span className="text-slate-400">Unnamed program</span>}
                      {e.level ? <span className="text-slate-500"> · {e.level}</span> : null}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Tuition {money(e.tuitionAmount, e.tuitionCurrency, e.tuitionPeriod)}
                      {e.hostelAmount != null && (
                        <> · Hostel {money(e.hostelAmount, e.tuitionCurrency, e.hostelPeriod)}</>
                      )}
                      {e.applicationFee != null && <> · App fee {money(e.applicationFee, e.tuitionCurrency)}</>}
                      {e.insuranceFee != null && <> · Insurance {money(e.insuranceFee, e.tuitionCurrency)}</>}
                    </div>
                    <div className="text-xs text-slate-500">
                      {e.intakeText ? `Intake ${e.intakeText}` : null}
                      {e.applicationDeadline ? ` · Deadline ${e.applicationDeadline}` : null}
                      {e.sourcePage ? ` · p.${e.sourcePage}` : null}
                    </div>
                    {e.issues.length > 0 && (
                      <div className="mt-2 rounded border border-amber-200 bg-amber-50 px-2.5 py-1.5">
                        {e.issues.map((i) => (
                          <p key={i} className="text-[11px] text-amber-900">
                            ⚠ {i}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[11px] px-2 py-1 rounded-full font-medium ${
                        e.status === "approved"
                          ? "bg-emerald-100 text-emerald-800"
                          : e.status === "rejected"
                            ? "bg-slate-200 text-slate-600"
                            : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {e.status}
                    </span>
                    <button
                      onClick={() => openEdit(e)}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
                    >
                      Edit
                    </button>
                    {e.status !== "approved" && (
                      <button
                        onClick={() => void act("approve", e.id)}
                        disabled={busy}
                        className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1B3A6B] text-white hover:bg-[#152d56] disabled:opacity-40"
                      >
                        Approve
                      </button>
                    )}
                    <button
                      onClick={() => void act("reject", e.id)}
                      disabled={busy}
                      className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {sources.length > 0 && (
        <section className="bg-white rounded-xl border border-slate-200 p-4">
          <h2 className="font-semibold text-[#1B3A6B] text-sm mb-2">Uploaded documents</h2>
          <ul className="text-sm space-y-1">
            {sources.slice(0, 8).map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3">
                <span className="truncate text-slate-700">{s.title}</span>
                <span className="text-xs text-slate-500 shrink-0">{s.status}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <h3 className="font-semibold text-[#1B3A6B] text-sm">Edit knowledge entry</h3>
              <button
                onClick={() => setEditing(null)}
                aria-label="Close"
                className="text-slate-500 hover:text-slate-800 text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="p-4 space-y-3">
              {(
                [
                  ["universityName", "University", "text"],
                  ["city", "City", "text"],
                  ["programName", "Program name", "text"],
                  ["intakeText", "Intake", "text"],
                  ["applicationDeadline", "Application deadline", "text"],
                ] as const
              ).map(([k, label]) => (
                <label key={k} className="block">
                  <span className="text-xs font-medium text-slate-700">{label}</span>
                  <input
                    type="text"
                    value={form[k] ?? ""}
                    onChange={(ev) => setForm((f) => ({ ...f, [k]: ev.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#29ABE2]"
                  />
                </label>
              ))}

              <label className="block">
                <span className="text-xs font-medium text-slate-700">Level</span>
                <select
                  value={form.level ?? ""}
                  onChange={(ev) => setForm((f) => ({ ...f, level: ev.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">—</option>
                  {LEVELS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Tuition amount</span>
                  <input
                    type="number"
                    value={form.tuitionAmount ?? ""}
                    onChange={(ev) => setForm((f) => ({ ...f, tuitionAmount: ev.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Currency</span>
                  <input
                    type="text"
                    value={form.tuitionCurrency ?? ""}
                    onChange={(ev) => setForm((f) => ({ ...f, tuitionCurrency: ev.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-medium text-slate-700">Tuition period</span>
                <select
                  value={form.tuitionPeriod ?? ""}
                  onChange={(ev) => setForm((f) => ({ ...f, tuitionPeriod: ev.target.value }))}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="">not stated</option>
                  <option value="semester">per semester</option>
                  <option value="year">per year</option>
                  <option value="month">per month</option>
                </select>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Hostel amount</span>
                  <input
                    type="number"
                    value={form.hostelAmount ?? ""}
                    onChange={(ev) => setForm((f) => ({ ...f, hostelAmount: ev.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Hostel period</span>
                  <select
                    value={form.hostelPeriod ?? ""}
                    onChange={(ev) => setForm((f) => ({ ...f, hostelPeriod: ev.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="">not stated</option>
                    <option value="semester">per semester</option>
                    <option value="year">per year</option>
                    <option value="month">per month</option>
                  </select>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Application fee</span>
                  <input
                    type="number"
                    value={form.applicationFee ?? ""}
                    onChange={(ev) => setForm((f) => ({ ...f, applicationFee: ev.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-slate-700">Insurance fee</span>
                  <input
                    type="number"
                    value={form.insuranceFee ?? ""}
                    onChange={(ev) => setForm((f) => ({ ...f, insuranceFee: ev.target.value }))}
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  />
                </label>
              </div>

              <p className="text-xs text-slate-500">
                Saving returns this entry to draft. You must approve it again before the AI can use it.
              </p>
            </div>
            <div className="sticky bottom-0 bg-white border-t border-slate-200 px-4 py-3 flex justify-end gap-2">
              <button
                onClick={() => setEditing(null)}
                className="text-sm font-medium px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                onClick={() => void saveEdit()}
                disabled={busy}
                className="bg-[#C8102E] text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
              >
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
