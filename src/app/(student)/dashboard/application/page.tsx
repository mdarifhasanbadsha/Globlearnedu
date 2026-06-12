export const dynamic = "force-dynamic";

import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import { ArrowRight, Clock, MessageSquare, Plus } from "lucide-react";

const TOTAL_STAGES = 14;

const STATUS_STAGE: Record<string, number> = {
  submitted: 1, under_review: 2, documents_approved: 3, applied_per_university: 4,
  processing: 5, interview: 6, pre_admission: 7, student_confirms: 8,
  university_deposit: 9, final_admission: 10, student_accepts: 11,
  service_charge_payment: 12, jw202_issued: 13, complete: 14,
  withdrawn: 0, cancelled: 0,
};

const STATUS_NAMES: Record<string, string> = {
  submitted: "Submitted", under_review: "Under Review", documents_approved: "Documents Approved",
  applied_per_university: "Applied to Universities", processing: "Processing at University",
  interview: "Interview", pre_admission: "Pre-Admission", student_confirms: "Student Confirms",
  university_deposit: "University Deposit", final_admission: "Final Admission Notice",
  student_accepts: "Student Accepts Offer", service_charge_payment: "Service Charge Payment",
  jw202_issued: "JW202 Issued", complete: "Complete", withdrawn: "Withdrawn", cancelled: "Cancelled",
};

const SCHOLARSHIP_LABELS: Record<string, string> = {
  csc: "CSC Government Scholarship", university: "University Scholarship",
  provincial: "Provincial Scholarship", self_sponsored: "Self-Sponsored",
};

const PROGRAM_LABELS: Record<string, string> = {
  mbbs: "MBBS / Medicine", bachelor: "Bachelor's Degree", master: "Master's Degree",
  phd: "PhD", language: "Chinese Language", diploma: "Diploma / Vocational",
  foundation: "Foundation / Pre-University", short_course: "Short Course / Exchange",
};

