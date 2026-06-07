import Link from "next/link";

const QUICK_LINKS = [
  { label: "About Us", href: "/about" },
  { label: "Universities", href: "/universities" },
  { label: "Programs", href: "/programs" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Blog", href: "/blog" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

const ADMISSION_LINKS = [
  { label: "Apply Now", href: "/universities" },
  { label: "Track Application", href: "/track" },
  { label: "Partner Program", href: "/partner" },
  { label: "Refer & Earn", href: "/refer-and-earn" },
  { label: "CSC Scholarship", href: "/scholarships" },
  { label: "University Scholarship", href: "/scholarships" },
];

const CITIES = [
  "Beijing", "Shanghai", "Wuhan", "Chengdu", "Xi'an",
  "Nanjing", "Guangzhou", "Hangzhou", "Harbin", "Dalian",
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#0A1628" }} className="text-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        <div className="py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-6">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{ backgroundColor: "#1B3A6B" }}
              >
                GE
              </div>
              <div className="leading-none">
                <div className="font-bold text-sm text-white">Globlearn</div>
                <div
                  className="font-semibold text-[10px] tracking-widest uppercase"
                  style={{ color: "#29ABE2" }}
                >
                  Education
                </div>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed mb-5 max-w-[220px]">
              Empowering students from Africa, Middle East & South Asia to unlock
              world-class education in China. Transparent fees. Dedicated guidance.
            </p>
            <div className="flex gap-2">
              {["WA", "FB", "IG", "LI", "YT"].map((icon) => (
                <div
                  key={icon}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-300 cursor-pointer hover:text-white transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
                >
                  {icon}
                </div>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                  WhatsApp
                </span>
                <a
                  href="https://wa.me/message/globlearnedu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-[#29ABE2] transition-colors"
                >
                  Chat with us on WhatsApp
                </a>
              </li>
              <li>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                  Email
                </span>
                <a
                  href="mailto:info@globlearnedu.com"
                  className="text-xs text-slate-400 hover:text-[#29ABE2] transition-colors"
                >
                  info@globlearnedu.com
                </a>
              </li>
              <li>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                  Office
                </span>
                <span className="text-xs text-slate-400">Wuhan, Hubei, China</span>
              </li>
              <li>
                <span className="block text-[10px] text-slate-500 uppercase tracking-wider mb-0.5">
                  Support Hours
                </span>
                <span className="text-xs text-slate-400">Online 24/7</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#29ABE2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admission */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              Admission 2025
            </h4>
            <ul className="space-y-2.5">
              {ADMISSION_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-slate-400 hover:text-[#29ABE2] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Study Cities */}
          <div>
            <h4 className="text-[10px] font-bold text-white uppercase tracking-widest mb-4">
              Study Cities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {CITIES.map((city) => (
                <span
                  key={city}
                  className="text-[11px] text-slate-400 px-2.5 py-1 rounded-md transition-colors"
                  style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
                >
                  {city}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
        >
          <p>© {new Date().getFullYear()} Globlearn Education. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy-policy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
