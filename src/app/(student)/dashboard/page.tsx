import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications, notifications as notifTable, payments, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import Link from "next/link";
import {
  Clock, FileText, Bell, Download,
  MapPin, MessageCircle, Check,
} from "lucide-react";
import VerificationBanner from "./_VerificationBanner";

export const dynamic = "force-dynamic";

// ── Stage pipeline ────────────────────────────────────────────────────────────

const PHASES = [
  { label: "Application",       color: "#1B3A6B", bg: "#EEF4FF", stages: [0, 1, 2] },
  { label: "Univ. Processing",  color: "#29ABE2", bg: "#E0F2FE", stages: [3, 4, 5] },
  { label: "Admission",         color: "#92610A", bg: "#FFFBEB", stages: [6, 7, 8, 9, 10] },
  { label: "Completion",        color: "#166534", bg: "#F0FDF4", stages: [11, 12, 13] },
];

const STATUS_TO_STAGE: Record<string, number> = {
  submitted: 0, under_review: 1, documents_approved: 2,
  applied_per_university: 3, processing: 4, interview: 5,
  pre_admission: 6, student_confirms: 7, university_deposit: 8,
  final_admission: 9, student_accepts: 10,
  service_charge_payment: 11, jw202_issued: 12, complete: 13,
};

const STAGE_NAMES = [
  "Submitted", "Under Review", "Documents Approved", "Applied to Universities",
  "Processing at University", "Interview (if required)", "Pre-Admission",
  "Student Confirms", "University Deposit", "Final Admission + JW202",
  "Student Accepts Offer", "Service Charge Payment", "JW202 Issued", "Complete",
];

const STAGE_DESCRIPTIONS: Record<number, string> = {
  0: "Your application has been submitted. Globlearn Education will review it shortly.",
  1: "Our team is reviewing your documents. This usually takes 24 hours.",
  2: "Your documents are approved. We are preparing your university submissions.",
  3: "Your application has been submitted to your chosen universities.",
  4: "The university admissions office is reviewing your file. This can take 2–8 weeks.",
  5: "The university has requested an interview. Check your notices for details.",
  6: "The university has provisionally accepted your application.",
  7: "Please confirm your acceptance through your dashboard.",
  8: "University deposit payment required before final admission.",
  9: "You have received your official admission letter and JW202 form.",
  10: "You have accepted your offer. Service charge payment is the next step.",
  11: "Please pay the Globlearn Education service charge to complete your admission.",
  12: "Your JW202 visa form has been issued.",
  13: "Your admission is fully complete. Congratulations!",
};

// ── Compact stepper ──────────────────────────────────────────────────────────

