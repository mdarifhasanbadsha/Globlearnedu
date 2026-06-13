"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Save, Loader2, Check, AlertTriangle,
  Plus, Trash2, ChevronDown, ChevronUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

type University = {
  universityId?: string;
  universityName?: string;
  programName?: string;
  expectedMajor?: string;
};

type AcademicRecord = {
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  country: string;
  startYear: string;
  endYear: string;
  grade: string;
};

type WorkRecord = {
  employer: string;
  jobTitle: string;
  country: string;
  startDate: string;
  endDate: string;
  description: string;
};

type InitialData = {
  passportGivenName: string;
  passportSurname: string;
  passportNumber: string;
  passportExpiry: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  religion: string;
  phone: string;
  email: string;
  addressCity: string;
  addressCountry: string;
  addressDetailed: string;
  addressPostcode: string;
  programLevel: string;
  scholarshipType: string;
  isUrgent: boolean;
  isCurrentlyInChina: boolean;
  selectedUniversities: University[];
  parentInfo: Record<string, string>;
  sponsorInfo: Record<string, string | boolean>;
  academicHistory: Array<Record<string, string>>;
  workExperience: Array<Record<string, string>>;
  englishProficiency: Record<string, string>;
  chineseProficiency: Record<string, string | boolean>;
  chinaStatus: Record<string, string>;
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
const ENGLISH_TEST_OPTIONS = ["IELTS", "TOEFL", "Duolingo", "Cambridge", "PTE", "MOI (Medium of Instruction)"];
const HSK_LEVELS = ["1", "2", "3", "4", "5", "6"];
const HSKK_LEVELS = ["Primary", "Intermediate", "Advanced"];
const INCOME_OPTIONS = [
  "Under $5,000", "$5,000–$10,000", "$10,000–$20,000",
  "$20,000–$50,000", "$50,000–$100,000", "Over $100,000",
];

function F({
  label, value, onChange, type = "text", span2 = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  type?: string; span2?: boolean;
}) {
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none"
        style={{ borderColor: "#E2E8F0", color: "#0A1628" }} />
    </div>
  );
}

