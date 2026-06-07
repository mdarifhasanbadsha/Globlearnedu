import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  Upload, Search, FileCheck, Send, Clock, Video,
  Star, UserCheck, CreditCard, Award, ThumbsUp,
  Receipt, FileText, Trophy, Check, LogIn,
} from "lucide-react";
import WhatsAppButton from "~/components/shared/WhatsAppButton";

export const metadata: Metadata = {
  title: "Track Your Application — Globlearn Education",
  description: "Log in to your student portal to track your China university application through all 14 stages — from submission to completed enrollment.",
};

// 0-indexed demo: index 4 = Stage 5 "Processing at University"
const DEMO_CURRENT = 4;

type StageData = {
  icon: LucideIcon;
  name: string;
  desc: string;
  phase?: string;
  phaseColor?: string;
};

const STAGES: StageData[] = [
  // ── Phase 1 ──
  {
    phase: "Phase 1 — Application",
    phaseColor: "#1B3A6B",
    icon: Upload,
    name: "Submitted",
    desc: "Your application and 500 RMB deposit have been received by Globlearn Education.",
  },
  {
    icon: Search,
    name: "Under Review",
    desc: "Your documents are being reviewed by our team. We check everything before submission.",
  },
  {
    icon: FileCheck,
    name: "Documents Approved",
    desc: "All your documents have been verified and approved. We are preparing your university submissions.",
  },
  // ── Phase 2 ──
  {
    phase: "Phase 2 — University Processing",
    phaseColor: "#29ABE2",
    icon: Send,
    name: "Applied to Universities",
    desc: "Globlearn Education has formally submitted your application to your chosen universities.",
  },
  {
    icon: Clock,
    name: "Processing at University",
    desc: "The university admissions office is actively reviewing your file. This stage can take 2–8 weeks.",
  },
  {
    icon: Video,
    name: "Interview (if required)",
    desc: "Some universities require an interview. Your advisor will send you full details — date, time, platform and preparation tips.",
  },
  // ── Phase 3 ──
  {
    phase: "Phase 3 — Admission",
    phaseColor: "#92610A",
    icon: Star,
    name: "Pre-Admission",
    desc: "The university has provisionally accepted you. Final admission letter being prepared.",
  },
  {
    icon: UserCheck,
    name: "Student Confirms",
    desc: "Please confirm you accept this offer. Log in to your dashboard to confirm.",
  },
  {
    icon: CreditCard,
    name: "University Deposit (if required)",
    desc: "Some universities require a deposit to secure your place. Your advisor will guide you.",
  },
  {
    icon: Award,
    name: "Final Admission Notice + JW202",
    desc: "You have been officially admitted. Your Admission Notice and JW202 form are ready — needed for your visa application.",
  },
  {
    icon: ThumbsUp,
    name: "Student Accepts Offer",
    desc: "You have accepted your offer. Congratulations — now preparing for visa guidance.",
  },
  // ── Phase 4 ──
  {
    phase: "Phase 4 — Completion",
    phaseColor: "#166534",
    icon: Receipt,
    name: "Service Charge Payment",
    desc: "Your service charge to Globlearn Education is now due — payable only after successful admission.",
  },
  {
    icon: FileText,
    name: "JW202 Issued (if later)",
    desc: "Your JW202 has been issued separately if it was delayed. This is required for visa application.",
  },
  {
    icon: Trophy,
    name: "Complete",
    desc: "🎉 Congratulations! Your admission is complete. Your China journey begins. Check your dashboard for the pre-departure guide.",
  },
];

