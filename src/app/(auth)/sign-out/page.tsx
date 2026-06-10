"use client";
import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function SignOutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen bg-[#0A1628] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/60 text-sm">Signing out…</p>
      </div>
    </div>
  );
}
