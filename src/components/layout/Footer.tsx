"use client";
import { useState } from "react";
import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
  { label: "Track Application", href: "/track" },
  { label: "FAQ", href: "/faq" },
  { label: "Partner Portal", href: "/partner" },
];

const CITIES = [
  "Beijing", "Shanghai", "Wuhan", "Chengdu",
  "Xi'an", "Nanjing", "Guangzhou", "Hangzhou",
];

const PROGRAMS = [
  { label: "MBBS / Medicine", href: "/programs/mbbs-medicine" },
  { label: "Bachelor's Degree", href: "/programs/bachelors-degree" },
  { label: "Master's Degree", href: "/programs/masters-degree" },
  { label: "PhD Programs", href: "/programs/phd-program" },
  { label: "Chinese Language", href: "/programs/chinese-language" },
  { label: "Diploma / Vocational", href: "/programs/diploma-vocational" },
  { label: "Foundation / Pre-University", href: "/programs/foundation-pre-university" },
  { label: "Short Course / Exchange", href: "/programs/short-course-exchange" },
];

const SOCIALS = [
  { label: "WA", title: "WhatsApp", href: "https://wa.me/8615655031556?text=Hello%2C%20I%20want%20to%20know%20about%20studying%20in%20China%20with%20Globlearn%20Education." },
  { label: "WC", title: "WeChat", href: "#" },
  { label: "FB", title: "Facebook", href: "#" },
  { label: "IG", title: "Instagram", href: "#" },
  { label: "LI", title: "LinkedIn", href: "#" },
  { label: "YT", title: "YouTube", href: "#" },
  { label: "TT", title: "TikTok", href: "#" },
];

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      style={{
        width: "16px",
        height: "16px",
        flexShrink: 0,
        transform: open ? "rotate(180deg)" : "rotate(0)",
        transition: "transform 0.2s",
      }}
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
    </svg>
  );
}

