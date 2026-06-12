export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Upload, Search, FileCheck, Send, Clock, Video,
  Star, UserCheck, CreditCard, Award, ThumbsUp,
  Receipt, FileText, Trophy, Check,
} from "lucide-react";
import { auth } from "@/lib/auth/config";
import { db } from "@/lib/db";
import { applications } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import TrackForm from "./_TrackForm";
import WhatsAppButton from "~/components/shared/WhatsAppButton";

export const metadata: Metadata = {
  title: "Track Your Application — Globlearn Education",
  description: "Track your China university application through all 14 stages.",
};

type StageData = { icon: LucideIcon; name: string; desc: string; phase?: string; phaseColor?: string };

const STAGES: StageData[] = [
  { phase: "Phase 1 — Application", phaseColor: "#1B3A6B",
    icon: Upload, name: "Submitted", desc: "Your application and 500 RMB deposit have been received by Globlearn Education." },
  { icon: Search, name: "Under Review", desc: "Your documents are being reviewed by our team." },
  { icon: FileCheck, name: "Documents Approved", desc: "All documents verified and approved. Preparing university submissions." },
  { phase: "Phase 2 — University Processing", phaseColor: "#29ABE2",
    icon: Send, name: "Applied to Universities", desc: "Globlearn Education has formally submitted your application to your chosen universities." },
  { icon: Clock, name: "Processing at University", desc: "The university admissions office is actively reviewing your file. This stage can take 2–8 weeks." },
  { icon: Video, name: "Interview (if required)", desc: "Some universities require an interview. Your advisor will send you full details." },
  { phase: "Phase 3 — Admission", phaseColor: "#92610A",
    icon: Star, name: "Pre-Admission", desc: "The university has provisionally accepted you. Final admission letter being prepared." },
  { icon: UserCheck, name: "Student Confirms", desc: "Please confirm you accept this offer via your dashboard." },
  { icon: CreditCard, name: "University Deposit (if required)", desc: "Some universities require a deposit to secure your place." },
  { icon: Award, name: "Final Admission Notice + JW202", desc: "You have been officially admitted. Your Admission Notice and JW202 form are ready." },
  { icon: ThumbsUp, name: "Student Accepts Offer", desc: "You have accepted your offer. Congratulations — preparing for visa guidance." },
  { phase: "Phase 4 — Completion", phaseColor: "#166534",
    icon: Receipt, name: "Service Charge Payment", desc: "Your service charge is now due — payable only after successful admission." },
  { icon: FileText, name: "JW202 Issued (if later)", desc: "Your JW202 has been issued. Required for visa application." },
  { icon: Trophy, name: "Complete", desc: "🎉 Congratulations! Your admission is complete. Your China journey begins." },
];

export default async function TrackPage() {
  // Fix 9 — if logged in and has an application, redirect to their track page
  const session = await auth();
  if (session?.user?.id) {
    const app = await db.query.applications.findFirst({
      where: eq(applications.studentId, session.user.id),
      orderBy: [desc(applications.createdAt)],
    });
    if (app?.applicationNumber) {
      redirect(`/track/${app.applicationNumber}`);
    }
  }

  return (
    <>
      {/* Hero with search form */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "#29ABE2" }}>Application Tracking</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-5 leading-tight">
            Track Your Application
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-10">
            Enter your Application ID or Passport Number to check your status.
          </p>
          <TrackForm />
        </div>
      </section>

      {/* 14-stage pipeline — informational */}
      <section className="py-14 px-4 bg-white">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "#C8102E" }}>Application Pipeline</p>
          <h2 className="text-2xl font-black mb-3" style={{ color: "#1B3A6B" }}>Your 14-Stage Journey</h2>
          <p className="text-sm mb-10" style={{ color: "#64748B" }}>
            Every application goes through these 14 stages. Enter your Application ID above to see exactly where you are.
          </p>

          <div>
            {STAGES.map((stage, i) => {
              const Icon = stage.icon;
              const isLast = i === STAGES.length - 1;
              return (
                <div key={i}>
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
                  <div className="flex gap-4 items-stretch">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F3F4F6" }}>
                        <Icon size={17} color="#9CA3AF" />
                      </div>
                      {!isLast && <div className="w-0.5 flex-1 min-h-[2rem] mt-1" style={{ backgroundColor: "#E5E7EB" }} />}
                    </div>
                    <div className={`flex-1 pb-5 pt-1.5 ${isLast ? "pb-0" : ""}`}>
                      <p className="font-bold text-sm leading-snug mb-0.5" style={{ color: "#9CA3AF" }}>
                        <span className="font-normal text-[11px] mr-1" style={{ color: "#D1D5DB" }}>{i + 1}.</span>
                        {stage.name}
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "#D1D5DB" }}>{stage.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WhatsApp support */}
      <section className="py-12 px-4" style={{ backgroundColor: "#0A1628" }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-xl font-black text-white mb-3">Not sure what your stage means?</h2>
          <p className="text-sm mb-7" style={{ color: "rgba(255,255,255,0.6)" }}>
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