function Sel({
  label, value, onChange, options, span2 = false,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[] | string[]; span2?: boolean;
}) {
  const opts = options.map(o => typeof o === "string" ? { value: o, label: o } : o);
  return (
    <div className={span2 ? "sm:col-span-2" : ""}>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none bg-white"
        style={{ borderColor: "#E2E8F0", color: "#0A1628" }}>
        <option value="">— Select —</option>
        {opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function Card({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
        style={{ borderBottom: open ? "1px solid #F1F5F9" : "none" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-left" style={{ color: "#94A3B8" }}>{title}</p>
        {open ? <ChevronUp size={14} style={{ color: "#CBD5E1" }} /> : <ChevronDown size={14} style={{ color: "#CBD5E1" }} />}
      </button>
      {open && <div className="px-5 py-5"><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{children}</div></div>}
    </div>
  );
}

function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-dashed border-2"
      style={{ borderColor: "#29ABE2", color: "#29ABE2" }}>
      <Plus size={14} />{label}
    </button>
  );
}

function RemoveBtn({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg"
      style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
      <Trash2 size={11} />Remove
    </button>
  );
}

function newAcademic(): AcademicRecord {
  return { institution: "", qualification: "", fieldOfStudy: "", country: "", startYear: "", endYear: "", grade: "" };
}
function newWork(): WorkRecord {
  return { employer: "", jobTitle: "", country: "", startDate: "", endDate: "", description: "" };
}
function newUniversity(): University {
  return { universityId: "", universityName: "", programName: "", expectedMajor: "" };
}

export default function StaffEditClient({ applicationId, applicationNumber, studentName, initialData }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  // ── Scalar fields ──
  const [passportGivenName, setPassportGivenName] = useState(initialData.passportGivenName);
  const [passportSurname, setPassportSurname] = useState(initialData.passportSurname);
  const [passportNumber, setPassportNumber] = useState(initialData.passportNumber);
  const [passportExpiry, setPassportExpiry] = useState(initialData.passportExpiry);
  const [dateOfBirth, setDateOfBirth] = useState(initialData.dateOfBirth);
  const [gender, setGender] = useState(initialData.gender);
  const [nationality, setNationality] = useState(initialData.nationality);
  const [religion, setReligion] = useState(initialData.religion);
  const [phone, setPhone] = useState(initialData.phone);
  const [email, setEmail] = useState(initialData.email);
  const [addressCity, setAddressCity] = useState(initialData.addressCity);
  const [addressCountry, setAddressCountry] = useState(initialData.addressCountry);
  const [addressDetailed, setAddressDetailed] = useState(initialData.addressDetailed);
  const [addressPostcode, setAddressPostcode] = useState(initialData.addressPostcode);
  const [programLevel, setProgramLevel] = useState(initialData.programLevel);
  const [scholarshipType, setScholarshipType] = useState(initialData.scholarshipType);
  const [isUrgent, setIsUrgent] = useState(initialData.isUrgent);
  const [isCurrentlyInChina, setIsCurrentlyInChina] = useState(initialData.isCurrentlyInChina);

  // ── University targets ──
  const [univs, setUnivs] = useState<University[]>(
    initialData.selectedUniversities.length > 0 ? initialData.selectedUniversities : []
  );

  // ── Parent info ──
  const [fatherName, setFatherName] = useState(String(initialData.parentInfo.fatherName ?? ""));
  const [fatherOccupation, setFatherOccupation] = useState(String(initialData.parentInfo.fatherOccupation ?? ""));
  const [fatherPhone, setFatherPhone] = useState(String(initialData.parentInfo.fatherPhone ?? ""));
  const [motherName, setMotherName] = useState(String(initialData.parentInfo.motherName ?? ""));
  const [motherOccupation, setMotherOccupation] = useState(String(initialData.parentInfo.motherOccupation ?? ""));
  const [motherPhone, setMotherPhone] = useState(String(initialData.parentInfo.motherPhone ?? ""));

  // ── Sponsor info ──
  const [sponsorName, setSponsorName] = useState(String(initialData.sponsorInfo.sponsorName ?? ""));
  const [sponsorRelationship, setSponsorRelationship] = useState(String(initialData.sponsorInfo.sponsorRelationship ?? ""));
  const [sponsorOccupation, setSponsorOccupation] = useState(String(initialData.sponsorInfo.sponsorOccupation ?? ""));
  const [sponsorPhone, setSponsorPhone] = useState(String(initialData.sponsorInfo.sponsorPhone ?? ""));
  const [annualIncome, setAnnualIncome] = useState(String(initialData.sponsorInfo.annualIncomeRange ?? ""));
  const [sponsorSameAsParent, setSponsorSameAsParent] = useState(
    initialData.sponsorInfo.isSameAsParent === true || initialData.sponsorInfo.isSameAsParent === "true"
  );

  // ── Academic history ──
  const [academics, setAcademics] = useState<AcademicRecord[]>(
    (initialData.academicHistory as AcademicRecord[]).length > 0
      ? (initialData.academicHistory as AcademicRecord[])
      : []
  );

  // ── Work experience ──
  const [works, setWorks] = useState<WorkRecord[]>(
    (initialData.workExperience as WorkRecord[]).length > 0
      ? (initialData.workExperience as WorkRecord[])
      : []
  );

  // ── English proficiency ──
  const [engTestType, setEngTestType] = useState(String(initialData.englishProficiency.testType ?? ""));
  const [engScore, setEngScore] = useState(String(initialData.englishProficiency.score ?? ""));
  const [engTestDate, setEngTestDate] = useState(String(initialData.englishProficiency.testDate ?? ""));
  const [engInstitution, setEngInstitution] = useState(String(initialData.englishProficiency.institution ?? ""));

  // ── Chinese proficiency ──
  const [hasHSK, setHasHSK] = useState(
    initialData.chineseProficiency.hasHSK === true || initialData.chineseProficiency.hasHSK === "true"
  );
  const [hskLevel, setHskLevel] = useState(String(initialData.chineseProficiency.hskLevel ?? ""));
  const [hskScore, setHskScore] = useState(String(initialData.chineseProficiency.hskScore ?? ""));
  const [hasHSKK, setHasHSKK] = useState(
    initialData.chineseProficiency.hasHSKK === true || initialData.chineseProficiency.hasHSKK === "true"
  );
  const [hskkLevel, setHskkLevel] = useState(String(initialData.chineseProficiency.hskkLevel ?? ""));

  // ── China status ──
  const [visaType, setVisaType] = useState(String(initialData.chinaStatus.visaType ?? ""));
  const [visaEntryDate, setVisaEntryDate] = useState(String(initialData.chinaStatus.visaEntryDate ?? ""));
  const [visaExpiryDate, setVisaExpiryDate] = useState(String(initialData.chinaStatus.visaExpiryDate ?? ""));
  const [currentUniversity, setCurrentUniversity] = useState(String(initialData.chinaStatus.currentUniversity ?? ""));
  const [currentAddress, setCurrentAddress] = useState(String(initialData.chinaStatus.currentAddress ?? ""));

  function setAcademic(i: number, field: keyof AcademicRecord, val: string) {
    setAcademics(prev => prev.map((a, idx) => idx === i ? { ...a, [field]: val } : a));
  }
  function setWork(i: number, field: keyof WorkRecord, val: string) {
    setWorks(prev => prev.map((w, idx) => idx === i ? { ...w, [field]: val } : w));
  }
  function setUniv(i: number, field: keyof University, val: string) {
    setUnivs(prev => prev.map((u, idx) => idx === i ? { ...u, [field]: val } : u));
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    try {
      const payload = {
        passportGivenName, passportSurname, passportNumber, passportExpiry,
        dateOfBirth, gender, nationality, religion,
        phone, email,
        addressCity, addressCountry, addressDetailed, addressPostcode,
        programLevel, scholarshipType, isUrgent, isCurrentlyInChina,
        selectedUniversities: univs,
        parentInfo: { fatherName, fatherOccupation, fatherPhone, motherName, motherOccupation, motherPhone },
        sponsorInfo: { isSameAsParent: sponsorSameAsParent, sponsorName, sponsorRelationship, sponsorOccupation, sponsorPhone, annualIncomeRange: annualIncome },
        academicHistory: academics,
        workExperience: works,
        englishProficiency: engTestType ? { testType: engTestType, score: engScore, testDate: engTestDate, institution: engInstitution } : {},
        chineseProficiency: { hasHSK, hskLevel, hskScore, hasHSKK, hskkLevel },
        chinaStatus: isCurrentlyInChina ? { visaType, visaEntryDate, visaExpiryDate, currentUniversity, currentAddress } : {},
      };

      const res = await fetch(`/api/staff/applications/${applicationId}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <div className="max-w-[900px] mx-auto space-y-5 pb-10">
      {/* Header */}
      <div className="flex items-start gap-3">
        <Link href={`/staff/applications/${applicationId}`}
          className="mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center border hover:bg-gray-50 flex-shrink-0"
          style={{ borderColor: "#E2E8F0" }}>
          <ArrowLeft size={14} style={{ color: "#64748B" }} />
        </Link>
        <div className="flex-1">
          <h1 className="text-xl font-black" style={{ color: "#0A1628" }}>Edit Application</h1>
          <p className="text-xs mt-0.5" style={{ color: "#64748B" }}>{studentName} · {applicationNumber}</p>
          <div className="inline-flex items-center gap-2 mt-2 rounded-xl px-3 py-2 text-xs font-semibold"
            style={{ backgroundColor: "#FEF9C3", color: "#854D0E" }}>
            <AlertTriangle size={12} />All changes are logged in the audit trail
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm font-semibold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
          {error}
        </div>
      )}

      {/* ── Step 1: Programme & Universities ── */}
      <Card title="Step 1 — Programme & University Selection">
        <Sel label="Programme Level" value={programLevel} onChange={setProgramLevel} options={PROGRAM_OPTIONS} />
        <Sel label="Scholarship Type" value={scholarshipType} onChange={setScholarshipType} options={SCHOLARSHIP_OPTIONS} />
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={isUrgent} onChange={e => setIsUrgent(e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm font-semibold" style={{ color: "#374151" }}>Mark as Urgent</span>
          </label>
        </div>
        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
              Universities & Programmes ({univs.length})
            </p>
            <AddButton label="Add University" onClick={() => setUnivs(prev => [...prev, newUniversity()])} />
          </div>
          {univs.map((u, i) => (
            <div key={i} className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black" style={{ color: "#1B3A6B" }}>University #{i + 1}</span>
                <RemoveBtn onClick={() => setUnivs(prev => prev.filter((_, idx) => idx !== i))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <F label="University Name" value={u.universityName ?? ""} onChange={v => setUniv(i, "universityName", v)} span2 />
                <F label="Programme Name" value={u.programName ?? ""} onChange={v => setUniv(i, "programName", v)} />
                <F label="Expected Major" value={u.expectedMajor ?? ""} onChange={v => setUniv(i, "expectedMajor", v)} />
              </div>
            </div>
          ))}
          {univs.length === 0 && (
            <p className="text-sm" style={{ color: "#94A3B8" }}>No universities added yet.</p>
          )}
        </div>
      </Card>

      {/* ── Step 2: Personal ── */}
      <Card title="Step 2 — Personal Information">
        <F label="Given Name (Passport)" value={passportGivenName} onChange={setPassportGivenName} />
        <F label="Surname (Passport)" value={passportSurname} onChange={setPassportSurname} />
        <F label="Passport Number" value={passportNumber} onChange={setPassportNumber} />
        <F label="Passport Expiry" value={passportExpiry} onChange={setPassportExpiry} type="date" />
        <F label="Date of Birth" value={dateOfBirth} onChange={setDateOfBirth} type="date" />
        <Sel label="Gender" value={gender} onChange={setGender} options={GENDER_OPTIONS} />
        <F label="Nationality" value={nationality} onChange={setNationality} />
        <F label="Religion" value={religion} onChange={setReligion} />
      </Card>

      {/* ── Step 3: Contact ── */}
      <Card title="Step 3 — Contact Information">
        <F label="Email" value={email} onChange={setEmail} type="email" />
        <F label="Phone" value={phone} onChange={setPhone} type="tel" />
        <F label="City" value={addressCity} onChange={setAddressCity} />
        <F label="Country" value={addressCountry} onChange={setAddressCountry} />
        <F label="Postcode / ZIP" value={addressPostcode} onChange={setAddressPostcode} />
        <F label="Detailed Address" value={addressDetailed} onChange={setAddressDetailed} span2 />
      </Card>

      {/* ── Step 4: Parents & Sponsor ── */}
      <Card title="Step 4 — Parent & Sponsor Information" defaultOpen={false}>
        <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider -mb-1" style={{ color: "#1B3A6B" }}>Father</p>
        <F label="Father's Name" value={fatherName} onChange={setFatherName} />
        <F label="Father's Occupation" value={fatherOccupation} onChange={setFatherOccupation} />
        <F label="Father's Phone" value={fatherPhone} onChange={setFatherPhone} />
        <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider mt-2 -mb-1" style={{ color: "#1B3A6B" }}>Mother</p>
        <F label="Mother's Name" value={motherName} onChange={setMotherName} />
        <F label="Mother's Occupation" value={motherOccupation} onChange={setMotherOccupation} />
        <F label="Mother's Phone" value={motherPhone} onChange={setMotherPhone} />
        <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider mt-2 -mb-1" style={{ color: "#1B3A6B" }}>Financial Guarantor / Sponsor</p>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={sponsorSameAsParent} onChange={e => setSponsorSameAsParent(e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm font-semibold" style={{ color: "#374151" }}>Sponsor is same as parent</span>
          </label>
        </div>
        {!sponsorSameAsParent && (
          <>
            <F label="Sponsor Name" value={sponsorName} onChange={setSponsorName} />
            <F label="Relationship to Applicant" value={sponsorRelationship} onChange={setSponsorRelationship} />
            <F label="Sponsor Occupation" value={sponsorOccupation} onChange={setSponsorOccupation} />
            <F label="Sponsor Phone" value={sponsorPhone} onChange={setSponsorPhone} />
            <Sel label="Annual Household Income" value={annualIncome} onChange={setAnnualIncome} options={INCOME_OPTIONS} />
          </>
        )}
      </Card>

      {/* ── Step 5: Academic History & Work ── */}
      <Card title="Step 5 — Academic History & Work Experience" defaultOpen={false}>
        <div className="sm:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
              Academic Records ({academics.length})
            </p>
            <AddButton label="Add Record" onClick={() => setAcademics(prev => [...prev, newAcademic()])} />
          </div>
          {academics.map((a, i) => (
            <div key={i} className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black" style={{ color: "#1B3A6B" }}>Academic Record #{i + 1}</span>
                <RemoveBtn onClick={() => setAcademics(prev => prev.filter((_, idx) => idx !== i))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <F label="Institution Name" value={a.institution} onChange={v => setAcademic(i, "institution", v)} span2 />
                <F label="Qualification / Degree" value={a.qualification} onChange={v => setAcademic(i, "qualification", v)} />
                <F label="Field of Study" value={a.fieldOfStudy} onChange={v => setAcademic(i, "fieldOfStudy", v)} />
                <F label="Country" value={a.country} onChange={v => setAcademic(i, "country", v)} />
                <F label="Grade / GPA" value={a.grade} onChange={v => setAcademic(i, "grade", v)} />
                <F label="Start Year" value={a.startYear} onChange={v => setAcademic(i, "startYear", v)} />
                <F label="End Year" value={a.endYear} onChange={v => setAcademic(i, "endYear", v)} />
              </div>
            </div>
          ))}
        </div>

        <div className="sm:col-span-2 space-y-3 mt-2">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
              Work Experience ({works.length})
            </p>
            <AddButton label="Add Job" onClick={() => setWorks(prev => [...prev, newWork()])} />
          </div>
          {works.map((w, i) => (
            <div key={i} className="rounded-xl p-4 space-y-3" style={{ backgroundColor: "#F8FAFC", border: "1px solid #F1F5F9" }}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black" style={{ color: "#1B3A6B" }}>Job #{i + 1}</span>
                <RemoveBtn onClick={() => setWorks(prev => prev.filter((_, idx) => idx !== i))} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <F label="Employer" value={w.employer} onChange={v => setWork(i, "employer", v)} />
                <F label="Job Title" value={w.jobTitle} onChange={v => setWork(i, "jobTitle", v)} />
                <F label="Country" value={w.country} onChange={v => setWork(i, "country", v)} />
                <F label="Start Date" value={w.startDate} onChange={v => setWork(i, "startDate", v)} type="date" />
                <F label="End Date (leave blank if current)" value={w.endDate} onChange={v => setWork(i, "endDate", v)} type="date" />
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#94A3B8" }}>Description</label>
                  <textarea value={w.description} onChange={e => setWork(i, "description", e.target.value)} rows={2}
                    className="w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none resize-none"
                    style={{ borderColor: "#E2E8F0", color: "#0A1628" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── Step 6: Language Proficiency ── */}
      <Card title="Step 6 — Language Proficiency" defaultOpen={false}>
        <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider -mb-1" style={{ color: "#1B3A6B" }}>English Proficiency</p>
        <Sel label="Test Type" value={engTestType} onChange={setEngTestType} options={ENGLISH_TEST_OPTIONS} />
        <F label="Score / Band" value={engScore} onChange={setEngScore} />
        <F label="Test Date" value={engTestDate} onChange={setEngTestDate} type="date" />
        <F label="Issuing Institution (for MOI)" value={engInstitution} onChange={setEngInstitution} />

        <p className="sm:col-span-2 text-[10px] font-bold uppercase tracking-wider mt-2 -mb-1" style={{ color: "#1B3A6B" }}>Chinese Proficiency (HSK)</p>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={hasHSK} onChange={e => setHasHSK(e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm font-semibold" style={{ color: "#374151" }}>Has HSK certificate</span>
          </label>
        </div>
        {hasHSK && (
          <>
            <Sel label="HSK Level" value={hskLevel} onChange={setHskLevel} options={HSK_LEVELS} />
            <F label="HSK Score" value={hskScore} onChange={setHskScore} />
          </>
        )}
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={hasHSKK} onChange={e => setHasHSKK(e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm font-semibold" style={{ color: "#374151" }}>Has HSKK certificate</span>
          </label>
        </div>
        {hasHSKK && (
          <Sel label="HSKK Level" value={hskkLevel} onChange={setHskkLevel} options={HSKK_LEVELS} />
        )}
      </Card>

      {/* ── Step 7: China Status ── */}
      <Card title="Step 7 — Currently in China?" defaultOpen={false}>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input type="checkbox" checked={isCurrentlyInChina} onChange={e => setIsCurrentlyInChina(e.target.checked)} className="w-4 h-4 rounded" />
            <span className="text-sm font-semibold" style={{ color: "#374151" }}>Applicant is currently in China</span>
          </label>
        </div>
        {isCurrentlyInChina && (
          <>
            <F label="Visa Type" value={visaType} onChange={setVisaType} />
            <F label="Visa Entry Date" value={visaEntryDate} onChange={setVisaEntryDate} type="date" />
            <F label="Visa Expiry Date" value={visaExpiryDate} onChange={setVisaExpiryDate} type="date" />
            <F label="Current University / Employer" value={currentUniversity} onChange={setCurrentUniversity} />
            <F label="Current Address in China" value={currentAddress} onChange={setCurrentAddress} span2 />
          </>
        )}
      </Card>

      {/* ── Save ── */}
      <div className="flex items-center gap-3 justify-end">
        <Link href={`/staff/applications/${applicationId}`}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold border"
          style={{ borderColor: "#E2E8F0", color: "#64748B" }}>
          Cancel
        </Link>
        <button onClick={handleSave} disabled={saving || saved}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-70"
          style={{ backgroundColor: saved ? "#059669" : "#1B3A6B" }}>
          {saving ? <Loader2 size={14} className="animate-spin" /> : saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "Saved!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
