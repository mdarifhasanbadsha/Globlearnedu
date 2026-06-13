export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import {
  applications, users,
  applicationUniversities, applicationStatusHistory,
  applicationEditLogs, emailLogs, modificationRequests,
} from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import {
  ArrowLeft, User, BookOpen, Building2, History,
  Edit3, Mail, AlertCircle, ChevronRight, Download, ExternalLink,
} from "lucide-react";

const DOC_LABELS: Record<string, string> = {
  passport: "Passport Copy", photo: "Passport Photo",
  certificate: "Highest Certificate", transcript: "Academic Transcript",
  police: "Police Clearance", medical: "Medical Examination",
  bank: "Bank Statement", english_cert: "English Certificate",
  hsk_cert: "HSK Certificate", rec1: "Recommendation Letter 1",
  rec2: "Recommendation Letter 2", intro_video: "Self-Intro Video",
  equivalency: "Equivalency Report", visa_copy: "Visa Copy",
  enrollment: "Enrollment Letter",
};

const TARGET_STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending:          { label: "Pending",         bg: "#F1F5F9", color: "#475569" },
  applied:          { label: "Applied",          bg: "#DBEAFE", color: "#1E40AF" },
  pre_admission:    { label: "Pre-Admission",    bg: "#FEF3C7", color: "#92400E" },
  interview:        { label: "Interview",        bg: "#FCE7F3", color: "#9D174D" },
  admission_notice: { label: "Admission Notice", bg: "#D1FAE5", color: "#065F46" },
  final_admission:  { label: "Final Admission",  bg: "#DCFCE7", color: "#166534" },
  rejected:         { label: "Not Accepted",     bg: "#FEE2E2", color: "#991B1B" },
  deferred:         { label: "Deferred",         bg: "#FFEDD5", color: "#9A3412" },
  withdrawn:        { label: "Withdrawn",        bg: "#F8FAFC", color: "#94A3B8" },
};

const APP_STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  submitted:              { label: "Submitted",        bg: "#F1F5F9", color: "#475569" },
  under_review:           { label: "Under Review",     bg: "#FEF9C3", color: "#854D0E" },
  documents_approved:     { label: "Docs Approved",    bg: "#D1FAE5", color: "#065F46" },
  applied_per_university: { label: "Applied",          bg: "#DBEAFE", color: "#1E40AF" },
  processing:             { label: "Processing",       bg: "#E0E7FF", color: "#3730A3" },
  interview:              { label: "Interview",        bg: "#FCE7F3", color: "#9D174D" },
  pre_admission:          { label: "Pre-Admission",    bg: "#FEF3C7", color: "#92400E" },
  student_confirms:       { label: "Student Confirms", bg: "#D1FAE5", color: "#065F46" },
  university_deposit:     { label: "Univ. Deposit",    bg: "#FEE2E2", color: "#991B1B" },
  final_admission:        { label: "Final Admission",  bg: "#DCFCE7", color: "#166534" },
  student_accepts:        { label: "Student Accepts",  bg: "#D1FAE5", color: "#065F46" },
  service_charge_payment: { label: "Service Charge",   bg: "#FFEDD5", color: "#9A3412" },
  jw202_issued:           { label: "JW202 Issued",     bg: "#DBEAFE", color: "#1E40AF" },
  complete:               { label: "Complete",         bg: "#F0FDF4", color: "#14532D" },
  withdrawn:              { label: "Withdrawn",        bg: "#F8FAFC", color: "#94A3B8" },
  cancelled:              { label: "Cancelled",        bg: "#FEE2E2", color: "#991B1B" },
};

