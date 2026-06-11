"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, ChevronDown, LogOut, ClipboardCheck } from "lucide-react";

type Props = { userName: string; userInitials: string };

export default function StaffTopBar({ userName, userInitials }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 flex-shrink-0"
      style={{ backgroundColor: "white", borderBottom: "1px solid #E2E8F0" }}
    >
      <div className="flex items-center gap-2">
        <Link href="/staff" className="md:hidden flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#059669" }}>
            <span className="text-white text-[11px] font-black">GL</span>
          </div>
          <span className="text-sm font-bold" style={{ color: "#1B3A6B" }}>Staff</span>
        </Link>
        <div className="hidden md:flex items-center gap-2">
          <ClipboardCheck size={15} style={{ color: "#059669" }} />
          <span className="text-sm font-semibold" style={{ color: "#1B3A6B" }}>Staff Portal</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/staff/notices" className="relative flex items-center justify-center w-9 h-9 rounded-lg hover:bg-gray-50">
          <Bell size={18} style={{ color: "#64748B" }} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{ backgroundColor: "#C8102E" }} />
        </Link>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50"
          >
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: "#059669" }}>
              {userInitials.toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">{userName}</span>
            <ChevronDown size={14} style={{ color: "#94A3B8", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-1 w-44 rounded-xl border shadow-lg py-1 z-50" style={{ backgroundColor: "white", borderColor: "#E2E8F0" }}>
              <div className="px-4 py-2.5" style={{ borderBottom: "1px solid #F1F5F9" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#059669" }}>Staff</p>
                <p className="text-xs font-semibold text-gray-700 truncate mt-0.5">{userName}</p>
              </div>
              <button
                onClick={() => { window.location.href = "/api/auth/logout"; }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm w-full text-left hover:bg-red-50 text-red-600"
              >
                <LogOut size={14} />Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
