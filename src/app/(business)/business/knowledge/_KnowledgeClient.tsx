"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Source {
  id: string;
  title: string;
  status: string;
  error: string | null;
  createdAt: string;
}

interface Entry {
  id: string;
  sourceId: string | null;
  universityName: string | null;
  city: string | null;
  programName: string | null;
  level: string | null;
  tuitionAmount: number | null;
  tuitionCurrency: string | null;
  intakeMonths: unknown;
  applicationDeadline: string | null;
  status: string;
}

function money(amount: number | null, currency: string | null) {
  if (amount == null) return "—";
  return `${amount.toLocaleString()} ${currency ?? ""}`.trim();
}

export default function KnowledgeClient() {
  const [sources, setSources] = useState<Source[]>([]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [filter, setFilter] = useState<"draft" | "approved" | "all">("draft");
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

  async function act(action: string, id: string) {
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/business/knowledge/review", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Action failed");
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  const shown = entries.filter((e) => (filter === "all" ? true : e.status === filter));
  const draftCount = entries.filter((e) => e.status === "draft").length;
  const approvedCount = entries.filter((e) => e.status === "approved").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A6B]">Knowledge</h1>
        <p className="text-sm text-slate-600 mt-1">
          Upload brochures and photos. The AI extracts program details as drafts —
          nothing is used in student conversations until you approve it.
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
        <div className="space-y-2">
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
        </div>
      </section>

      <section className="bg-white rounded-xl border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200 flex flex-wrap items-center gap-2 justify-between">
          <h2 className="font-semibold text-[#1B3A6B] text-sm">
            Extracted programs
            <span className="ml-2 text-xs font-normal text-slate-500">
              {draftCount} draft · {approvedCount} approved
            </span>
          </h2>
          <div className="flex gap-1">
            {(["draft", "approved", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize ${
                  filter === f
                    ? "bg-[#1B3A6B] text-white"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {shown.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-600">
              {filter === "approved"
                ? "No approved knowledge yet."
                : "No programs here yet. Upload a brochure above."}
            </p>
            {filter === "draft" && (
              <p className="text-xs text-slate-500 mt-1">
                The AI will say “I need to verify that” until you approve entries.
              </p>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {shown.map((e) => (
              <li key={e.id} className="p-4 flex flex-col md:flex-row md:items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-[#1B3A6B] truncate">
                    {e.universityName ?? "Unknown university"}
                    {e.city ? <span className="text-slate-500"> · {e.city}</span> : null}
                  </div>
                  <div className="text-sm text-slate-700 truncate">
                    {e.programName ?? "Unnamed program"}
                    {e.level ? <span className="text-slate-500"> · {e.level}</span> : null}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Tuition {money(e.tuitionAmount, e.tuitionCurrency)} · Deadline{" "}
                    {e.applicationDeadline ?? "—"}
                  </div>
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
    </div>
  );
}
