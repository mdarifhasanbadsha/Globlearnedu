"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Check, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";

type InitialData = {
  passportGivenName: string;
  passportSurname: string;
  passportNumber: string;
  passportExpiry: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  phone: string;
  email: string;
  addressCity: string;
  addressCountry: string;
  programLevel: string;
  scholarshipType: string;
  isUrgent: boolean;
};

type Props = {
  applicationId: string;
  applicationNumber: string;
  studentName: string;
  initialData: InitialData;
};

const PROGRAM_OPTIONS = [
  { value: "mbbs",         label: "MBBS / Medicine" },
  { value: "bachelor",     label: "Bachelor's Degree" },
  { value: "master",       label: "Master's Degree" },
  { value: "phd",          label: "PhD" },
  { value: "language",     label: "Chinese Language" },
  { value: "diploma",      label: "Diploma" },
  { value: "foundation",   label: "Foundation" },
  { value: "short_course", label: "Short Course" },
];

const SCHOLARSHIP_OPTIONS = [
  { value: "",           label: "— None / Not specified —" },
  { value: "csc",        label: "CSC (Chinese Government)" },
  { value: "university", label: "University Scholarship" },
  { value: "provincial", label: "Provincial Scholarship" },
  { value: "self",       label: "Self-sponsored" },
];

const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

function FormField({
  label, name, value, onChange, type = "text", required = false, hint,
}: {
  label: string; name: string; value: string;
  onChange: (v: string) => void; type?: string;
  required?: boolean; hint?: string;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>
        {label}{required && <span style={{ color: "#C8102E" }}> *</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
        style={{ borderColor: "#E2E8F0", color: "#0A1628" }}
      />
      {hint && <p className="text-[10px] mt-1" style={{ color: "#94A3B8" }}>{hint}</p>}
    </div>
  );
}

function SelectField({
  label, value, onChange, options, required = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[]; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>
        {label}{required && <span style={{ color: "#C8102E" }}> *</span>}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white"
        style={{ borderColor: "#E2E8F0", color: "#0A1628" }}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <div className="px-5 py-3.5" style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#94A3B8" }}>{title}</p>
      </div>
      <div className="px-5 py-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div>
      </div>
    </div>
  );
}

export default function StaffEditClient({ applicationId, applicationNumber, studentName, initialData }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<InitialData>(initialData);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  function set(field: keyof InitialData, value: string | boolean) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/staff/applications/${applicationId}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        router.push(`/staff/applications/${applicationId}`);
      }, 1200);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error saving");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-[900px] mx-auto space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link
          href={`/staff/applications/${applicationId}`}
          className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center border hover:bg-gray-50 transition-colors flex-shrink-0"
          style={{ borderColor: "#E2E8F0" }}
        >
          <ArrowLeft size={14} style={{ color: "#64748B" }} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>Edit Application</h1>
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>
            {studentName} · {applicationNumber}
          </p>
          <div className="flex items-center gap-2 mt-1.5 rounded-xl px-3 py-2 text-xs font-semibold" style={{ backgroundColor: "#FEF9C3", color: "#854D0E", display: "inline-flex" }}>
            <AlertTriangle size={12} />
            All changes are logged in the audit trail
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
          {error}
        </div>
      )}

      {/* Personal Information */}
      <SectionCard title="Personal Information">
        <FormField label="Given Name (Passport)" name="passportGivenName"
          value={form.passportGivenName} onChange={v => set("passportGivenName", v)} />
        <FormField label="Surname (Passport)" name="passportSurname"
          value={form.passportSurname} onChange={v => set("passportSurname", v)} />
        <FormField label="Passport Number" name="passportNumber"
          value={form.passportNumber} onChange={v => set("passportNumber", v)} />
        <FormField label="Passport Expiry" name="passportExpiry" type="date"
          value={form.passportExpiry} onChange={v => set("passportExpiry", v)} />
        <FormField label="Date of Birth" name="dateOfBirth" type="date"
          value={form.dateOfBirth} onChange={v => set("dateOfBirth", v)} />
        <SelectField label="Gender" value={form.gender}
          onChange={v => set("gender", v)}
          options={GENDER_OPTIONS.map(g => ({ value: g, label: g }))} />
        <FormField label="Nationality" name="nationality"
          value={form.nationality} onChange={v => set("nationality", v)} />
      </SectionCard>

      {/* Contact Information */}
      <SectionCard title="Contact Information">
        <FormField label="Email" name="email" type="email"
          value={form.email} onChange={v => set("email", v)} />
        <FormField label="Phone" name="phone" type="tel"
          value={form.phone} onChange={v => set("phone", v)} />
        <FormField label="City" name="addressCity"
          value={form.addressCity} onChange={v => set("addressCity", v)} />
        <FormField label="Country" name="addressCountry"
          value={form.addressCountry} onChange={v => set("addressCountry", v)} />
      </SectionCard>

      {/* Programme */}
      <SectionCard title="Programme">
        <SelectField label="Programme Level" value={form.programLevel}
          onChange={v => set("programLevel", v)} options={PROGRAM_OPTIONS} />
        <SelectField label="Scholarship Type" value={form.scholarshipType}
          onChange={v => set("scholarshipType", v)} options={SCHOLARSHIP_OPTIONS} />
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.isUrgent}
              onChange={e => set("isUrgent", e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-semibold" style={{ color: "#374151" }}>
              Mark as Urgent
              <span className="ml-1.5 text-xs font-normal" style={{ color: "#94A3B8" }}>
                (shows red dot in queue)
              </span>
            </span>
          </label>
        </div>
      </SectionCard>

      {/* Actions */}
      <div className="flex items-center gap-3 justify-end">
        <Link
          href={`/staff/applications/${applicationId}`}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: "#E2E8F0", color: "#64748B" }}
        >
          Cancel
        </Link>
        <button
          onClick={handleSave}
          disabled={saving || saved}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-70"
          style={{ backgroundColor: saved ? "#059669" : "#1B3A6B" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
