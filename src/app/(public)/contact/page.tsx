import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Globlearn Education for study-in-China guidance and scholarship support.",
};

export default function ContactPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-16">
      <h1 className="text-3xl font-bold mb-4" style={{ color: "#1B3A6B" }}>Contact Us</h1>
      <p className="text-slate-600 mb-8">
        Reach out to Globlearn Education for personalised guidance on studying in China.
        Our team is available 24/7 to answer your questions.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-2">WhatsApp</h2>
          <p className="text-sm text-slate-600 mb-3">Fastest response — usually within minutes.</p>
          <a
            href="https://wa.me/8615655031556?text=Hello%2C%20I%20want%20to%20contact%20Globlearn%20Education%20about%20studying%20in%20China."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-sm font-semibold text-white px-4 py-2 rounded-lg bg-[#1B3A6B] hover:opacity-90 transition-opacity"
          >
            Chat on WhatsApp
          </a>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900 mb-2">Email</h2>
          <p className="text-sm text-slate-600 mb-3">We reply within 24 hours.</p>
          <a
            href="mailto:info@globlearnedu.com"
            className="text-sm font-medium text-[#C8102E] hover:underline"
          >
            info@globlearnedu.com
          </a>
        </div>
      </div>
    </div>
  );
}
