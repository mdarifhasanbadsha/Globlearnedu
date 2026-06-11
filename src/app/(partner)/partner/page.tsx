import Link from "next/link";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { applications, users, partners, payments, applicationUniversities, universities } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { Users, CheckCircle2, Clock, DollarSign, UserPlus, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

const ADMITTED_STATUSES = ["final_admission", "student_accepts", "service_charge_payment", "jw202_issued", "complete"];
const INACTIVE_STATUSES = ["withdrawn", "cancelled"];
const COMMISSION_RATE = 0.2;
const DEFAULT_SERVICE_CHARGE = 10000;

const STATUS_DISPLAY: Record<string, { label: string; color: string; bg: string }> = {
  submitted:              { label: "Submitted",    color: "#475569", bg: "#F1F5F9" },
  under_review:           { label: "Under Review", color: "#D97706", bg: "#FFFBEB" },
  documents_approved:     { label: "Docs Approved",color: "#1B3A6B", bg: "#EEF4FF" },
  applied_per_university: { label: "Applied",      color: "#5B21B6", bg: "#EDE9FE" },
  processing:             { label: "Processing",   color: "#1E40AF", bg: "#DBEAFE" },
  interview:              { label: "Interview",    color: "#92400E", bg: "#FEF3C7" },
  pre_admission:          { label: "Pre-Admission",color: "#166534", bg: "#DCFCE7" },
  student_confirms:       { label: "Confirmed",    color: "#065F46", bg: "#D1FAE5" },
  university_deposit:     { label: "Uni Deposit",  color: "#9A3412", bg: "#FEE2E2" },
  final_admission:        { label: "Admitted",     color: "#14532D", bg: "#DCFCE7" },
  student_accepts:        { label: "Accepted",     color: "#14532D", bg: "#F0FDF4" },
  service_charge_payment: { label: "Svc Charge",   color: "#9A3412", bg: "#FFEDD5" },
  jw202_issued:           { label: "JW202",        color: "#6D28D9", bg: "#EDE9FE" },
  complete:               { label: "Complete",     color: "#14532D", bg: "#F0FDF4" },
  withdrawn:              { label: "Withdrawn",    color: "#991B1B", bg: "#FEE2E2" },
  cancelled:              { label: "Cancelled",    color: "#7F1D1D", bg: "#FEE2E2" },
};

const PROGRAM_LABELS: Record<string, string> = {
  mbbs: "MBBS", bachelor: "Bachelor's", master: "Master's",
  phd: "PhD", language: "Language", diploma: "Diploma",
  foundation: "Foundation", short_course: "Short Course",
};

export default async function PartnerDashboard() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "partner") redirect("/sign-in");

  const [partner] = await db
    .select({ id: partners.id })
    .from(partners)
    .where(eq(partners.userId, session.user.id))
    .limit(1);

  const monthName = new Date().toLocaleString("en-GB", { month: "long", year: "numeric" });

  if (!partner) {
    return (
      <div>
        <h1 className="text-2xl font-black mb-2" style={{ color: "#1B3A6B" }}>Partner Dashboard</h1>
        <p className="text-sm text-gray-400">Partner account pending approval.</p>
      </div>
    );
  }

  // All applications for this partner with student info + payment info
  const appRows = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      programLevel: applications.programLevel,
      nationality: applications.nationality,
      serviceChargePaid: applications.serviceChargePaid,
      createdAt: applications.createdAt,
      studentFirstName: users.firstName,
      studentLastName: users.lastName,
      studentEmail: users.email,
      studentCountry: users.country,
      paymentAmount: payments.amount,
    })
    .from(applications)
    .leftJoin(users, eq(applications.studentId, users.id))
    .leftJoin(
      payments,
      and(
        eq(payments.applicationId, applications.id),
        eq(payments.type, "service_charge"),
        eq(payments.status, "paid"),
      ),
    )
    .where(eq(applications.partnerId, partner.id))
    .orderBy(desc(applications.createdAt));

  // First university per application for recent students table
  const uniRows = await db
    .select({
      applicationId: applicationUniversities.applicationId,
      universityName: universities.nameEn,
    })
    .from(applicationUniversities)
    .leftJoin(universities, eq(applicationUniversities.universityId, universities.id))
    .where(
      sql`${applicationUniversities.applicationId} IN (
        SELECT id FROM applications WHERE partner_id = ${partner.id}
      )`,
    )
    .orderBy(applicationUniversities.order);

  const uniMap: Record<string, string> = {};
  for (const r of uniRows) {
    if (!uniMap[r.applicationId]) uniMap[r.applicationId] = r.universityName ?? "—";
  }

  // Compute stats
  const total = appRows.length;
  const admitted = appRows.filter(r => ADMITTED_STATUSES.includes(r.status)).length;
  const inProgress = appRows.filter(r => !ADMITTED_STATUSES.includes(r.status) && !INACTIVE_STATUSES.includes(r.status)).length;

  // Commission: paid = service_charge_paid apps * 20%
  let totalCommissionPaid = 0;
  let totalCommissionPending = 0;
  let paidCount = 0;
  let pendingCount = 0;
  for (const r of appRows) {
    if (INACTIVE_STATUSES.includes(r.status)) continue;
    const amount = r.paymentAmount ? parseFloat(r.paymentAmount as string) : DEFAULT_SERVICE_CHARGE;
    const commission = amount * COMMISSION_RATE;
    if (r.serviceChargePaid) {
      totalCommissionPaid += commission;
      paidCount++;
    } else if (ADMITTED_STATUSES.includes(r.status)) {
      totalCommissionPending += commission;
      pendingCount++;
    }
  }
  const totalCommission = totalCommissionPaid + totalCommissionPending;

  // Recent 6 for table
  const recent = appRows.slice(0, 6).map(r => ({
    id: r.id,
    studentName: [r.studentFirstName, r.studentLastName].filter(Boolean).join(" ") || r.studentEmail || "—",
    nationality: r.nationality ?? r.studentCountry ?? "—",
    programLevel: r.programLevel,
    university: uniMap[r.id] ?? "—",
    status: r.status,
  }));

  const stats = [
    { label: "Total students", value: total.toString(), icon: Users, color: "#1B3A6B", bg: "#EEF4FF" },
    { label: "Admitted", value: admitted.toString(), icon: CheckCircle2, color: "#16A34A", bg: "#F0FDF4" },
    { label: "In progress", value: inProgress.toString(), icon: Clock, color: "#D97706", bg: "#FFFBEB" },
    { label: "Commission earned", value: totalCommission > 0 ? `¥${totalCommission.toLocaleString()}` : "¥0", icon: DollarSign, color: "#C8102E", bg: "#FEF2F2" },
  ];

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>Partner Dashboard</h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Welcome back — here&apos;s your student overview for {monthName}.
          </p>
        </div>
        <Link
          href="/partner/add-student"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#C8102E" }}
        >
          <UserPlus size={15} />
          Add student
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl p-5 border" style={{ backgroundColor: stat.bg, borderColor: stat.color + "30" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: stat.color }}>{stat.label}</p>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: stat.color + "20" }}>
                  <Icon size={15} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-black" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Students table */}
        <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F1F5F9" }}>
            <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>Recent students</p>
            <Link href="/partner/students" className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: "#C8102E" }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recent.length === 0 ? (
            <div className="py-12 text-center text-sm text-gray-400">
              No students yet — add your first student to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                    {["Student", "Country", "Program", "University", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recent.map((s) => {
                    const style = STATUS_DISPLAY[s.status] ?? { label: s.status, color: "#64748B", bg: "#F8FAFC" };
                    return (
                      <tr key={s.id} className="transition-colors hover:bg-gray-50" style={{ borderBottom: "1px solid #F8FAFC" }}>
                        <td className="px-5 py-3.5">
                          <p className="text-sm font-semibold" style={{ color: "#1B3A6B" }}>{s.studentName}</p>
                        </td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>{s.nationality}</td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>
                          {PROGRAM_LABELS[s.programLevel ?? ""] ?? s.programLevel ?? "—"}
                        </td>
                        <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>{s.university}</td>
                        <td className="px-5 py-3.5">
                          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: style.bg, color: style.color }}>
                            {style.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Commission summary */}
        <div className="space-y-4">
          <div className="bg-white border rounded-2xl p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-sm font-black mb-4" style={{ color: "#1B3A6B" }}>Commission summary</p>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                <p className="text-xs" style={{ color: "#64748B" }}>Commission rate</p>
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>20%</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                <p className="text-xs" style={{ color: "#64748B" }}>Total paid</p>
                <p className="text-sm font-black" style={{ color: "#16A34A" }}>¥{totalCommissionPaid.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                <p className="text-xs" style={{ color: "#64748B" }}>Pending ({pendingCount})</p>
                <p className="text-sm font-black" style={{ color: "#D97706" }}>¥{totalCommissionPending.toLocaleString()}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold" style={{ color: "#1B3A6B" }}>Total earned</p>
                <p className="text-base font-black" style={{ color: "#1B3A6B" }}>¥{totalCommission.toLocaleString()}</p>
              </div>
            </div>
            <Link
              href="/partner/commission"
              className="flex items-center justify-center gap-1.5 mt-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              View details <ArrowRight size={13} />
            </Link>
          </div>

          <div className="rounded-2xl p-5 text-center border" style={{ backgroundColor: "#FEF2F2", borderColor: "#C8102E20" }}>
            <p className="text-sm font-bold mb-1" style={{ color: "#1B3A6B" }}>Refer a new student</p>
            <p className="text-xs mb-3" style={{ color: "#64748B" }}>
              Add a student to start earning commission on their service charge.
            </p>
            <Link
              href="/partner/add-student"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#C8102E" }}
            >
              <UserPlus size={14} />
              Add student
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