function fmt(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function fmtDate(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export default async function AdminAppDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (role !== "admin" && role !== "staff") notFound();

  const { id } = await params;

  const app = await db.query.applications.findFirst({
    where: eq(applications.id, id),
  });
  if (!app) notFound();

  const [student, history, editLogs, emails, modReqs] = await Promise.all([
    db.query.users.findFirst({ where: eq(users.id, app.studentId) }),
    db.select().from(applicationStatusHistory)
      .where(eq(applicationStatusHistory.applicationId, id))
      .orderBy(desc(applicationStatusHistory.createdAt)),
    db.select().from(applicationEditLogs)
      .where(eq(applicationEditLogs.applicationId, id))
      .orderBy(desc(applicationEditLogs.createdAt)),
    db.select().from(emailLogs)
      .where(eq(emailLogs.applicationId, id))
      .orderBy(desc(emailLogs.createdAt)),
    db.select().from(modificationRequests)
      .where(eq(modificationRequests.applicationId, id))
      .orderBy(desc(modificationRequests.createdAt)),
  ]);

  // Fetch workflow rows; auto-sync any JSONB unis not yet present
  let targets = await db.select().from(applicationUniversities)
    .where(eq(applicationUniversities.applicationId, id))
    .orderBy(applicationUniversities.priority);

  {
    const jsonbUnivs = (app.selectedUniversities as Array<{
      universityId?: string; universityName?: string; programName?: string; expectedMajor?: string;
    }> | null) ?? [];
    const tgtNames = new Set(targets.map(t => t.universityName?.toLowerCase()));
    const tgtIds   = new Set(targets.map(t => t.universityId).filter(Boolean));
    const toSync   = jsonbUnivs.filter(u => {
      if (u.universityId && tgtIds.has(u.universityId)) return false;
      if (u.universityName && tgtNames.has(u.universityName.toLowerCase())) return false;
      return true;
    });
    if (toSync.length > 0) {
      await db.insert(applicationUniversities).values(
        toSync.map((u, i) => ({
          applicationId: id,
          universityId: u.universityId || null,
          universityName: u.universityName ?? "Unknown University",
          programName: u.programName ?? null,
          expectedMajor: u.expectedMajor ?? u.programName ?? null,
          targetStatus: "pending" as const,
          priority: targets.length + i + 1,
          order: targets.length + i + 1,
        }))
      ).catch(() => {});
      targets = await db.select().from(applicationUniversities)
        .where(eq(applicationUniversities.applicationId, id))
        .orderBy(applicationUniversities.priority);
    }
  }

  const appStatus = APP_STATUS_CONFIG[app.status] ?? { label: app.status, bg: "#F1F5F9", color: "#475569" };
  const studentName = student
    ? `${student.firstName ?? ""} ${student.lastName ?? ""}`.trim() || student.email
    : app.passportGivenName
      ? `${app.passportGivenName} ${app.passportSurname ?? ""}`.trim()
      : "Unknown";

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back + header */}
      <div>
        <Link
          href="/admin/applications"
          className="inline-flex items-center gap-1.5 text-sm mb-3"
          style={{ color: "#64748B" }}
        >
          <ArrowLeft size={14} />
          Applications
        </Link>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>
              {app.applicationNumber}
            </h1>
            <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>{studentName}</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span
              className="text-xs font-bold px-3 py-1.5 rounded-full"
              style={{ backgroundColor: appStatus.bg, color: appStatus.color }}
            >
              {appStatus.label}
            </span>
            {app.isUrgent && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                Urgent
              </span>
            )}
            <Link
              href={`/staff/applications/${app.id}`}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              Open in Staff Portal
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column — student + app info */}
        <div className="lg:col-span-1 space-y-5">

          {/* Student info */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2 mb-4">
              <User size={15} style={{ color: "#1B3A6B" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>Student</p>
            </div>
            <div className="space-y-2">
              {[
                ["Name", studentName],
                ["Email", student?.email ?? "—"],
                ["Passport", `${app.passportGivenName ?? ""} ${app.passportSurname ?? ""}`.trim() || "—"],
                ["Passport No.", app.passportNumber ?? "—"],
                ["Passport Issue Date", app.passportIssueDate ?? "—"],
                ["Passport Expiry Date", app.passportExpiry ?? "—"],
                ["DOB", app.dateOfBirth ?? "—"],
                ["Gender", app.gender ?? "—"],
                ["Nationality", app.nationality ?? student?.country ?? "—"],
                ["Phone", app.phone ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-xs" style={{ color: "#94A3B8" }}>{k}</span>
                  <span className="text-xs font-semibold text-right" style={{ color: "#0A1628" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Programme info */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={15} style={{ color: "#1B3A6B" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>Programme</p>
            </div>
            <div className="space-y-2">
              {[
                ["Level", app.programLevel?.replace(/_/g, " ") ?? "—"],
                ["Scholarship", app.scholarshipType ?? "—"],
                ["Targets", targets.length.toString()],
                ["Mode", app.applicationMode ?? "submitted"],
                ["Deposit Paid", app.depositPaid ? "Yes" : "No"],
                ["Service Charge", app.serviceChargePaid ? "Paid" : "Pending"],
                ["Submitted", fmtDate(app.createdAt)],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-2">
                  <span className="text-xs" style={{ color: "#94A3B8" }}>{k}</span>
                  <span className="text-xs font-semibold text-right capitalize" style={{ color: "#0A1628" }}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Modification requests */}
          {modReqs.length > 0 && (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={15} style={{ color: "#D97706" }} />
                <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#D97706" }}>Modification Requests</p>
              </div>
              <div className="space-y-3">
                {modReqs.map((m) => (
                  <div key={m.id} className="rounded-xl p-3 border" style={{ borderColor: "#FDE68A", backgroundColor: "#FFFBEB" }}>
                    <p className="text-xs font-bold mb-1" style={{ color: "#92400E" }}>
                      {fmtDate(m.createdAt)} · {m.status}
                    </p>
                    <p className="text-xs" style={{ color: "#A16207" }}>{m.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column — targets + audit tabs */}
        <div className="lg:col-span-2 space-y-5">

          {/* University targets */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2 mb-4">
              <Building2 size={15} style={{ color: "#1B3A6B" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>
                University Targets ({targets.length})
              </p>
            </div>
            {targets.length === 0 ? (
              <p className="text-xs" style={{ color: "#94A3B8" }}>No targets added yet.</p>
            ) : (
              <div className="space-y-2">
                {targets.map((t, i) => {
                  const tst = TARGET_STATUS_CONFIG[t.targetStatus ?? "pending"] ?? TARGET_STATUS_CONFIG["pending"];
                  return (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-3 rounded-xl px-4 py-3 border"
                      style={{ borderColor: "#E2E8F0" }}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className="text-[10px] font-black w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}
                        >
                          {t.priority ?? i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: "#0A1628" }}>
                            {t.universityName ?? "—"}
                          </p>
                          <p className="text-[11px] truncate" style={{ color: "#94A3B8" }}>
                            {t.programName ?? t.expectedMajor ?? "—"}
                          </p>
                        </div>
                      </div>
                      <span
                        className="text-[10px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
                        style={{ backgroundColor: tst.bg, color: tst.color }}
                      >
                        {tst.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Status change history */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2 mb-4">
              <History size={15} style={{ color: "#1B3A6B" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>
                Status History ({history.length})
              </p>
            </div>
            {history.length === 0 ? (
              <p className="text-xs" style={{ color: "#94A3B8" }}>No status changes recorded.</p>
            ) : (
              <div className="relative">
                <div
                  className="absolute left-[7px] top-0 bottom-0 w-px"
                  style={{ backgroundColor: "#E2E8F0" }}
                />
                <div className="space-y-4 pl-6">
                  {history.map((h) => {
                    const tst = TARGET_STATUS_CONFIG[h.newStatus] ?? { label: h.newStatus, bg: "#F1F5F9", color: "#64748B" };
                    return (
                      <div key={h.id} className="relative">
                        <div
                          className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full border-2 border-white"
                          style={{ backgroundColor: tst.color }}
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: tst.bg, color: tst.color }}
                            >
                              {tst.label}
                            </span>
                            {!h.visibleToStudent && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: "#FEF3C7", color: "#92400E" }}>
                                Internal only
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] mt-1" style={{ color: "#64748B" }}>
                            {h.changedByStaffName ?? "Staff"} · {fmt(h.createdAt)}
                          </p>
                          {h.studentVisibleRemark && (
                            <p className="text-xs mt-1 font-medium" style={{ color: "#475569" }}>{h.studentVisibleRemark}</p>
                          )}
                          {h.internalNote && (
                            <p className="text-[11px] mt-0.5 italic" style={{ color: "#94A3B8" }}>Note: {h.internalNote}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Edit logs */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2 mb-4">
              <Edit3 size={15} style={{ color: "#1B3A6B" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>
                Field Edit Log ({editLogs.length})
              </p>
            </div>
            {editLogs.length === 0 ? (
              <p className="text-xs" style={{ color: "#94A3B8" }}>No field edits recorded.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                      {["Field", "Old Value", "New Value", "By", "When"].map((h) => (
                        <th key={h} className="px-3 py-2 text-left font-bold" style={{ color: "#94A3B8" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {editLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                        <td className="px-3 py-2 font-mono font-bold" style={{ color: "#1B3A6B" }}>
                          {log.fieldChanged}
                        </td>
                        <td className="px-3 py-2 max-w-[120px] truncate" style={{ color: "#94A3B8" }}>
                          {log.oldValue ?? "—"}
                        </td>
                        <td className="px-3 py-2 max-w-[120px] truncate font-semibold" style={{ color: "#0A1628" }}>
                          {log.newValue ?? "—"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap" style={{ color: "#64748B" }}>
                          {log.editedByStaffName ?? "Staff"}
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap" style={{ color: "#94A3B8" }}>
                          {fmt(log.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Email log */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center gap-2 mb-4">
              <Mail size={15} style={{ color: "#1B3A6B" }} />
              <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>
                Email Log ({emails.length})
              </p>
            </div>
            {emails.length === 0 ? (
              <p className="text-xs" style={{ color: "#94A3B8" }}>No emails sent yet.</p>
            ) : (
              <div className="space-y-2">
                {emails.map((e) => (
                  <div
                    key={e.id}
                    className="rounded-xl px-4 py-3 border flex items-start justify-between gap-4"
                    style={{ borderColor: "#E2E8F0", backgroundColor: e.status === "failed" ? "#FEF2F2" : "white" }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate" style={{ color: "#0A1628" }}>
                        {e.subject ?? e.templateName ?? "Email"}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>
                        To: {e.recipientEmail}
                      </p>
                      {e.errorMessage && (
                        <p className="text-[11px] mt-0.5" style={{ color: "#C8102E" }}>{e.errorMessage}</p>
                      )}
                    </div>
                    <div className="flex-shrink-0 text-right">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: e.status === "sent" ? "#D1FAE5" : "#FEE2E2",
                          color: e.status === "sent" ? "#065F46" : "#991B1B",
                        }}
                      >
                        {e.status ?? "sent"}
                      </span>
                      <p className="text-[10px] mt-1" style={{ color: "#94A3B8" }}>{fmt(e.createdAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Full student data ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Academic History */}
        {(() => {
          const academics = (app.academicHistory as Array<Record<string, unknown>>) ?? [];
          return academics.length > 0 ? (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#1B3A6B" }}>Academic History</p>
              <div className="space-y-3">
                {academics.map((h, i) => (
                  <div key={i} className="rounded-xl p-3 border" style={{ borderColor: "#F1F5F9", backgroundColor: "#F8FAFC" }}>
                    <p className="text-sm font-semibold mb-1" style={{ color: "#0A1628" }}>{String(h.institution ?? "—")}</p>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {[["Qualification", h.qualification], ["Field", h.fieldOfStudy], ["Grade", h.grade], ["Country", h.country], ["Years", `${h.startYear ?? "?"}–${h.endYear ?? "?"}`]].filter(([, v]) => v).map(([k, v]) => (
                        <div key={String(k)}><span style={{ color: "#94A3B8" }}>{String(k)}: </span><span style={{ color: "#475569" }}>{String(v)}</span></div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null;
        })()}

        {/* Language Proficiency */}
        {(() => {
          const eng = (app.englishProficiency as Record<string, unknown>) ?? {};
          const chn = (app.chineseProficiency as Record<string, unknown>) ?? {};
          return Object.keys(eng).length > 0 || Object.keys(chn).length > 0 ? (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#1B3A6B" }}>Language Proficiency</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold mb-2" style={{ color: "#29ABE2" }}>English</p>
                  {[["Test", eng.testType], ["Score", eng.score], ["Date", eng.testDate]].filter(([, v]) => v).map(([k, v]) => (
                    <div key={String(k)} className="text-xs mb-1"><span style={{ color: "#94A3B8" }}>{String(k)}: </span><span style={{ color: "#475569" }}>{String(v)}</span></div>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] font-bold mb-2" style={{ color: "#29ABE2" }}>Chinese (HSK)</p>
                  {[["Has HSK", chn.hasHSK ? "Yes" : "No"], ["Level", chn.hskLevel], ["Score", chn.hskScore]].filter(([, v]) => v && v !== "No").map(([k, v]) => (
                    <div key={String(k)} className="text-xs mb-1"><span style={{ color: "#94A3B8" }}>{String(k)}: </span><span style={{ color: "#475569" }}>{String(v)}</span></div>
                  ))}
                </div>
              </div>
            </div>
          ) : null;
        })()}

        {/* Parent & Sponsor */}
        {(() => {
          const parent = (app.parentInfo as Record<string, unknown>) ?? {};
          const sponsor = (app.sponsorInfo as Record<string, unknown>) ?? {};
          return Object.keys(parent).length > 0 ? (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#1B3A6B" }}>Parent & Sponsor</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[11px] font-bold mb-2" style={{ color: "#94A3B8" }}>Father</p>
                  {[["Name", parent.fatherName], ["Occupation", parent.fatherOccupation], ["Phone", parent.fatherPhone]].filter(([, v]) => v).map(([k, v]) => (
                    <div key={String(k)} className="text-xs mb-1"><span style={{ color: "#94A3B8" }}>{String(k)}: </span><span style={{ color: "#475569" }}>{String(v)}</span></div>
                  ))}
                </div>
                <div>
                  <p className="text-[11px] font-bold mb-2" style={{ color: "#94A3B8" }}>Mother</p>
                  {[["Name", parent.motherName], ["Occupation", parent.motherOccupation], ["Phone", parent.motherPhone]].filter(([, v]) => v).map(([k, v]) => (
                    <div key={String(k)} className="text-xs mb-1"><span style={{ color: "#94A3B8" }}>{String(k)}: </span><span style={{ color: "#475569" }}>{String(v)}</span></div>
                  ))}
                </div>
                {!sponsor.isSameAsParent && Boolean(sponsor.sponsorName) && (
                  <div className="col-span-2 pt-3 border-t" style={{ borderColor: "#F1F5F9" }}>
                    <p className="text-[11px] font-bold mb-2" style={{ color: "#94A3B8" }}>Sponsor</p>
                    {[["Name", sponsor.sponsorName], ["Relationship", sponsor.sponsorRelationship], ["Occupation", sponsor.sponsorOccupation], ["Annual Income", sponsor.annualIncomeRange]].filter(([, v]) => v).map(([k, v]) => (
                      <div key={String(k)} className="text-xs mb-1"><span style={{ color: "#94A3B8" }}>{String(k)}: </span><span style={{ color: "#475569" }}>{String(v)}</span></div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null;
        })()}

        {/* Documents */}
        {(() => {
          const docs = (app.documents as Record<string, string> | null) ?? {};
          const docEntries = Object.entries(docs).filter(([, url]) => url);
          return (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "#1B3A6B" }}>
                Documents ({docEntries.length} uploaded)
              </p>
              {docEntries.length > 0 ? (
                <div className="space-y-2">
                  {docEntries.map(([key, url]) => {
                    const isUrl = url.startsWith("http");
                    return (
                      <div key={key} className="flex items-center justify-between rounded-xl px-3 py-2.5 border"
                        style={{ borderColor: "#BBF7D0", backgroundColor: "#F0FDF4" }}>
                        <span className="text-xs font-semibold" style={{ color: "#065F46" }}>
                          {DOC_LABELS[key] ?? key.replace(/_/g, " ")}
                        </span>
                        {isUrl ? (
                          <div className="flex items-center gap-2">
                            <a href={url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1 text-[11px] font-bold" style={{ color: "#059669" }}>
                              <ExternalLink size={10} />View
                            </a>
                            <a href={url} download
                              className="flex items-center gap-1 text-[11px] font-bold" style={{ color: "#1B3A6B" }}>
                              <Download size={10} />Download
                            </a>
                          </div>
                        ) : (
                          <span className="text-[11px]" style={{ color: "#94A3B8" }}>{url}</span>
                        )}
                      </div>
                    );
                  })}
                  {Object.keys(DOC_LABELS).filter(k => !docs[k]).map(key => (
                    <div key={key} className="flex items-center gap-2 rounded-xl px-3 py-2.5 border"
                      style={{ borderColor: "#FECACA", backgroundColor: "#FEF2F2" }}>
                      <span className="text-xs font-semibold" style={{ color: "#991B1B" }}>
                        {DOC_LABELS[key]} — missing
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm" style={{ color: "#94A3B8" }}>No documents uploaded yet.</p>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
