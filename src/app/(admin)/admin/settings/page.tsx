"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Globe, CreditCard, Bell, Search, Save, Loader2 } from "lucide-react";

type Tab = "payment" | "contact" | "application" | "seo" | "general" | "notifications";

interface SettingRow {
  key: string;
  value: string | null;
  label: string | null;
  category: string | null;
}

const inputClass =
  "w-full border rounded-xl px-4 py-2.5 text-sm bg-white focus:outline-none focus:border-[#29ABE2] transition-colors";
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

function SaveButton({
  settingKey,
  value,
  onSaved,
}: {
  settingKey: string;
  value: string;
  onSaved?: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: settingKey, value }),
      });
      setSaved(true);
      onSaved?.();
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSave}
      disabled={saving}
      className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-white transition-colors"
      style={{ backgroundColor: saved ? "#16A34A" : "#C8102E", minWidth: "80px", justifyContent: "center" }}
    >
      {saving ? (
        <Loader2 size={13} className="animate-spin" />
      ) : saved ? (
        <>
          <CheckCircle2 size={13} /> Saved
        </>
      ) : (
        <>
          <Save size={13} /> Save
        </>
      )}
    </button>
  );
}

function SettingField({
  row,
  type = "text",
  hint,
}: {
  row: SettingRow;
  type?: string;
  hint?: string;
}) {
  const [value, setValue] = useState(row.value ?? "");

  return (
    <Field label={row.label ?? row.key} hint={hint}>
      <div className="flex gap-2">
        <input
          type={type}
          className={inputClass}
          style={inputStyle}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <SaveButton settingKey={row.key} value={value} />
      </div>
    </Field>
  );
}