export function Footer() {
  const [open, setOpen] = useState<Record<string, boolean>>({
    contact: false,
    links: false,
    partners: false,
    programs: false,
  });

  function toggle(key: string) {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <footer style={{ backgroundColor: "#0A1628" }}>
      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        {/* Main grid */}
        <div className="py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-6">

          {/* ── Col 1: Brand ── */}
          <div className="pb-6 lg:pb-0 border-b lg:border-b-0 border-white/8 mb-2 lg:mb-0">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4">
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  backgroundColor: "#1B3A6B",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontWeight: 900,
                  fontSize: "13px",
                  letterSpacing: "-0.5px",
                  flexShrink: 0,
                }}
              >
                GL
              </div>
              <div style={{ lineHeight: 1.1 }}>
                <div style={{ fontWeight: 800, fontSize: "14px", color: "white", letterSpacing: "0.04em" }}>
                  GLOBLEARN
                </div>
                <div style={{ fontWeight: 600, fontSize: "10px", color: "#29ABE2", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  Education
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-5 max-w-[220px]">
              Empowering students from Africa, Middle East &amp; South Asia to unlock
              world-class education in China. Transparent fees. Dedicated guidance.
            </p>
            <div className="flex flex-wrap gap-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.title}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(255,255,255,0.08)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "9px",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.55)",
                    textDecoration: "none",
                  }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* ── Col 2: Contact ── */}
          <div className="border-b lg:border-b-0 border-white/8">
            <button
              onClick={() => toggle("contact")}
              className="flex w-full justify-between items-center py-4 lg:py-0 lg:pointer-events-none lg:mb-4"
            >
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Contact Us
              </span>
              <span className="lg:hidden text-slate-500">
                <ChevronIcon open={open.contact} />
              </span>
            </button>

            <div className={`${open.contact ? "block" : "hidden"} lg:block pb-6 lg:pb-0`}>
              {/* WhatsApp button */}
              <a
                href="https://wa.me/8615655031556?text=Hello%2C%20I%20want%20to%20contact%20Globlearn%20Education%20about%20studying%20in%20China."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "#25D366",
                  color: "white",
                  fontSize: "12px",
                  fontWeight: 600,
                  textDecoration: "none",
                  marginBottom: "14px",
                }}
              >
                <svg style={{ width: "14px", height: "14px", flexShrink: 0 }} viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>

              <ul className="space-y-3">
                <li>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Email</span>
                  <a href="mailto:info@globlearnedu.com" className="text-xs text-slate-400 hover:text-[#29ABE2] transition-colors">
                    info@globlearnedu.com
                  </a>
                </li>
                <li>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Response Time</span>
                  <span className="text-xs text-slate-400">⚡ WhatsApp: 5 min · 📧 Email: 4 hr</span>
                </li>
                <li>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Office</span>
                  <span className="text-xs text-slate-400">Wuhan, Hubei, China</span>
                </li>
                <li>
                  <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">Support</span>
                  <span className="text-xs text-slate-400">Online 24/7</span>
                </li>
              </ul>
            </div>
          </div>

          {/* ── Col 3: Quick Links + Top Cities ── */}
          <div className="border-b lg:border-b-0 border-white/8">
            <button
              onClick={() => toggle("links")}
              className="flex w-full justify-between items-center py-4 lg:py-0 lg:pointer-events-none lg:mb-4"
            >
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Quick Links
              </span>
              <span className="lg:hidden text-slate-500">
                <ChevronIcon open={open.links} />
              </span>
            </button>

            <div className={`${open.links ? "block" : "hidden"} lg:block pb-6 lg:pb-0`}>
              <ul className="space-y-2.5 mb-5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-xs text-slate-400 hover:text-[#29ABE2] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
                <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-3">
                  Top Cities
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {CITIES.map((city) => (
                    <span
                      key={city}
                      className="text-[11px] text-slate-400 px-2.5 py-1 rounded-md"
                      style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                    >
                      {city}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Col 4: Partner & Refer cards ── */}
          <div className="border-b lg:border-b-0 border-white/8">
            <button
              onClick={() => toggle("partners")}
              className="flex w-full justify-between items-center py-4 lg:py-0 lg:pointer-events-none lg:mb-4"
            >
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Partners
              </span>
              <span className="lg:hidden text-slate-500">
                <ChevronIcon open={open.partners} />
              </span>
            </button>

            <div className={`${open.partners ? "block" : "hidden"} lg:block pb-6 lg:pb-0 space-y-3`}>
              {/* Become a Partner card */}
              <div
                style={{
                  borderRadius: "12px",
                  padding: "14px",
                  backgroundColor: "#1B3A6B",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}
              >
                <p className="text-xs font-bold text-white mb-1">Become a Partner</p>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Join our global network of agents and recruitment partners. Earn commissions on every successful placement.
                </p>
                <Link
                  href="/partner"
                  className="text-[11px] font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#C8102E" }}
                >
                  Join our network →
                </Link>
              </div>

              {/* Refer & Earn card */}
              <div
                style={{
                  borderRadius: "12px",
                  padding: "14px",
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,215,0,0.3)",
                }}
              >
                <p className="text-xs font-bold text-white mb-1">Refer &amp; Earn</p>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  Know someone looking to study in China? Refer them and earn a reward when they enrol.
                </p>
                <Link
                  href="/refer-and-earn"
                  className="text-[11px] font-semibold transition-colors hover:opacity-80"
                  style={{ color: "#FFD700" }}
                >
                  Learn more →
                </Link>
              </div>
            </div>
          </div>

          {/* ── Col 5: Our Programs ── */}
          <div className="border-b lg:border-b-0 border-white/8">
            <button
              onClick={() => toggle("programs")}
              className="flex w-full justify-between items-center py-4 lg:py-0 lg:pointer-events-none lg:mb-4"
            >
              <span className="text-[10px] font-bold text-white uppercase tracking-widest">
                Our Programs
              </span>
              <span className="lg:hidden text-slate-500">
                <ChevronIcon open={open.programs} />
              </span>
            </button>

            <div className={`${open.programs ? "block" : "hidden"} lg:block pb-6 lg:pb-0`}>
              <ul className="space-y-2.5">
                {PROGRAMS.map((p) => (
                  <li key={p.label}>
                    <Link
                      href={p.href}
                      className="text-xs text-slate-400 hover:text-[#29ABE2] transition-colors"
                    >
                      {p.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div
          className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-slate-500"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <div>
            <p>© {new Date().getFullYear()} Globlearn Education. All rights reserved.</p>
            <p className="mt-1 text-[10px] text-slate-600">
              Visa decisions are made by the Chinese Embassy. Success rate reflects our guidance outcomes.
            </p>
          </div>
          <div className="flex gap-5 flex-shrink-0">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
