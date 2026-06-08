"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

type FormState = {
  name: string;
  chineseName: string;
  city: string;
  province: string;
  region: string;
  tier: string;
  ranking: string;
  established: string;
  students: string;
  tagline: string;
  tuitionRMB: string;
  livingCostRMB: string;
  intakeMonths: string;
  scholarships: string;
  highlights: string;
};

const INITIAL: FormState = {
  name: "", chineseName: "", city: "", province: "",
  region: "East", tier: "Regular", ranking: "", established: "",
  students: "", tagline: "", tuitionRMB: "", livingCostRMB: "",
  intakeMonths: "September", scholarships: "", highlights: "",
};

const inputClass = "w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors";
const inputStyle = { borderColor: "#E2E8F0" };

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>
        {label} {required && <span style={{ color: "#C8102E" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function NewUniversityPage() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [saved, setSaved] = useState(false);

  function update(key: keyof FormState, val: string) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/universities"
          className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-gray-50"
          style={{ borderColor: "#E2E8F0" }}
        >
          <ArrowLeft size={15} style={{ color: "#64748B" }} />
        </Link>
        <div>
          <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>
            Add University
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            New university entry for the Globlearn Education database
          </p>
        </div>
      </div>

      {/* Success banner */}
      {saved && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ backgroundColor: "#DCFCE7", border: "1px solid #86EFAC" }}
        >
          <CheckCircle2 size={18} style={{ color: "#166534" }} />
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>
            University saved successfully. Connect to a real database to persist this entry.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
            Basic Information
          </p>
          <div className="grid gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <Field label="University Name (English)" required>
              <input
                className={inputClass}
                style={inputStyle}
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="e.g. Wuhan University"
                required
              />
            </Field>
            <Field label="University Name (Chinese)">
              <input
                className={inputClass}
                style={inputStyle}
                value={form.chineseName}
                onChange={(e) => update("chineseName", e.target.value)}
                placeholder="e.g. 武汉大学"
              />
            </Field>
            <Field label="City" required>
              <input
                className={inputClass}
                style={inputStyle}
                value={form.city}
                onChange={(e) => update("city", e.target.value)}
                placeholder="e.g. Wuhan"
                required
              />
            </Field>
            <Field label="Province" required>
              <input
                className={inputClass}
                style={inputStyle}
                value={form.province}
                onChange={(e) => update("province", e.target.value)}
                placeholder="e.g. Hubei"
                required
              />
            </Field>
            <Field label="Region">
              <select
                className={inputClass}
                style={{ ...inputStyle, color: "#475569" }}
                value={form.region}
                onChange={(e) => update("region", e.target.value)}
              >
                {["North", "East", "South", "Central", "West", "Northeast"].map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </Field>
            <Field label="Tier">
              <select
                className={inputClass}
                style={{ ...inputStyle, color: "#475569" }}
                value={form.tier}
                onChange={(e) => update("tier", e.target.value)}
              >
                {["985", "211", "Medical", "Language", "Business", "Regular"].map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
            <Field label="Ranking (optional)">
              <input
                className={inputClass}
                style={inputStyle}
                value={form.ranking}
                onChange={(e) => update("ranking", e.target.value)}
                placeholder="e.g. QS Top 100"
              />
            </Field>
            <Field label="Year Established">
              <input
                type="number"
                className={inputClass}
                style={inputStyle}
                value={form.established}
                onChange={(e) => update("established", e.target.value)}
                placeholder="e.g. 1893"
                min={1800}
                max={2024}
              />
            </Field>
          </div>
          <Field label="Tagline" required>
            <input
              className={inputClass}
              style={inputStyle}
              value={form.tagline}
              onChange={(e) => update("tagline", e.target.value)}
              placeholder="One-sentence description shown on university card"
              required
            />
          </Field>
        </section>

        {/* Costs & Intake */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
            Costs & Intake
          </p>
          <div className="grid gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Tuition (RMB / year)" required>
              <input
                className={inputClass}
                style={inputStyle}
                value={form.tuitionRMB}
                onChange={(e) => update("tuitionRMB", e.target.value)}
                placeholder="e.g. ¥20,000 – ¥35,000"
                required
              />
            </Field>
            <Field label="Living Cost (RMB / month)">
              <input
                className={inputClass}
                style={inputStyle}
                value={form.livingCostRMB}
                onChange={(e) => update("livingCostRMB", e.target.value)}
                placeholder="e.g. ¥2,000 – ¥3,500"
              />
            </Field>
            <Field label="Intake Months">
              <input
                className={inputClass}
                style={inputStyle}
                value={form.intakeMonths}
                onChange={(e) => update("intakeMonths", e.target.value)}
                placeholder="e.g. September, March"
              />
            </Field>
            <Field label="Total Students">
              <input
                className={inputClass}
                style={inputStyle}
                value={form.students}
                onChange={(e) => update("students", e.target.value)}
                placeholder="e.g. 40,000+"
              />
            </Field>
          </div>
        </section>

        {/* Scholarships & Highlights */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
            Scholarships & Highlights
          </p>
          <Field label="Scholarships available (comma-separated)">
            <input
              className={inputClass}
              style={inputStyle}
              value={form.scholarships}
              onChange={(e) => update("scholarships", e.target.value)}
              placeholder="e.g. CSC Scholarship, University Scholarship, Self-Sponsored"
            />
          </Field>
          <Field label="Key highlights (one per line)">
            <textarea
              className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors resize-none"
              style={{ borderColor: "#E2E8F0" }}
              rows={4}
              value={form.highlights}
              onChange={(e) => update("highlights", e.target.value)}
              placeholder={"English-medium MBBS program\nRanked #1 in Hubei province\nCSC scholarship available"}
            />
          </Field>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-4">
          <Link
            href="/admin/universities"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
            style={{ borderColor: "#E2E8F0", color: "#64748B", backgroundColor: "white" }}
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-colors"
            style={{ backgroundColor: "#C8102E" }}
          >
            Save University
          </button>
        </div>
      </form>
    </div>
  );
}
