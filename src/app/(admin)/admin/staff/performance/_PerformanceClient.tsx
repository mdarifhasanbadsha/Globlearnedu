"use client";

import Link from "next/link";
import { TrendingUp, Users, CheckCircle, AlertCircle, Activity, FileText, MessageSquare } from "lucide-react";

const ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  application_manager: "App Manager",
  content_manager: "Content",
  support_agent: "Support",
  finance: "Finance",
};

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  admin:               { bg: "#EDE9FE", color: "#6D28D9" },
  application_manager: { bg: "#DBEAFE", color: "#1D4ED8" },
  content_manager:     { bg: "#D1FAE5", color: "#065F46" },
  support_agent:       { bg: "#FEF3C7", color: "#92400E" },
  finance:             { bg: "#FCE7F3", color: "#9D174D" },
};

type Member = {
  staffId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  staffRole: string;
  isActive: boolean;
  joinedAt: string | null;
  total: number;
  completed: number;
  withdrawn: number;
  urgent: number;
  active: number;
  recentActivity: number;
  notesAdded: number;
  completionRate: number;
};

type Team = {
  total: number;
  completed: number;
  active: number;
  urgent: number;
  recentActivity: number;
  completionRate: number;
  activeStaff: number;
  totalStaff: number;
};

function StatCard({ label, value, sub, icon: Icon, color }: {
  label: string; value: string | number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="rounded-2xl p-5 flex items-start gap-4" style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${color}18` }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-black" style={{ color: "#1B3A6B" }}>{value}</p>
        <p className="text-xs font-semibold text-gray-500 mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function PerformanceBar({ rate, total }: { rate: number; total: number }) {
  const color = rate >= 70 ? "#059669" : rate >= 40 ? "#D97706" : total === 0 ? "#CBD5E1" : "#DC2626";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "#F1F5F9" }}>
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${Math.min(rate, 100)}%`, backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-bold w-8 text-right" style={{ color }}>{total === 0 ? "—" : `${rate}%`}</span>
    </div>
  );
}

