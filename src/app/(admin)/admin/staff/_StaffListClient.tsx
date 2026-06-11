"use client";

import { useState } from "react";
import {
  UserCheck, Plus, Eye, EyeOff, Loader2, Trash2, ChevronDown, CheckCircle2,
} from "lucide-react";

type StaffMember = {
  staffId: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  staffRole: string;
  isActive: boolean;
  userIsActive: boolean;
  createdAt: string;
  applicationCount: number;
};

const STAFF_ROLE_LABELS: Record<string, string> = {
  admin: "Admin",
  application_manager: "Application Manager",
  content_manager: "Content Manager",
  support_agent: "Support Agent",
  finance: "Finance",
};

const STAFF_ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  admin:               { bg: "#FEE2E2", color: "#991B1B" },
  application_manager: { bg: "#DBEAFE", color: "#1E40AF" },
  content_manager:     { bg: "#F5F3FF", color: "#5B21B6" },
  support_agent:       { bg: "#DCFCE7", color: "#166534" },
  finance:             { bg: "#FEF9C3", color: "#854D0E" },
};

const STAFF_ROLES = Object.keys(STAFF_ROLE_LABELS) as (keyof typeof STAFF_ROLE_LABELS)[];

export default function StaffListClient({
  staffMembers: initial,
  isAdmin,
}: {
  staffMembers: StaffMember[];
  isAdmin: boolean;
}) {
  const [members, setMembers] = useState(initial);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", staffRole: "support_agent",
  });
  const [creating, setSaving] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<string | null>(null);
  const [editRole, setEditRole] = useState("");
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  function showToast(msg: string, ok = true) {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.email || !form.firstName || !form.lastName || !form.password) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create");
      setMembers(prev => [data.staff, ...prev]);
      setForm({ firstName: "", lastName: "", email: "", password: "", staffRole: "support_agent" });
      setShowCreate(false);
      showToast(`Staff account created for ${data.staff.firstName} ${data.staff.lastName}`);
    } catch (e: unknown) {
      showToast(e instanceof Error ? e.message : "Error", false);
    } finally {
      setSaving(false);
    }
  }

  async function handleToggleActive(staffId: string, userId: string, current: boolean) {
    setToggling(staffId);
    try {
      const res = await fetch(`/api/admin/staff/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (!res.ok) throw new Error("Failed");
      setMembers(prev => prev.map(m =>
        m.staffId === staffId ? { ...m, isActive: !current, userIsActive: !current } : m
      ));
      showToast(!current ? "Staff activated — can now log in" : "Staff deactivated — login blocked");
    } catch {
      showToast("Failed to update", false);
    } finally {
      setToggling(null);
    }
  }

  async function handleSaveRole(staffId: string) {
    try {
      const res = await fetch(`/api/admin/staff/${staffId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ staffRole: editRole }),
      });
      if (!res.ok) throw new Error("Failed");
      setMembers(prev => prev.map(m => m.staffId === staffId ? { ...m, staffRole: editRole } : m));
      setEditingRole(null);
      showToast("Role updated");
    } catch {
      showToast("Failed to update role", false);
    }
  }

  async function handleDelete(staffId: string, name: string) {
    if (!confirm(`Deactivate ${name}? They will no longer be able to log in.`)) return;
    setDeleting(staffId);
    try {
      const res = await fetch(`/api/admin/staff/${staffId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed");
      setMembers(prev => prev.map(m => m.staffId === staffId ? { ...m, isActive: false, userIsActive: false } : m));
      showToast(`${name} deactivated`);
    } catch {
      showToast("Failed", false);
    } finally {
      setDeleting(null);
    }
  }

  const activeCount = members.filter(m => m.isActive && m.userIsActive).length;
  const totalApps = members.reduce((s, m) => s + m.applicationCount, 0);

  return (
    <div className="max-w-[1000px] mx-auto space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-semibold text-white shadow-lg"
          style={{ backgroundColor: toast.ok ? "#166534" : "#C8102E" }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Staff</h1>
          <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
            {activeCount} active · {members.length} total
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowCreate(v => !v)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#C8102E" }}
          >
            <Plus size={15} />
            Add Staff Member
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-3">
        {[
          { label: "Active Staff", value: activeCount, color: "#166534", bg: "#DCFCE7" },
          { label: "Applications Handled", value: totalApps, color: "#1E40AF", bg: "#DBEAFE" },
          { label: "Avg per Staff", value: activeCount > 0 ? Math.round(totalApps / activeCount) : 0, color: "#5B21B6", bg: "#F5F3FF" },
        ].map(c => (
          <div key={c.label} className="bg-white rounded-2xl border p-5 text-center" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-3xl font-black" style={{ color: c.color }}>{c.value}</p>
            <p className="text-xs font-semibold mt-1" style={{ color: "#64748B" }}>{c.label}</p>
          </div>
        ))}
      </div>

      {/* Create form */}
      {showCreate && isAdmin && (
        <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
          <p className="text-sm font-bold" style={{ color: "#0A1628" }}>Add New Staff Member</p>
          <p className="text-xs" style={{ color: "#94A3B8" }}>
            Creates a staff account directly. Share the email + password with the team member. They can change their password after signing in.
          </p>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>First Name *</label>
                <input
                  type="text" required
                  value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: "#E2E8F0" }}
                  placeholder="Li"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Last Name *</label>
                <input
                  type="text" required
                  value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: "#E2E8F0" }}
                  placeholder="Wei"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Email *</label>
                <input
                  type="email" required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: "#E2E8F0" }}
                  placeholder="liwei@globlearnedu.com"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Password *</label>
                <input
                  type="text" required minLength={8}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none"
                  style={{ borderColor: "#E2E8F0" }}
                  placeholder="Minimum 8 characters"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: "#64748B" }}>Role *</label>
                <select
                  value={form.staffRole}
                  onChange={e => setForm(f => ({ ...f, staffRole: e.target.value }))}
                  className="w-full border rounded-xl px-3 py-2.5 text-sm focus:outline-none"
                  style={{ borderColor: "#E2E8F0" }}
                >
                  {STAFF_ROLES.map(r => (
                    <option key={r} value={r}>{STAFF_ROLE_LABELS[r]}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={creating}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                style={{ backgroundColor: "#C8102E" }}
              >
                {creating ? <Loader2 size={14} className="animate-spin" /> : <UserCheck size={14} />}
                Create Account
              </button>
              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold"
                style={{ backgroundColor: "#F1F5F9", color: "#64748B" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff table */}
      {members.length === 0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center" style={{ borderColor: "#E2E8F0" }}>
          <UserCheck size={40} className="mx-auto mb-3" style={{ color: "#CBD5E1" }} />
          <p className="font-bold mb-1" style={{ color: "#1B3A6B" }}>No staff members yet</p>
          <p className="text-sm" style={{ color: "#94A3B8" }}>
            {isAdmin ? "Use the \"Add Staff Member\" button above to create the first staff account." : "No staff have been added yet."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor: "#E2E8F0" }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr style={{ borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }}>
                  {["Staff Member", "Role", "Applications", "Status", "Joined", isAdmin ? "Actions" : ""].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider" style={{ color: "#94A3B8" }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {members.map((m, i) => {
                  const active = m.isActive && m.userIsActive;
                  const roleStyle = STAFF_ROLE_COLORS[m.staffRole] ?? { bg: "#F1F5F9", color: "#64748B" };
                  const isEditingThisRole = editingRole === m.staffId;
                  return (
                    <tr
                      key={m.staffId}
                      className="transition-colors hover:bg-gray-50"
                      style={{ borderBottom: i < members.length - 1 ? "1px solid #F8FAFC" : "none" }}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0"
                            style={{ backgroundColor: active ? "#1B3A6B" : "#CBD5E1" }}
                          >
                            {(m.firstName[0] ?? "").toUpperCase()}{(m.lastName[0] ?? "").toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold" style={{ color: "#0A1628" }}>
                              {m.firstName} {m.lastName}
                            </p>
                            <p className="text-[11px] mt-0.5" style={{ color: "#94A3B8" }}>{m.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {isEditingThisRole && isAdmin ? (
                          <div className="flex items-center gap-1">
                            <select
                              value={editRole}
                              onChange={e => setEditRole(e.target.value)}
                              className="border rounded-lg px-2 py-1 text-xs focus:outline-none"
                              style={{ borderColor: "#E2E8F0" }}
                            >
                              {STAFF_ROLES.map(r => (
                                <option key={r} value={r}>{STAFF_ROLE_LABELS[r]}</option>
                              ))}
                            </select>
                            <button
                              onClick={() => handleSaveRole(m.staffId)}
                              className="text-[11px] font-bold px-2 py-1 rounded-lg text-white"
                              style={{ backgroundColor: "#1B3A6B" }}
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingRole(null)}
                              className="text-[11px] px-1 py-1 rounded-lg"
                              style={{ color: "#94A3B8" }}
                            >✕</button>
                          </div>
                        ) : (
                          <button
                            disabled={!isAdmin}
                            onClick={() => { setEditingRole(m.staffId); setEditRole(m.staffRole); }}
                            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
                            style={{ ...roleStyle, cursor: isAdmin ? "pointer" : "default" }}
                            title={isAdmin ? "Click to change role" : ""}
                          >
                            {STAFF_ROLE_LABELS[m.staffRole] ?? m.staffRole}
                            {isAdmin && <ChevronDown size={9} />}
                          </button>
                        )}
                      </td>
                      <td className="px-5 py-4 text-sm font-bold text-center" style={{ color: "#0A1628" }}>
                        {m.applicationCount}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                          style={active
                            ? { backgroundColor: "#DCFCE7", color: "#166534" }
                            : { backgroundColor: "#F1F5F9", color: "#94A3B8" }
                          }
                        >
                          {active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs" style={{ color: "#94A3B8" }}>
                        {new Date(m.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
                      </td>
                      {isAdmin && (
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleActive(m.staffId, m.userId, active)}
                              disabled={toggling === m.staffId}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100 disabled:opacity-50"
                              title={active ? "Deactivate (blocks login)" : "Activate"}
                            >
                              {toggling === m.staffId
                                ? <Loader2 size={12} className="animate-spin" style={{ color: "#94A3B8" }} />
                                : active
                                  ? <EyeOff size={13} style={{ color: "#64748B" }} />
                                  : <Eye size={13} style={{ color: "#059669" }} />
                              }
                            </button>
                            <button
                              onClick={() => handleDelete(m.staffId, `${m.firstName} ${m.lastName}`)}
                              disabled={deleting === m.staffId}
                              className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-red-50 disabled:opacity-50"
                              title="Remove staff member"
                            >
                              {deleting === m.staffId
                                ? <Loader2 size={12} className="animate-spin" style={{ color: "#C8102E" }} />
                                : <Trash2 size={13} style={{ color: "#C8102E" }} />
                              }
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 py-3 text-xs" style={{ borderTop: "1px solid #F1F5F9", backgroundColor: "#FAFAFA", color: "#94A3B8" }}>
            {members.length} staff members · Deactivated members cannot log in
          </div>
        </div>
      )}
    </div>
  );
}
