"use client";

import { Plus, Trash2 } from "lucide-react";
import type { FormData, AcademicEntry, WorkEntry } from "../types";
import { INPUT_CLS, LABEL_CLS, SELECT_CLS, COUNTRIES, EMPTY_ACADEMIC, EMPTY_WORK } from "../types";

type Props = { data: FormData; onChange: (u: Partial<FormData>) => void };

const DEGREES = [
  "High School Diploma / A-Levels", "Foundation / Pre-University",
  "Bachelor's Degree", "Master's Degree", "PhD / Doctorate",
  "Postgraduate Diploma", "Professional Qualification", "Other",
];

const START_YEARS = Array.from({ length: 40 }, (_, i) => String(2024 - i));
const END_YEARS = ["Expected 2026", "Expected 2027", "Expected 2028", ...Array.from({ length: 30 }, (_, i) => String(2024 - i))];
const WORK_MONTHS = [
  "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
];
const WORK_YEARS = Array.from({ length: 30 }, (_, i) => String(2024 - i));

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={LABEL_CLS}>
        {label} {required && <span style={{ color: "#C8102E" }}>*</span>}
      </label>
      {children}
    </div>
  );
}

export default function Step5Academic({ data, onChange }: Props) {
  function updateAcademic(index: number, updates: Partial<AcademicEntry>) {
    const next = data.academicHistory.map((e, i) => (i === index ? { ...e, ...updates } : e));
    onChange({ academicHistory: next });
  }

  function addAcademic() {
    if (data.academicHistory.length < 3) {
      onChange({ academicHistory: [...data.academicHistory, { ...EMPTY_ACADEMIC }] });
    }
  }

  function removeAcademic(index: number) {
    onChange({ academicHistory: data.academicHistory.filter((_, i) => i !== index) });
  }

  function updateWork(index: number, updates: Partial<WorkEntry>) {
    const next = data.workHistory.map((e, i) => (i === index ? { ...e, ...updates } : e));
    onChange({ workHistory: next });
  }

  function addWork() {
    onChange({ workHistory: [...data.workHistory, { ...EMPTY_WORK }] });
  }

  function removeWork(index: number) {
    onChange({ workHistory: data.workHistory.filter((_, i) => i !== index) });
  }

  return (
    <div>
      <h2 className="text-xl font-black mb-1" style={{ color: "#1B3A6B" }}>Academic background</h2>
      <p className="text-sm mb-8" style={{ color: "#64748B" }}>
        List your academic qualifications, most recent first. Add up to 3 entries.
      </p>

      {/* Academic history */}
      {data.academicHistory.map((entry, i) => (
        <div
          key={i}
          className="border rounded-xl p-5 mb-5"
          style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFAFA" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>
              Qualification {i + 1}
            </p>
            {i > 0 && (
              <button
                type="button"
                onClick={() => removeAcademic(i)}
                className="flex items-center gap-1 text-xs font-semibold transition-colors"
                style={{ color: "#C8102E" }}
              >
                <Trash2 size={13} />
                Remove
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Institution name" required>
              <input
                type="text"
                value={entry.institution}
                onChange={(e) => updateAcademic(i, { institution: e.target.value })}
                placeholder="e.g. Dhaka College"
                className={INPUT_CLS}
              />
            </Field>
            <Field label="Degree / qualification" required>
              <select
                value={entry.degree}
                onChange={(e) => updateAcademic(i, { degree: e.target.value })}
                className={SELECT_CLS}
              >
                <option value="">Select type</option>
                {DEGREES.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </Field>
            <Field label="Field of study" required>
              <input
                type="text"
                value={entry.field}
                onChange={(e) => updateAcademic(i, { field: e.target.value })}
                placeholder="e.g. Science / Biology"
                className={INPUT_CLS}
              />
            </Field>
            <Field label="Country" required>
              <select
                value={entry.country}
                onChange={(e) => updateAcademic(i, { country: e.target.value })}
                className={SELECT_CLS}
              >
                <option value="">Select country</option>
                {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Start year" required>
              <select
                value={entry.startYear}
                onChange={(e) => updateAcademic(i, { startYear: e.target.value })}
                className={SELECT_CLS}
              >
                <option value="">Year</option>
                {START_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <Field label="End year / expected" required>
              <select
                value={entry.endYear}
                onChange={(e) => updateAcademic(i, { endYear: e.target.value })}
                className={SELECT_CLS}
              >
                <option value="">Year</option>
                {END_YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </Field>
            <div className="sm:col-span-2">
              <Field label="Grade / GPA / Percentage" required>
                <input
                  type="text"
                  value={entry.grade}
                  onChange={(e) => updateAcademic(i, { grade: e.target.value })}
                  placeholder="e.g. 4.0 / 5.0 GPA · 85% · A"
                  className={INPUT_CLS}
                />
              </Field>
            </div>
          </div>
          <p className="text-xs mt-3" style={{ color: "#94A3B8" }}>
            Upload certificate: add in Step 8 (Documents).
          </p>
        </div>
      ))}

      {data.academicHistory.length < 3 && (
        <button
          type="button"
          onClick={addAcademic}
          className="flex items-center gap-2 text-sm font-semibold mb-8 transition-colors"
          style={{ color: "#1B3A6B" }}
        >
          <Plus size={16} />
          + Add another qualification
        </button>
      )}

      {/* Work experience */}
      <div className="border rounded-xl p-5" style={{ borderColor: "#E2E8F0" }}>
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Work experience</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className="w-10 h-5 rounded-full relative transition-colors"
              style={{ backgroundColor: data.hasWorkExperience ? "#1B3A6B" : "#CBD5E1" }}
            >
              <div
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: data.hasWorkExperience ? "calc(100% - 18px)" : "2px" }}
              />
            </div>
            <input
              type="checkbox"
              className="sr-only"
              checked={data.hasWorkExperience}
              onChange={(e) => onChange({ hasWorkExperience: e.target.checked, workHistory: e.target.checked && data.workHistory.length === 0 ? [{ ...EMPTY_WORK }] : data.workHistory })}
            />
            <span className="text-sm" style={{ color: "#475569" }}>
              {data.hasWorkExperience ? "Yes, I have work experience" : "Add work experience"}
            </span>
          </label>
        </div>

        {/* PhD research section */}
      {(data.degreeLevel === "PhD" || data.degreeLevel === "phd") && (
        <div className="border rounded-xl p-5 mb-6" style={{ borderColor: "#1B3A6B30", backgroundColor: "#EEF4FF" }}>
          <p className="text-sm font-black mb-1" style={{ color: "#1B3A6B" }}>PhD Research Details</p>
          <p className="text-xs mb-4" style={{ color: "#64748B" }}>
            Required for PhD applications. Describe your intended research area and proposal.
          </p>
          <div className="space-y-4">
            <Field label="Research area / field" required>
              <input
                type="text"
                value={data.phdResearchArea}
                onChange={(e) => onChange({ phdResearchArea: e.target.value })}
                placeholder="e.g. Artificial Intelligence, Cancer Biology, Environmental Engineering"
                className={INPUT_CLS}
              />
            </Field>
            <Field label="Research proposal / statement (brief)" required>
              <textarea
                rows={4}
                value={data.phdResearchProposal}
                onChange={(e) => onChange({ phdResearchProposal: e.target.value })}
                placeholder="Briefly describe your proposed research topic, objectives, and methodology…"
                className={INPUT_CLS}
              />
            </Field>
          </div>
        </div>
      )}

      {data.hasWorkExperience && (
          <div className="mt-5">
            {data.workHistory.map((entry, i) => (
              <div key={i} className="border rounded-xl p-4 mb-4" style={{ borderColor: "#E2E8F0", backgroundColor: "white" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Position {i + 1}</p>
                  <button type="button" onClick={() => removeWork(i)} className="text-xs font-semibold flex items-center gap-1" style={{ color: "#C8102E" }}>
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Employer name" required>
                    <input type="text" value={entry.employer} onChange={(e) => updateWork(i, { employer: e.target.value })} placeholder="Company / Organisation" className={INPUT_CLS} />
                  </Field>
                  <Field label="Job title" required>
                    <input type="text" value={entry.title} onChange={(e) => updateWork(i, { title: e.target.value })} placeholder="e.g. Research Assistant" className={INPUT_CLS} />
                  </Field>
                  <Field label="Country" required>
                    <select value={entry.country} onChange={(e) => updateWork(i, { country: e.target.value })} className={SELECT_CLS}>
                      <option value="">Select country</option>
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </Field>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Start" required>
                      <select value={entry.startDate} onChange={(e) => updateWork(i, { startDate: e.target.value })} className={SELECT_CLS}>
                        <option value="">MM/YYYY</option>
                        {WORK_YEARS.flatMap((y) => WORK_MONTHS.map((m) => `${m} ${y}`)).map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                    <Field label="End" required>
                      <select value={entry.endDate} onChange={(e) => updateWork(i, { endDate: e.target.value })} className={SELECT_CLS}>
                        <option value="">MM/YYYY</option>
                        <option value="Current">Current</option>
                        {WORK_YEARS.flatMap((y) => WORK_MONTHS.map((m) => `${m} ${y}`)).map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </Field>
                  </div>
                  <div className="sm:col-span-2">
                    <Field label="Brief description">
                      <textarea value={entry.description} onChange={(e) => updateWork(i, { description: e.target.value })} rows={2} placeholder="Briefly describe your role and responsibilities." className={INPUT_CLS} />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addWork} className="flex items-center gap-2 text-sm font-semibold" style={{ color: "#1B3A6B" }}>
              <Plus size={15} /> + Add another position
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
