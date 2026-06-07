import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Search, CheckCircle2, Plane, GraduationCap, MessageCircle } from "lucide-react";
import WhatsAppButton from "~/components/shared/WhatsAppButton";

export const metadata: Metadata = {
  title: "Track Your Application — Globlearn Education",
  description: "Log in to your student portal to track your China university application status, view documents, and receive real-time notifications from Globlearn Education.",
};

const STAGES = [
  {
    icon: <FileText size={22} />,
    title: "Applied",
    desc: "Your application has been submitted to the university. Globlearn Education is tracking it.",
  },
  {
    icon: <Search size={22} />,
    title: "Under Review",
    desc: "The university admissions team is reviewing your documents and academic profile.",
  },
  {
    icon: <CheckCircle2 size={22} />,
    title: "Offer Received",
    desc: "You have received your Admission Notice (JW202). Scholarship result confirmed.",
  },
  {
    icon: <Plane size={22} />,
    title: "Visa & Travel",
    desc: "Globlearn Education is guiding you through X1 visa documents at your local Chinese Embassy.",
  },
  {
    icon: <GraduationCap size={22} />,
    title: "Enrolled",
    desc: "You have arrived in China, registered at the university, and obtained your Residence Permit.",
  },
];

const WHAT_YOU_CAN_TRACK = [
  { label: "Application Status", detail: "Live status from the university admissions portal" },
  { label: "Document Checklist", detail: "Which documents are submitted, verified, or missing" },
  { label: "Scholarship Decision", detail: "CSC, University, and Provincial scholarship outcomes" },
  { label: "Visa Progress", detail: "Embassy appointment status and document readiness" },
  { label: "Advisor Messages", detail: "Direct messages from your Globlearn Education advisor" },
  { label: "Arrival Checklist", detail: "Pre-departure and first-week tasks in China" },
];

export default function TrackPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">Student Portal</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            Track Your China<br className="hidden md:block" /> Application
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-10">
            Sign in to see your application status, scholarship decision, visa progress, and messages from your advisor — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
            >
              Sign In to Track My Application
            </Link>
            <WhatsAppButton
              size="lg"
              label="Ask about my application"
              message="Hi! 👋 I've applied through Globlearn Education and want to check on my application status. Can you help?"
            />
          </div>
        </div>
      </section>

      {/* Application stages */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3 text-center">Your Journey</p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-10 text-center">5 Stages of Your Application</h2>

          <div className="relative">
            {/* Connector line (desktop) */}
            <div
              className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5"
              style={{ backgroundColor: "#E5E7EB" }}
            />

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {STAGES.map((stage, i) => (
                <div key={stage.title} className="relative text-center">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10"
                    style={{
                      backgroundColor: i === 0 ? "#C8102E" : "#F3F4F6",
                      color: i === 0 ? "white" : "#9CA3AF",
                    }}
                  >
                    {stage.icon}
                  </div>
                  <p className="font-bold text-[#1B3A6B] text-sm mb-2">{stage.title}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{stage.desc}</p>

                  {i === 0 && (
                    <span className="absolute top-0 right-4 md:right-auto md:left-1/2 md:-translate-x-1/2 text-[10px] font-bold bg-[#C8102E] text-white px-2 py-0.5 rounded-full">
                      You are here
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            The portal shows your exact current stage — updated in real-time as your application progresses.
          </p>
        </div>
      </section>

      {/* What you can track */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-3">Portal Features</p>
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-8">What you can see in your dashboard</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WHAT_YOU_CAN_TRACK.map((item) => (
              <div key={item.label} className="bg-white rounded-xl border border-gray-200 p-5">
                <CheckCircle2 size={16} className="text-[#C8102E] mb-3" />
                <p className="font-bold text-[#1B3A6B] text-sm mb-1">{item.label}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Haven't applied yet */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <div
            className="rounded-2xl p-8 md:p-10 text-center border-2"
            style={{ backgroundColor: "#EEF4FF", borderColor: "#1B3A6B30" }}
          >
            <p className="text-xs font-bold tracking-widest uppercase text-[#1B3A6B] mb-3">Haven't Applied Yet?</p>
            <h2 className="text-2xl font-black text-[#1B3A6B] mb-4">
              Start your application today
            </h2>
            <p className="text-gray-600 text-sm mb-8 max-w-lg mx-auto leading-relaxed">
              Globlearn Education handles your full application — university selection, scholarship applications, and visa guidance — from one service. No upfront payment until your admission is confirmed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/universities"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
              >
                Browse Universities
              </Link>
              <Link
                href="/scholarships"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-[#1B3A6B] bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
              >
                View Scholarships
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WhatsApp support */}
      <section className="py-14 px-4" style={{ backgroundColor: "#0A1628" }}>
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
            style={{ backgroundColor: "#25D366" }}
          >
            <MessageCircle size={24} color="white" />
          </div>
          <h2 className="text-2xl font-black text-white mb-4">Need help with your application?</h2>
          <p className="text-white/60 text-sm mb-8 max-w-lg mx-auto">
            Can't log in, have a question about your status, or need to update your documents? WhatsApp your advisor directly — we reply in under 5 minutes.
          </p>
          <WhatsAppButton
            size="lg"
            label="WhatsApp my advisor now"
            message="Hi! 👋 I have a question about my application status or documents. Can you help me?"
          />
        </div>
      </section>
    </>
  );
}
