"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, Shield, Menu } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

type Props = {
  userName: string;
  userInitials: string;
};

export default function AdminTopBar({ userName, userInitials }: Props) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header
      className="h-16 flex items-center justify-between px-4 md:px-6 flex-shrink-0"
      style={{ backgroundColor: "white", borderBottom: "1px solid #E2E8F0" }}
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile: hamburger placeholder + logo */}
        <Link href="/admin" className="md:hidden flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#0A1628" }}
          >
            <span className="text-white text-[11px] font-black">GL</span>
          </div>
          <span className="text-sm font-bold" style={{ color: "#0A1628" }}>
            Admin
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <Shield size={15} style={{ color: "#29ABE2" }} />
          <span className="text-sm font-semibold" style={{ color: "#0A1628" }}>
            Admin Panel
          </span>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "#EFF6FF", color: "#1E40AF" }}
          >
            Globlearn Education
          </span>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {/* Bell */}
        <button className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-50">
          <Bell size={18} style={{ color: "#64748B" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#C8102E" }}
          />
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-50"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: "#7C3AED" }}
            >
              {userInitials.toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {userName}
            </span>
            <ChevronDown
              size={14}
              style={{
                color: "#94A3B8",
                transform: dropdownOpen ? "rotate(180deg)" : "none",
                transition: "transform 0.15s",
              }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-48 rounded-xl border shadow-lg py-1 z-50"
              style={{ backgroundColor: "white", borderColor: "#E2E8F0" }}
            >
              <div className="px-4 py-2.5" style={{ borderBottom: "1px solid #F1F5F9" }}>
                <p
                  className="text-[10px] font-bold uppercase tracking-widest"
                  style={{ color: "#7C3AED" }}
                >
                  Admin
                </p>
                <p className="text-xs font-semibold text-gray-700 truncate mt-0.5">{userName}</p>
              </div>
              <div className="py-1">
                <SignOutButton redirectUrl="/">
                  <button className="flex items-center gap-2.5 px-4 py-2.5 text-sm w-full text-left transition-colors hover:bg-red-50 text-red-600">
                    <LogOut size={14} />
                    Sign out
                  </button>
                </SignOutButton>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
