import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Users, GraduationCap, Globe, Award } from "lucide-react";
import WhatsAppButton from "~/components/shared/WhatsAppButton";

export const metadata: Metadata = {
  title: "About Us — Globlearn Education",
  description: "Globlearn Education helps students from Africa, Middle East & South Asia access top Chinese universities. 5,000+ students placed, 99% visa guidance success, transparent fees.",
};

const STATS = [
  { icon: <Users size={28} />, value: "5,000+", label: "Students Placed" },
  { icon: <GraduationCap size={28} />, value: "99%", label: "Visa Guidance Success*" },
  { icon: <Globe size={28} />, value: "80+", label: "Countries Served" },
  { icon: <Award size={28} />, value: "4 Types", label: "Scholarships We Handle" },
];

const VALUES = [
  {
    title: "Transparent Fees",
    body: "We charge a single, clearly stated service fee — paid only after your admission is confirmed. No hidden charges, no surprise costs.",
  },
  {
    title: "All 4 Scholarships",
    body: "We apply to CSC Government, University, Provincial, and Self-sponsored options simultaneously — maximising your funding chances.",
  },
  {
    title: "Visa Guidance",
    body: "Visa decisions are made by the Chinese Embassy. We prepare your documents carefully — our students have a 99% guidance success rate.",
  },
  {
    title: "End-to-End Support",
    body: "From the first WhatsApp message to airport pickup coordination and Residence Permit registration — we're with you every step.",
  },
];

const STEPS = [
  { step: "01", title: "Free Assessment", body: "Send us your documents. We review your academics, budget, and goals — then match you to the right university and program. No charge." },
  { step: "02", title: "Application", body: "We prepare and submit your full university application, scholarship forms, and supporting documents — correctly and on time." },
  { step: "03", title: "Scholarship", body: "We apply to all eligible scholarship types in parallel — CSC, University, Provincial — to maximise your funding." },
  { step: "04", title: "Visa Guidance", body: "We prepare your X1 student visa documents and guide you through the Chinese Embassy process in your country." },
  { step: "05", title: "Arrival Support", body: "Airport pickup coordination, Residence Permit assistance, campus registration — we handle your first weeks in China." },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-20 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">About Globlearn Education</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
            We help students from Africa, Middle East &amp; South Asia<br className="hidden md:block" /> study in China
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
            Transparent fees. All 4 scholarship types. 99% visa guidance success. One team — from first enquiry to arrival in China.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/universities"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
            >
              Browse Universities
            </Link>
            <WhatsAppButton
              size="lg"
              label="Talk to us on WhatsApp"
              message="Hi! 👋 I want to know more about Globlearn Education. Can you tell me how the process works?"
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-[#C8102E] flex justify-center mb-3">{s.icon}</div>
              <div className="text-3xl font-black text-[#1B3A6B] mb-1">{s.value}</div>
              <div className="text-xs text-gray-500 font-medium">{s.label}</div>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-gray-400 mt-6">* Visa decisions are made by the Chinese Embassy. 99% reflects guidance outcomes, not a guarantee.</p>
      </section>

      {/* Our Story */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <p className="text-xs font-bold tracking-widest uppercase text-[#C8102E] mb-4">Our Story</p>
              <h2 className="text-2xl font-black text-[#1B3A6B] mb-5">
                Why we started Globlearn Education
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  We started Globlearn Education because we saw too many students from Africa, the Middle East, and South Asia either miss out on world-class Chinese university education entirely — or get badly misled by agents who hid fees, misrepresented universities, and disappeared after collecting payment.
                </p>
                <p>
                  China offers some of the world's best programs in medicine, engineering, business, and technology — at a fraction of the cost of Western alternatives. The CSC Government Scholarship alone covers full tuition plus a monthly stipend. Yet the process was opaque, confusing, and riddled with bad actors.
                </p>
                <p>
                  Our model is simple: transparent fees, honest advice, and a dedicated team that handles everything from application to arrival. We are based in Wuhan, China — so we know the universities, the visa process, and the student life firsthand.
                </p>
              </div>
            </div>

            <div className="lg:w-72 space-y-4">
              {VALUES.map((v) => (
                <div key={v.title} className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="text-[#C8102E] flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#1B3A6B] text-sm mb-1">{v.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{v.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How we work */}
      <section className="py-16 px-4" style={{ backgroundColor: "#0A1628" }}>
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-3 text-center">How It Works</p>
          <h2 className="text-2xl font-black text-white mb-10 text-center">
            From WhatsApp to graduation — we're with you
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
            {STEPS.map((s) => (
              <div key={s.step} className="text-center">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-black text-white mx-auto mb-4"
                  style={{ backgroundColor: "#C8102E" }}
                >
                  {s.step}
                </div>
                <p className="font-bold text-white text-sm mb-2">{s.title}</p>
                <p className="text-white/50 text-xs leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-black text-[#1B3A6B] mb-4">Ready to start your China journey?</h2>
          <p className="text-gray-500 mb-8">
            Send us a WhatsApp message — our team responds in under 5 minutes and will guide you through every step.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/universities"
              className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-[#C8102E] hover:bg-[#A50D25] rounded-lg transition-colors"
            >
              Browse Universities
            </Link>
            <WhatsAppButton
              size="lg"
              label="Start on WhatsApp — it's free"
              message="Hi! 👋 I want to start my China study journey with Globlearn Education. Where do I begin?"
            />
          </div>
        </div>
      </section>
    </>
  );
}
