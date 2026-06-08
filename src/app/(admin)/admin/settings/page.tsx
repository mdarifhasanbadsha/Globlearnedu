"use client";

import { useState } from "react";
import { CheckCircle2, Globe, DollarSign, Bell, ChevronRight } from "lucide-react";

type Tab = "general" | "commissions" | "notifications";

const inputClass = "w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors";
const inputStyle = { borderColor: "#E2E8F0" };

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold mb-1.5" style={{ color: "#475569" }}>
        {label}
      </label>
      {children}
      {hint && <p className="text-[11px] mt-1" style={{ color: "#94A3B8" }}>{hint}</p>}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="relative flex-shrink-0 w-10 h-5 rounded-full transition-colors"
      style={{ backgroundColor: checked ? "#C8102E" : "#E2E8F0" }}
    >
      <span
        className="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform"
        style={{ transform: checked ? "translateX(20px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [saved, setSaved] = useState(false);

  // General
  const [siteName, setSiteName] = useState("Globlearn Education");
  const [contactEmail, setContactEmail] = useState("info@globlearnedu.com");
  const [whatsapp, setWhatsapp] = useState("+86 156 5503 1556");
  const [officeAddress, setOfficeAddress] = useState("Wuhan, Hubei, China");
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  // Commissions
  const [commissionRate, setCommissionRate] = useState("20");
  const [paymentTerms, setPaymentTerms] = useState("30");
  const [minPayout, setMinPayout] = useState("2000");

  // Notifications
  const [notifyNewApp, setNotifyNewApp] = useState(true);
  const [notifyAdmission, setNotifyAdmission] = useState(true);
  const [notifyPartnerJoin, setNotifyPartnerJoin] = useState(true);
  const [notifyPayment, setNotifyPayment] = useState(false);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "general", label: "General", icon: <Globe size={15} /> },
    { id: "commissions", label: "Commissions", icon: <DollarSign size={15} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={15} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          Platform configuration for Globlearn Education
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-semibold transition-all"
            style={
              activeTab === tab.id
                ? { backgroundColor: "white", color: "#0A1628", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }
                : { color: "#64748B" }
            }
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {saved && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "#DCFCE7", border: "1px solid #86EFAC" }}>
          <CheckCircle2 size={18} style={{ color: "#166534" }} />
          <p className="text-sm font-semibold" style={{ color: "#166534" }}>
            Settings saved successfully.
          </p>
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* General tab */}
        {activeTab === "general" && (
          <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
              General Settings
            </p>
            <Field label="Platform Name">
              <input className={inputClass} style={inputStyle} value={siteName} onChange={(e) => setSiteName(e.target.value)} />
            </Field>
            <Field label="Contact Email" hint="Displayed publicly on the site and used for system notifications.">
              <input type="email" className={inputClass} style={inputStyle} value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
            </Field>
            <Field label="Support WhatsApp Number" hint="Format: +country code + number. Used for WA deep links.">
              <input className={inputClass} style={inputStyle} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
            </Field>
            <Field label="Office Address">
              <input className={inputClass} style={inputStyle} value={officeAddress} onChange={(e) => setOfficeAddress(e.target.value)} />
            </Field>

            {/* Maintenance mode */}
            <div
              className="flex items-center justify-between p-4 rounded-xl"
              style={{ backgroundColor: maintenanceMode ? "#FEF2F2" : "#F8FAFC", border: `1px solid ${maintenanceMode ? "#FECACA" : "#E2E8F0"}` }}
            >
              <div>
                <p className="text-sm font-bold" style={{ color: maintenanceMode ? "#991B1B" : "#0A1628" }}>
                  Maintenance Mode
                </p>
                <p className="text-xs mt-0.5" style={{ color: maintenanceMode ? "#DC2626" : "#94A3B8" }}>
                  {maintenanceMode ? "Site is offline — only admins can access." : "Site is live and accessible to all visitors."}
                </p>
              </div>
              <Toggle checked={maintenanceMode} onChange={() => setMaintenanceMode((v) => !v)} />
            </div>
          </div>
        )}

        {/* Commissions tab */}
        {activeTab === "commissions" && (
          <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
              Commission Settings
            </p>
            <Field label="Default Commission Rate (%)" hint="Percentage of Globlearn service fee paid to partners per admitted student.">
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  max={100}
                  className={inputClass}
                  style={inputStyle}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "#94A3B8" }}>%</span>
              </div>
            </Field>
            <Field label="Payment Terms (days after admission)" hint="Number of days within which commission is paid after student admission.">
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  className={inputClass}
                  style={inputStyle}
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs" style={{ color: "#94A3B8" }}>days</span>
              </div>
            </Field>
            <Field label="Minimum Payout Threshold (¥)" hint="Partners must reach this amount before a commission payment is processed.">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold" style={{ color: "#94A3B8" }}>¥</span>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  style={{ ...inputStyle, paddingLeft: "2rem" }}
                  value={minPayout}
                  onChange={(e) => setMinPayout(e.target.value)}
                />
              </div>
            </Field>

            <div className="p-4 rounded-xl" style={{ backgroundColor: "#EEF4FF", border: "1px solid #BFDBFE" }}>
              <p className="text-xs font-bold mb-1" style={{ color: "#1E40AF" }}>Current effective commission</p>
              <p className="text-2xl font-black" style={{ color: "#1B3A6B" }}>{commissionRate}%</p>
              <p className="text-xs mt-1" style={{ color: "#3B82F6" }}>
                Paid within {paymentTerms} days · Min payout ¥{Number(minPayout).toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
              Email Notification Preferences
            </p>
            {[
              { label: "New Application Submitted", hint: "Get notified when a student submits an application.", checked: notifyNewApp, toggle: () => setNotifyNewApp((v) => !v) },
              { label: "Admission Confirmed", hint: "Notify when a student is admitted by a university.", checked: notifyAdmission, toggle: () => setNotifyAdmission((v) => !v) },
              { label: "New Partner Registration", hint: "Notify when a new partner registers on the platform.", checked: notifyPartnerJoin, toggle: () => setNotifyPartnerJoin((v) => !v) },
              { label: "Commission Payment Processed", hint: "Notify when a commission payout is completed.", checked: notifyPayment, toggle: () => setNotifyPayment((v) => !v) },
              { label: "Weekly Summary Report", hint: "Receive a weekly digest of platform activity every Monday.", checked: notifyWeeklyReport, toggle: () => setNotifyWeeklyReport((v) => !v) },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0" }}
              >
                <div className="flex-1 mr-4">
                  <p className="text-sm font-semibold" style={{ color: "#0A1628" }}>{item.label}</p>
                  <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{item.hint}</p>
                </div>
                <Toggle checked={item.checked} onChange={item.toggle} />
              </div>
            ))}
          </div>
        )}

        {/* Save button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-8 py-3 rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: "#C8102E" }}
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