function QrField({ row }: { row: SettingRow }) {
  const [value, setValue] = useState(row.value ?? "");
  const [preview, setPreview] = useState(row.value ?? "");

  return (
    <Field label={row.label ?? row.key} hint="Paste the full URL of the QR code image.">
      <div className="flex gap-2 mb-3">
        <input
          type="url"
          className={inputClass}
          style={inputStyle}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <SaveButton settingKey={row.key} value={value} onSaved={() => setPreview(value)} />
      </div>
      {preview && (
        <div
          className="inline-block p-3 rounded-xl border"
          style={{ borderColor: "#E2E8F0", backgroundColor: "#FAFAFA" }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="QR code preview"
            style={{ width: "140px", height: "140px", objectFit: "contain", display: "block" }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
          <p className="text-[10px] text-center mt-1" style={{ color: "#94A3B8" }}>
            QR preview
          </p>
        </div>
      )}
    </Field>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("payment");
  const [rows, setRows] = useState<SettingRow[]>([]);
  const [loading, setLoading] = useState(true);

  // General / notifications local state (still static-saved for now)
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [commissionRate, setCommissionRate] = useState("20");
  const [notifyNewApp, setNotifyNewApp] = useState(true);
  const [notifyAdmission, setNotifyAdmission] = useState(true);
  const [notifyPartnerJoin, setNotifyPartnerJoin] = useState(true);
  const [notifyPayment, setNotifyPayment] = useState(false);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);
  const [localSaved, setLocalSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        setRows(data.settings ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function getRow(key: string): SettingRow {
    return rows.find((r) => r.key === key) ?? { key, value: "", label: key, category: null };
  }

  const TABS: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "payment", label: "Payments", icon: <CreditCard size={14} /> },
    { id: "contact", label: "Contact", icon: <Globe size={14} /> },
    { id: "application", label: "Applications", icon: <Globe size={14} /> },
    { id: "seo", label: "SEO", icon: <Search size={14} /> },
    { id: "general", label: "General", icon: <Globe size={14} /> },
    { id: "notifications", label: "Notifications", icon: <Bell size={14} /> },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black" style={{ color: "#0A1628" }}>Settings</h1>
        <p className="text-sm mt-0.5" style={{ color: "#64748B" }}>
          Platform configuration — changes save immediately to the database.
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-1 p-1 rounded-xl" style={{ backgroundColor: "#F1F5F9" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all"
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

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin" style={{ color: "#94A3B8" }} />
        </div>
      )}

      {!loading && (
        <>
          {/* ── PAYMENT ─────────────────────────────────── */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border p-6 space-y-6" style={{ borderColor: "#E2E8F0" }}>
                <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
                  QR Code Payments
                </p>
                <QrField row={getRow("alipay_qr_url")} />
                <QrField row={getRow("wechat_qr_url")} />
              </div>

              <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "#E2E8F0" }}>
                <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <p className="text-sm font-bold" style={{ color: "#0A1628" }}>Bank Transfer</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#64748B" }}>
                      {getRow("bank_transfer_enabled").value === "true" ? "Enabled" : "Disabled"}
                    </span>
                    <SaveButton
                      settingKey="bank_transfer_enabled"
                      value={getRow("bank_transfer_enabled").value === "true" ? "false" : "true"}
                    />
                  </div>
                </div>
                <SettingField row={getRow("bank_name")} hint="e.g. Industrial and Commercial Bank of China" />
                <SettingField row={getRow("bank_account_number")} />
                <SettingField row={getRow("bank_account_name")} />
                <SettingField row={getRow("bank_swift")} hint="e.g. ICBKCNBJ" />
                <SettingField row={getRow("deposit_amount")} type="number" hint="Amount in CNY (¥)" />
              </div>
            </div>
          )}

          {/* ── CONTACT ─────────────────────────────────── */}
          {activeTab === "contact" && (
            <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
                Contact Information
              </p>
              <SettingField row={getRow("whatsapp_number")} hint="Digits only, with country code. e.g. 8615655031556" />
              <SettingField row={getRow("wechat_id")} hint="WeChat ID shown on contact page" />
              <SettingField row={getRow("support_email")} type="email" />
            </div>
          )}

          {/* ── APPLICATION ──────────────────────────────── */}
          {activeTab === "application" && (
            <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
                Application Settings
              </p>
              <SettingField row={getRow("deposit_amount")} type="number" hint="Application deposit amount in CNY" />
              <SettingField row={getRow("max_universities_per_application")} type="number" hint="Maximum universities a student can select per application" />
            </div>
          )}

          {/* ── SEO ─────────────────────────────────────── */}
          {activeTab === "seo" && (
            <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
                SEO & Analytics
              </p>
              <SettingField
                row={getRow("google_analytics_id")}
                hint="e.g. G-XXXXXXXXXX — paste your GA4 Measurement ID"
              />
              <SettingField
                row={getRow("google_search_console_id")}
                hint="The content value from your Google Search Console meta verification tag"
              />
            </div>
          )}

          {/* ── GENERAL ─────────────────────────────────── */}
          {activeTab === "general" && (
            <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
                General Settings
              </p>
              <Field label="Commission Rate (%)">
                <div className="flex gap-2">
                  <div className="relative flex-1">
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
                </div>
              </Field>
              <div
                className="flex items-center justify-between p-4 rounded-xl"
                style={{ backgroundColor: maintenanceMode ? "#FEF2F2" : "#F8FAFC", border: `1px solid ${maintenanceMode ? "#FECACA" : "#E2E8F0"}` }}
              >
                <div>
                  <p className="text-sm font-bold" style={{ color: maintenanceMode ? "#991B1B" : "#0A1628" }}>
                    Maintenance Mode
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: maintenanceMode ? "#DC2626" : "#94A3B8" }}>
                    {maintenanceMode ? "Site is offline — only admins can access." : "Site is live and accessible."}
                  </p>
                </div>
                <Toggle checked={maintenanceMode} onChange={() => setMaintenanceMode((v) => !v)} />
              </div>
              {localSaved && (
                <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "#DCFCE7", border: "1px solid #86EFAC" }}>
                  <CheckCircle2 size={16} style={{ color: "#166534" }} />
                  <p className="text-sm font-semibold" style={{ color: "#166534" }}>Saved.</p>
                </div>
              )}
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => { setLocalSaved(true); setTimeout(() => setLocalSaved(false), 2500); }}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
                  style={{ backgroundColor: "#C8102E" }}
                >
                  Save Settings
                </button>
              </div>
            </div>
          )}

          {/* ── NOTIFICATIONS ────────────────────────────── */}
          {activeTab === "notifications" && (
            <div className="bg-white rounded-2xl border p-6 space-y-4" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-sm font-bold pb-3" style={{ color: "#0A1628", borderBottom: "1px solid #F1F5F9" }}>
                Email Notification Preferences
              </p>
              {[
                { label: "New Application Submitted", hint: "Notify when a student submits an application.", checked: notifyNewApp, toggle: () => setNotifyNewApp((v) => !v) },
                { label: "Admission Confirmed", hint: "Notify when a student is admitted.", checked: notifyAdmission, toggle: () => setNotifyAdmission((v) => !v) },
                { label: "New Partner Registration", hint: "Notify when a new partner registers.", checked: notifyPartnerJoin, toggle: () => setNotifyPartnerJoin((v) => !v) },
                { label: "Commission Payment Processed", hint: "Notify when a commission payout completes.", checked: notifyPayment, toggle: () => setNotifyPayment((v) => !v) },
                { label: "Weekly Summary Report", hint: "Weekly digest every Monday.", checked: notifyWeeklyReport, toggle: () => setNotifyWeeklyReport((v) => !v) },
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
        </>
      )}
    </div>
  );
}
