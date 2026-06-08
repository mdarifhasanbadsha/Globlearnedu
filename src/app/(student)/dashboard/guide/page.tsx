import { Lock, MessageSquare } from "lucide-react";

const GUIDE_STEPS = [
  {
    num: 1,
    title: "Getting Your Student Visa (X1)",
    desc: "Step-by-step guidance for the Chinese embassy visa application in your home country.",
  },
  {
    num: 2,
    title: "Finding Accommodation in China",
    desc: "On-campus dormitory options, off-campus rental tips, and safe neighbourhoods near your university.",
  },
  {
    num: 3,
    title: "Health Insurance & Medical Requirements",
    desc: "Mandatory PICC health insurance, how to register, and what's covered for international students.",
  },
  {
    num: 4,
    title: "Opening a Bank Account in China",
    desc: "How to open a Bank of China or ICBC account, required documents, and setting up WeChat Pay.",
  },
  {
    num: 5,
    title: "Obtaining Your Residence Permit",
    desc: "The 30-day registration process with the local Public Security Bureau (PSB) after arrival.",
  },
  {
    num: 6,
    title: "Getting a Chinese SIM Card & Internet",
    desc: "Which carrier to choose, data plans, and how to access essential apps (VPN guidance).",
  },
  {
    num: 7,
    title: "Adjusting to Life in China",
    desc: "Campus life, food, transport, culture tips, and connecting with the student community.",
  },
];

export default function GuidePage() {
  const waHref = `https://wa.me/8615655031556?text=${encodeURIComponent(
    "Hi! I have a question about preparing for life in China after my admission."
  )}`;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black mb-1" style={{ color: "#1B3A6B" }}>
          China Living Guide
        </h1>
        <p className="text-sm" style={{ color: "#64748B" }}>
          Your complete guide to settling into life in China as a student.
        </p>
      </div>

      {/* Lock banner */}
      <div
        className="rounded-2xl p-8 mb-8 text-center"
        style={{ background: "linear-gradient(135deg, #1B3A6B 0%, #0A1628 100%)" }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        >
          <Lock size={28} className="text-white" />
        </div>
        <p className="text-xl font-black text-white mb-2">Guide locked</p>
        <p className="text-sm text-white mb-4" style={{ opacity: 0.7 }}>
          This guide unlocks automatically when your admission is confirmed (Stage 11 of 14).
          Complete your admission to access the full China Living Guide.
        </p>
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white"
          style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
        >
          <Lock size={12} />
          Currently at Stage 5 / 14 — Awaiting university response
        </div>
      </div>

      {/* Teaser preview */}
      <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#94A3B8" }}>
        What&apos;s inside — 7 sections
      </p>
      <div className="space-y-3 mb-8">
        {GUIDE_STEPS.map((step) => (
          <div
            key={step.num}
            className="relative flex gap-4 p-4 rounded-xl border overflow-hidden"
            style={{ borderColor: "#E2E8F0", backgroundColor: "white" }}
          >
            {/* Blur overlay */}
            <div
              className="absolute inset-0 z-10 flex items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(248,250,252,0.85)", backdropFilter: "blur(2px)" }}
            >
              <Lock size={14} style={{ color: "#CBD5E1" }} />
            </div>

            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-white flex-shrink-0"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              {step.num}
            </div>
            <div>
              <p className="text-sm font-bold mb-0.5" style={{ color: "#1B3A6B" }}>
                {step.title}
              </p>
              <p className="text-xs" style={{ color: "#64748B" }}>
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* WA CTA */}
      <div
        className="rounded-2xl p-5 border text-center"
        style={{ borderColor: "#25D36630", backgroundColor: "#F0FDF4" }}
      >
        <p className="text-sm font-semibold mb-1" style={{ color: "#166534" }}>
          Have questions about preparing for China now?
        </p>
        <p className="text-xs mb-4" style={{ color: "#64748B" }}>
          Our advisors are available 24/7 to answer any questions while you wait.
        </p>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-white text-sm font-bold"
          style={{ backgroundColor: "#25D366" }}
        >
          <MessageSquare size={16} />
          Ask your advisor on WhatsApp
        </a>
      </div>
    </div>
  );
}