export default function TrackPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">Student Portal</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Track Your Application
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            14 clear stages — from submission to your arrival in China. Sign in to see exactly where your application is right now.
          </p>
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
          >
            <LogIn size={18} />
            Sign In to Track My Application
          </Link>
        </div>
      </section>

      {/* Demo banner */}
      <div className="bg-[#FFF8EC] border-b border-[#FDE68A] px-4 py-3 text-center">
        <p className="text-xs text-[#92610A] font-semibold">
          Demo preview — showing Stage 5 as current. Log in to see your real status.
        </p>
      </div>

      {/* 14-stage stepper */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-2">Application Pipeline</p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-10">Your 14-Stage Journey</h2>

          <div>
            {STAGES.map((stage, i) => {
              const status: "done" | "current" | "future" =
                i < DEMO_CURRENT ? "done" : i === DEMO_CURRENT ? "current" : "future";
              const Icon = stage.icon;
              const isLast = i === STAGES.length - 1;

              return (
                <div key={i}>
                  {/* Phase header */}
                  {stage.phase && (
                    <div className={`flex items-center gap-3 mb-4 ${i > 0 ? "mt-8" : ""}`}>
                      <span
                        className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full text-white"
                        style={{ backgroundColor: stage.phaseColor }}
                      >
                        {stage.phase}
                      </span>
                      <div className="flex-1 h-px" style={{ backgroundColor: `${stage.phaseColor}30` }} />
                    </div>
                  )}

                  {/* Stage row */}
                  <div className="flex gap-4 items-stretch">
                    {/* Left: icon + connector */}
                    <div className="flex flex-col items-center flex-shrink-0">
                      {/* Circle */}
                      <div className="relative">
                        {status === "done" && (
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#16A34A" }}
                          >
                            <Check size={16} color="white" strokeWidth={3} />
                          </div>
                        )}
                        {status === "current" && (
                          <div className="relative w-9 h-9 flex items-center justify-center">
                            <span
                              className="absolute inset-0 rounded-full animate-ping"
                              style={{ backgroundColor: "#29ABE220" }}
                            />
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center relative z-10"
                              style={{ backgroundColor: "#1B3A6B" }}
                            >
                              <Icon size={17} />
                            </div>
                          </div>
                        )}
                        {status === "future" && (
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: "#F3F4F6" }}
                          >
                            <Icon size={17} />
                          </div>
                        )}
                      </div>

                      {/* Connector */}
                      {!isLast && (
                        <div
                          className="w-0.5 flex-1 min-h-[2rem] mt-1"
                          style={{ backgroundColor: i < DEMO_CURRENT ? "#16A34A40" : "#E5E7EB" }}
                        />
                      )}
                    </div>

                    {/* Right: content card */}
                    <div className={`flex-1 pb-5 ${isLast ? "pb-0" : ""}`}>
                      {status === "current" ? (
                        <div
                          className="rounded-xl border-2 p-4 mb-1"
                          style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B" }}
                        >
                          <div className="flex items-center gap-2 mb-1.5">
                            <span
                              className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full text-white"
                              style={{ backgroundColor: "#29ABE2" }}
                            >
                              You are here
                            </span>
                            <span className="text-[10px] font-semibold text-[#1B3A6B]/60">
                              Stage {i + 1} of {STAGES.length}
                            </span>
                          </div>
                          <p className="font-black text-[#1B3A6B] text-sm mb-1">{stage.name}</p>
                          <p className="text-xs text-[#1B3A6B]/70 leading-relaxed">{stage.desc}</p>
                        </div>
                      ) : (
                        <div className="pt-1.5">
                          <p
                            className="font-bold text-sm leading-snug mb-0.5"
                            style={{ color: status === "done" ? "#1B3A6B" : "#9CA3AF" }}
                          >
                            <span
                              className="font-normal text-[11px] mr-1"
                              style={{ color: status === "done" ? "#16A34A" : "#D1D5DB" }}
                            >
                              {i + 1}.
                            </span>
                            {stage.name}
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: status === "done" ? "#6B7280" : "#D1D5DB" }}
                          >
                            {stage.desc}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Login CTA below stepper */}
          <div
            className="mt-10 rounded-2xl p-6 text-center border"
            style={{ backgroundColor: "#F9FAFB", borderColor: "#E5E7EB" }}
          >
            <p className="text-sm font-semibold text-[#1B3A6B] mb-1">Want to see your real stage?</p>
            <p className="text-xs text-gray-500 mb-5">
              Log in to your dashboard to see your live application status, documents, and advisor messages.
            </p>
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
            >
              <LogIn size={16} />
              Log in to see your actual stage
            </Link>
          </div>
        </div>
      </section>

      {/* WhatsApp support */}
      <section className="py-12 px-4" style={{ backgroundColor: "#0A1628" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-black text-white mb-3">Not sure what your stage means?</h2>
          <p className="text-white/60 text-sm mb-7">
            Your advisor explains everything. WhatsApp us and we reply in under 5 minutes.
          </p>
          <WhatsAppButton
            size="lg"
            label="Ask your advisor on WhatsApp →"
            message="Hi! 👋 I want to understand my application stage better. Can you help me?"
          />
        </div>
      </section>
    </>
  );
}
