import Link from "next/link";
import { Users, CheckCircle2, Clock, DollarSign, UserPlus, ArrowRight } from "lucide-react";

const STATS = [
  { label: "Total students", value: "12", icon: Users, color: "#1B3A6B", bg: "#EEF4FF" },
  { label: "Admitted", value: "8", icon: CheckCircle2, color: "#16A34A", bg: "#F0FDF4" },
  { label: "In progress", value: "3", icon: Clock, color: "#D97706", bg: "#FFFBEB" },
  { label: "Commission earned", value: "¥16,000", icon: DollarSign, color: "#C8102E", bg: "#FEF2F2" },
];

const STATUS_STYLES: Record<string, { color: string; bg: string }> = {
  "Under Review": { color: "#D97706", bg: "#FFFBEB" },
  "Admitted": { color: "#16A34A", bg: "#F0FDF4" },
  "Processing": { color: "#29ABE2", bg: "#E0F2FE" },
  "Documents Approved": { color: "#1B3A6B", bg: "#EEF4FF" },
  "Applied": { color: "#94A3B8", bg: "#F8FAFC" },
  "Complete": { color: "#16A34A", bg: "#DCFCE7" },
};

const STUDENTS = [
  { name: "Rahima Hossain", country: "🇧🇩 Bangladesh", program: "MBBS", university: "Wuhan University", status: "Under Review" },
  { name: "Kwame Asante", country: "🇬🇭 Ghana", program: "Engineering", university: "Peking University", status: "Admitted" },
  { name: "Amara Mensah", country: "🇳🇬 Nigeria", program: "Computer Science", university: "Jilin University", status: "Processing" },
  { name: "Sunita Patel", country: "🇮🇳 India", program: "MBA", university: "Fudan University", status: "Documents Approved" },
  { name: "Ahmed Khan", country: "🇵🇰 Pakistan", program: "MBBS", university: "Sichuan University", status: "Applied" },
  { name: "Maria Santos", country: "🇵🇭 Philippines", program: "Language", university: "Wuhan University", status: "Complete" },
];

export default function PartnerDashboard() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>
            Partner Dashboard
          </h1>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Welcome back — here&apos;s your student overview for June 2026.
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
        {STATS.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="rounded-2xl p-5 border"
              style={{ backgroundColor: stat.bg, borderColor: stat.color + "30" }}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: stat.color }}>
                  {stat.label}
                </p>
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: stat.color + "20" }}
                >
                  <Icon size={15} style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-black" style={{ color: stat.color }}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
        {/* Students table */}
        <div className="bg-white border rounded-2xl overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b" style={{ borderColor: "#F1F5F9" }}>
            <p className="text-sm font-black" style={{ color: "#1B3A6B" }}>
              Recent students
            </p>
            <Link
              href="/partner/students"
              className="flex items-center gap-1.5 text-xs font-semibold"
              style={{ color: "#C8102E" }}
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9" }}>
                  {["Student", "Country", "Program", "University", "Status"].map((h) => (
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
                {STUDENTS.map((s) => {
                  const style = STATUS_STYLES[s.status] ?? { color: "#64748B", bg: "#F8FAFC" };
                  return (
                    <tr
                      key={s.name}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: "1px solid #F8FAFC" }}
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold" style={{ color: "#1B3A6B" }}>
                          {s.name}
                        </p>
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>
                        {s.country}
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>
                        {s.program}
                      </td>
                      <td className="px-5 py-3.5 text-sm" style={{ color: "#64748B" }}>
                        {s.university}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={{ backgroundColor: style.bg, color: style.color }}
                        >
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commission summary */}
        <div className="space-y-4">
          <div className="bg-white border rounded-2xl p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-sm font-black mb-4" style={{ color: "#1B3A6B" }}>
              Commission summary
            </p>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                <p className="text-xs" style={{ color: "#64748B" }}>Commission rate</p>
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>20%</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                <p className="text-xs" style={{ color: "#64748B" }}>Total paid</p>
                <p className="text-sm font-black" style={{ color: "#16A34A" }}>¥12,000</p>
              </div>
              <div className="flex justify-between items-center pb-3 border-b" style={{ borderColor: "#F1F5F9" }}>
                <p className="text-xs" style={{ color: "#64748B" }}>Pending</p>
                <p className="text-sm font-black" style={{ color: "#D97706" }}>¥4,000</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold" style={{ color: "#1B3A6B" }}>Total earned</p>
                <p className="text-base font-black" style={{ color: "#1B3A6B" }}>¥16,000</p>
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

          {/* Quick add */}
          <div
            className="rounded-2xl p-5 text-center border"
            style={{ backgroundColor: "#FEF2F2", borderColor: "#C8102E20" }}
          >
            <p className="text-sm font-bold mb-1" style={{ color: "#1B3A6B" }}>
              Refer a new student
            </p>
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
