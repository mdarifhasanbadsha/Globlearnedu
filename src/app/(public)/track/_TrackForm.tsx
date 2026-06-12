"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, AlertCircle } from "lucide-react";

// Application ID pattern: 1-3 uppercase letters followed by exactly 11 digits
// e.g. MD20260608001, B20260608001, MBA20260608001
const APP_ID_PATTERN = /^[A-Z]{1,3}\d{11}$/;

function looksLikeAppId(value: string): boolean {
  return APP_ID_PATTERN.test(value.toUpperCase().trim());
}

export default function TrackForm() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmed = value.trim();
    if (!trimmed) {
      setError("Please enter your Application ID or Passport Number.");
      return;
    }

    const upper = trimmed.toUpperCase();

    // If input looks like it could be an application ID (mostly uppercase letters + digits)
    // but doesn't match the exact pattern, show format error
    if (/^[A-Z]{1,3}\d+$/i.test(upper) && !APP_ID_PATTERN.test(upper)) {
      setError("Please enter a valid Application ID (e.g. MD20260608001)");
      return;
    }

    setLoading(true);
    try {
      let url: string;
      if (APP_ID_PATTERN.test(upper)) {
        url = `/api/applications/track?applicationNumber=${encodeURIComponent(upper)}`;
      } else {
        url = `/api/applications/track?passportNumber=${encodeURIComponent(trimmed)}`;
      }

      const res = await fetch(url);
      const data = await res.json();

      if (!data.found) {
        setError("No application found with this ID. Please check your Application ID or login to your dashboard.");
        return;
      }

      router.push(`/track/${data.applicationNumber}`);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(""); }}
          placeholder="e.g. MD20260608001 or Passport No."
          className="flex-1 px-4 py-3.5 rounded-xl text-sm font-medium outline-none border-2"
          style={{
            borderColor: error ? "#C8102E" : "rgba(255,255,255,0.2)",
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "white",
          }}
          onFocus={(e) => {
            if (!error) e.target.style.borderColor = "#29ABE2";
          }}
          onBlur={(e) => {
            if (!error) e.target.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          aria-describedby={error ? "track-error" : undefined}
        />
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white transition-colors disabled:opacity-60"
          style={{ backgroundColor: "#C8102E" }}
        >
          <Search size={16} />
          {loading ? "Searching…" : "Track"}
        </button>
      </div>

      {error && (
        <div
          id="track-error"
          className="mt-3 flex items-start gap-2 px-4 py-3 rounded-xl text-sm"
          style={{ backgroundColor: "rgba(200,16,46,0.15)", color: "#FCA5A5" }}
        >
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <p className="mt-3 text-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
        Enter your Application ID (e.g. MD20260608001) or Passport Number
      </p>
    </form>
  );
}
