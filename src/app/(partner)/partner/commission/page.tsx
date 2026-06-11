import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { applications, users, partners, payments, applicationUniversities, universities } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { CheckCircle2, Clock, DollarSign, MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Commissions — Partner Portal" };

const ADMITTED_STATUSES = ["final_admission", "student_accepts", "service_charge_payment", "jw202_issued", "complete"];
const COMMISSION_RATE = 0.2;
const DEFAULT_SERVICE_CHARGE = 10000;

const STATUS_STYLES = {
  paid:     { label: "Paid",     color: "#16A34A", bg: "#F0FDF4", icon: CheckCircle2 },
  pending:  { label: "Pending",  color: "#D97706", bg: "#FFFBEB", icon: Clock },
  not_due:  { label: "In Progress", color: "#64748B", bg: "#F8FAFC", icon: Clock },
};

export default async function CommissionPage() {
  const session = await auth();
  if (!session?.user?.id || (session.user as any).role !== "partner") redirect("/sign-in");

  const [partner] = await db
    .select({ id: partners.id })
    .from(partners)
    .where(eq(partners.userId, session.user.id))
    .limit(1);

  if (!partner) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center text-gray-400">
        Partner account not found.
      </div>
    );
  }

  const appRows = await db
    .select({
      id: applications.id,
      applicationNumber: applications.applicationNumber,
      status: applications.status,
      nationality: applications.nationality,
      serviceChargePaid: applications.serviceChargePaid,
      serviceChargePaidAt: applications.serviceChargePaidAt,
      completedAt: applications.completedAt,
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

  const rows = appRows
    .filter(r => !["withdrawn", "cancelled"].includes(r.status))
    .map(r => {
      const studentName =
        [r.studentFirstName, r.studentLastName].filter(Boolean).join(" ") ||
        r.studentEmail || "—";
      const serviceChargeAmount = r.paymentAmount ? parseFloat(r.paymentAmount as string) : null;
      const commissionAmount = serviceChargeAmount
        ? serviceChargeAmount * COMMISSION_RATE
        : DEFAULT_SERVICE_CHARGE * COMMISSION_RATE;
      const isPaid = r.serviceChargePaid ?? false;
      const isEstimated = !serviceChargeAmount;
      const isAdmitted = ADMITTED_STATUSES.includes(r.status);
      const commissionStatus: keyof typeof STATUS_STYLES = isPaid ? "paid" : isAdmitted ? "pending" : "not_due";
      const admittedAt = r.serviceChargePaidAt
        ? new Date(r.serviceChargePaidAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : r.completedAt
        ? new Date(r.completedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
        : "—";

      return {
        applicationNumber: r.applicationNumber,
        studentName,
        nationality: r.nationality ?? r.studentCountry ?? "—",
        university: uniMap[r.id] ?? "—",
        admittedAt,
        serviceChargeDisplay: isPaid && serviceChargeAmount ? `¥${serviceChargeAmount.toLocaleString()}` : "—",
        commissionDisplay: `¥${commissionAmount.toLocaleString()}${isEstimated && !isPaid ? " est." : ""}`,
        commissionAmount,
        commissionStatus,
        isPaid,
      };
    });

  const paidRows = rows.filter(r => r.commissionStatus === "paid");
  const pendingRows = rows.filter(r => r.commissionStatus === "pending");
  const totalPaid = paidRows.reduce((s, r) => s + r.commissionAmount, 0);
  const totalPending = pendingRows.reduce((s, r) => s + r.commissionAmount, 0);

  const waHref = `https://wa.me/8615655031556?text=${encodeURIComponent(
    "Hi! I have a question about my partner commission payment."
  )}`;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>Commissions</h1>
        <p className="text-sm" style={{ color: "#64748B" }}>Your commission history and pending payments.</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#F0FDF4", borderColor: "#16A34A30" }}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} style={{ color: "#16A34A" }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#16A34A" }}>Total paid</p>
          </div>
          <p className="text-3xl font-black" style={{ color: "#166534" }}>
            ¥{totalPaid.toLocaleString()}
          </p>
          <p className="text-xs mt-1" style={{ color: "#166534" }}>
            {paidRows.length} {paidRows.length === 1 ? "student" : "students"} admitted
          </p>
        </div>

        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#FFFBEB", borderColor: "#D9770630" }}>
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} style={{ color: "#D97706" }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#D97706" }}>Pending</p>
          </div>
          <p className="text-3xl font-black" style={{ color: "#92400E" }}>
            ¥{totalPending.toLocaleString()}
          </p>
          <p className="text-xs mt-1" style={{ color: "#92400E" }}>
            {pendingRows.length} {pendingRows.length === 1 ? "student" : "students"} in progress
          </p>
        </div>

        <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B30" }}>
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} style={{ color: "#1B3A6B" }} />
            <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "#1B3A6B" }}>Your rate</p>
          </div>
          <p className="text-3xl font-black" style={{ color: "#1B3A6B" }}>20%</p>
          <p className="text-xs mt-1" style={{ color: "#475569" }}>
            Of Globlearn Education service charge
          </p>
        </div>
      </div>

      {/* Commission table */}
      <div className="bg-white border rounded-2xl overflow-hidden mb-6" style={{ borderColor: "#E2E8F0" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}>
          <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>Commission history</p>
        </div>

        {rows.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">
            No students yet — commissions will appear here once you add students.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {["Student", "Country", "University", "Admission date", "Service charge", "Your commission", "Status"].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider whitespace-nowrap" style={{ color: "#94A3B8" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, i) => {
                  const style = STATUS_STYLES[row.commissionStatus];
                  const StatusIcon = style.icon;
                  return (
                    <tr key={i} className="transition-colors hover:bg-gray-50" style={{ borderBottom: "1px solid #F8FAFC" }}>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold whitespace-nowrap" style={{ color: "#1B3A6B" }}>{row.studentName}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{row.applicationNumber}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: "#64748B" }}>{row.nationality}</td>
                      <td className="px-5 py-3.5 text-sm whitespace-nowrap" style={{ color: "#64748B" }}>{row.university}</td>
                      <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>{row.admittedAt}</td>
                      <td className="px-5 py-3.5 text-sm font-semibold" style={{ color: "#1B3A6B" }}>{row.serviceChargeDisplay}</td>
                      <td className="px-5 py-3.5 text-sm font-black" style={{ color: row.isPaid ? "#16A34A" : "#D97706" }}>
                        {row.commissionDisplay}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: style.bg, color: style.color }}>
                          <StatusIcon size={11} />
                          {style.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr style={{ borderTop: "2px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
                  <td colSpan={5} className="px-5 py-3.5 text-sm font-black" style={{ color: "#1B3A6B" }}>Total</td>
                  <td className="px-5 py-3.5 text-base font-black" style={{ color: "#1B3A6B" }}>
                    ¥{(totalPaid + totalPending).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#94A3B8" }}>
                    ¥{totalPaid.toLocaleString()} paid · ¥{totalPending.toLocaleString()} pending
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* How it works */}
      <div className="rounded-2xl p-5 border mb-6" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
        <p className="text-xs font-bold mb-2" style={{ color: "#1B3A6B" }}>How partner commissions work</p>
        <ul className="space-y-1.5 text-xs" style={{ color: "#475569" }}>
          <li>• You earn 20% of the Globlearn Education service charge (¥10,000) — that&apos;s ¥2,000 per admitted student.</li>
          <li>• Commission is credited after the student&apos;s service charge payment is confirmed.</li>
          <li>• Pending commissions relate to students whose service charge has not yet been paid.</li>
          <li>• Payments are made monthly by bank transfer or WeChat Pay to your registered account.</li>
        </ul>
      </div>

      {/* Contact CTA */}
      <div className="rounded-2xl p-5 border text-center" style={{ borderColor: "#25D36630", backgroundColor: "#F0FDF4" }}>
        <p className="text-sm font-semibold mb-1" style={{ color: "#166534" }}>Questions about your commissions?</p>
        <p className="text-xs mb-4" style={{ color: "#64748B" }}>
          Contact our partner support team via WhatsApp for payment queries.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageSquare size={16} />
          WhatsApp partner support
        </a>
      </div>
    </div>
  );
}
