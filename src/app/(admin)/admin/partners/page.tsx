import { DollarSign, Users, TrendingUp, Plus } from "lucide-react";

const MOCK_PARTNERS = [
  {
    id: "P001",
    name: "South Asia Study Abroad",
    email: "contact@sastudy.in",
    country: "India",
    students: 31,
    admitted: 26,
    pending: 5,
    commissionPaid: 52000,
    commissionPending: 10000,
    status: "Active",
    joined: "2023-11-05",
  },
  {
    id: "P002",
    name: "Ahmed Counseling Services",
    email: "ahmed@acservices.ng",
    country: "Nigeria",
    students: 24,
    admitted: 19,
    pending: 5,
    commissionPaid: 38000,
    commissionPending: 10000,
    status: "Active",
    joined: "2024-01-15",
  },
  {
    id: "P003",
    name: "Africa Education Hub",
    email: "info@africaedhub.gh",
    country: "Ghana",
    students: 18,
    admitted: 14,
    pending: 4,
    commissionPaid: 28000,
    commissionPending: 8000,
    status: "Active",
    joined: "2024-03-20",
  },
  {
    id: "P004",
    name: "Gulf Education Partners",
    email: "info@gulfedu.ae",
    country: "UAE",
    students: 12,
    admitted: 9,
    pending: 3,
    commissionPaid: 18000,
    commissionPending: 6000,
    status: "Active",
    joined: "2024-07-10",
  },
  {
    id: "P005",
    name: "East Africa Study Group",
    email: "info@eastudy.ke",
    country: "Kenya",
    students: 8,
    admitted: 5,
    pending: 3,
    commissionPaid: 10000,
    commissionPending: 6000,
    status: "Active",
    joined: "2025-01-22",
  },
  {
    id: "P006",
    name: "Dhaka Education Consultants",
    email: "dhaka@decons.bd",
    country: "Bangladesh",
    students: 15,
    admitted: 11,
    pending: 4,
    commissionPaid: 22000,
    commissionPending: 8000,
    status: "Pending",
    joined: "2025-04-01",
  },
];

const totalStudents = MOCK_PARTNERS.reduce((s, p) => s + p.students, 0);
const totalAdmitted = MOCK_PARTNERS.reduce((s, p) => s + p.admitted, 0);
const totalCommission = MOCK_PARTNERS.reduce((s, p) => s + p.commissionPaid, 0);
const totalPending = MOCK_PARTNERS.reduce((s, p) => s + p.commissionPending, 0);

export default function AdminPartnersPage() {
  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Partners</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {MOCK_PARTNERS.length} registered partners · commission rate 20%
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#C8102E" }}
          onClick={() => alert("Invite partner flow — connect to backend.")}
        >
          <Plus size={15} />
          Invite Partner
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
        {[
          { label: "Total Students", value: totalStudents.toString(), icon: Users, bg: "#EEF4FF", color: "#1B3A6B" },
          { label: "Admitted", value: totalAdmitted.toString(), icon: TrendingUp, bg: "#DCFCE7", color: "#166534" },
          { label: "Commission Paid", value: `¥${totalCommission.toLocaleString()}`, icon: DollarSign, bg: "#FEF9C3", color: "#854D0E" },
          { label: "Commission Pending", value: `¥${totalPending.toLocaleString()}`, icon: DollarSign, bg: "#FFEDD5", color: "#9A3412" },
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
                {["ID", "Partner", "Country", "Students", "Admitted", "Paid", "Pending", "Status", "Joined"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider"
                    style={{ color: "#94A3B8" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_PARTNERS.map((p, i) => (
                <tr
                  key={p.id}
                  className="transition-colors hover:bg-gray-50"
                  style={{ borderBottom: i < MOCK_PARTNERS.length - 1 ? "1px solid #F8FAFC" : "none" }}
                >
                  <td className="px-5 py-3.5 font-mono text-xs font-bold" style={{ color: "#94A3B8" }}>
                    {p.id}
                  </td>
                  <td className="px-5 py-3.5">
                    <p className="font-bold text-sm" style={{ color: "#0A1628" }}>{p.name}</p>
                    <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>{p.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs" style={{ color: "#64748B" }}>{p.country}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-center" style={{ color: "#1B3A6B" }}>{p.students}</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-center" style={{ color: "#166534" }}>{p.admitted}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold" style={{ color: "#0A1628" }}>
                    ¥{p.commissionPaid.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-semibold" style={{ color: "#9A3412" }}>
                    ¥{p.commissionPending.toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={
                        p.status === "Active"
                          ? { backgroundColor: "#DCFCE7", color: "#166534" }
                          : { backgroundColor: "#FEF9C3", color: "#854D0E" }
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-xs whitespace-nowrap" style={{ color: "#94A3B8" }}>{p.joined}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: "2px solid #E2E8F0", backgroundColor: "#F8FAFC" }}>
                <td className="px-5 py-3.5 text-xs font-bold" style={{ color: "#475569" }} colSpan={3}>
                  Totals
                </td>
                <td className="px-5 py-3.5 text-sm font-black text-center" style={{ color: "#1B3A6B" }}>{totalStudents}</td>
                <td className="px-5 py-3.5 text-sm font-black text-center" style={{ color: "#166534" }}>{totalAdmitted}</td>
                <td className="px-5 py-3.5 text-xs font-black" style={{ color: "#0A1628" }}>
                  ¥{totalCommission.toLocaleString()}
                </td>
                <td className="px-5 py-3.5 text-xs font-black" style={{ color: "#9A3412" }}>
                  ¥{totalPending.toLocaleString()}
                </td>
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
