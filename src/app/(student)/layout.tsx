import Link from "next/link";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 h-14 flex items-center">
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="font-bold text-sm" style={{ color: "#1B3A6B" }}>
            Globlearn Education — Student Portal
          </Link>
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-700">
            ← Back to Site
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
