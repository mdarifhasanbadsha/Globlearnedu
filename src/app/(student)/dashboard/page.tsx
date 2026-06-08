import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import {
  CheckCircle2, Clock, FileText, Bell, Download,
  MapPin, MessageCircle, Check,
} from "lucide-react";

// ── Stage data (same 14-stage pipeline) ──────────────────────────────────────

const DEMO_CURRENT = 4; // 0-indexed → Stage 5 "Processing at University"

const PHASES = [
  { label: "Application", color: "#1B3A6B", bg: "#EEF4FF", stages: [0, 1, 2] },
  { label: "Univ. Processing", color: "#29ABE2", bg: "#E0F2FE", stages: [3, 4, 5] },
  { label: "Admission", color: "#92610A", bg: "#FFFBEB", stages: [6, 7, 8, 9, 10] },
  { label: "Completion", color: "#166534", bg: "#F0FDF4", stages: [11, 12, 13] },
];

const STAGE_NAMES = [
  "Submitted",
  "Under Review",
  "Documents Approved",
  "Applied to Universities",
  "Processing at University",
  "Interview (if required)",
  "Pre-Admission",
  "Student Confirms",
  "University Deposit",
  "Final Admission Notice + JW202",
  "Student Accepts Offer",
  "Service Charge Payment",
  "JW202 Issued",
  "Complete",
];

// ── Mock data ─────────────────────────────────────────────────────────────────

const UNIVERSITIES = [
  { name: "Wuhan University", city: "Wuhan", program: "MBBS (Medicine)", status: "Processing", statusColor: "#29ABE2" },
  { name: "Jilin University", city: "Changchun", program: "MBBS (Medicine)", status: "Applied", statusColor: "#94A3B8" },
  { name: "Sichuan University", city: "Chengdu", program: "MBBS (Medicine)", status: "Applied", statusColor: "#94A3B8" },
];

const NOTICES = [
  { text: "Your documents have been approved ✓", age: "2 days ago", color: "#16A34A", bg: "#F0FDF4", border: "#BBF7D0" },
  { text: "Applied to Wuhan University", age: "5 days ago", color: "#29ABE2", bg: "#E0F2FE", border: "#BAE6FD" },
  { text: "Application received — deposit confirmed", age: "8 days ago", color: "#64748B", bg: "#F8FAFC", border: "#E2E8F0" },
];

const DOCS = [
  "Passport",
  "Academic certificate",
  "Transcript",
  "Passport photo",
  "Police clearance",
  "Medical exam",
  "Bank statement",
  "English certificate",
];

const NEXT_STEPS = [
  { text: "University reviews your file", timeline: "2–6 weeks" },
  { text: "Interview notification (if required)", timeline: "After file review" },
  { text: "Pre-admission decision", timeline: "After interview" },
];

const QUICK_ACTIONS = [
  { label: "Track application", href: "/track", icon: MapPin, bg: "#EEF4FF", color: "#1B3A6B" },
  { label: "WhatsApp advisor", href: "https://wa.me/8615655031556?text=Hi!%20I%20need%20help%20with%20my%20application%20MB20260602001.", icon: MessageCircle, bg: "#F0FDF4", color: "#166534", external: true },
  { label: "View notices", href: "/dashboard/notices", icon: Bell, bg: "#E0F2FE", color: "#29ABE2" },
  { label: "Download docs", href: "/dashboard/documents", icon: Download, bg: "#F8FAFC", color: "#64748B" },
];

// ── Compact 14-stage stepper ──────────────────────────────────────────────────

