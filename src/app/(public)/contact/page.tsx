import type { Metadata } from "next";
import WhatsAppNudge from "~/components/shared/WhatsAppNudge";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Globlearn Education for study-in-China guidance. WhatsApp replies in under 5 minutes, 24/7.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="py-16 px-4" style={{ backgroundColor: "#1B3A6B" }}>
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-xs font-bold tracking-widest uppercase text-[#29ABE2] mb-4">Get in Touch</p>
          <h1 className="text-4xl font-black text-white mb-4">Contact Globlearn Education</h1>
          <p className="text-white/70 text-lg">
            Our team is available 24/7. WhatsApp is the fastest way to reach us — we reply in under 5 minutes.
          </p>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-14">

        {/* WhatsApp — primary */}
        <div
          className="rounded-2xl p-8 mb-6 border-2"
          style={{ backgroundColor: "#F0FDF4", borderColor: "#BBF7D0" }}
        >
          <div className="flex items-start gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#25D366" }}
            >
              <svg style={{ width: "28px", height: "28px" }} viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-black text-[#166534] text-lg">WhatsApp</p>
                <span className="flex items-center gap-1 bg-[#25D366] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Online now
                </span>
              </div>
              <p className="text-[#166534] text-sm mb-1">+86 156 5503 1556</p>
              <p className="text-[#15803D] text-sm mb-5">
                Fastest way to reach us — our team replies in under 5 minutes, 24 hours a day.
              </p>
              <a
                href="https://wa.me/8615655031556?text=Hi!%20I%20filled%20the%20contact%20form%20but%20I%27d%20rather%20chat.%20I%27m%20interested%20in%20studying%20in%20China%20with%20Globlearn%20Education."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] hover:bg-[#1ea952] text-white font-bold rounded-lg transition-colors"
              >
                <svg style={{ width: "16px", height: "16px" }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Open WhatsApp Chat
              </a>
            </div>
          </div>
        </div>

        {/* Email + Office */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-bold tracking-widest uppercase text-[#1B3A6B] mb-3">Email</p>
            <p className="text-sm text-gray-500 mb-2">We reply within 4 hours.</p>
            <a
              href="mailto:info@globlearnedu.com"
              className="text-sm font-semibold text-[#C8102E] hover:underline"
            >
              info@globlearnedu.com
            </a>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <p className="text-xs font-bold tracking-widest uppercase text-[#1B3A6B] mb-3">Office</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              Wuhan, Hubei Province, China
            </p>
            <p className="text-xs text-gray-400 mt-2">Online support available 24/7</p>
          </div>
        </div>

        {/* Response times */}
        <div className="bg-gray-50 rounded-2xl border border-gray-200 p-6 mb-8">
          <p className="text-xs font-bold tracking-widest uppercase text-[#1B3A6B] mb-4">Response Times</p>
          <div className="space-y-3">
            {[
              { channel: "⚡ WhatsApp", time: "Under 5 minutes", note: "24/7" },
              { channel: "📧 Email", time: "Within 4 hours", note: "Mon–Sun" },
              { channel: "📞 Call back", time: "Within 24 hours", note: "By request via WhatsApp" },
            ].map((r) => (
              <div key={r.channel} className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">{r.channel}</span>
                <div className="text-right">
                  <span className="text-sm text-[#166534] font-semibold">{r.time}</span>
                  <span className="text-xs text-gray-400 ml-2">({r.note})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <WhatsAppNudge
          message="Hi! I filled the contact form but I'd rather chat. I'm interested in studying in China with Globlearn Education."
          label="Prefer to talk? WhatsApp us instead →"
        />
      </div>
    </>
  );
}