export default function PerformanceClient({ members, team }: { members: Member[]; team: Team | null }) {
  const sorted = [...members].sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8" style={{ backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#1B3A6B" }}>Staff Performance</h1>
          <p className="text-sm text-gray-500 mt-0.5">Team workload and completion metrics</p>
        </div>
        <Link
          href="/admin/staff"
          className="px-4 py-2 rounded-xl text-sm font-semibold transition-colors"
          style={{ backgroundColor: "#1B3A6B", color: "white" }}
        >
          Manage Staff
        </Link>
      </div>

      {/* Team summary cards */}
      {team && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Active Staff" value={`${team.activeStaff}/${team.totalStaff}`} icon={Users} color="#1B3A6B" sub="team members" />
          <StatCard label="Total Applications" value={team.total} icon={FileText} color="#29ABE2" sub="all assigned" />
          <StatCard label="Completed" value={team.completed} sub={`${team.completionRate}% completion rate`} icon={CheckCircle} color="#059669" />
          <StatCard label="Urgent" value={team.urgent} icon={AlertCircle} color="#C8102E" sub="flagged applications" />
        </div>
      )}

      {/* Secondary stats */}
      {team && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Team Completion Rate</p>
            <p className="text-3xl font-black mb-2" style={{ color: team.completionRate >= 50 ? "#059669" : "#DC2626" }}>
              {team.completionRate}%
            </p>
            <PerformanceBar rate={team.completionRate} total={team.total} />
            <p className="text-xs text-gray-400 mt-2">{team.completed} of {team.total} applications completed</p>
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">Active Pipeline</p>
            <p className="text-3xl font-black mb-2" style={{ color: "#1B3A6B" }}>{team.active}</p>
            <p className="text-xs text-gray-400">applications in progress</p>
            <div className="mt-3 flex gap-3 flex-wrap">
              <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ backgroundColor: "#DBEAFE", color: "#1D4ED8" }}>
                {team.active} active
              </span>
              <span className="text-xs px-2 py-1 rounded-full font-semibold" style={{ backgroundColor: "#FEE2E2", color: "#991B1B" }}>
                {team.urgent} urgent
              </span>
            </div>
          </div>
          <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">7-Day Activity</p>
            <p className="text-3xl font-black mb-2" style={{ color: "#29ABE2" }}>{team.recentActivity}</p>
            <p className="text-xs text-gray-400">applications updated this week</p>
            <div className="mt-3">
              <Activity size={14} style={{ color: "#29ABE2", display: "inline" }} />
              <span className="text-xs text-gray-500 ml-1">across {team.activeStaff} active staff</span>
            </div>
          </div>
        </div>
      )}

      {/* Per-staff table */}
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
        <div className="px-6 py-4" style={{ borderBottom: "1px solid #F1F5F9" }}>
          <h2 className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Individual Performance</h2>
        </div>

        {sorted.length === 0 ? (
          <div className="py-16 text-center">
            <Users size={32} className="mx-auto mb-3 text-gray-300" />
            <p className="text-sm text-gray-400">No staff members yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
                  {["Staff Member", "Role", "Status", "Total", "Active", "Completed", "Urgent", "Notes", "Completion", "7d Activity"].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((m) => {
                  const name = [m.firstName, m.lastName].filter(Boolean).join(" ") || m.email;
                  const initials = ((m.firstName?.[0] ?? "") + (m.lastName?.[0] ?? "")).toUpperCase() || m.email[0].toUpperCase();
                  const roleStyle = ROLE_COLORS[m.staffRole] ?? { bg: "#F1F5F9", color: "#64748B" };

                  return (
                    <tr key={m.staffId} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: m.isActive ? "#1B3A6B" : "#CBD5E1" }}
                          >
                            {initials}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{name}</p>
                            <p className="text-xs text-gray-400">{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{ backgroundColor: roleStyle.bg, color: roleStyle.color }}
                        >
                          {ROLE_LABELS[m.staffRole] ?? m.staffRole}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={m.isActive
                            ? { backgroundColor: "#D1FAE5", color: "#065F46" }
                            : { backgroundColor: "#F1F5F9", color: "#94A3B8" }}
                        >
                          {m.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-gray-800">{m.total}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold" style={{ color: "#1D4ED8" }}>{m.active}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="font-semibold" style={{ color: "#059669" }}>{m.completed}</span>
                      </td>
                      <td className="px-4 py-3.5">
                        {m.urgent > 0
                          ? <span className="font-bold" style={{ color: "#C8102E" }}>{m.urgent}</span>
                          : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <MessageSquare size={12} style={{ color: "#64748B" }} />
                          <span className="text-gray-600">{m.notesAdded}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 min-w-[120px]">
                        <PerformanceBar rate={m.completionRate} total={m.total} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Activity size={12} style={{ color: m.recentActivity > 0 ? "#29ABE2" : "#CBD5E1" }} />
                          <span className={m.recentActivity > 0 ? "text-gray-700 font-semibold" : "text-gray-300"}>
                            {m.recentActivity}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Rank breakdown */}
      {sorted.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top performer */}
          {sorted[0] && sorted[0].total > 0 && (
            <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FFD700" }}>
                🏆 Most Applications
              </p>
              <p className="font-black text-lg" style={{ color: "#1B3A6B" }}>
                {[sorted[0].firstName, sorted[0].lastName].filter(Boolean).join(" ") || sorted[0].email}
              </p>
              <p className="text-sm text-gray-500">{sorted[0].total} assigned</p>
            </div>
          )}

          {/* Highest completion rate */}
          {(() => {
            const withApps = sorted.filter(m => m.total >= 3);
            if (!withApps.length) return null;
            const top = [...withApps].sort((a, b) => b.completionRate - a.completionRate)[0];
            return (
              <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#059669" }}>
                  ✅ Best Completion Rate
                </p>
                <p className="font-black text-lg" style={{ color: "#1B3A6B" }}>
                  {[top.firstName, top.lastName].filter(Boolean).join(" ") || top.email}
                </p>
                <p className="text-sm text-gray-500">{top.completionRate}% rate ({top.total} apps)</p>
              </div>
            );
          })()}

          {/* Most active this week */}
          {(() => {
            const active = [...sorted].sort((a, b) => b.recentActivity - a.recentActivity)[0];
            if (!active || active.recentActivity === 0) return null;
            return (
              <div className="rounded-2xl p-5" style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#29ABE2" }}>
                  ⚡ Most Active (7d)
                </p>
                <p className="font-black text-lg" style={{ color: "#1B3A6B" }}>
                  {[active.firstName, active.lastName].filter(Boolean).join(" ") || active.email}
                </p>
                <p className="text-sm text-gray-500">{active.recentActivity} updates this week</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