function CompactStepper({ currentStage }: { currentStage: number }) {
  const pct = Math.round(((currentStage + 1) / 14) * 100);
  const stageName = STAGE_NAMES[currentStage] ?? "Unknown";
  const stageDesc = STAGE_DESCRIPTIONS[currentStage] ?? "";

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold" style={{ color: "#1B3A6B" }}>Stage {currentStage + 1} of 14</span>
        <span className="text-xs" style={{ color: "#94A3B8" }}>{pct}% complete</span>
      </div>
      <div className="h-1.5 rounded-full mb-5" style={{ backgroundColor: "#E2E8F0" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, backgroundColor: "#29ABE2" }} />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
        {PHASES.map((phase, pi) => {
          const done   = phase.stages.every((s) => s < currentStage);
          const active = phase.stages.includes(currentStage);
          const bg     = done ? "#F0FDF4" : active ? phase.bg : "#F9FAFB";
          const border = done ? "#BBF7D0" : active ? `${phase.color}30` : "#E5E7EB";
          const lc     = done ? "#166534" : active ? phase.color : "#CBD5E1";
          return (
            <div key={pi} className="rounded-xl p-3 border" style={{ backgroundColor: bg, borderColor: border }}>
              <p className="text-[9px] font-bold tracking-widest uppercase mb-1" style={{ color: lc }}>
                Phase {pi + 1}
              </p>
              <p className="text-xs font-semibold mb-3 leading-tight" style={{ color: lc }}>{phase.label}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {phase.stages.map((si) => {
                  const sDone    = si < currentStage;
                  const sCurrent = si === currentStage;
                  return (
                    <div
                      key={si}
                      className="relative rounded-full"
                      style={{ width: 10, height: 10, backgroundColor: sDone ? "#16A34A" : sCurrent ? phase.color : "#D1D5DB", flexShrink: 0 }}
                    >
                      {sCurrent && (
                        <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: `${phase.color}30` }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-start gap-3 rounded-xl px-4 py-3 border" style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B20" }}>
        <div className="relative mt-0.5">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#1B3A6B" }} />
          <span className="absolute inset-0 rounded-full animate-ping" style={{ backgroundColor: "#29ABE240" }} />
        </div>
        <div>
          <p className="text-xs font-bold" style={{ color: "#1B3A6B" }}>
            Stage {currentStage + 1} — {stageName}
          </p>
          <p className="text-xs mt-0.5" style={{ color: "#1B3A6B80" }}>{stageDesc}</p>
        </div>
        <Link href="/track" className="ml-auto text-xs font-semibold flex-shrink-0 underline" style={{ color: "#1B3A6B" }}>
          Full detail →
        </Link>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const session = await auth();
  const role = (session?.user as any)?.role as string | undefined;
  if (role === "admin" || role === "staff") redirect("/admin");
  if (role === "partner") redirect("/partner");

  const userId = (session?.user as any)?.id as string | undefined;
  const firstName = (session?.user as any)?.firstName ?? (session?.user?.name ?? "there").split(" ")[0];

  const [userRecord, app] = await Promise.all([
    userId
      ? db.select({ emailVerified: users.emailVerified }).from(users).where(eq(users.id, userId)).limit(1).then((r) => r[0])
      : Promise.resolve(null),
    userId
      ? db.query.applications.findFirst({
          where: eq(applications.studentId, userId),
          orderBy: [desc(applications.createdAt)],
        })
      : Promise.resolve(null),
  ]);

  const isEmailVerified = !!userRecord?.emailVerified;

  const [recentNotices, recentPayments] = await Promise.all([
    userId
      ? db.select().from(notifTable)
          .where(eq(notifTable.userId, userId))
          .orderBy(desc(notifTable.createdAt))
          .limit(3)
      : Promise.resolve([]),
    app
      ? db.select().from(payments).where(eq(payments.applicationId, app.id)).limit(5)
      : Promise.resolve([]),
  ]);

  const currentStage = app ? (STATUS_TO_STAGE[app.status] ?? 0) : 0;
  const appNumber = app?.applicationNumber ?? "—";

  const selectedUnivs = (app?.selectedUniversities as Array<{ universityName: string; universityId: string; programName: string }> | null) ?? [];

  const waHref = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "8615655031556"}?text=${encodeURIComponent(
    `Hi! I want to check on my application ${appNumber}.`
  )}`;

  const QUICK_ACTIONS = [
    { label: "Track application", href: "/track",                icon: MapPin,        bg: "#EEF4FF", color: "#1B3A6B" },
    { label: "WhatsApp advisor",  href: waHref,                  icon: MessageCircle, bg: "#F0FDF4", color: "#166534", external: true },
    { label: "View notices",      href: "/dashboard/notices",    icon: Bell,          bg: "#E0F2FE", color: "#29ABE2" },
    { label: "Download docs",     href: "/dashboard/documents",  icon: Download,      bg: "#F8FAFC", color: "#64748B" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">

        {/* ── LEFT ─────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Email verification banner */}
          {!isEmailVerified && <VerificationBanner />}

          {/* Welcome card */}
          <div className="rounded-2xl p-6" style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0A1628 100%)" }}>
            <p className="text-white/60 text-xs mb-1">Student Portal</p>
            <h1 className="text-xl font-black text-white mb-2">Welcome back, {firstName} 👋</h1>
            <p className="text-white/70 text-sm">
              {app ? "Your application is in progress — here's where things stand." : "Start your journey to study in China."}
            </p>
            {app && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-white/50 text-xs">App ID:</span>
                <span className="text-xs font-mono font-bold text-white bg-white/10 px-2 py-0.5 rounded">
                  {appNumber}
                </span>
                <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: "#29ABE220", color: "#29ABE2" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#29ABE2] animate-pulse" />
                  {STAGE_NAMES[currentStage]}
                </span>
              </div>
            )}
            {!app && (
              <Link
                href="/dashboard/apply"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                style={{ backgroundColor: "#C8102E" }}
              >
                Start application →
              </Link>
            )}
          </div>

          {/* Status stepper */}
          {app && (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Application Status</p>
                <Link href="/track" className="text-xs font-semibold" style={{ color: "#C8102E" }}>View all stages →</Link>
              </div>
              <CompactStepper currentStage={currentStage} />
            </div>
          )}

          {/* Universities */}
          {selectedUnivs.length > 0 && (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <p className="text-sm font-bold mb-4" style={{ color: "#1B3A6B" }}>Your Universities</p>
              <div className="space-y-3">
                {selectedUnivs.map((u, i) => (
                  <div key={i} className="flex items-center justify-between gap-3 p-3 rounded-xl border" style={{ borderColor: "#F1F5F9", backgroundColor: "#FAFAFA" }}>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ backgroundColor: "#1B3A6B" }}>
                        {u.universityName?.[0] ?? "U"}
                      </div>
                      <div>
                        <p className="text-sm font-bold leading-tight" style={{ color: "#1B3A6B" }}>{u.universityName}</p>
                        <p className="text-xs" style={{ color: "#94A3B8" }}>{u.programName}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: "#29ABE220", color: "#29ABE2" }}>
                      {i === 0 ? "Primary" : `Choice ${i + 1}`}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Recent Notices</p>
              <Link href="/dashboard/notices" className="text-xs font-semibold" style={{ color: "#C8102E" }}>View all →</Link>
            </div>
            {recentNotices.length > 0 ? (
              <div className="space-y-3">
                {recentNotices.map((n) => (
                  <div key={n.id} className="flex items-start gap-3 p-3 rounded-xl border" style={{ backgroundColor: n.isRead ? "#F8FAFC" : "#EEF4FF", borderColor: n.isRead ? "#E2E8F0" : "#1B3A6B20" }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: n.isRead ? "#94A3B8" : "#1B3A6B" }} />
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-snug" style={{ color: "#1B3A6B" }}>{n.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: "#94A3B8" }}>
                        {new Date(n.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-center py-4" style={{ color: "#94A3B8" }}>No notices yet.</p>
            )}
          </div>
        </div>

        {/* ── RIGHT ────────────────────────────────────── */}
        <div className="space-y-5">

          {/* Advisor card */}
          <div className="rounded-2xl p-5 border" style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0" style={{ backgroundColor: "#1B3A6B" }}>AE</div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Your Globlearn Education Advisor</p>
                <p className="text-xs" style={{ color: "#166534" }}>Available 24/7</p>
              </div>
            </div>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ backgroundColor: "#25D366" }}
            >
              <MessageCircle size={15} />
              Message advisor
            </a>
          </div>

          {/* What happens next */}
          {app && (
            <div className="rounded-2xl p-5 border-2 bg-white" style={{ borderColor: "#FFD70040" }}>
              <div className="flex items-center gap-2 mb-4">
                <Clock size={15} style={{ color: "#92610A" }} />
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>What happens next?</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "#475569" }}>
                {STAGE_DESCRIPTIONS[currentStage + 1] ?? "Your application will proceed to the next stage. Your advisor will notify you."}
              </p>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 mt-4 text-xs font-semibold"
                style={{ color: "#166534" }}
              >
                <MessageCircle size={12} />
                Questions? Ask your advisor →
              </a>
            </div>
          )}

          {/* Payments summary */}
          {recentPayments.length > 0 && (
            <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Payments</p>
                <Link href="/dashboard/payments" className="text-xs font-semibold" style={{ color: "#C8102E" }}>View all →</Link>
              </div>
              <div className="space-y-2">
                {recentPayments.slice(0, 3).map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-xs">
                    <span style={{ color: "#475569" }} className="capitalize">{p.type.replace(/_/g, " ")}</span>
                    <span className="font-bold" style={{ color: p.status === "paid" ? "#16A34A" : "#D97706" }}>
                      ¥{Number(p.amount).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Document checklist */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <FileText size={15} style={{ color: "#1B3A6B" }} />
                <p className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Documents</p>
              </div>
            </div>
            {app?.documents && Object.keys(app.documents as object).length > 0 ? (
              <div className="grid grid-cols-1 gap-1.5">
                {Object.keys(app.documents as object).map((doc) => (
                  <div key={doc} className="flex items-center gap-2">
                    <Check size={13} style={{ color: "#16A34A" }} />
                    <span className="text-xs capitalize" style={{ color: "#475569" }}>{doc.replace(/_/g, " ")}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs" style={{ color: "#94A3B8" }}>No documents uploaded yet.</p>
            )}
            <Link href="/dashboard/documents" className="block mt-4 text-xs font-semibold text-center" style={{ color: "#C8102E" }}>
              Manage documents →
            </Link>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border p-5" style={{ borderColor: "#E2E8F0" }}>
            <p className="text-sm font-bold mb-4" style={{ color: "#1B3A6B" }}>Quick Actions</p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map((a) => {
                const Icon = a.icon;
                const inner = (
                  <div className="flex flex-col items-center gap-2 p-3 rounded-xl text-center hover:opacity-80 transition-opacity" style={{ backgroundColor: a.bg }}>
                    <Icon size={18} style={{ color: a.color }} />
                    <span className="text-[11px] font-semibold leading-tight" style={{ color: a.color }}>{a.label}</span>
                  </div>
                );
                return a.external ? (
                  <a key={a.label} href={a.href} target="_blank" rel="noopener noreferrer">{inner}</a>
                ) : (
                  <Link key={a.label} href={a.href}>{inner}</Link>
                );
              })}
            </div>
          </div>

          {/* App ID */}
          {app && (
            <div className="rounded-2xl p-4 text-center" style={{ backgroundColor: "#F8FAFC", border: "1px dashed #CBD5E1" }}>
              <p className="text-[10px] font-bold tracking-widest uppercase mb-1" style={{ color: "#94A3B8" }}>Application ID</p>
              <p className="text-base font-mono font-black" style={{ color: "#1B3A6B" }}>{appNumber}</p>
              <p className="text-[10px] mt-1" style={{ color: "#CBD5E1" }}>Quote this when contacting support</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
