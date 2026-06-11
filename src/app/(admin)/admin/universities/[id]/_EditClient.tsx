"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const inputClass =
  "w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors";
const inputStyle = { borderColor: "#E2E8F0" };

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>
        {label} {required && <span style={{ color: "#C8102E" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export type UniversityRecord = {
  id: string;
  slug: string;
  nameEn: string;
  nameCn: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  tier985: boolean | null;
  tier211: boolean | null;
  qsRanking: number | null;
  founded: number | null;
  totalStudents: number | null;
  internationalStudents: number | null;
  website: string | null;
  description: string | null;
  isPartner: boolean | null;
  isActive: boolean | null;
  dataConfidence: string | null;
  cscAgencyNumber: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
};

export default function EditUniversityClient({
  university,
}: {
  university: UniversityRecord;
}) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [nameEn, setNameEn] = useState(university.nameEn);
  const [nameCn, setNameCn] = useState(university.nameCn ?? "");
  const [city, setCity] = useState(university.city ?? "");
  const [province, setProvince] = useState(university.province ?? "");
  const [country, setCountry] = useState(university.country ?? "China");
  const [tier985, setTier985] = useState(university.tier985 ?? false);
  const [tier211, setTier211] = useState(university.tier211 ?? false);
  const [qsRanking, setQsRanking] = useState(university.qsRanking?.toString() ?? "");
  const [founded, setFounded] = useState(university.founded?.toString() ?? "");
  const [totalStudents, setTotalStudents] = useState(university.totalStudents?.toString() ?? "");
  const [internationalStudents, setInternationalStudents] = useState(
    university.internationalStudents?.toString() ?? ""
  );
  const [website, setWebsite] = useState(university.website ?? "");
  const [description, setDescription] = useState(university.description ?? "");
  const [isPartner, setIsPartner] = useState(university.isPartner ?? false);
  const [isActive, setIsActive] = useState(university.isActive ?? true);
  const [dataConfidence, setDataConfidence] = useState(university.dataConfidence ?? "medium");
  const [cscAgencyNumber, setCscAgencyNumber] = useState(university.cscAgencyNumber ?? "");
  const [metaTitle, setMetaTitle] = useState(university.metaTitle ?? "");
  const [metaDescription, setMetaDescription] = useState(university.metaDescription ?? "");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/universities/${university.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nameEn,
          nameCn: nameCn || null,
          city: city || null,
          province: province || null,
          country: country || "China",
          tier985,
          tier211,
          qsRanking: qsRanking ? parseInt(qsRanking) : null,
          founded: founded ? parseInt(founded) : null,
          totalStudents: totalStudents ? parseInt(totalStudents) : null,
          internationalStudents: internationalStudents ? parseInt(internationalStudents) : null,
          website: website || null,
          description: description || null,
          isPartner,
          isActive,
          dataConfidence,
          cscAgencyNumber: cscAgencyNumber || null,
          metaTitle: metaTitle || null,
          metaDescription: metaDescription || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
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
            Edit: {university.nameEn}
          </h1>
          <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
            Slug: {university.slug}
          </p>
        </div>
      </div>

      {saved && (
        <div
          className="flex items-center gap-3 p-4 rounded-xl"
          style={{ backgroundColor: "#DCFCE7", border: "1px solid #86EFAC" }}
        >
          <CheckCircle2 size={18} style={{ color: "#166534" }} />
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>
            Changes saved successfully.
          </p>
        </div>
      )}

      {error && (
        <div
          className="p-4 rounded-xl text-sm font-semibold"
          style={{ backgroundColor: "#FEF2F2", border: "1px solid #FECACA", color: "#991B1B" }}
        >
          Error: {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p
            className="text-sm font-bold pb-3"
            style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}
          >
            Basic Information
          </p>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <Field label="University Name (English)" required>
              <input
                className={inputClass}
                style={inputStyle}
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                required
              />
            </Field>
            <Field label="University Name (Chinese)">
              <input
                className={inputClass}
                style={inputStyle}
                value={nameCn}
                onChange={(e) => setNameCn(e.target.value)}
              />
            </Field>
            <Field label="City">
              <input
                className={inputClass}
                style={inputStyle}
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </Field>
            <Field label="Province">
              <input
                className={inputClass}
                style={inputStyle}
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              />
            </Field>
            <Field label="QS Ranking (number)">
              <input
                type="number"
                className={inputClass}
                style={inputStyle}
                value={qsRanking}
                onChange={(e) => setQsRanking(e.target.value)}
                placeholder="e.g. 25"
              />
            </Field>
            <Field label="Founded (year)">
              <input
                type="number"
                className={inputClass}
                style={inputStyle}
                value={founded}
                onChange={(e) => setFounded(e.target.value)}
                placeholder="e.g. 1911"
              />
            </Field>
            <Field label="Total Students">
              <input
                type="number"
                className={inputClass}
                style={inputStyle}
                value={totalStudents}
                onChange={(e) => setTotalStudents(e.target.value)}
              />
            </Field>
            <Field label="International Students">
              <input
                type="number"
                className={inputClass}
                style={inputStyle}
                value={internationalStudents}
                onChange={(e) => setInternationalStudents(e.target.value)}
              />
            </Field>
            <Field label="Website">
              <input
                type="url"
                className={inputClass}
                style={inputStyle}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
              />
            </Field>
            <Field label="CSC Agency Number">
              <input
                className={inputClass}
                style={inputStyle}
                value={cscAgencyNumber}
                onChange={(e) => setCscAgencyNumber(e.target.value)}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors resize-none"
              style={{ borderColor: "#E2E8F0" }}
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
        </section>

        {/* Tiers & Status */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p
            className="text-sm font-bold pb-3"
            style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}
          >
            Classification & Status
          </p>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={tier985}
                onChange={(e) => setTier985(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>985 University</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={tier211}
                onChange={(e) => setTier211(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>211 University</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isPartner}
                onChange={(e) => setIsPartner(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>Partner University</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>Active (visible on site)</span>
            </label>
          </div>
          <Field label="Data Confidence">
            <select
              className={inputClass}
              style={{ ...inputStyle, color: "#475569" }}
              value={dataConfidence}
              onChange={(e) => setDataConfidence(e.target.value)}
            >
              {["verified", "high", "medium", "low", "skeleton", "unverified"].map((v) => (
                <option key={v} value={v} className="capitalize">
                  {v}
                </option>
              ))}
            </select>
          </Field>
        </section>

        {/* SEO */}
        <section className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p
            className="text-sm font-bold pb-3"
            style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}
          >
            SEO
          </p>
          <Field label="Meta Title">
            <input
              className={inputClass}
              style={inputStyle}
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder={`${nameEn} | Study in China | Globlearn Education`}
            />
          </Field>
          <Field label="Meta Description">
            <textarea
              className="w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors resize-none"
              style={{ borderColor: "#E2E8F0" }}
              rows={3}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
            />
          </Field>
        </section>

        <div className="flex justify-between items-center pb-4">
          <Link
            href={`/universities/${university.slug}`}
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
              disabled={saving}
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
              style={{ backgroundColor: "#C8102E" }}
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
