"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface Entry {
  id: string;
  universityName: string | null;
  city: string | null;
  programName: string | null;
  level: string | null;
  intakeText: string | null;
  status: string;
}

interface ImportResult {
  created: number;
  updated: number;
  skipped: number;
  pendingApproval: number;
  problems: string[];
}

export default function KnowledgeImport() {
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Entry[]>([]);
  const [counts, setCounts] = useState({ draft: 0, approved: 0 });
  const [showDrafts, setShowDrafts] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/business/knowledge/import", { cache: "no-store" });
      if (!res.ok) return;
      const json = await res.json();
      setCounts(json.counts ?? { draft: 0, approved: 0 });
      setDrafts((json.entries ?? []).filter((e: Entry) => e.status === "draft"));
    } catch {
      /* keep the panel usable */
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload(file: File) {
    setBusy(true);
    setErr(null);
    setMsg(null);
    setResult(null);
    try {
      const text = await file.text();
      let parsed: any;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("That file is not valid JSON. Export your brochures as JSON, or ask us for the template.");
      }

      const res = await fetch("/api/business/knowledge/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Import failed");
      setResult(json);
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Import failed");
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function review(action: "approve" | "reject") {
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/business/knowledge/review", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, all: true }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      setMsg(
        action === "approve"
          ? `${json.updated} entries approved — the AI can now use them.`
          : `${json.updated} drafts rejected.`
      );
      await load();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-semibold text-[#0F2A52] text-sm">Import universities</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Upload a JSON file. Everything lands as a draft and only reaches students once you approve it.
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
            {counts.approved} live
          </span>
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
            {counts.draft} draft
          </span>
        </div>
      </div>

      {err && (
        <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {err}
        </div>
      )}
      {msg && (
        <div className="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-900">
          {msg}
        </div>
      )}

      <div className="mt-3 flex items-center gap-2 flex-wrap">
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void upload(f);
          }}
        />
        <button
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="bg-[#C8102E] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
        >
          {busy ? "Working…" : "Choose JSON file"}
        </button>

        <a
          href="/api/business/knowledge/import/template"
          className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-[#0F2A52] hover:border-[#29ABE2]"
        >
          Download template
        </a>

        {counts.draft > 0 && (
          <>
            <button
              onClick={() => review("approve")}
              disabled={busy}
              className="bg-[#0F2A52] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#1B3A6B] disabled:opacity-40"
            >
              Approve all {counts.draft}
            </button>
            <button
              onClick={() => review("reject")}
              disabled={busy}
              className="text-xs font-medium px-3 py-2 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40"
            >
              Reject all
            </button>
            <button
              onClick={() => setShowDrafts((v) => !v)}
              className="text-xs text-[#29ABE2] hover:underline"
            >
              {showDrafts ? "Hide" : "Review"} drafts
            </button>
          </>
        )}
      </div>

      {result && (
        <div className="mt-3 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-700">
          Imported: <strong>{result.created} new</strong>
          {result.updated > 0 && <> · {result.updated} updated</>}
          {result.skipped > 0 && <> · {result.skipped} skipped</>}
          {" — "}
          {result.pendingApproval} waiting for approval.
          {result.problems.length > 0 && (
            <ul className="mt-1.5 list-disc pl-4 text-[11px] text-slate-500">
              {result.problems.slice(0, 5).map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      {showDrafts && drafts.length > 0 && (
        <ul className="mt-3 divide-y divide-slate-100 max-h-64 overflow-y-auto border-t border-slate-100">
          {drafts.map((d) => (
            <li key={d.id} className="py-1.5 flex items-center justify-between gap-2 text-xs">
              <span className="truncate text-slate-800">
                {d.universityName}
                <span className="text-slate-400"> · {d.programName}</span>
              </span>
              <span className="text-slate-500 shrink-0">{d.intakeText ?? "—"}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
