import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { partners, users, applications, payments } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { DollarSign, Users, TrendingUp, Plus } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata = { title: "Partners — Globlearn Admin" };

const ADMITTED_STATUSES = ["final_admission", "student_accepts", "service_charge_payment", "jw202_issued", "complete"];
const COMMISSION_RATE = 0.2;
const DEFAULT_SERVICE_CHARGE = 10000;

export default async function AdminPartnersPage() {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session?.user?.id || !["admin", "staff"].includes(role)) redirect("/sign-in");

  // Partners with user info
  const partnerRows = await db
    .select({
      id: partners.id,
      userId: partners.userId,
      agencyName: partners.agencyName,
      agencyCountry: partners.agencyCountry,
      isApproved: partners.isApproved,
      createdAt: partners.createdAt,
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      userIsActive: users.isActive,
    })
    .from(partners)
    .leftJoin(users, eq(partners.userId, users.id))
    .orderBy(partners.createdAt);

  if (partnerRows.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Partners</h1>
          <p className="text-sm mt-0.5 text-gray-400">No partners registered yet.</p>
        </div>
      </div>
    );
  }

  // Application stats per partner
  const appStats = await db.execute(sql`
    SELECT
      partner_id::text,
      COUNT(*)::int                                                                                        AS total,
      COUNT(*) FILTER (WHERE status IN (${sql.raw(ADMITTED_STATUSES.map(s => `'${s}'`).join(","))}))::int AS admitted
    FROM applications
    WHERE partner_id IS NOT NULL
    GROUP BY partner_id
  `);

  const appMap: Record<string, { total: number; admitted: number }> = {};
  for (const r of appStats.rows as any[]) {
    appMap[r.partner_id] = { total: r.total ?? 0, admitted: r.admitted ?? 0 };
  }

  // Commission stats per partner
  const commStats = await db.execute(sql`
    SELECT
      a.partner_id::text,
      COALESCE(SUM(p.amount) FILTER (WHERE a.service_charge_paid = TRUE), 0)::numeric AS paid_amount,
      COUNT(*) FILTER (WHERE a.service_charge_paid = TRUE)::int                        AS paid_count,
      COUNT(*) FILTER (WHERE a.service_charge_paid = FALSE
                         AND a.status IN (${sql.raw(ADMITTED_STATUSES.map(s => `'${s}'`).join(","))}))::int AS pending_count
    FROM applications a
    LEFT JOIN payments p ON p.application_id = a.id AND p.type = 'service_charge' AND p.status = 'paid'
    WHERE a.partner_id IS NOT NULL
    GROUP BY a.partner_id
  `);

  const commMap: Record<string, { paidAmount: number; paidCount: number; pendingCount: number }> = {};
  for (const r of commStats.rows as any[]) {
    commMap[r.partner_id] = {
      paidAmount: parseFloat(r.paid_amount ?? "0"),
      paidCount: r.paid_count ?? 0,
      pendingCount: r.pending_count ?? 0,
    };
  }

  const rows = partnerRows.map(p => {
    const apps = appMap[p.id] ?? { total: 0, admitted: 0 };
    const comm = commMap[p.id] ?? { paidAmount: 0, paidCount: 0, pendingCount: 0 };
    const commissionPaid = comm.paidAmount * COMMISSION_RATE;
    const commissionPending = comm.pendingCount * DEFAULT_SERVICE_CHARGE * COMMISSION_RATE;
    const displayName = p.agencyName || [p.firstName, p.lastName].filter(Boolean).join(" ") || p.email || "—";
    return {
      id: p.id,
      displayName,
      email: p.email ?? "—",
      country: p.agencyCountry ?? "—",
      isApproved: p.isApproved,
      userIsActive: p.userIsActive,
      joinedAt: p.createdAt ? new Date(p.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—",
      students: apps.total,
      admitted: apps.admitted,
      commissionPaid,
      commissionPending,
    };
  }).sort((a, b) => b.students - a.students);

  const totalStudents = rows.reduce((s, r) => s + r.students, 0);
  const totalAdmitted = rows.reduce((s, r) => s + r.admitted, 0);
  const totalCommPaid = rows.reduce((s, r) => s + r.commissionPaid, 0);
  const totalCommPending = rows.reduce((s, r) => s + r.commissionPending, 0);

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Partners</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {rows.length} registered · {rows.filter(r => r.isApproved).length} approved · commission rate 20%
          </p>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Students", value: totalStudents.toString(), icon: Users, bg: "#EEF4FF", color: "#1B3A6B" },
          { label: "Admitted", value: totalAdmitted.toString(), icon: TrendingUp, bg: "#DCFCE7", color: "#166534" },
          { label: "Commission Paid", value: `¥${Math.round(totalCommPaid).toLocaleString()}`, icon: DollarSign, bg: "#FEF9C3", color: "#854D0E" },
          { label: "Commission Pending", value: `¥${Math.round(totalCommPending).toLocaleString()}`, icon: DollarSign, bg: "#FFEDD5", color: "#9A3412" },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: card.bg }}>
                <Icon size={20} style={{ color: card.color }} />
              </div>
              <p className="text-2xl font-black" style={{ color: "#0A1628" }}>{card.value}</p>
              <p className="text-sm font-semibold mt-1" style={{ color: "#64748B" }}>{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                {["Partner", "Country", "Students", "Admitted", "Commission Paid", "Comm. Pending", "Status", "Joined"].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((p, i) => (
                <tr key={p.id} className="transition-colors hover:bg-gray-50" style={{ borderBottom: i < rows.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-sm" style={{ color: "#0A1628" }}>{p.displayName}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>{p.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>{p.country}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-center" style={{ color: "#1B3A6B" }}>{p.students}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-center" style={{ color: "#166534" }}>{p.admitted}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold" style={{ color: "#0A1628" }}>
                    ¥{Math.round(p.commissionPaid).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold" style={{ color: "#9A3412" }}>
                    ¥{Math.round(p.commissionPending).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={p.isApproved
                        ? { backgroundColor: "#DCFCE7", color: "#166534" }
                        : { backgroundColor: "#FEF9C3", color: "#854D0E" }}
                    >
                      {p.isApproved ? "Approved" : "Pending"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>{p.joinedAt}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
                <td className="px-5 py-3.5 text-xs font-bold" style={{ color: "#475569" }} colSpan={2}>Totals</td>
                <td className="px-5 py-3.5 text-sm font-black text-center" style={{ color: "#1B3A6B" }}>{totalStudents}</td>
                <td className="px-5 py-3.5 text-sm font-black text-center" style={{ color: "#166534" }}>{totalAdmitted}</td>
                <td className="px-5 py-3.5 text-xs font-black" style={{ color: "#0A1628" }}>¥{Math.round(totalCommPaid).toLocaleString()}</td>
                <td className="px-5 py-3.5 text-xs font-black" style={{ color: "#9A3412" }}>¥{Math.round(totalCommPending).toLocaleString()}</td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Commission info */}
      <div className="p-5 rounded-2xl" style={{ backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}>
        <p className="text-sm font-bold mb-2" style={{ color: "#1E40AF" }}>Commission Policy</p>
        <p className="text-sm" style={{ color: "#1E40AF" }}>
          Partners earn 20% of the Globlearn Education service fee on each admitted student. Commissions are paid within 30 days of the student&apos;s admission confirmation. Minimum payout threshold: ¥2,000.
        </p>
      </div>
    </div>
  );
}
