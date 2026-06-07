import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header
        className="px-6 h-14 flex items-center text-white"
        style={{ backgroundColor: "#0A1628" }}
      >
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <span className="font-bold text-sm">Globlearn Education — Admin</span>
          <Link href="/" className="text-xs text-slate-400 hover:text-white transition-colors">
            ← View Site
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