function CompactStepper() {
  const pct = Math.round(((DEMO_CURRENT + 1) / 14) * 100);

  return (
    <div>
      {/* Progress line */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: "#1B3A6B" }}>
          Stage {DEMO_CURRENT + 1} of 14
        </span>
        <span className="text-xs" style={{ color: "#94A3B8" }}>{pct}% complete</span>
      </div>
      <div className="h-1.5 rounded-full mb-5" style={{ backgroundColor: "#E2E8F0" }}>
        <div
          className="h-1.5 rounded-full"
          style={{ width: `${pct}%`, backgroundColor: "#29ABE2" }}
        />
      </div>

      {/* Phase blocks — 2×2 on mobile, 4×1 on desktop */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {PHASES.map((phase, pi) => {
          const done = phase.stages.every((s) => s < DEMO_CURRENT);
          const active = phase.stages.includes(DEMO_CURRENT);
          const bg = done ? "#F0FDF4" : active ? phase.bg : "#F9FAFB";
          const border = done ? "#BBF7D0" : active ? `${phase.color}30` : "#E5E7EB";
          const labelColor = done ? "#166534" : active ? phase.color : "#CBD5E1";

          return (
            <div
              key={pi}
              className="rounded-xl p-3 border"
              style={{ backgroundColor: bg, borderColor: border }}
            >
              <p
                className="text-[9px] font-bold tracking-widest uppercase mb-1"
                style={{ color: labelColor }}
              >
                Phase {pi + 1}
              </p>
              <p
                className="text-xs font-semibold mb-3 leading-tight"
                style={{ color: labelColor }}
              >
                {phase.label}
              </p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {phase.stages.map((si) => {
                  const sDone = si < DEMO_CURRENT;
                  const sCurrent = si === DEMO_CURRENT;
                  return (
                    <div
                      key={si}
                      className="relative rounded-full"
                      style={{
                        width: 10,
                        height: 10,
                        backgroundColor: sDone ? "#16A34A" : sCurrent ? phase.color : "#D1D5DB",
                        flexShrink: 0,
                      }}
                    >
                      {sCurrent && (
                        <span
                          className="absolute inset-0 rounded-full animate-ping"
                          style={{ backgroundColor: `${phase.color}30` }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Current stage callout */}
      <div
        className="flex items-start gap-3 rounded-xl px-4 py-3 border"
        style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}
      >
        <div className="relative mt-0.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1B3A6B" }} />
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: "#29ABE240" }}
          />
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: "#1B3A6B" }}>
            Stage {DEMO_CURRENT + 1} — {STAGE_NAMES[DEMO_CURRENT]}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#1B3A6B80" }}>
            The university admissions office is reviewing your file. This can take 2–8 weeks.
          </p>
        </div>
        <Link
          href="/track"
          className="ml-auto text-xs font-semibold flex-shrink-0 underline"
          style={{ color: "#1B3A6B" }}
        >
          Full detail →
        </Link>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <div className="max-w-6xl mx-auto">
      {/* Two-column grid: main (left) + sidebar (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* ── LEFT COLUMN ─────────────────────────────── */}
        <div className="space-y-6">

          {/* Welcome card */}
          <div
            className="rounded-2xl p-6"
            style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0A1628 100%)" }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-white/60 text-xs mb-1">Student Portal</p>
                <h1 className="text-xl font-black text-white mb-2">
                  Welcome back, {firstName} 👋
                </h1>
                <p className="text-white/70 text-sm">
                  Your application is in progress — here's where things stand.
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-white/50 text-xs">App ID:</span>
                  <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                    MB20260602001
                  </span>
                  <span
                    className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
                    style={{ backgroundColor: "#29ABE220", color: "#29ABE2" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#29ABE2] animate-pulse" />
                    Processing at University
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status stepper */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Application Status</p>
              <Link href="/track" className="text-xs font-semibold" style={{ color: "#C8102E" }}>
                View all stages →
              </Link>
            </div>
            <CompactStepper />
          </div>

          {/* University rows */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-sm font-bold mb-4" style={{ color: "#1B3A6B" }}>Your Universities</p>
            <div className="space-y-3">
              {UNIVERSITIES.map((u) => (
                <div
                  key={u.name}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl border"
                  style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0"
                      style={{ backgroundColor: "#1B3A6B" }}
                    >
                      {u.name[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold leading-tight" style={{ color: "#1B3A6B" }}>
                        {u.name}
                      </p>
                      <p className="text-xs" style={{ color: "#94A3B8" }}>
                        {u.city} · {u.program}
                      </p>
                    </div>
                  </div>
                  <span
                    className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                    style={{ backgroundColor: `${u.statusColor}20`, color: u.statusColor }}
                  >
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent notices */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Recent Notices</p>
              <Link href="/dashboard/notices" className="text-xs font-semibold" style={{ color: "#C8102E" }}>
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {NOTICES.map((n) => (
                <div
                  key={n.text}
                  className="flex items-start gap-3 p-3 rounded-xl border"
                  style={{ backgroundColor: n.bg, borderColor: n.border }}
                >
                  <div
                    className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                    style={{ backgroundColor: n.color }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-snug" style={{ color: "#1B3A6B" }}>
                      {n.text}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>{n.age}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ────────────────────────────── */}
        <div className="space-y-5">

          {/* Counsellor card */}
          <div
            className="rounded-2xl p-5 border"
            style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
                style={{ backgroundColor: "#1B3A6B" }}
              >
                AE
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
                  Your Globlearn Education Advisor
                </p>
                <p className="text-xs" style={{ color: "#166534" }}>Available 24/7</p>
              </div>
            </div>
            <a
              href="https://wa.me/8615655031556?text=Hi!%20I%20want%20to%20check%20on%20my%20application%20MB20260602001."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={15} />
              Message advisor
            </a>
          </div>

          {/* Next steps */}
          <div
            className="rounded-2xl p-5 border-2"
            style={{ backgroundColor: "white", borderColor: "#FFD70040" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Clock size={15} style={{ color: "#92610A" }} />
              <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>What happens next?</p>
            </div>
            <div className="space-y-3">
              {NEXT_STEPS.map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0 mt-0.5"
                    style={{ backgroundColor: "#FFD700" }}
                  >
                    {i + 1}
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#1B3A6B" }}>{s.text}</p>
                    <p className="text-[11px]" style={{ color: "#94A3B8" }}>{s.timeline}</p>
                  </div>
                </div>
              ))}
            </div>
            <a
              href="https://wa.me/8615655031556?text=Hi!%20I%20have%20a%20question%20about%20what%20happens%20next%20in%20my%20application."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold"
              style={{ color: "#166534" }}
            >
              <MessageCircle size={12} />
              Questions? Ask your advisor →
            </a>
          </div>

          {/* Document status */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={15} style={{ color: "#1B3A6B" }} />
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Documents</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: "#16A34A" }}>
                All approved
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1.5">
              {DOCS.map((doc) => (
                <div key={doc} className="flex items-center gap-2">
                  <Check size={13} style={{ color: "#16A34A" }} />
                  <span className="text-xs" style={{ color: "#475569" }}>{doc}</span>
                </div>
              ))}
            </div>
            <Link
              href="/dashboard/documents"
              className="block mt-4 text-xs font-semibold text-center"
              style={{ color: "#C8102E" }}
            >
              View all documents →
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-sm font-bold mb-4" style={{ color: "#1B3A6B" }}>Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((a) => {
                const Icon = a.icon;
                const inner = (
                  <div
                    className="flex flex-col items-center gap-2 p-3 rounded-xl text-center hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: a.bg }}
                  >
                    <Icon size={18} style={{ color: a.color }} />
                    <span className="text-[11px] font-semibold leading-tight" style={{ color: a.color }}>
                      {a.label}
                    </span>
                  </div>
                );
                return a.external ? (
                  <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  <Link key={a.label} href={a.href}>
                    {inner}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* App ID card */}
          <div
            className="rounded-2xl p-4 text-center"
            style={{ backgroundColor: "#F8FAFC", border: "1px dashed #CBD5E1" }}
          >
            <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#94A3B8" }}>
              Application ID
            </p>
            <p className="text-base font-mono font-black" style={{ color: "#1B3A6B" }}>
              MB20260602001
            </p>
            <p className="text-[10px] mt-1" style={{ color: "#CBD5E1" }}>
              Quote this when contacting support
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
