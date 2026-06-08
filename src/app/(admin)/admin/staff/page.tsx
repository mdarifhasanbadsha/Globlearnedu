"use client";

import { useState } from "react";
import { UserCheck, Plus, Mail, CheckCircle2 } from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  email: string;
  role: string;
  applications: number;
  status: "Active" | "Inactive";
  joined: string;
}

const MOCK_STAFF: StaffMember[] = [
  { id: 1, name: "Li Wei",          email: "liwei@globlearnedu.com",   role: "Senior Counselor",    applications: 45, status: "Active",   joined: "2024-03-01" },
  { id: 2, name: "Fatima Malik",    email: "fatima@globlearnedu.com",  role: "Admission Reviewer",  applications: 38, status: "Active",   joined: "2024-06-15" },
  { id: 3, name: "James Okonkwo",   email: "james@globlearnedu.com",   role: "Student Support",     applications: 22, status: "Active",   joined: "2025-01-10" },
  { id: 4, name: "Priya Nair",      email: "priya@globlearnedu.com",   role: "Visa Coordinator",    applications: 31, status: "Active",   joined: "2025-03-20" },
  { id: 5, name: "Chen Jianming",   email: "chen@globlearnedu.com",    role: "University Liaison",  applications: 0,  status: "Inactive", joined: "2023-09-01" },
];

const ROLES = ["Senior Counselor", "Admission Reviewer", "Student Support", "Visa Coordinator", "University Liaison", "Manager"];

export default function AdminStaffPage() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState(ROLES[0]);
  const [inviteSent, setInviteSent] = useState(false);

  function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteSent(true);
    setInviteEmail("");
    setTimeout(() => { setInviteSent(false); setShowInvite(false); }, 3000);
  }

  const activeCount = MOCK_STAFF.filter((s) => s.status === "Active").length;
  const totalApps = MOCK_STAFF.reduce((s, m) => s + m.applications, 0);

  return (
    <div className="max-w-[900px] mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Staff</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {activeCount} active · {MOCK_STAFF.length} total staff members
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{ backgroundColor: "#C8102E" }}
        >
          <Plus size={15} />
          Invite Staff
        </button>
      </div>

      {/* Summary row */}
      <div className="grid gap-4" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {[
          { label: "Active Staff", value: activeCount.toString(), color: "#166534", bg: "#DCFCE7" },
          { label: "Total Applications Handled", value: totalApps.toString(), color: "#1E40AF", bg: "#DBEAFE" },
          { label: "Avg per Staff", value: Math.round(totalApps / activeCount).toString(), color: "#5B21B6", bg: "#F5F3FF" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border p-5 text-center" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-3xl font-black" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: "#64748B" }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Invite panel */}
      {showInvite && (
        <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold" style={{ color: "#0A1628" }}>Invite New Staff Member</p>
          {inviteSent ? (
            <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#DCFCE7" }}>
              <CheckCircle2 size={18} style={{ color: "#166534" }} />
              <p className="text-sm font-semibold" style={{ color: "#166534" }}>
                Invitation sent to {inviteEmail}
              </p>
            </div>
          ) : (
            <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                required
                placeholder="staff@globlearnedu.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
                style={{ borderColor: "#E2E8F0" }}
              />
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none"
                style={{ borderColor: "#E2E8F0", color: "#475569" }}
              >
                {ROLES.map((r) => <option key={r}>{r}</option>)}
              </select>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2"
                  style={{ backgroundColor: "#C8102E" }}
                >
                  <Mail size={14} />
                  Send Invite
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvite(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold border"
                  style={{ borderColor: "#E2E8F0", color: "#64748B" }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {/* Staff table */}
      <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                {["Staff Member", "Role", "Applications", "Status", "Joined"].map((h) => (
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
              {MOCK_STAFF.map((member, i) => (
                <tr
                  key={member.id}
                  className="transition-colors hover:bg-gray-50"
                  style={{ borderBottom: i < MOCK_STAFF.length - 1 ? "1px solid #F8FAFC" : "none" }}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                        style={{ backgroundColor: member.status === "Active" ? "#1B3A6B" : "#CBD5E1" }}
                      >
                        {member.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold" style={{ color: "#0A1628" }}>{member.name}</p>
                        <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "#EEF4FF", color: "#1B3A6B" }}
                    >
                      {member.role}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-center" style={{ color: "#0A1628" }}>
                    {member.applications}
                  </td>
                  <td className="px-5 py-4">
                    <span
                      className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={
                        member.status === "Active"
                          ? { backgroundColor: "#DCFCE7", color: "#166534" }
                          : { backgroundColor: "#F1F5F9", color: "#64748B" }
                      }
                    >
                      {member.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs" style={{ color: "#94A3B8" }}>
                    {member.joined}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