function Section({
  title, waMessage, items, actionHref, actionLabel,
}: {
  title: string;
  waMessage?: string;
  items: { label: string; value: string }[];
  actionHref?: string;
  actionLabel?: string;
}) {
  const action = waMessage ? (
    <a
      href={`https://wa.me/8615655031556?text=${encodeURIComponent(waMessage)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
      style={{ color: "#C8102E", backgroundColor: "#FEF2F2" }}
    >
      <MessageSquare size={12} />
      Request change
    </a>
  ) : actionHref ? (
    <Link
      href={actionHref}
      className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
      style={{ color: "#1B3A6B", backgroundColor: "#EEF4FF" }}
    >
      {actionLabel} <ArrowRight size={12} />
    </Link>
  ) : null;

  return (
    <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
      <div
        className="flex items-center justify-between px-5 py-4 border-b"
        style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}
      >
        <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>{title}</p>
        {action}
      </div>
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "#94A3B8" }}>
              {item.label}
            </p>
            <p className="text-sm font-medium" style={{ color: item.value ? "#1B3A6B" : "#CBD5E1" }}>
              {item.value || "—"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ApplicationPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const app = await db.query.applications.findFirst({
    where: eq(applications.studentId, session.user.id),
    orderBy: [desc(applications.createdAt)],
  });

  if (!app) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>My Application</h1>
        </div>
        <div className="bg-white border rounded-2xl p-12 text-center" style={{ borderColor: "#E2E8F0" }}>
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#EEF4FF" }}
          >
            <Plus size={28} style={{ color: "#1B3A6B" }} />
          </div>
          <p className="text-base font-bold mb-2" style={{ color: "#1B3A6B" }}>No application yet</p>
          <p className="text-sm mb-6" style={{ color: "#64748B" }}>
            You haven't submitted an application. Start one and our team will guide you through every step.
          </p>
          <Link
            href="/dashboard/apply"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white text-sm font-bold"
            style={{ backgroundColor: "#C8102E" }}
          >
            Start Application <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  const currentStage = STATUS_STAGE[app.status] ?? 1;
  const progress = currentStage > 0 ? Math.round((currentStage / TOTAL_STAGES) * 100) : 0;
  const stageName = STATUS_NAMES[app.status] ?? app.status.replace(/_/g, " ");
  const submittedDate = new Date(app.createdAt).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

  const unis = (app.selectedUniversities as { universityId: string; universityName: string; programName: string }[]) ?? [];
  const parentInfo = (app.parentInfo as Record<string, string>) ?? {};
  const sponsorInfo = (app.sponsorInfo as Record<string, string | boolean>) ?? {};
  const academics = (app.academicHistory as Record<string, string | number>[]) ?? [];
  const english = (app.englishProficiency as Record<string, string>) ?? {};
  const chinese = (app.chineseProficiency as Record<string, string | boolean | number>) ?? {};
  const docs = (app.documents as Record<string, string>) ?? {};
  const docCount = Object.values(docs).filter(Boolean).length;

  const waMsg = `Hi! I'd like to make a change to my application ${app.applicationNumber}.`;

  const firstAcademic = academics[0] ?? {};

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>My Application</h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Application — {app.applicationNumber}
        </p>
      </div>

      {/* Status banner */}
      <div
        className="rounded-2xl p-6 mb-8 text-white"
        style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0A1628 100%)" }}
      >
        <div className="flex flex-wrap items-start gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Clock size={14} style={{ opacity: 0.6 }} />
              <span className="text-xs font-semibold" style={{ opacity: 0.6 }}>
                Submitted {submittedDate}
              </span>
            </div>
            <p className="text-base font-black">{app.applicationNumber}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs font-semibold mb-0.5" style={{ opacity: 0.6 }}>Current stage</p>
            <p className="text-2xl font-black">
              {currentStage > 0 ? currentStage : "—"}
              {currentStage > 0 && (
                <span className="text-sm font-medium" style={{ opacity: 0.6 }}>{" / "}{TOTAL_STAGES}</span>
              )}
            </p>
          </div>
        </div>

        {currentStage > 0 && (
          <div className="h-2 rounded-full mb-4" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
            <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: "#FFD700" }} />
          </div>
        )}

        <p className="text-sm font-bold mb-1" style={{ color: "#FFD700" }}>
          {currentStage > 0 ? `Stage ${currentStage}: ` : ""}{stageName}
        </p>

        <div className="mt-5">
          <Link
            href={`/track/${app.applicationNumber}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-lg text-white"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          >
            View full 14-stage pipeline <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Data sections */}
      <div className="space-y-4">
        <Section
          title="Program & Universities"
          waMessage={`Hi! I'd like to request a change to my program or university selection. My application ID is ${app.applicationNumber}.`}
          items={[
            { label: "Funding type", value: SCHOLARSHIP_LABELS[app.scholarshipType] ?? app.scholarshipType ?? "" },
            { label: "Degree level", value: PROGRAM_LABELS[app.programLevel ?? ""] ?? app.programLevel ?? "" },
            ...unis.map((u, i) => ({
              label: `${["1st", "2nd", "3rd", "4th", "5th"][i] ?? `${i + 1}th`} choice`,
              value: `${u.universityName} — ${u.programName}`,
            })),
          ]}
        />

        <Section
          title="Personal Information"
          waMessage={`Hi! I'd like to update my personal information. My application ID is ${app.applicationNumber}.`}
          items={[
            { label: "Surname", value: app.passportSurname ?? "" },
            { label: "Given names", value: app.passportGivenName ?? "" },
            { label: "Date of birth", value: app.dateOfBirth ?? "" },
            { label: "Gender", value: app.gender ?? "" },
            { label: "Nationality", value: app.nationality ?? "" },
            { label: "Passport number", value: app.passportNumber ?? "" },
            { label: "Passport expiry", value: app.passportExpiry ?? "" },
            { label: "Religion", value: app.religion ?? "" },
          ]}
        />

        <Section
          title="Contact Details"
          waMessage={`Hi! I'd like to update my contact details. My application ID is ${app.applicationNumber}.`}
          items={[
            { label: "Phone / WhatsApp", value: app.phone ?? "" },
            { label: "Email", value: app.email ?? "" },
            { label: "Address", value: app.addressDetailed ?? "" },
            { label: "City", value: app.addressCity ?? "" },
            { label: "Country of residence", value: app.addressCountry ?? "" },
          ]}
        />

        <Section
          title="Family & Sponsor"
          waMessage={`Hi! I'd like to update my family or sponsor details. My application ID is ${app.applicationNumber}.`}
          items={[
            { label: "Father's name", value: parentInfo.fatherName ?? "" },
            { label: "Father's occupation", value: parentInfo.fatherOccupation ?? "" },
            { label: "Mother's name", value: parentInfo.motherName ?? "" },
            { label: "Mother's occupation", value: parentInfo.motherOccupation ?? "" },
            { label: "Sponsor", value: sponsorInfo.isSameAsParent ? "Parent" : (sponsorInfo.sponsorName as string | undefined) ?? "" },
            { label: "Annual income range", value: (sponsorInfo.annualIncomeRange as string | undefined) ?? "" },
          ]}
        />

        {academics.length > 0 && (
          <Section
            title="Academic Background"
            waMessage={`Hi! I'd like to update my academic details. My application ID is ${app.applicationNumber}.`}
            items={[
              { label: "Qualification", value: String(firstAcademic.qualification ?? "") },
              { label: "Institution", value: String(firstAcademic.institution ?? "") },
              { label: "Field of study", value: String(firstAcademic.fieldOfStudy ?? "") },
              { label: "Country", value: String(firstAcademic.country ?? "") },
              { label: "Grade / GPA", value: String(firstAcademic.grade ?? "") },
              { label: "Year completed", value: String(firstAcademic.endYear ?? "") },
            ]}
          />
        )}

        {english.testType && (
          <Section
            title="Language Proficiency"
            waMessage={`Hi! I'd like to update my language proficiency details. My application ID is ${app.applicationNumber}.`}
            items={[
              { label: "English test", value: english.testType?.toUpperCase() ?? "" },
              { label: "Score", value: english.score ?? "" },
              { label: "Test date", value: english.testDate ?? "" },
              { label: "Chinese proficiency", value: chinese.hasHSK ? `HSK Level ${chinese.hskLevel ?? ""}` : "None" },
            ]}
          />
        )}

        <Section
          title="China Status"
          waMessage={`Hi! I need to update my China status information. My application ID is ${app.applicationNumber}.`}
          items={[
            { label: "Currently in China", value: app.isCurrentlyInChina ? "Yes" : "No" },
          ]}
        />

        {/* Documents card */}
        <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div
            className="flex items-center justify-between px-5 py-4 border-b"
            style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}
          >
            <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>Documents</p>
            <Link
              href="/dashboard/documents"
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ color: "#1B3A6B", backgroundColor: "#EEF4FF" }}
            >
              Manage documents <ArrowRight size={12} />
            </Link>
          </div>
          <div className="px-5 py-5">
            {docCount > 0 ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
                  style={{ backgroundColor: "#16A34A" }}
                >
                  {docCount}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
                    {docCount} document{docCount !== 1 ? "s" : ""} uploaded
                  </p>
                  <p className="text-xs" style={{ color: "#94A3B8" }}>
                    Go to Documents to upload or manage files
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-sm" style={{ color: "#94A3B8" }}>
                No documents uploaded yet. Visit the Documents page to upload your files.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Help CTA */}
      <div
        className="mt-8 p-5 rounded-2xl border text-center"
        style={{ borderColor: "#25D36630", backgroundColor: "#F0FDF4" }}
      >
        <p className="text-sm font-semibold mb-3" style={{ color: "#166534" }}>
          Need to update something in your application?
        </p>
        <a
          href={`https://wa.me/8615655031556?text=${encodeURIComponent(waMsg)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageSquare size={16} />
          WhatsApp your advisor
        </a>
      </div>
    </div>
  );
}
