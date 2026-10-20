"use client";

import { useCallback, useEffect, useState } from "react";

interface Status {
  columns?: string[];
  missing?: string[];
}

export default function SetupMigrate() {
  const [status, setStatus] = useState<Status | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ applied: number; failed: string[] } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/business/setup/migrate", {
        cache: "no-store",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      // A truncated or HTML body must never surface as "Unexpected end of
      // JSON input" — that tells the owner nothing actionable.
      if (!text.trim()) {
        setErr("The server returned an empty response. Try again in a moment.");
        return;
      }
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        setErr(`Unexpected response from the server (${res.status}).`);
        return;
      }
      if (json?.error) {
        setErr(String(json.error));
        return;
      }
      setErr(null);
      setStatus(json);
    } catch (e: any) {
      setErr(e?.message ?? "Could not reach the server.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function run() {
    setBusy(true);
    setErr(null);
    setResult(null);
    try {
      const res = await fetch("/api/business/setup/migrate", {
        method: "POST",
        headers: { Accept: "application/json" },
      });
      const text = await res.text();
      if (!text.trim()) throw new Error("The server returned an empty response. Try again.");
      const json = JSON.parse(text);
      if (!res.ok) throw new Error(json?.error ?? "Update failed");
      setResult({ applied: json.applied ?? 0, failed: json.failed ?? [] });
      await load();
    } catch (e: any) {
      setErr(e.message ?? "Update failed");
    } finally {
      setBusy(false);
    }
  }

  const missing = status?.missing ?? [];
  const healthy = missing.length === 0;

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h2 className="font-semibold text-[#0F2A52] text-sm">Database schema</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Applies the column changes this build expects. Safe to run any time, and running it
            twice does nothing.
          </p>
        </div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full ${
            healthy ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-900"
          }`}
        >
          {status == null ? "checking…" : healthy ? "up to date" : `${missing.length} missing`}
        </span>
      </div>

      {!healthy && missing.length > 0 && (
        <p className="mt-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          Missing columns: <code className="font-mono">{missing.join(", ")}</code>
        </p>
      )}

      {err && (
        <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
          {err}
        </div>
      )}

      {result && (
        <div
          className={`mt-2 rounded-lg px-3 py-2 text-xs border ${
            result.failed.length === 0
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          {result.applied} statement(s) applied.
          {result.failed.length > 0 && <> Failed: {result.failed.join("; ")}</>}
        </div>
      )}

      <button
        onClick={run}
        disabled={busy}
        className="mt-3 bg-[#C8102E] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#A50D25] disabled:opacity-40"
      >
        {busy ? "Updating…" : healthy ? "Re-check / update schema" : "Update database now"}
      </button>
    </section>
  );
}
