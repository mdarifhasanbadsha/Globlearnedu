export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Upload, Search, FileCheck, Send, Clock, Video,
  Star, UserCheck, CreditCard, Award, ThumbsUp,
  Receipt, FileText, Trophy, Check, LogIn, ArrowLeft,
} from "lucide-react";
import { db } from "@/lib/db";
import { applications, applicationUniversities, applicationStatusHistory } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Application ${id} — Globlearn Education`,
    description: `Track your application ${id} through all 14 stages.`,
  };
}

const STATUS_STAGE: Record<string, number> = {
  submitted: 1, under_review: 2, documents_approved: 3, applied_per_university: 4,
  processing: 5, interview: 6, pre_admission: 7, student_confirms: 8,
  university_deposit: 9, final_admission: 10, student_accepts: 11,
  service_charge_payment: 12, jw202_issued: 13, complete: 14,
  withdrawn: 0, cancelled: 0,
};

type StageData = { icon: LucideIcon; name: string; desc: string; phase?: string; phaseColor?: string };

const STAGES: StageData[] = [
  { phase: "Phase 1 — Application", phaseColor: "#1B3A6B",
    icon: Upload, name: "Submitted", desc: "Your application and 500 RMB deposit have been received by Globlearn Education." },
  { icon: Search, name: "Under Review", desc: "Your documents are being reviewed by our team. We check everything before submission." },
  { icon: FileCheck, name: "Documents Approved", desc: "All your documents have been verified and approved. We are preparing your university submissions." },
  { phase: "Phase 2 — University Processing", phaseColor: "#29ABE2",
    icon: Send, name: "Applied to Universities", desc: "Globlearn Education has formally submitted your application to your chosen universities." },
  { icon: Clock, name: "Processing at University", desc: "The university admissions office is actively reviewing your file. This stage can take 2–8 weeks." },
  { icon: Video, name: "Interview (if required)", desc: "Some universities require an interview. Your advisor will send you full details." },
  { phase: "Phase 3 — Admission", phaseColor: "#92610A",
    icon: Star, name: "Pre-Admission", desc: "The university has provisionally accepted you. Final admission letter being prepared." },
  { icon: UserCheck, name: "Student Confirms", desc: "Please confirm you accept this offer. Log in to your dashboard to confirm." },
  { icon: CreditCard, name: "University Deposit (if required)", desc: "Some universities require a deposit to secure your place. Your advisor will guide you." },
  { icon: Award, name: "Final Admission Notice + JW202", desc: "You have been officially admitted. Your Admission Notice and JW202 form are ready." },
  { icon: ThumbsUp, name: "Student Accepts Offer", desc: "You have accepted your offer. Congratulations — now preparing for visa guidance." },
  { phase: "Phase 4 — Completion", phaseColor: "#166534",
    icon: Receipt, name: "Service Charge Payment", desc: "Your service charge to Globlearn Education is now due — payable only after successful admission." },
  { icon: FileText, name: "JW202 Issued (if later)", desc: "Your JW202 has been issued separately if it was delayed. This is required for visa application." },
  { icon: Trophy, name: "Complete", desc: "🎉 Congratulations! Your admission is complete. Your China journey begins." },
];

export default async function TrackDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const app = await db.query.applications.findFirst({
    where: eq(applications.applicationNumber, id.toUpperCase().trim()),
  });

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16" style={{ backgroundColor: "#F8FAFC" }}>
        <div className="max-w-md w-full bg-white rounded-2xl border p-10 text-center" style={{ borderColor: "#E2E8F0" }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#FEF2F2" }}
          >
            <Search size={28} style={{ color: "#C8102E" }} />
          </div>
          <h1 className="text-xl font-black mb-2" style={{ color: "#1B3A6B" }}>Application not found</h1>
          <p className="text-sm mb-2" style={{ color: "#64748B" }}>
            No application found with ID <strong>{id}</strong>.
          </p>
          <p className="text-sm mb-8" style={{ color: "#64748B" }}>
            Please check your Application ID or log in to your dashboard to view your application.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/track"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold border-2"
              style={{ borderColor: "#E2E8F0", color: "#1B3A6B" }}
            >
              <ArrowLeft size={14} />
              Try again
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#C8102E" }}
            >
              <LogIn size={14} />
              Login to dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentStageNum = STATUS_STAGE[app.status] ?? 1;
  const DEMO_CURRENT = currentStageNum - 1; // 0-indexed

  const submittedDate = new Date(app.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  // Fetch per-university targets and their student-visible history
  const targetRows = await db
    .select({
      id: applicationUniversities.id,
      universityName: applicationUniversities.universityName,
      programName: applicationUniversities.programName,
      targetStatus: applicationUniversities.targetStatus,
      priority: applicationUniversities.priority,
    })
    .from(applicationUniversities)
    .where(eq(applicationUniversities.applicationId, app.id))
    .orderBy(applicationUniversities.priority);

  // Fetch student-visible history events for each target
  const historyRows = await db
    .select({
      targetId: applicationStatusHistory.targetId,
      newStatus: applicationStatusHistory.newStatus,
      studentVisibleRemark: applicationStatusHistory.studentVisibleRemark,
      createdAt: applicationStatusHistory.createdAt,
    })
    .from(applicationStatusHistory)
    .where(
      and(
        eq(applicationStatusHistory.applicationId, app.id),
        eq(applicationStatusHistory.visibleToStudent, true)
      )
    )
    .orderBy(desc(applicationStatusHistory.createdAt))
    .limit(50);

  return (
    <>
      {/* Hero */}
      <section className="py-12 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-3xl mx-auto">
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 text-xs font-semibold mb-6 opacity-60 hover:opacity-100"
            style={{ color: "white" }}
          >
            <ArrowLeft size={12} /> Back to search
          </Link>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#29ABE2" }}>Application Status</p>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">{app.applicationNumber}</h1>
          <p className="text-white/60 text-sm mb-6">Submitted {submittedDate}</p>

          {/* Stage badge */}
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-xl text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
          >
            <div className="text-center">
              <p className="text-2xl font-black">{currentStageNum > 0 ? currentStageNum : "—"}</p>
              <p className="text-[10px] font-semibold opacity-60">of 14</p>
            </div>
            <div className="w-px h-10 opacity-30" style={{ backgroundColor: "white" }} />
            <div>
              <p className="text-xs font-semibold opacity-60 mb-0.5">Current stage</p>
              <p className="text-sm font-black">{STAGES[DEMO_CURRENT]?.name ?? app.status.replace(/_/g, " ")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 14-stage stepper */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#C8102E" }}>Application Pipeline</p>
          <h2 className="text-2xl font-black mb-10" style={{ color: "#1B3A6B" }}>Your 14-Stage Journey</h2>

          <div>
            {STAGES.map((stage, i) => {
              const status: "done" | "current" | "future" =
                i < DEMO_CURRENT ? "done" : i === DEMO_CURRENT ? "current" : "future";
              const Icon = stage.icon;
              const isLast = i === STAGES.length - 1;

              return (
                <div key={i}>
                  {stage.phase && (
                    <div className={`flex items-center gap-3 mb-4 ${i > 0 ? "mt-8" : ""}`}>
                      <span
                        className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-white"
                        style={{ backgroundColor: stage.phaseColor }}
                      >
                        {stage.phase}
                      </span>
                      <div className="flex-1 h-px" style={{ backgroundColor: `${stage.phaseColor}30` }} />
                    </div>
                  )}

                  <div className="flex gap-4 items-stretch">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="relative">
                        {status === "done" && (
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#16A34A" }}>
                            <Check size={16} color="white" strokeWidth={3} />
                          </div>
                        )}
                        {status === "current" && (
                          <div className="relative w-9 h-9 flex items-center justify-center">
                            <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "#29ABE220" }} />
                            <div className="w-9 h-9 rounded-full flex items-center justify-center relative z-10" style={{ backgroundColor: "#1B3A6B" }}>
                              <Icon size={17} color="white" />
                            </div>
                          </div>
                        )}
                        {status === "future" && (
                          <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F3F4F6" }}>
                            <Icon size={17} color="#9CA3AF" />
                          </div>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 min-h-[2rem] mt-1"
                          style={{ backgroundColor: i < DEMO_CURRENT ? "#16A34A40" : "#E5E7EB" }}
                        />
                      )}
                    </div>

                    <div className={`flex-1 pb-5 ${isLast ? "pb-0" : ""}`}>
                      {status === "current" ? (
                        <div className="rounded-xl border-2 p-4 mb-1" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B" }}>
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: "#29ABE2" }}
                            >
                              You are here
                            </span>
                            <span className="text-[10px] font-semibold" style={{ color: "rgba(27,58,107,0.6)" }}>
                              Stage {i + 1} of {STAGES.length}
                            </span>
                          </div>
                          <p className="font-black text-sm mb-1" style={{ color: "#1B3A6B" }}>{stage.name}</p>
                          <p className="text-xs leading-relaxed" style={{ color: "rgba(27,58,107,0.7)" }}>{stage.desc}</p>
                        </div>
                      ) : (
                        <div className="pt-1.5">
                          <p className="font-bold text-sm leading-snug mb-0.5" style={{ color: status === "done" ? "#1B3A6B" : "#9CA3AF" }}>
                            <span className="font-normal text-[11px] mr-1" style={{ color: status === "done" ? "#16A34A" : "#D1D5DB" }}>
                              {i + 1}.
                            </span>
                            {stage.name}
                          </p>
                          <p className="text-xs leading-relaxed" style={{ color: status === "done" ? "#6B7280" : "#D1D5DB" }}>
                            {stage.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* University Targets (J1) */}
          {targetRows.length > 0 && (
            <div className="mt-12">
              <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#29ABE2" }}>University Applications</p>
              <h2 className="text-xl font-black mb-6" style={{ color: "#1B3A6B" }}>Your University Targets</h2>
              <div className="space-y-4">
                {targetRows.map(target => {
                  const history = historyRows.filter(h => h.targetId === target.id);
                  const statusLabels: Record<string, { label: string; bg: string; color: string }> = {
                    pending:          { label: "Pending Submission", bg: "#F1F5F9", color: "#475569" },
                    applied:          { label: "Submitted to University", bg: "#DBEAFE", color: "#1E40AF" },
                    pre_admission:    { label: "Pre-Admission Offer", bg: "#FEF3C7", color: "#92400E" },
                    interview:        { label: "Interview Scheduled", bg: "#FCE7F3", color: "#9D174D" },
                    admission_notice: { label: "Admission Notice Received", bg: "#D1FAE5", color: "#065F46" },
                    final_admission:  { label: "Final Admission", bg: "#DCFCE7", color: "#166534" },
                    rejected:         { label: "Not Accepted", bg: "#FEE2E2", color: "#991B1B" },
                    deferred:         { label: "Deferred", bg: "#FFEDD5", color: "#9A3412" },
                    withdrawn:        { label: "Withdrawn", bg: "#F8FAFC", color: "#94A3B8" },
                  };
                  const st = statusLabels[target.targetStatus] ?? statusLabels["pending"];
                  return (
                    <div key={target.id} className="rounded-xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
                      <div className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: "#FAFAFA", borderBottom: "1px solid #F1F5F9" }}>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[10px] font-black px-1.5 py-0.5 rounded" style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}>
                            #{target.priority}
                          </span>
                          <div>
                            <p className="text-sm font-bold" style={{ color: "#0A1628" }}>{target.universityName ?? "—"}</p>
                            {target.programName && (
                              <p className="text-[11px]" style={{ color: "#64748B" }}>{target.programName}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: st.bg, color: st.color }}>
                          {st.label}
                        </span>
                      </div>
                      {history.length > 0 && (
                        <div className="px-4 py-3 space-y-2">
                          {history.slice(0, 3).map((h, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: "#29ABE2" }} />
                              <div>
                                <p className="text-xs font-semibold" style={{ color: "#1B3A6B" }}>
                                  {(statusLabels[h.newStatus] ?? { label: h.newStatus }).label}
                                </p>
                                {h.studentVisibleRemark && (
                                  <p className="text-[11px] mt-0.5" style={{ color: "#64748B" }}>{h.studentVisibleRemark}</p>
                                )}
                                <p className="text-[10px] mt-0.5" style={{ color: "#94A3B8" }}>
                                  {new Date(h.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Dashboard CTA */}
          <div className="mt-10 rounded-2xl p-6 text-center border" style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}>
            <p className="text-sm font-semibold mb-1" style={{ color: "#1B3A6B" }}>Manage your application</p>
            <p className="text-xs mb-5" style={{ color: "#6B7280" }}>
              Log in to upload documents, view advisor messages, and receive real-time updates.
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-white rounded-lg transition-colors"
              style={{ backgroundColor: "#C8102E" }}
            >
              <LogIn size={16} />
              Log in to your dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
