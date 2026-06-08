"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { universitiesData } from "~/lib/data/universities";

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

export default function EditUniversityPage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : "";
  const uni = universitiesData[id];

  const [saved, setSaved] = useState(false);
  const [name, setName] = useState(uni?.name ?? "");
  const [chineseName, setChineseName] = useState(uni?.chineseName ?? "");
  const [city, setCity] = useState(uni?.city ?? "");
  const [province, setProvince] = useState(uni?.province ?? "");
  const [region, setRegion] = useState<string>(uni?.region ?? "East");
  const [tier, setTier] = useState<string>(uni?.tier ?? "Regular");
  const [ranking, setRanking] = useState(uni?.ranking ?? "");
  const [tagline, setTagline] = useState(uni?.tagline ?? "");
  const [tuitionRMB, setTuitionRMB] = useState(uni?.tuitionRMB ?? "");
  const [livingCostRMB, setLivingCostRMB] = useState(uni?.livingCostRMB ?? "");
  const [intakeMonths, setIntakeMonths] = useState(uni?.intakeMonths ?? "");
  const [scholarships, setScholarships] = useState(uni?.scholarships?.join(", ") ?? "");
  const [highlights, setHighlights] = useState(uni?.highlights?.join("\n") ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }

  if (!uni) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Link href="/admin/universities" className="w-8 h-8 rounded-lg flex items-center justify-center border" style={{ borderColor: "#E2E8F0" }}>
            <ArrowLeft size={15} style={{ color: "#64748B" }} />
          </Link>
          <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>Edit University</h1>
        </div>
        <div className="flex items-center gap-3 p-5 rounded-xl" style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA" }}>
          <AlertCircle size={18} style={{ color: "#C8102E" }} />
          <p className="text-sm font-semibold" style={{ color: "#991B1B" }}>
            University &quot;{id}&quot; not found in the database.
          </p>
        </div>
      </div>
    );
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
            Edit: {uni.name}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Slug: {uni.slug}
          </p>
        </div>
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#DCFCE7", border: "1px solid #86EFAC" }}>
          <CheckCircle2 size={18} style={{ color: "#166534" }} />
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>
            Changes saved. Connect to a real database to persist updates.
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
              <input className={inputClass} style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} required />
            </Field>
            <Field label="University Name (Chinese)">
              <input className={inputClass} style={inputStyle} value={chineseName} onChange={(e) => setChineseName(e.target.value)} />
            </Field>
            <Field label="City" required>
              <input className={inputClass} style={inputStyle} value={city} onChange={(e) => setCity(e.target.value)} required />
            </Field>
            <Field label="Province" required>
              <input className={inputClass} style={inputStyle} value={province} onChange={(e) => setProvince(e.target.value)} required />
            </Field>
            <Field label="Region">
              <select className={inputClass} style={{ ...inputStyle, color: "#475569" }} value={region} onChange={(e) => setRegion(e.target.value)}>
                {["North", "East", "South", "Central", "West", "Northeast"].map((r) => <option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Tier">
              <select className={inputClass} style={{ ...inputStyle, color: "#475569" }} value={tier} onChange={(e) => setTier(e.target.value)}>
                {["985", "211", "Medical", "Language", "Business", "Regular"].map((t) => <option key={t}>{t}</option>)}
              </select>
            </Field>
            <Field label="Ranking">
              <input className={inputClass} style={inputStyle} value={ranking} onChange={(e) => setRanking(e.target.value)} placeholder="e.g. QS Top 25" />
            </Field>
            <Field label="Intake Months">
              <input className={inputClass} style={inputStyle} value={intakeMonths} onChange={(e) => setIntakeMonths(e.target.value)} />
            </Field>
          </div>
          <Field label="Tagline">
            <input className={inputClass} style={inputStyle} value={tagline} onChange={(e) => setTagline(e.target.value)} />
          </Field>
        </section>

        {/* Costs */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
            Costs
          </p>
          <div className="grid gap-4" style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }}>
            <Field label="Tuition (RMB / year)">
              <input className={inputClass} style={inputStyle} value={tuitionRMB} onChange={(e) => setTuitionRMB(e.target.value)} />
            </Field>
            <Field label="Living Cost (RMB / month)">
              <input className={inputClass} style={inputStyle} value={livingCostRMB} onChange={(e) => setLivingCostRMB(e.target.value)} />
            </Field>
          </div>
        </section>

        {/* Scholarships & Highlights */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
            Scholarships & Highlights
          </p>
          <Field label="Scholarships (comma-separated)">
            <input className={inputClass} style={inputStyle} value={scholarships} onChange={(e) => setScholarships(e.target.value)} />
          </Field>
          <Field label="Highlights (one per line)">
            <textarea
              className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors resize-none"
              style={{ borderColor: "#E2E8F0" }}
              rows={5}
              value={highlights}
              onChange={(e) => setHighlights(e.target.value)}
            />
          </Field>
        </section>

        <div className="flex justify-between items-center pb-4">
          <Link
            href={`/universities/${uni.slug}`}
            target="_blank"
            className="text-xs font-semibold"
            style={{ color: "#29ABE2" }}
          >
            View live page →
          </Link>
          <div className="flex gap-3">
            <Link
              href="/admin/universities"
              className="px-5 py-2.5 rounded-xl text-sm font-semibold border transition-colors"
              style={{ borderColor: "#E2E8F0", color: "#64748B", backgroundColor: "white" }}
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#C8102E" }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
