"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Guide {
  id: string;
  summary: string | null;
  tone: string[];
  greetingPatterns: string[];
  pricingPhrases: string[];
  followupPhrases: string[];
  avoidPhrases: string[];
  languageMix: string | null;
  sampleCount: number;
  status: string;
  updatedAt: string;
}

function Section({ title, items }: { title: string; items: string[] }) {
  if (items.length === 0) return null;
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">{title}</h3>
      <ul className="space-y-1">
        {items.map((i, idx) => (
          <li key={idx} className="text-sm text-slate-800 bg-slate-50 rounded px-2 py-1">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function StyleClient({
  guides,
  samples,
}: {
  guides: Guide[];
  samples: { body: string; channel: string }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  const active = guides.find((g) => g.status === "approved") ?? guides[0] ?? null;

  async function act(action: "approve" | "reject") {
    if (!active) return;
    setBusy(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/business/style", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: active.id, action }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Failed");
      setMsg(action === "approve" ? "Approved. New replies will follow this style." : "Rejected.");
      router.refresh();
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#1B3A6B]">House style</h1>
        <p className="text-sm text-slate-600 mt-1">
          Learned from {active?.sampleCount ?? 0} real staff replies. Once approved, the AI
          writes like your team instead of a generic assistant.
        </p>
      </div>

      {err && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{err}</div>
      )}
      {msg && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {msg}
        </div>
      )}

      {!active ? (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
          <p className="text-sm text-slate-600">No style guide yet.</p>
          <p className="text-xs text-slate-500 mt-1">
            One is generated from imported conversations; run the style-learning step to create it.
          </p>
        </div>
      ) : (
        <section className="bg-white rounded-xl border border-slate-200">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1B3A6B] text-sm">Current guide</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  active.status === "approved"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {active.status}
              </span>
            </div>
            <div className="flex gap-2">
              {active.status !== "approved" ? (
                <button
                  onClick={() => void act("approve")}
                  disabled={busy}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1B3A6B] text-white hover:bg-[#152d56] disabled:opacity-40"
                >
                  Approve &amp; use
                </button>
              ) : (
                <button
                  onClick={() => void act("reject")}
                  disabled={busy}
                  className="text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-40"
                >
                  Stop using
                </button>
              )}
            </div>
          </div>

          <div className="p-4 space-y-4">
            {active.summary && <p className="text-sm text-slate-800">{active.summary}</p>}
            {active.languageMix && (
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1">
                  Language
                </h3>
                <p className="text-sm text-slate-800 bg-slate-50 rounded px-2 py-1">
                  {active.languageMix}
                </p>
              </div>
            )}
            <Section title="Tone" items={active.tone} />
            <Section title="Openings we use" items={active.greetingPatterns} />
            <Section title="How we talk about fees" items={active.pricingPhrases} />
            <Section title="Asking for documents" items={active.followupPhrases} />
            <Section title="Avoid" items={active.avoidPhrases} />
          </div>
        </section>
      )}

      <section className="bg-white rounded-xl border border-slate-200">
        <h2 className="font-semibold text-[#1B3A6B] text-sm px-4 py-3 border-b border-slate-200">
          Sample real replies it learned from
        </h2>
        {samples.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No staff replies imported yet.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {samples.map((s, i) => (
              <li key={i} className="px-4 py-2">
                <div className="text-[10px] uppercase tracking-wide text-slate-400">{s.channel}</div>
                <div className="text-sm text-slate-800">{s.body}</div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
