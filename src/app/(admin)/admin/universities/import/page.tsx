"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, CheckCircle2, AlertTriangle, ArrowLeft } from "lucide-react";

interface ImportResult {
  inserted: number;
  updated: number;
  skipped: number;
  errors: string[];
  total: number;
}

const EXAMPLE_JSON = JSON.stringify([
  {
    slug: "example-university",
    nameEn: "Example University",
    nameCn: "示例大学",
    city: "Beijing",
    province: "Beijing",
    tier985: false,
    tier211: true,
    qsRanking: 500,
    founded: 1950,
    totalStudents: 30000,
    internationalStudents: 2000,
    website: "https://example.edu.cn",
    description: "A leading university in China.",
    isPartner: false,
    cscAgencyNumber: "10001",
  },
], null, 2);

export default function UniversityImportPage() {
  const [json, setJson] = useState("");
  const [mode, setMode] = useState<"upsert" | "insert_only">("upsert");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [parseError, setParseError] = useState("");

  async function handleImport() {
    setParseError("");
    setResult(null);

    let parsed;
    try {
      parsed = JSON.parse(json);
    } catch {
      setParseError("Invalid JSON — check your input.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setParseError("JSON must be an array of university objects.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/universities/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universities: parsed, mode }),
      });
      const data = await res.json();
      if (!res.ok) {
        setParseError(typeof data.error === "string" ? data.error : "Import failed.");
        return;
      }
      setResult(data);
    } catch {
      setParseError("Network error — try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => setJson((e.target?.result as string) ?? "");
    reader.readAsText(file);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/admin/universities" className="flex items-center gap-1.5 text-sm font-semibold" style={{ color: "#64748B" }}>
          <ArrowLeft size={15} />
          Back
        </Link>
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Import Universities</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>Paste JSON or upload a file — max 500 universities per import</p>
        </div>
      </div>

      {/* Mode */}
      <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
        <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Import mode</p>
        <div className="flex gap-3">
          {(["upsert", "insert_only"] as const).map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="mode" value={m} checked={mode === m} onChange={() => setMode(m)} />
              <span className="text-sm" style={{ color: "#374151" }}>
                {m === "upsert" ? "Upsert (insert + update existing)" : "Insert only (skip existing slugs)"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* File upload */}
      <div
        className="bg-white rounded-2xl border-2 border-dashed p-8 text-center"
        style={{ borderColor: "#CBD5E1" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
      >
        <Upload size={24} className="mx-auto mb-3" style={{ color: "#94A3B8" }} />
        <p className="text-sm font-semibold mb-1" style={{ color: "#374151" }}>Drag & drop a JSON file, or</p>
        <label className="cursor-pointer">
          <span className="text-sm font-bold underline" style={{ color: "#1B3A6B" }}>browse to upload</span>
          <input type="file" accept=".json,application/json" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
        </label>
      </div>

      {/* JSON textarea */}
      <div className="bg-white rounded-2xl border p-5 space-y-3" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>JSON input</p>
          <button
            type="button"
            onClick={() => setJson(EXAMPLE_JSON)}
            className="text-xs font-semibold underline"
            style={{ color: "#29ABE2" }}
          >
            Load example
          </button>
        </div>
        <textarea
          value={json}
          onChange={(e) => setJson(e.target.value)}
          placeholder='[{"slug": "peking-university", "nameEn": "Peking University", ...}]'
          className="w-full h-64 border rounded-xl p-3 text-xs font-mono bg-gray-50 focus:outline-none resize-y"
          style={{ borderColor: "#E2E8F0" }}
        />
        {parseError && (
          <div className="flex items-center gap-2 text-xs" style={{ color: "#C8102E" }}>
            <AlertTriangle size={13} />
            {parseError}
          </div>
        )}
      </div>

      {/* Required fields reference */}
      <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
        <p className="text-xs font-bold mb-2" style={{ color: "#1B3A6B" }}>Required fields</p>
        <p className="text-xs font-mono" style={{ color: "#475569" }}>slug, nameEn</p>
        <p className="text-xs font-bold mt-3 mb-1" style={{ color: "#1B3A6B" }}>Optional fields</p>
        <p className="text-xs font-mono leading-relaxed" style={{ color: "#475569" }}>
          nameCn, city, province, tier985, tier211, qsRanking, founded, totalStudents,<br />
          internationalStudents, website, logoUrl, heroImageUrl, description,<br />
          isPartner, cscAgencyNumber, metaTitle, metaDescription
        </p>
      </div>

      {/* Import button */}
      <button
        type="button"
        disabled={!json.trim() || loading}
        onClick={handleImport}
        className="flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold disabled:opacity-50"
        style={{ backgroundColor: "#C8102E" }}
      >
        <Upload size={15} />
        {loading ? "Importing…" : "Run import"}
      </button>

      {/* Result */}
      {result && (
        <div className="bg-white rounded-2xl border p-5 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center gap-2">
            <CheckCircle2 size={18} style={{ color: "#16A34A" }} />
            <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Import complete</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Inserted",   value: result.inserted, color: "#166534",  bg: "#F0FDF4" },
              { label: "Updated",    value: result.updated,  color: "#1E40AF",  bg: "#DBEAFE" },
              { label: "Skipped",    value: result.skipped,  color: "#92400E",  bg: "#FEF3C7" },
              { label: "Total",      value: result.total,    color: "#0A1628",  bg: "#F8FAFC" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4 text-center" style={{ backgroundColor: s.bg }}>
                <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                <p className="text-xs font-semibold mt-0.5" style={{ color: s.color }}>{s.label}</p>
              </div>
            ))}
          </div>
          {result.errors.length > 0 && (
            <div>
              <p className="text-xs font-bold mb-2" style={{ color: "#C8102E" }}>
                {result.errors.length} error{result.errors.length !== 1 ? "s" : ""}
              </p>
              <ul className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((e, i) => (
                  <li key={i} className="text-xs font-mono" style={{ color: "#C8102E" }}>{e}</li>
                ))}
              </ul>
            </div>
          )}
          <Link href="/admin/universities" className="text-sm font-semibold underline" style={{ color: "#1B3A6B" }}>
            View all universities →
          </Link>
        </div>
      )}
    </div>
  );
}
