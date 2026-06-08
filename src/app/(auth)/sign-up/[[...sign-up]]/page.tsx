import { SignUp } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Sign Up — Globlearn Education" };

export default function SignUpPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-12"
      style={{ backgroundColor: "#0A1628" }}
    >
      <div className="mb-8 text-center">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3"
          style={{ backgroundColor: "#1B3A6B", border: "1px solid rgba(255,255,255,0.1)" }}
        >
          <span className="text-white font-black text-xl">GL</span>
        </div>
        <h1 className="text-white font-bold text-xl">Globlearn Education</h1>
        <p className="text-sm mt-1" style={{ color: "rgba(255,255,255,0.5)" }}>
          Create your student account
        </p>
      </div>

      <SignUp
        routing="path"
        path="/sign-up"
        signInUrl="/sign-in"
        fallbackRedirectUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: "#C8102E",
            colorBackground: "#ffffff",
            colorText: "#1B3A6B",
            borderRadius: "0.75rem",
            fontFamily: "Inter, sans-serif",
          },
          elements: {
            card: "shadow-2xl border-0",
            formButtonPrimary: "bg-[#C8102E] hover:bg-[#A50D25] text-white font-semibold",
            footerActionLink: "text-[#C8102E] hover:text-[#A50D25] font-medium",
            headerTitle: "text-[#1B3A6B] font-bold",
            headerSubtitle: "text-gray-500",
          },
        }}
      />

      <p className="text-xs mt-6 text-center max-w-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
        Already have an account?{" "}
        <a href="/sign-in" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "underline" }}>
          Sign in here
        </a>
      </p>
    </div>
  );
}
