import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about studying in China with Globlearn Education.",
};

const FAQS = [
  {
    q: "Is studying in China expensive?",
    a: "Tuition fees are significantly lower than in Western countries. With scholarship support — CSC, University, or Provincial — many students study at little to no personal cost. Even self-sponsored students enjoy affordable tuition.",
  },
  {
    q: "Do you guarantee a visa?",
    a: "Visa decisions are made solely by the Chinese Embassy. Globlearn Education provides expert guidance to maximise your application strength. Our students have a 99% visa guidance success rate based on outcomes.",
  },
  {
    q: "Which scholarships do you support?",
    a: "We support all four pathways equally: CSC Government Scholarship, University Scholarship, Provincial Government Scholarship, and Self-sponsored programs. We help you choose the best fit for your profile.",
  },
  {
    q: "What documents do I need to apply?",
    a: "Typically: valid passport, academic transcripts, degree certificates, medical examination, police clearance, personal statement, and photos. Our team guides you through the complete checklist.",
  },
  {
    q: "Can I study in English?",
    a: "Yes. Many top Chinese universities offer fully English-taught programs at Bachelor, Master and PhD levels, especially in medicine, engineering, business and technology.",
  },
];

export default function FAQPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-3xl font-bold mb-2" style={{ color: "#1B3A6B" }}>Frequently Asked Questions</h1>
      <p className="text-slate-600 mb-10">Everything you need to know about studying in China with Globlearn Education.</p>
      <div className="space-y-4">
        {FAQS.map((faq, i) => (
          <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 mb-2">{faq.q}</h2>
            <p className="text-sm text-slate-600 leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
