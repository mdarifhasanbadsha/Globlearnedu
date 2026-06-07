"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

type Props = {
  userName: string;
  userInitials: string;
};

export default function DashboardTopBar({ userName, userInitials }: Props) {
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
      className="h-16 flex items-center justify-between px-4 md:px-6 border-b flex-shrink-0"
      style={{ backgroundColor: "white", borderColor: "#E2E8F0" }}
    >
      {/* Left: mobile logo */}
      <div className="flex items-center gap-3">
        <Link href="/dashboard" className="md:hidden flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#1B3A6B" }}
          >
            <span className="text-white text-[11px] font-black">GL</span>
          </div>
          <span className="text-sm font-bold" style={{ color: "#1B3A6B" }}>
            Student Portal
          </span>
        </Link>
        <span
          className="hidden md:block text-sm font-semibold"
          style={{ color: "#1B3A6B" }}
        >
          Student Portal
        </span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <Link
          href="/dashboard/notices"
          className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-gray-50"
        >
          <Bell size={18} style={{ color: "#64748B" }} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ backgroundColor: "#C8102E" }}
          />
        </Link>

        {/* User dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors hover:bg-gray-50"
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
              style={{ backgroundColor: "#1B3A6B" }}
            >
              {userInitials.toUpperCase()}
            </div>
            <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-[120px] truncate">
              {userName}
            </span>
            <ChevronDown
              size={14}
              style={{ color: "#94A3B8", transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}
            />
          </button>

          {dropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1 w-44 rounded-xl border shadow-lg py-1 z-50"
              style={{ backgroundColor: "white", borderColor: "#E2E8F0" }}
            >
              <Link
                href="/dashboard/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <User size={14} />
                Profile
              </Link>
              <div className="border-t my-1" style={{ borderColor: "#F1F5F9" }} />
              <SignOutButton redirectUrl="/">
                <button className="flex items-center gap-2.5 px-4 py-2.5 text-sm w-full text-left transition-colors hover:bg-red-50 text-red-600">
                  <LogOut size={14} />
                  Sign out
                </button>
              </SignOutButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
